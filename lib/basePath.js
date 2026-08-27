// GitHub Pages serves a project repo like this one from a subpath
// (https://<user>.github.io/<repo>/), not the domain root. BASE_PATH carries
// that prefix through the static export — set via the BASE_PATH env var in
// .github/workflows/deploy.yml, empty for local dev and any host that serves
// from the root (Cloudflare Pages, a custom domain, etc).
export const BASE_PATH = process.env.BASE_PATH || "";

export function withBase(assetPath) {
  if (!assetPath) return assetPath;
  return `${BASE_PATH}${assetPath}`;
}
