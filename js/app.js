import { renderHeader } from './components/header.js';
import { renderBottomNav } from './components/bottomNav.js';
import { renderHomeView } from './views/homeView.js';
import { renderAnimalsView } from './views/animalsView.js';
import { renderProfileView } from './views/profileView.js';
import { renderAuthView } from './views/authView.js';
import { renderRequestsView } from './views/requestsView.js';
import { store } from './services/store.js';

document.addEventListener('DOMContentLoaded', () => {
  const splashEl = document.getElementById('splash-screen');
  const headerEl = document.getElementById('main-header');
  const contentEl = document.getElementById('main-content');
  const bottomNavEl = document.getElementById('bottom-nav');

  let currentTab = 'home';

  // Splash Screen transitando suavemente
  setTimeout(() => {
    if (splashEl) splashEl.classList.add('hide');
  }, 1000);

  function renderApp() {
    const user = store.getState().currentUser;

    // Login Obrigatório na entrada
    if (!user) {
      bottomNavEl.style.display = 'none';
      renderAuthView(contentEl, () => {
        currentTab = 'home';
        renderApp();
      });
      return;
    }

    bottomNavEl.style.display = 'flex';
    renderBottomNav(bottomNavEl, currentTab, (tab) => {
      currentTab = tab;
      renderApp();
    });

    if (currentTab === 'home') {
      renderHomeView(contentEl, (tab) => {
        currentTab = tab;
        renderApp();
      });
    } else if (currentTab === 'animals') {
      renderAnimalsView(contentEl, (tab) => {
        currentTab = tab;
        renderApp();
      });
    } else if (currentTab === 'requests') {
      renderRequestsView(contentEl, (tab) => {
        currentTab = tab;
        renderApp();
      });
    } else if (currentTab === 'profile') {
      renderProfileView(contentEl, () => {
        renderApp();
      });
    }
  }

  renderHeader(headerEl);
  renderApp();
});
