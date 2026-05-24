import { createServerFn } from '@tanstack/react-start';
import { supabaseAdmin } from '@/integrations/supabase/client.server';

/**
 * Server function: exchange a Google access token for a Supabase session token.
 *
 * Flow:
 *  1. Verify the Google access token → fetch the user's profile from Google
 *  2. Create the Supabase user if they don't exist yet (email_confirm: true)
 *  3. Generate a magic-link token via the admin API
 *  4. Return the hashed token so the client can call verifyOtp() without any redirect
 */
export const signInWithGoogleToken = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => data as { accessToken: string })
  .handler(async ({ data }) => {
    // 1. Verify with Google and get profile
    const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${data.accessToken}` },
    });

    if (!res.ok) {
      throw new Error('Invalid Google token — could not fetch user info');
    }

    const { email, name, picture, sub: googleId } = (await res.json()) as {
      email: string;
      name: string;
      picture: string;
      sub: string;
    };

    // 2. Create user if they don't exist (idempotent — "already registered" is fine)
    const { error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: {
        full_name: name,
        avatar_url: picture,
        google_id: googleId,
        role: 'player',
      },
    });

    if (createError && !createError.message.toLowerCase().includes('already')) {
      throw createError;
    }

    // 3. Generate a one-time sign-in token (magic link)
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email,
    });

    if (linkError || !linkData) {
      throw linkError ?? new Error('Failed to generate sign-in token');
    }

    return { token_hash: linkData.properties.hashed_token };
  });
