async function renderHerbLibrary() {
  const root = document.getElementById("herb-library-root");

  try {
    const response = await fetch("../data/herbs.json");
    const herbs = await response.json();
    const cards = Object.entries(herbs)
      .map(
        ([slug, herb]) => `
          <article class="panel herb-card">
            <p class="section-label">${herb.family}</p>
            <h2>${herb.title}</h2>
            <p>${herb.intro}</p>
            <a class="text-link" href="${slug}.html">Open page</a>
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
