async function renderRecipePage() {
  const recipeSlug = document.body.dataset.recipeSlug;
  const root = document.getElementById("recipe-root");

  try {
    const [recipeResponse, herbResponse, moleculeResponse] = await Promise.all([
      fetch("../data/recipes.json"),
      fetch("../data/herbs.json"),
      fetch("../data/molecules.json")
    ]);
    const recipes = await recipeResponse.json();
    const herbs = await herbResponse.json();
    const molecules = await moleculeResponse.json();
    const recipe = recipes[recipeSlug];

    if (!recipe) {
      root.innerHTML =
        '<main class="shell"><section class="notes"><h2>Recipe not found</h2><p>The requested page is missing.</p></section></main>';
      return;
    }

    document.title = `${recipe.title} | Nowhere's End Absinthe`;

    const recipeSectionsHtml = recipe.recipeSections
      .map(
        (section) => `
          <article class="panel">
            <p class="section-label">${section.title}</p>
            <div class="recipe-ledger">
              ${section.items
                .map(
                  ([name, value, note]) => `
                    <div class="ledger-row">
                      <div>
                        <div class="ledger-name">${name}</div>
                        <div>${note}</div>
                      </div>
                      <div class="ledger-value">${value}</div>
                    </div>
                  `
                )
                .join("")}
            </div>
          </article>
        `
      )
      .join("");

    const herbHtml = recipe.herbs
      .map(([slug, note]) => {
        const herb = herbs[slug];
        const label = herb ? herb.title : slug;
        const chips = herb
          ? herb.molecules
              .slice(0, 4)
              .map((moleculeSlug) => {
                const molecule = molecules[moleculeSlug];
                return molecule
                  ? `<a class="mini-chip" href="../molecules/${moleculeSlug}.html">${molecule.title}</a>`
                  : "";
              })
              .join("")
          : "";
        return `
          <li>
            <strong><a class="text-link" href="../herbs/${slug}.html">${label}</a>:</strong> ${note}.
            <div class="chip-row">${chips}</div>
          </li>
        `;
      })
      .join("");

    const moleculeHtml = recipe.molecules
      .map(([slug, note]) => {
        const molecule = molecules[slug];
        if (!molecule) {
          return "";
        }
        return `
          <li>
            <strong><a class="text-link" href="../molecules/${slug}.html">${molecule.title}</a>:</strong> ${note}.
          </li>
        `;
      })
      .join("");

    const serviceHtml = recipe.serviceNotes
      .map((note) => `<li>${note}</li>`)
      .join("");

    root.innerHTML = `
      <div class="page-glow page-glow-a"></div>
      <div class="page-glow page-glow-b"></div>
      <header class="page-header shell">
        <a class="back-link" href="../index.html">Back to catalog</a>
        <div class="page-title-wrap frame ${recipe.toneClass}">
          <p class="eyebrow">${recipe.subtitle}</p>
          <div class="page-title">
            <h1>${recipe.title}</h1>
            <span class="chip">${recipe.chip}</span>
          </div>
          <p class="page-intro">${recipe.intro}</p>
          <p>${recipe.story}</p>
        </div>
      </header>
      <main class="page-content shell">
        <section class="stack">
          ${recipeSectionsHtml}
          <article class="panel">
            <p class="section-label">Herbs</p>
            <h2>Botanical frame</h2>
            <ul class="herb-list">${herbHtml}</ul>
          </article>
        </section>
        <aside class="stack">
          <article class="panel">
            <p class="section-label">Molecules</p>
            <h2>Molecule intent</h2>
            <ul class="molecule-list">${moleculeHtml}</ul>
          </article>
          <article class="panel">
            <p class="section-label">Service posture</p>
            <h2>How the SKU should read</h2>
            <ul>${serviceHtml}</ul>
          </article>
          <article class="panel">
            <p class="section-label">Knowledge graph</p>
            <h2>Continue exploring</h2>
            <p><a class="text-link" href="../herbs/index.html">Browse the herb library</a></p>
            <p><a class="text-link" href="../molecules/index.html">Browse the molecule library</a></p>
          </article>
        </aside>
      </main>
    `;
  } catch (error) {
    root.innerHTML =
      '<main class="shell"><section class="notes"><h2>Data load failed</h2><p>The recipe data could not be loaded.</p></section></main>';
  }
}

renderRecipePage();
