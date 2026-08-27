// Step 2 of the Decap CMS <-> GitHub OAuth handshake. GitHub redirects the
// popup here with a one-time `code`. We exchange it server-side for an
// access token (this is the one step that *must* happen on a server, since
// it needs the OAuth App's client secret) and hand the token back to the
// Decap CMS popup via the postMessage handshake it expects.

function renderResponseScript(payload) {
  const message = `authorization:github:success:${JSON.stringify(payload)}`;
  // JSON.stringify(message) below produces a safely-escaped JS string
  // literal — the token itself came straight from GitHub's API, but we
  // still avoid ever concatenating it into HTML/JS unescaped.
  return `<!DOCTYPE html>
<html>
<body>
<script>
  (function () {
    function receiveMessage(e) {
      window.opener.postMessage(${JSON.stringify(message)}, e.origin);
      window.removeEventListener("message", receiveMessage, false);
    }
    window.addEventListener("message", receiveMessage, false);
    window.opener.postMessage("authorizing:github", "*");
  })();
</script>
</body>
</html>`;
}

export async function onRequestGet({ request, env }) {
  const clientId = env.GITHUB_CLIENT_ID;
  const clientSecret = env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return new Response(
      "Missing GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET environment variables — set them in the Cloudflare Pages project settings. See web/DEPLOY.md.",
      { status: 500 }
    );
  }

  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  if (!code) {
    return new Response("Missing ?code from GitHub", { status: 400 });
  }

  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
  });

  const tokenData = await tokenRes.json();

  if (tokenData.error || !tokenData.access_token) {
    return new Response(
      `GitHub OAuth error: ${tokenData.error_description || tokenData.error || "no access_token in response"}`,
      { status: 400 }
    );
  }

  const html = renderResponseScript({ token: tokenData.access_token, provider: "github" });
  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}
