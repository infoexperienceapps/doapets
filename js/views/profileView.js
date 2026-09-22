import { store } from '../services/store.js';

export function renderProfileView(container, onLogout) {
  const isAdmin = store.isAdmin();
  const isGuest = store.isGuest();
  const user = store.getState().currentUser || {
    name: "Visitante",
    email: "visitante@doapets.com",
    cpf: "Não informado",
    phone: "Apenas visualização",
    address: "Não informado",
    city: "Modo Leitura",
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80"
  };

  const allAnimals = store.getState().animals;
  const myPets = !isGuest ? allAnimals.filter(pet => pet.ownerEmail === user.email) : [];

  container.innerHTML = `
    <div class="profile-view-wrapper">
      <div class="profile-header-card">
        <div class="profile-avatar-container">
          <img class="profile-avatar-img" src="${user.avatarUrl}" alt="${user.name}">
          ${!isGuest ? `
            <button class="profile-avatar-edit-btn" id="btn-edit-avatar" title="Trocar foto">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
            </button>
          ` : ''}
        </div>
        <h2 class="profile-user-name">${user.name}</h2>
        <p class="profile-user-email">${isGuest ? 'Navegando em modo visitante' : user.email}</p>
        <span class="profile-role-badge ${isAdmin ? 'profile-role-admin' : ''}">
          ${isAdmin ? '👑 Perfil Oficial da ONG (Prioridade Máxima)' : (isGuest ? '👀 Modo Visitante (Apenas Leitura)' : '🐾 Tutor Cadastrado')}
        </span>
        ${!isGuest ? `
          <div>
            <button class="btn-edit-profile" id="btn-open-edit">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
              </svg>
              Editar Meus Dados
            </button>
          </div>
        ` : `
          <div>
            <button class="btn-send-request" id="btn-guest-register-now" style="margin-top: 10px; font-size: 13px; padding: 10px 18px;">
              Criar Conta ou Fazer Login
            </button>
          </div>
        `}
      </div>

      <!-- SEÇÃO MINIMIZÁVEL: Meus Animais para Doação (com Editar e Excluir) -->
      ${!isGuest ? `
        <div class="accordion-item" id="acc-my-pets" style="margin-bottom: 16px; border-radius: var(--radius-md); border: 1px solid var(--border-light); background: var(--bg-surface); overflow: hidden; box-shadow: var(--shadow-card);">
          <div class="accordion-header" id="header-my-pets" style="padding: 14px 16px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; user-select: none;">
            <div style="display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 800; color: var(--text-main);">
              <span>🐾</span>
              <span>${isAdmin ? 'Animais Vinculados à ONG' : 'Meus Animais para Doação'} (${myPets.length})</span>
            </div>
            <span class="accordion-arrow" id="arrow-my-pets" style="font-size: 12px; color: var(--text-muted); transition: transform 0.25s ease;">▼</span>
          </div>
          <div class="accordion-content" id="content-my-pets" style="display: none; padding: 0 14px 14px; border-top: 1px dashed var(--border-light);">
            ${myPets.length === 0 ? `
              <div style="padding: 12px; text-align: center; font-size: 12px; color: var(--text-muted);">
                Você ainda não cadastrou nenhum animal para doação.
              </div>
            ` : `
              <div style="margin-top: 10px;">
                ${myPets.map(pet => `
                  <div class="request-card" style="margin-bottom: 10px; background: #FFFDFB;">
                    <div class="request-card-header">
                      <span class="request-pet-name">🐾 ${pet.name}</span>
                      <span class="status-badge ${pet.status === 'Disponível' || pet.status === 'Aprovado' ? 'status-aprovado' : 'status-pendente'}">
                        ${pet.status}
                      </span>
                    </div>
                    <div class="request-detail-line"><strong>Espécie e Sexo:</strong> ${pet.species} • ${pet.sex} (${pet.age})</div>
                    <div class="request-detail-line"><strong>Status:</strong> ${pet.status === 'Disponível' || pet.status === 'Aprovado' ? '✅ Aprovado e visível' : '⏳ Aguardando aprovação da ONG'}</div>
                    <div class="request-detail-line"><strong>Data:</strong> ${pet.date}</div>

                    <!-- Botões Rápidos de Gestão do Pet no Perfil -->
                    <div style="display: flex; gap: 8px; margin-top: 8px; padding-top: 8px; border-top: 1px dashed var(--border-light);">
                      <button type="button" class="btn-edit-pet-profile" data-pet-id="${pet.id}" style="flex: 1; background: #2B2D42; color: white; padding: 6px; font-size: 12px; font-weight: 700; border-radius: var(--radius-sm);">
                        ✏️ Editar
                      </button>
                      <button type="button" class="btn-delete-pet-profile" data-pet-id="${pet.id}" data-pet-name="${pet.name}" style="flex: 1; background: #D62828; color: white; padding: 6px; font-size: 12px; font-weight: 700; border-radius: var(--radius-sm);">
                        🗑️ Excluir
                      </button>
                    </div>
                  </div>
                `).join('')}
              </div>
            `}
          </div>
        </div>
      ` : ''}

      <!-- Dados Oficiais Cadastrados -->
      <div class="profile-section-title">Dados Cadastrais Oficiais</div>
      <div class="profile-group-card">
        <div class="profile-item">
          <div class="profile-item-left">
            <div class="profile-item-icon">👤</div>
            <div class="profile-item-texts">
              <span class="profile-item-label">Identificação / Nome</span>
              <span class="profile-item-value">${user.name}</span>
            </div>
          </div>
        </div>

        <div class="profile-item">
          <div class="profile-item-left">
            <div class="profile-item-icon">📄</div>
            <div class="profile-item-texts">
              <span class="profile-item-label">CPF</span>
              <span class="profile-item-value">${user.cpf || 'Não informado'}</span>
            </div>
          </div>
        </div>

        <div class="profile-item">
          <div class="profile-item-left">
            <div class="profile-item-icon">📱</div>
            <div class="profile-item-texts">
              <span class="profile-item-label">Telefone Contato Real</span>
              <span class="profile-item-value">${user.phone}</span>
            </div>
          </div>
        </div>

        <div class="profile-item">
          <div class="profile-item-left">
            <div class="profile-item-icon">🏠</div>
            <div class="profile-item-texts">
              <span class="profile-item-label">Endereço</span>
              <span class="profile-item-value">${user.address || 'Não informado'}</span>
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
        ${isGuest ? 'Voltar para a Tela de Login' : 'Sair da Conta'}
      </button>
    </div>

    <!-- Modal Editar Dados do Usuário -->
    ${!isGuest ? `
      <div id="modal-edit-profile" class="modal-backdrop" style="display: none;">
        <div class="modal-sheet">
          <div class="modal-header">
            <h3>Atualizar Dados Cadastrais</h3>
            <button class="modal-close-btn" id="btn-close-edit">✕</button>
          </div>
          <form id="form-edit-user">
            <div class="form-group-field">
              <label>Nome Completo *</label>
              <input type="text" id="edit-name" value="${user.name}" required>
            </div>
            <div class="form-group-field">
              <label>CPF *</label>
              <input type="text" id="edit-cpf" value="${user.cpf || ''}" required>
            </div>
            <div class="form-group-field">
              <label>Telefone Contato Real (WhatsApp) *</label>
              <input type="tel" id="edit-phone" value="${user.phone}" required>
            </div>
            <div class="form-group-field">
              <label>Endereço Completo (Rua, Nº, Bairro) *</label>
              <input type="text" id="edit-address" value="${user.address || ''}" required>
            </div>
            <div class="form-group-field">
              <label>Cidade e Estado *</label>
              <input type="text" id="edit-city" value="${user.city}" required>
            </div>
            <div class="form-group-field">
              <label>Link da Foto de Perfil (URL)</label>
              <input type="url" id="edit-avatar" value="${user.avatarUrl}">
            </div>
            <button type="submit" class="btn-send-request">Salvar Alterações</button>
          </form>
        </div>
      </div>
    ` : ''}

    <!-- Modal Editar Pet (no Perfil) -->
    <div id="modal-edit-pet-profile" class="modal-backdrop" style="display: none;">
      <div class="modal-sheet">
        <div class="modal-header">
          <h3>Editar Animal</h3>
          <button class="modal-close-btn" id="btn-close-edit-pet-p">✕</button>
        </div>
        <form id="form-edit-pet-p">
          <input type="hidden" id="edit-p-id">
          <div class="form-group-field">
            <label>Nome do Animal *</label>
            <input type="text" id="edit-p-name" required>
          </div>
          <div class="form-group-field">
            <label>URL da Foto Real *</label>
            <input type="url" id="edit-p-photo" required>
          </div>
          <div class="form-group-field">
            <label>Espécie *</label>
            <select id="edit-p-species" required>
              <option value="Cachorro">Cachorro</option>
              <option value="Gato">Gato</option>
              <option value="Outro">Outro</option>
            </select>
          </div>
          <div class="form-group-field">
            <label>Idade e Sexo *</label>
            <div style="display: flex; gap: 8px;">
              <input type="text" id="edit-p-age" required style="flex: 1;">
              <select id="edit-p-sex" required style="flex: 1;">
                <option value="Macho">Macho</option>
                <option value="Fêmea">Fêmea</option>
              </select>
            </div>
          </div>
          <div class="form-group-field">
            <label>Porte *</label>
            <select id="edit-p-size" required>
              <option value="Pequeno">Pequeno</option>
              <option value="Médio">Médio</option>
              <option value="Grande">Grande</option>
            </select>
          </div>
          <div class="form-group-field">
            <label>História / Cuidados / Castrado? *</label>
            <textarea id="edit-p-desc" rows="3" required style="resize:none;"></textarea>
          </div>
          <button type="submit" class="btn-send-request" style="margin-top: 12px;">Salvar Alterações</button>
        </form>
      </div>
    </div>
  `;

  // Sanfona Meus Animais
  const headerMyPets = container.querySelector('#header-my-pets');
  const contentMyPets = container.querySelector('#content-my-pets');
  const arrowMyPets = container.querySelector('#arrow-my-pets');

  if (headerMyPets) {
    headerMyPets.addEventListener('click', () => {
      const isVisible = contentMyPets.style.display === 'block';
      contentMyPets.style.display = isVisible ? 'none' : 'block';
      arrowMyPets.style.transform = isVisible ? 'rotate(0deg)' : 'rotate(180deg)';
      arrowMyPets.style.color = isVisible ? 'var(--text-muted)' : 'var(--color-primary)';
    });
  }

  // Modais de Edição de Pet pelo Perfil
  const modalEditPetP = container.querySelector('#modal-edit-pet-profile');
  const btnCloseEditPetP = container.querySelector('#btn-close-edit-pet-p');
  const formEditPetP = container.querySelector('#form-edit-pet-p');

  if (btnCloseEditPetP) btnCloseEditPetP.addEventListener('click', () => modalEditPetP.style.display = 'none');

  container.querySelectorAll('.btn-edit-pet-profile').forEach(btn => {
    btn.addEventListener('click', () => {
      const petId = btn.dataset.petId;
      const pet = allAnimals.find(p => p.id === petId);
      if (!pet) return;

      container.querySelector('#edit-p-id').value = pet.id;
      container.querySelector('#edit-p-name').value = pet.name;
      container.querySelector('#edit-p-photo').value = pet.photoUrl;
      container.querySelector('#edit-p-species').value = pet.species;
      container.querySelector('#edit-p-age').value = pet.age;
      container.querySelector('#edit-p-sex').value = pet.sex;
      container.querySelector('#edit-p-size').value = pet.size;
      container.querySelector('#edit-p-desc').value = pet.description;

      modalEditPetP.style.display = 'flex';
    });
  });

  if (formEditPetP) {
    formEditPetP.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = container.querySelector('#edit-p-id').value;
      const updated = {
        name: container.querySelector('#edit-p-name').value.trim(),
        photoUrl: container.querySelector('#edit-p-photo').value.trim(),
        species: container.querySelector('#edit-p-species').value,
        age: container.querySelector('#edit-p-age').value.trim(),
        sex: container.querySelector('#edit-p-sex').value,
        size: container.querySelector('#edit-p-size').value,
        description: container.querySelector('#edit-p-desc').value.trim()
      };
      store.updateAnimal(id, updated);
      modalEditPetP.style.display = 'none';
      alert('Animal atualizado com sucesso!');
      renderProfileView(container, onLogout);
    });
  }

  // Exclusão de Pet no Perfil
  container.querySelectorAll('.btn-delete-pet-profile').forEach(btn => {
    btn.addEventListener('click', () => {
      const petId = btn.dataset.petId;
      const petName = btn.dataset.petName;
      if (confirm(`Tem certeza que deseja excluir o animal "${petName}"?`)) {
        store.deleteAnimal(petId);
        alert('Animal excluído com sucesso!');
        renderProfileView(container, onLogout);
      }
    });
  });

  if (isGuest) {
    container.querySelector('#btn-guest-register-now').addEventListener('click', () => {
      store.setState({ currentUser: null });
      if (onLogout) onLogout();
    });
  }

  const modal = container.querySelector('#modal-edit-profile');
  const btnOpen = container.querySelector('#btn-open-edit');
  const btnAvatar = container.querySelector('#btn-edit-avatar');
  const btnClose = container.querySelector('#btn-close-edit');
  const form = container.querySelector('#form-edit-user');

  if (btnOpen && modal) btnOpen.addEventListener('click', () => modal.style.display = 'flex');
  if (btnAvatar && modal) btnAvatar.addEventListener('click', () => modal.style.display = 'flex');
  if (btnClose && modal) btnClose.addEventListener('click', () => modal.style.display = 'none');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const updatedUser = {
        ...user,
        name: container.querySelector('#edit-name').value.trim(),
        cpf: container.querySelector('#edit-cpf').value.trim(),
        phone: container.querySelector('#edit-phone').value.trim(),
        address: container.querySelector('#edit-address').value.trim(),
        city: container.querySelector('#edit-city').value.trim(),
        avatarUrl: container.querySelector('#edit-avatar').value.trim() || user.avatarUrl
      };

      store.setState({ currentUser: updatedUser });
      modal.style.display = 'none';
      renderProfileView(container, onLogout);
    });
  }

  container.querySelector('#btn-profile-logout').addEventListener('click', () => {
    store.setState({ currentUser: null });
    if (onLogout) onLogout();
  });
}
