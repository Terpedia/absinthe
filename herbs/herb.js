async function renderHerbPage() {
  const herbSlug = document.body.dataset.herbSlug;
  const root = document.getElementById("herb-root");

  try {
    const response = await fetch("../data/herbs.json");
    const herbs = await response.json();
    const herb = herbs[herbSlug];

    if (!herb) {
      root.innerHTML =
        '<main class="shell"><section class="notes"><h2>Herb not found</h2><p>The requested herb page is missing.</p></section></main>';
      return;
    }

    document.title = `${herb.title} | Absinthe Atlas`;

    const sourcesHtml = herb.sources
      .map(
        ([label, url]) =>
          `<li><a href="${url}" target="_blank" rel="noreferrer">${label}</a></li>`
      )
      .join("");

    const medicinalHtml = herb.medicinal.map((item) => `<li>${item}</li>`).join("");

    root.innerHTML = `
      <div class="aurora aurora-a"></div>
      <div class="aurora aurora-b"></div>
      <header class="page-header shell">
        <a class="back-link" href="../index.html">Back to atlas</a>
        <a class="back-link" href="index.html">Back to herb library</a>
        <div class="page-title-wrap">
          <div class="page-title">
            <h1>${herb.title}</h1>
            <span class="chip">${herb.chip}</span>
          </div>
          <p class="page-intro"><em>${herb.latin}</em>. ${herb.intro}</p>
        </div>
      </header>
      <main class="page-content shell herb-page">
        <section class="stack">
          <figure class="panel hero-image">
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
        </section>
        <aside class="stack">
          <article class="panel">
            <p class="section-label">Medicinal history</p>
            <h2>Traditional and historical uses</h2>
            <ul class="history-list">${medicinalHtml}</ul>
            <p class="callout">These notes describe historical use in herbals and regional traditions. They are not modern medical guidance.</p>
          </article>
          <article class="panel">
            <p class="section-label">Absinthe role</p>
            <h2>Why it appears here</h2>
            <p>${herb.role}</p>
          </article>
          <article class="panel">
            <p class="section-label">Sources</p>
            <h2>Further reading</h2>
            <ul class="source-list">${sourcesHtml}</ul>
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
