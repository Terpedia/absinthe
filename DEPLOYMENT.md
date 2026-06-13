# nowhere.terpedia.com deployment

Current deployment target:

- Repository: `Terpedia/nowhere`
- GitHub Pages source: `main` branch, repo root
- Custom domain: `nowhere.terpedia.com`
- Published site origin after custom-domain switch: `http://nowhere.terpedia.com/`

## Current verified state

Verified on 2026-06-12 / 2026-06-13 UTC:

- GitHub Pages is enabled for the repo.
- The repo contains a `CNAME` file with `nowhere.terpedia.com`.
- GitHub Pages metadata reports `cname: nowhere.terpedia.com`.
- `https://terpedia.github.io/nowhere/...` now redirects to `http://nowhere.terpedia.com/...`.
- `nowhere.terpedia.com` does **not** resolve yet because DNS is missing.

## Required DNS change

`terpedia.com` is delegated to Cloudflare:

- `rihana.ns.cloudflare.com`
- `will.ns.cloudflare.com`

Create this DNS record in Cloudflare:

- Type: `CNAME`
- Name: `nowhere`
- Target: `terpedia.github.io`
- Proxy status: `DNS only` until GitHub Pages approves the certificate

If Cloudflare credentials are available locally, use:

```bash
./scripts/configure-cloudflare-cname.sh
```

After GitHub Pages shows the certificate/custom domain as healthy, proxying can be reconsidered if desired.

## After DNS is added

1. Wait for `nowhere.terpedia.com` to resolve.
2. Re-check GitHub Pages domain status.
3. Enable HTTPS enforcement once GitHub has issued the certificate.
4. Verify:
   - `http://nowhere.terpedia.com/` redirects or loads
   - `https://nowhere.terpedia.com/` returns `200`
   - deep links like `https://nowhere.terpedia.com/herbs/wormwood.html` and `https://nowhere.terpedia.com/data/herbs.json` return `200`

Repo helper:

```bash
./scripts/verify-custom-domain.sh
```

## Relevant commits

- `829c4d0` `Create CNAME`
- `dcad163` `Refactor site to structured recipe and herb data`
