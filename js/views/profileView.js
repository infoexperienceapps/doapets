import { store } from '../services/store.js';

export function renderProfileView(container, onLogout) {
  const isAdmin = store.isAdmin();
  const user = store.getState().currentUser || {
    name: "Tutor DoaPets",
    email: "tutor@exemplo.com",
    phone: "(00) 00000-0000",
    city: "Não informado",
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80"
  };

  container.innerHTML = `
    <div class="profile-view-wrapper">
      <div class="profile-header-card">
        <div class="profile-avatar-container">
          <img class="profile-avatar-img" src="${user.avatarUrl}" alt="${user.name}">
          <button class="profile-avatar-edit-btn" id="btn-edit-avatar" title="Trocar foto">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
          </button>
        </div>
        <h2 class="profile-user-name">${user.name}</h2>
        <p class="profile-user-email">${user.email}</p>
        <span class="profile-role-badge ${isAdmin ? 'profile-role-admin' : ''}">
          ${isAdmin ? '👑 Prioridade Máxima (ONG)' : '🐾 Tutor Cadastrado'}
        </span>
        <div>
          <button class="btn-edit-profile" id="btn-open-edit">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
            </svg>
            Editar Meus Dados
          </button>
        </div>
      </div>

      <div class="profile-section-title">Dados Pessoais</div>
      <div class="profile-group-card">
        <div class="profile-item">
          <div class="profile-item-left">
            <div class="profile-item-icon">👤</div>
            <div class="profile-item-texts">
              <span class="profile-item-label">Nome Completo</span>
              <span class="profile-item-value">${user.name}</span>
            </div>
          </div>
        </div>

        <div class="profile-item">
          <div class="profile-item-left">
            <div class="profile-item-icon">📱</div>
            <div class="profile-item-texts">
              <span class="profile-item-label">WhatsApp / Telefone</span>
              <span class="profile-item-value">${user.phone}</span>
            </div>
          </div>
        </div>

        <div class="profile-item">
          <div class="profile-item-left">
            <div class="profile-item-icon">📍</div>
            <div class="profile-item-texts">
              <span class="profile-item-label">Cidade e Estado</span>
              <span class="profile-item-value">${user.city}</span>
            </div>
          </div>
        </div>
      </div>

      <button class="btn-logout" id="btn-profile-logout">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
        Sair da Conta
      </button>
    </div>

    <!-- Modal Editar Dados -->
    <div id="modal-edit-profile" class="modal-backdrop" style="display: none;">
      <div class="modal-sheet">
        <div class="modal-header">
          <h3>Atualizar Cadastro</h3>
          <button class="modal-close-btn" id="btn-close-edit">✕</button>
        </div>
        <form id="form-edit-user">
          <div class="form-group-field">
            <label>Nome Completo</label>
            <input type="text" id="edit-name" value="${user.name}" required>
          </div>
          <div class="form-group-field">
            <label>Telefone / WhatsApp</label>
            <input type="tel" id="edit-phone" value="${user.phone}" required>
          </div>
          <div class="form-group-field">
            <label>Cidade e Estado</label>
            <input type="text" id="edit-city" value="${user.city}" required>
          </div>
          <div class="form-group-field">
            <label>Link da Foto de Perfil (URL)</label>
            <input type="url" id="edit-avatar" value="${user.avatarUrl}" placeholder="https://...">
          </div>
          <button type="submit" class="btn-send-request">Salvar Alterações</button>
        </form>
      </div>
    </div>
  `;

  const modal = container.querySelector('#modal-edit-profile');
  const btnOpen = container.querySelector('#btn-open-edit');
  const btnAvatar = container.querySelector('#btn-edit-avatar');
  const btnClose = container.querySelector('#btn-close-edit');
  const form = container.querySelector('#form-edit-user');

  const openM = () => { modal.style.display = 'flex'; };
  const closeM = () => { modal.style.display = 'none'; };

  btnOpen.addEventListener('click', openM);
  btnAvatar.addEventListener('click', openM);
  btnClose.addEventListener('click', closeM);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const updatedUser = {
      ...user,
      name: container.querySelector('#edit-name').value.trim(),
      phone: container.querySelector('#edit-phone').value.trim(),
      city: container.querySelector('#edit-city').value.trim(),
      avatarUrl: container.querySelector('#edit-avatar').value.trim() || user.avatarUrl
    };

    store.setState({ currentUser: updatedUser });
    closeM();
    renderProfileView(container, onLogout);
  });

  container.querySelector('#btn-profile-logout').addEventListener('click', () => {
    store.setState({ currentUser: null });
    if (onLogout) onLogout();
  });
}
