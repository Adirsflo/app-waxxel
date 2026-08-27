// Step 1 of the Decap CMS <-> GitHub OAuth handshake.
// Decap's admin page (public/admin/config.yml, auth_endpoint: api/auth) opens
// this in a popup. We redirect straight to GitHub's own authorize screen.
// See web/DEPLOY.md for how to create the GitHub OAuth App this depends on.

export async function onRequestGet({ request, env }) {
  const clientId = env.GITHUB_CLIENT_ID;
  if (!clientId) {
    return new Response(
      "Missing GITHUB_CLIENT_ID environment variable — set it in the Cloudflare Pages project settings. See web/DEPLOY.md.",
      { status: 500 }
    );
  }

  const url = new URL(request.url);
  const redirectUri = `${url.origin}/api/callback`;
  const state = crypto.randomUUID();

  const authorizeUrl = new URL("https://github.com/login/oauth/authorize");
  authorizeUrl.searchParams.set("client_id", clientId);
  authorizeUrl.searchParams.set("redirect_uri", redirectUri);
  authorizeUrl.searchParams.set("scope", "repo,user");
  authorizeUrl.searchParams.set("state", state);

  return Response.redirect(authorizeUrl.toString(), 302);
}
