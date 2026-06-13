function isTerpene(molecule) {
  return Boolean(molecule && /terpene/i.test(molecule.class));
}

function normalizeBiochemistryNote(note) {
  if (typeof note === "string") {
    return { text: note, refs: [] };
  }

  return {
    text: note.text,
    refs: Array.isArray(note.refs) ? note.refs : []
  };
}

async function renderMoleculePage() {
  const moleculeSlug = document.body.dataset.moleculeSlug;
  const root = document.getElementById("molecule-root");

  try {
    const [moleculeResponse, herbResponse] = await Promise.all([
      fetch("../data/molecules.json"),
      fetch("../data/herbs.json")
    ]);
    const molecules = await moleculeResponse.json();
    const herbs = await herbResponse.json();
    const molecule = molecules[moleculeSlug];

    if (!molecule) {
      root.innerHTML =
        '<main class="shell"><section class="notes"><h2>Molecule not found</h2><p>The requested molecule page is missing.</p></section></main>';
      return;
    }

    document.title = `${molecule.title} | Nowhere's End Absinthe`;
    const references = molecule.references || {};
    const referenceOrder = [];
    const referenceIndex = {};

    const ensureRefIndex = (refId) => {
      if (!referenceIndex[refId]) {
        referenceOrder.push(refId);
        referenceIndex[refId] = referenceOrder.length;
      }
      return referenceIndex[refId];
    };

    const herbHtml = molecule.occursIn
      .map((slug) => {
        const herb = herbs[slug];
        return herb
          ? `<a class="mini-chip" href="../herbs/${slug}.html">${herb.title}</a>`
          : "";
      })
      .join("");

    const biochemistryHtml = molecule.biochemistry
      .map((item) => {
        const note = normalizeBiochemistryNote(item);
        const refsHtml = note.refs
          .filter((refId) => references[refId])
          .map((refId) => {
            const ref = references[refId];
            const number = ensureRefIndex(refId);
            return `<a href="${ref.url}" target="_blank" rel="noreferrer">[${number}]</a>`;
          })
          .join(" ");

        return `
          <li>
            ${note.text}
            ${refsHtml ? `<span class="reference-links">${refsHtml}</span>` : ""}
          </li>
        `;
      })
      .join("");

    const literatureHtml = referenceOrder
      .map((refId) => {
        const ref = references[refId];
        const number = referenceIndex[refId];
        return `
          <li>
            <span class="reference-number">[${number}]</span>
            <a class="text-link" href="${ref.url}" target="_blank" rel="noreferrer">${ref.title}</a>
          </li>
        `;
      })
      .join("");

    root.innerHTML = `
      <div class="page-glow page-glow-a"></div>
      <div class="page-glow page-glow-b"></div>
      <header class="page-header shell">
        <a class="back-link" href="../index.html">Back to catalog</a>
        <a class="back-link" href="index.html">Back to molecule library</a>
        <div class="page-title-wrap frame${isTerpene(molecule) ? " molecule-card-terpene" : ""}">
          <p class="eyebrow">${molecule.class}</p>
          <div class="page-title">
            <h1>${molecule.title}</h1>
            <span class="chip">${molecule.chip}</span>
            ${isTerpene(molecule) ? '<span class="chip chip-terpene">Terpene</span>' : ""}
          </div>
          <p class="page-intro">${molecule.summary}</p>
        </div>
      </header>
      <main class="page-content shell">
        <section class="stack">
          <article class="panel">
            <p class="section-label">Sensory role</p>
            <h2>What it contributes</h2>
            <p>${molecule.sensory}</p>
          </article>
          <article class="panel">
            <p class="section-label">Occurrence</p>
            <h2>Where it appears in the line</h2>
            <div class="chip-row">${herbHtml}</div>
          </article>
        </section>
        <aside class="stack">
          <article class="panel">
            <p class="section-label">Metadata</p>
            <h2>Compound profile</h2>
            <div class="molecule-meta">
              <div><strong>Formula:</strong> ${molecule.formula}</div>
              <div><strong>Class:</strong> ${molecule.class}</div>
              <div><strong>Highlight:</strong> ${isTerpene(molecule) ? "Terpene-priority molecule" : "Non-terpene support molecule"}</div>
            </div>
          </article>
          <article class="panel">
            <p class="section-label">Human biochemistry</p>
            <h2>Physiological relevance</h2>
            <ul>${biochemistryHtml}</ul>
            <p class="callout">These notes summarize common pharmacology and metabolism discussions from botanical and flavor literature. They are informational, not medical guidance.</p>
          </article>
          <article class="panel">
            <p class="section-label">Literature</p>
            <h2>References for biochemical claims</h2>
            <ol class="reference-list">${literatureHtml}</ol>
          </article>
        </aside>
      </main>
    `;
  } catch (error) {
    root.innerHTML =
      '<main class="shell"><section class="notes"><h2>Data load failed</h2><p>The molecule data could not be loaded.</p></section></main>';
  }
}

renderMoleculePage();
