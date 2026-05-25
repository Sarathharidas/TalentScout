import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

/**
 * Vercel Serverless Function: POST /api/google-auth
 *
 * Exchanges a Google access token for a Supabase magic-link OTP token.
 * The client then calls supabase.auth.verifyOtp() with the returned token_hash.
 *
 * Flow:
 *  1. Verify the Google access token → fetch user profile from Google
 *  2. Create the Supabase user if they don't exist yet
 *  3. Generate a one-time magic-link token via the admin API
 *  4. Return the hashed token to the client
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { accessToken } = req.body as { accessToken?: string };
  if (!accessToken) {
    return res.status(400).json({ error: "Missing accessToken" });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    return res.status(500).json({ error: "Server not configured" });
  }

  try {
    // 1. Verify with Google and get profile
    const googleRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!googleRes.ok) {
      return res.status(401).json({ error: "Invalid Google token" });
    }
    const { email, name, picture, sub: googleId } = (await googleRes.json()) as {
      email: string;
      name: string;
      picture: string;
      sub: string;
    };

    // 2. Create Supabase admin client
    const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // 3. Create user if they don't exist (idempotent)
    const { error: createError } = await admin.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: {
        full_name: name,
        avatar_url: picture,
        google_id: googleId,
        role: "player",
      },
    });
    if (createError && !createError.message.toLowerCase().includes("already")) {
      throw createError;
    }

    // 4. Generate a one-time sign-in token
    const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
      type: "magiclink",
      email,
    });
    if (linkError || !linkData) throw linkError ?? new Error("Failed to generate token");

    return res.status(200).json({ token_hash: linkData.properties.hashed_token });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return res.status(500).json({ error: message });
  }
}
