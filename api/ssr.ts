import type { VercelRequest, VercelResponse } from "@vercel/node";

type ServerHandler = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response>;
};

// Cache the server module so it's only imported once per cold start
let serverPromise: Promise<ServerHandler> | null = null;

function getServer(): Promise<ServerHandler> {
  if (!serverPromise) {
    serverPromise = import("../dist/server/server.js").then((m) => m.default as ServerHandler);
  }
  return serverPromise;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Reconstruct the full URL from Vercel request headers
  const proto = (req.headers["x-forwarded-proto"] as string) ?? "https";
  const host = req.headers.host ?? "localhost";
  const url = `${proto}://${host}${req.url ?? "/"}`;

  // Convert Vercel's IncomingHttpHeaders to a plain Record<string, string>
  const headers: Record<string, string> = {};
  for (const [key, value] of Object.entries(req.headers)) {
    if (value !== undefined) {
      headers[key] = Array.isArray(value) ? value.join(", ") : value;
    }
  }

  // Re-serialize the body for non-GET/HEAD requests
  // (Vercel parses JSON automatically — we need to undo that)
  let body: BodyInit | undefined;
  if (req.method && !["GET", "HEAD"].includes(req.method) && req.body !== undefined) {
    body = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
  }

  const webRequest = new Request(url, {
    method: req.method ?? "GET",
    headers,
    body,
  });

  try {
    const server = await getServer();
    const response = await server.fetch(webRequest, process.env, {});

    res.status(response.status);
    response.headers.forEach((value: string, key: string) => {
      res.setHeader(key, value);
    });

    const buffer = Buffer.from(await response.arrayBuffer());
    res.end(buffer);
  } catch (err) {
    console.error("[SSR] Unhandled error:", err);
    res.status(500).send("Internal Server Error");
  }
}
