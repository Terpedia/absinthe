# Nowhere

Static GitHub Pages site for the Nowhere absinthe line:

- Verte
- Rouge
- Bleue
- Detour

Each page focuses on sensory direction, herbs, and aromatic molecules.

The current site is moving toward a KB-friendly model:

- `data/herbs.json` is the structured herb dataset.
- `data/recipes.json` is the structured recipe/concept dataset.
- `herbs/*.html` and `recipes/*.html` are thin shells rendered from the data files.

That structure is intended to migrate cleanly into a future `kb.terpedia.com` backend while the public-facing brand lives at `nowhere.terpedia.com`.

## Deployment helpers

- `scripts/configure-cloudflare-cname.sh`: create or update the Cloudflare CNAME for the custom domain in `CNAME`
- `scripts/verify-custom-domain.sh`: check DNS, GitHub Pages status, and live HTTP/HTTPS responses
