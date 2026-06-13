function isTerpene(molecule) {
  return Boolean(molecule && /terpene/i.test(molecule.class));
}

async function renderHerbLibrary() {
  const root = document.getElementById("herb-library-root");

  try {
    const [herbResponse, moleculeResponse] = await Promise.all([
      fetch("../data/herbs.json"),
      fetch("../data/molecules.json")
    ]);
    const herbs = await herbResponse.json();
    const molecules = await moleculeResponse.json();
    const cards = Object.entries(herbs)
      .map(
        ([slug, herb]) => `
          <article class="frame herb-card">
            <p class="section-label">${herb.family}</p>
            <h2>${herb.title}</h2>
            <p>${herb.intro}</p>
            <div class="chip-row">
              ${herb.molecules
                .slice(0, 4)
                .map((moleculeSlug) => {
                  const molecule = molecules[moleculeSlug];
                  const terpeneClass = isTerpene(molecule) ? " mini-chip-terpene" : "";
                  return molecule
                    ? `<a class="mini-chip${terpeneClass}" href="../molecules/${moleculeSlug}.html">${molecule.title}</a>`
                    : "";
                })
                .join("")}
            </div>
            <p><a class="text-link" href="${slug}.html">Open herb page</a></p>
          </article>
        `
      )
      .join("");

    root.innerHTML = cards;
  } catch (error) {
    root.innerHTML =
      '<section class="notes"><h2>Library unavailable</h2><p>The herb records could not be loaded.</p></section>';
  }
}

renderHerbLibrary();
