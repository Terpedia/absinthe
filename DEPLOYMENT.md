# absinthe.terpedia.com deployment

Current deployment target:

- Repository: `Terpedia/absinthe`
- GitHub Pages source: `main` branch, repo root
- Custom domain: `absinthe.terpedia.com`
- Published site origin after custom-domain switch: `http://absinthe.terpedia.com/`

## Current verified state

Verified on 2026-06-12 / 2026-06-13 UTC:

- GitHub Pages is enabled for the repo.
- The repo contains a `CNAME` file with `absinthe.terpedia.com`.
- GitHub Pages metadata reports `cname: absinthe.terpedia.com`.
- `https://terpedia.github.io/absinthe/...` now redirects to `http://absinthe.terpedia.com/...`.
- `absinthe.terpedia.com` does **not** resolve yet because DNS is missing.

## Required DNS change

`terpedia.com` is delegated to Cloudflare:

- `rihana.ns.cloudflare.com`
- `will.ns.cloudflare.com`

Create this DNS record in Cloudflare:

- Type: `CNAME`
- Name: `absinthe`
- Target: `terpedia.github.io`
- Proxy status: `DNS only` until GitHub Pages approves the certificate

After GitHub Pages shows the certificate/custom domain as healthy, proxying can be reconsidered if desired.

## After DNS is added

1. Wait for `absinthe.terpedia.com` to resolve.
2. Re-check GitHub Pages domain status.
3. Enable HTTPS enforcement once GitHub has issued the certificate.
4. Verify:
   - `http://absinthe.terpedia.com/` redirects or loads
   - `https://absinthe.terpedia.com/` returns `200`
   - deep links like `https://absinthe.terpedia.com/herbs/wormwood.html` and `https://absinthe.terpedia.com/data/herbs.json` return `200`

## Relevant commits

- `829c4d0` `Create CNAME`
- `dcad163` `Refactor site to structured recipe and herb data`
