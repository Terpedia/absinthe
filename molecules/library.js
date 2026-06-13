async function renderMoleculeLibrary() {
  const root = document.getElementById("molecule-library-root");

  try {
    const response = await fetch("../data/molecules.json");
    const molecules = await response.json();
    root.innerHTML = Object.entries(molecules)
      .map(
        ([slug, molecule]) => `
          <article class="frame molecule-card">
            <p class="section-label">${molecule.class}</p>
            <h2>${molecule.title}</h2>
            <p>${molecule.summary}</p>
            <div class="chip-row"><span class="mini-chip">${molecule.formula}</span></div>
            <p><a class="text-link" href="${slug}.html">Open molecule page</a></p>
          </article>
        `
      )
      .join("");
  } catch (error) {
    root.innerHTML =
      '<section class="notes"><h2>Library unavailable</h2><p>The molecule records could not be loaded.</p></section>';
  }
}

renderMoleculeLibrary();
