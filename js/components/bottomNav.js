export function renderBottomNav(container, activeTab = 'home', onTabChange) {
  const tabs = [
    { id: 'home', label: 'Início', icon: `<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>` },
    { id: 'animals', label: 'Animais', icon: `<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/>` },
    { id: 'requests', label: 'Pedidos', icon: `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>` },
    { id: 'profile', label: 'Perfil', icon: `<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>` }
  ];

  container.innerHTML = tabs.map(tab => `
    <button class="nav-item ${tab.id === activeTab ? 'active' : ''}" data-tab="${tab.id}">
      <svg viewBox="0 0 24 24">${tab.icon}</svg>
      <span>${tab.label}</span>
    </button>
  `).join('');

  container.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      if (onTabChange) onTabChange(target);
    });
  });
}
