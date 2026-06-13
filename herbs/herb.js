async function renderHerbPage() {
  const herbSlug = document.body.dataset.herbSlug;
  const root = document.getElementById("herb-root");

  try {
    const [herbResponse, moleculeResponse, recipeResponse] = await Promise.all([
      fetch("../data/herbs.json"),
      fetch("../data/molecules.json"),
      fetch("../data/recipes.json")
    ]);
    const herbs = await herbResponse.json();
    const molecules = await moleculeResponse.json();
    const recipes = await recipeResponse.json();
    const herb = herbs[herbSlug];

    if (!herb) {
      root.innerHTML =
        '<main class="shell"><section class="notes"><h2>Herb not found</h2><p>The requested herb page is missing.</p></section></main>';
      return;
    }

    document.title = `${herb.title} | Nowhere's End Absinthe`;

    const sourcesHtml = herb.sources
      .map(
        ([label, url]) =>
          `<li><a href="${url}" target="_blank" rel="noreferrer">${label}</a></li>`
      )
      .join("");

    const medicinalHtml = herb.medicinal.map((item) => `<li>${item}</li>`).join("");

    const moleculesHtml = herb.molecules
      .map((slug) => {
        const molecule = molecules[slug];
        if (!molecule) {
          return "";
        }
        return `
          <li>
            <strong><a class="text-link" href="../molecules/${slug}.html">${molecule.title}</a>:</strong>
            ${molecule.summary}
          </li>
        `;
      })
      .join("");

    const recipesHtml = herb.recipes
      .map((slug) => {
        const recipe = recipes[slug];
        if (!recipe) {
          return "";
        }
        return `<a class="mini-chip" href="../recipes/${slug}.html">${recipe.title}</a>`;
      })
      .join("");

    root.innerHTML = `
      <div class="page-glow page-glow-a"></div>
      <div class="page-glow page-glow-b"></div>
      <header class="page-header shell">
        <a class="back-link" href="../index.html">Back to catalog</a>
        <a class="back-link" href="index.html">Back to herb library</a>
        <div class="page-title-wrap frame">
          <p class="eyebrow">${herb.family}</p>
          <div class="page-title">
            <h1>${herb.title}</h1>
            <span class="chip">${herb.chip}</span>
          </div>
          <p class="page-intro"><em>${herb.latin}</em>. ${herb.intro}</p>
          <div class="chip-row">${recipesHtml}</div>
        </div>
      </header>
      <main class="page-content shell">
        <section class="stack">
          <figure class="panel hero-image frame">
            <img src="${herb.image}" alt="${herb.imageAlt}" />
            <figcaption>
              Representative image.
              <a href="${herb.imageCreditUrl}" target="_blank" rel="noreferrer">${herb.imageCreditLabel}</a>
            </figcaption>
          </figure>
          <article class="panel">
            <p class="section-label">History</p>
            <h2>Historical place</h2>
            <p>${herb.history}</p>
          </article>
          <article class="panel">
            <p class="section-label">Recipe role</p>
            <h2>Why this herb is in the line</h2>
            <p>${herb.role}</p>
          </article>
        </section>
        <aside class="stack">
          <article class="panel">
            <p class="section-label">Medicinal history</p>
            <h2>Traditional and historical uses</h2>
            <ul>${medicinalHtml}</ul>
            <p class="callout">These notes describe historical use in herbals and regional traditions. They are not modern medical guidance.</p>
          </article>
          <article class="panel">
            <p class="section-label">Molecules</p>
            <h2>Principal molecules</h2>
            <ul>${moleculesHtml}</ul>
          </article>
          <article class="panel">
            <p class="section-label">Sources</p>
            <h2>Further reading</h2>
            <ul>${sourcesHtml}</ul>
          </article>
        </aside>
      </main>
    `;
  } catch (error) {
    root.innerHTML =
      '<main class="shell"><section class="notes"><h2>Data load failed</h2><p>The herb data could not be loaded.</p></section></main>';
  }
}

renderHerbPage();
