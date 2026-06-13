async function renderRecipePage() {
  const recipeSlug = document.body.dataset.recipeSlug;
  const root = document.getElementById("recipe-root");

  try {
    const [recipeResponse, herbResponse] = await Promise.all([
      fetch("../data/recipes.json"),
      fetch("../data/herbs.json")
    ]);
    const recipes = await recipeResponse.json();
    const herbs = await herbResponse.json();
    const recipe = recipes[recipeSlug];

    if (!recipe) {
      root.innerHTML =
        '<main class="shell"><section class="notes"><h2>Recipe not found</h2><p>The requested page is missing.</p></section></main>';
      return;
    }

    document.title = `${recipe.title} | Absinthe Atlas`;

    const herbHtml = recipe.herbs
      .map(([slug, note]) => {
        const herb = herbs[slug];
        const label = herb ? herb.title : slug;
        return `<li><strong><a class="text-link" href="../herbs/${slug}.html">${label}</a>:</strong> ${note}.</li>`;
      })
      .join("");

    const moleculeHtml = recipe.molecules
      .map(([name, note]) => `<li><strong>${name}:</strong> ${note}.</li>`)
      .join("");

    root.innerHTML = `
      <div class="aurora aurora-a"></div>
      <div class="aurora aurora-b"></div>
      <header class="page-header shell">
        <a class="back-link" href="../index.html">Back to atlas</a>
        <div class="page-title-wrap ${recipe.toneClass}">
          <div class="page-title">
            <h1>${recipe.title}</h1>
            <span class="chip">${recipe.chip}</span>
          </div>
          <p class="page-intro">${recipe.intro}</p>
        </div>
      </header>
      <main class="page-content shell">
        <section class="stack">
          <article class="panel">
            <p class="section-label">Sensory target</p>
            <h2>${recipe.sensoryTitle}</h2>
            <p>${recipe.sensoryBody}</p>
          </article>
          <article class="panel">
            <p class="section-label">Herbs</p>
            <h2>Botanical frame</h2>
            <ul class="herb-list">${herbHtml}</ul>
          </article>
        </section>
        <aside class="stack">
          <article class="panel">
            <p class="section-label">Molecules</p>
            <h2>Primary aromatic drivers</h2>
            <ul class="molecule-list">${moleculeHtml}</ul>
          </article>
          <article class="panel">
            <p class="section-label">Color logic</p>
            <h2>${recipe.colorTitle}</h2>
            <p>${recipe.colorBody}</p>
            <p><a class="text-link" href="../herbs/index.html">Browse all herb pages</a></p>
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
