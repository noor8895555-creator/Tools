// Utility: fetch and insert HTML fragments
async function loadFragment(url, targetId) {
  const res = await fetch(url);
  if (!res.ok) return;
  const html = await res.text();
  document.getElementById(targetId).innerHTML = html;
}

// Build tool cards from manifest
async function renderToolGrid() {
  const res = await fetch('manifest.json');
  if (!res.ok) return;
  const data = await res.json();
  const tools = data.tools || [];

  const container = document.getElementById('tools-by-category');
  if (!container) return;
  container.innerHTML = '';

  // Group by category
  const categories = {};
  tools.forEach(t => {
    categories[t.category] = categories[t.category] || [];
    categories[t.category].push(t);
  });

  Object.keys(categories).forEach(cat => {
    const section = document.createElement('section');
    section.className = 'tool-category';
    const h2 = document.createElement('h2');
    h2.textContent = cat;
    section.appendChild(h2);

    const grid = document.createElement('div');
    grid.className = 'tools-grid';
    categories[cat].forEach(t => {
      const card = document.createElement('a');
      card.className = 'tool-card';
      card.href = `tools/${t.slug}`;
      card.title = t.name;

      card.innerHTML = `
        <div class="card-icon" aria-hidden="true">${t.icon || '🧰'}</div>
        <div class="card-content">
          <div class="card-title">${t.name}</div>
          <div class="card-desc">${t.description}</div>
        </div>
      `;
      grid.appendChild(card);
    });

    section.appendChild(grid);
    container.appendChild(section);
  });
}

// Simple local search across tool cards
function initSearch() {
  const input = document.getElementById('search-input');
  if (!input) return;
  input.addEventListener('input', function (e) {
    const q = e.target.value.toLowerCase().trim();
    const cards = document.querySelectorAll('.tool-card');
    cards.forEach(card => {
      const text = card.textContent.toLowerCase();
      card.style.display = text.includes(q) ? '' : 'none';
    });
  });

  const headerSearch = document.getElementById('header-search');
  if (headerSearch) {
    headerSearch.addEventListener('input', function (e) {
      const q = e.target.value.toLowerCase().trim();
      const cards = document.querySelectorAll('.tool-card');
      cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(q) ? '' : 'none';
      });
    });
  }
}

// Initialization
document.addEventListener('DOMContentLoaded', async () => {
  await loadFragment('header.html', 'header-placeholder');
  await loadFragment('footer.html', 'footer-placeholder');
  initSearch();
  await renderToolGrid();
});
