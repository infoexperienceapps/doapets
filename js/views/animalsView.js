import { store } from '../services/store.js';

export function renderAnimalsView(container, onNavigate) {
  const isAdmin = store.isAdmin();
  const isGuest = store.isGuest();
  const user = store.getState().currentUser;
  
  const allAnimals = store.getState().animals;
  // Decrescente: o mais novo cadastrado aparece no topo
  const animals = (isAdmin 
    ? allAnimals 
    : allAnimals.filter(pet => pet.status === 'Disponível' || pet.status === 'Aprovado')
  ).slice().reverse();

  container.innerHTML = `
    <div class="home-top-bar">
      <div>
        <h2 class="home-top-title">Todos os Animais</h2>
        <span style="font-size: 12px; color: var(--text-muted);">${animals.length} disponíveis para adoção</span>
      </div>
      ${!isGuest ? `
        <button class="btn-add-pet" id="btn-open-add-pet-animals" title="Cadastrar animal">+</button>
      ` : ''}
    </div>

    <!-- Lista Decrescente com foto oval menor e informações à direita -->
    <div id="pets-container-animals" style="overflow-y: auto; padding-bottom: 10px;">
      ${animals.length === 0 ? `
        <div class="empty-pets-notice">
          <p>Nenhum animal publicado no momento.</p>
          ${!isGuest ? `
            <button class="btn-send-request" id="btn-empty-add-animals" style="width: auto; padding: 10px 22px; margin-top: 10px; display: inline-block;">
              + Cadastrar Primeiro Animal
            </button>
          ` : `
            <p style="font-size: 12px; color: var(--color-primary); margin-top: 6px;">Entre com uma conta para cadastrar animais.</p>
          `}
        </div>
      ` : `
        ${animals.map((pet, index) => {
          const isFromOng = (pet.ownerName || '').toLowerCase().includes('ong') || 
                            (pet.ownerName || '').toLowerCase().includes('doapets') ||
                            (pet.ownerEmail || '').toLowerCase().includes('ong3');
          return `
            <div class="pet-horizontal-card" data-pet-idx="${index}">
              <img src="${pet.photoUrl}" class="pet-oval-avatar" alt="${pet.name}" loading="lazy">
              
              <div class="pet-card-right-info">
                <div class="pet-card-right-header">
                  <span class="pet-card-right-name">${pet.name}</span>
                  <span class="pet-card-right-badge">${pet.status || 'Disponível'}</span>
                </div>
                <div class="pet-card-right-meta">
                  ${pet.species} • ${pet.age} • Porte ${pet.size}
                </div>
                <div class="pet-card-right-author">
                  Publicado por:
                  ${isFromOng 
                    ? `<span class="author-tag-ong">👑 ONG (ong3)</span>` 
                    : `<span class="author-tag-user">👤 ${pet.ownerName || 'Tutor'}</span>`
                  }
                </div>
                <div style="font-size: 11px; color: var(--color-primary); font-weight: 700; margin-top: 4px;">
                  🔍 Toque para ver detalhes
                </div>
              </div>
            </div>
          `;
        }).join('')}
      `}
    </div>

    <!-- POPUP DETALHADO DO ANIMAL AO CLICAR -->
    <div id="modal-pet-details" class="modal-backdrop" style="display: none;">
      <div class="modal-sheet">
        <div class="modal-header">
          <h3 id="detail-pet-name">🐾 Detalhes do Animal</h3>
          <button class="modal-close-btn" id="btn-close-pet-details">✕</button>
        </div>
        
        <div id="detail-pet-body" style="max-height: 400px; overflow-y: auto;">
          <!-- Renderizado via JS com todas as informações -->
        </div>

        <button type="button" class="btn-send-request" id="btn-adopt-from-modal" style="margin-top: 14px;">
          Quero Adotar Este Pet
        </button>
      </div>
    </div>

    <!-- Modal Adicionar Animal -->
    ${!isGuest ? `
      <div id="modal-add-pet-animals" class="modal-backdrop" style="display: none;">
        <div class="modal-sheet">
          <div class="modal-header">
            <h3>Cadastrar Animal para Adoção</h3>
            <button class="modal-close-btn" id="btn-close-pet-modal-animals">✕</button>
          </div>
          <form id="form-new-pet-animals">
            <div class="form-group-field">
              <label>Nome do Animal *</label>
              <input type="text" id="pet-name-a" placeholder="Ex: Bob" required>
            </div>
            <div class="form-group-field">
              <label>URL da Foto Real *</label>
              <input type="url" id="pet-photo-a" placeholder="https://..." required>
            </div>
            <div class="form-group-field">
              <label>Espécie *</label>
              <select id="pet-species-a" required>
                <option value="Cachorro">Cachorro</option>
                <option value="Gato">Gato</option>
                <option value="Outro">Outro</option>
              </select>
            </div>
            <div class="form-group-field">
              <label>Idade e Sexo *</label>
              <div style="display: flex; gap: 8px;">
                <input type="text" id="pet-age-a" placeholder="Ex: 2 anos" required style="flex: 1;">
                <select id="pet-sex-a" required style="flex: 1;">
                  <option value="Macho">Macho</option>
                  <option value="Fêmea">Fêmea</option>
                </select>
              </div>
            </div>
            <div class="form-group-field">
              <label>Porte *</label>
              <select id="pet-size-a" required>
                <option value="Pequeno">Pequeno</option>
                <option value="Médio">Médio</option>
                <option value="Grande">Grande</option>
              </select>
            </div>
            <div class="form-group-field">
              <label>História / Cuidados / Castrado? *</label>
              <textarea id="pet-desc-a" rows="3" placeholder="Ex: Dócil, vacinado, castrado, sociável..." required style="resize:none;"></textarea>
            </div>
            
            ${!isAdmin ? `
              <div style="background: #FFF3E6; border: 1px solid var(--border-light); border-radius: var(--radius-sm); padding: 10px; margin-top: 10px; font-size: 11px; color: var(--color-primary-dark);">
                ℹ️ Seu animal será enviado para análise da equipe da <strong>DoaPets</strong>. Enquanto aguarda aprovação, você poderá visualizá-lo em seu perfil.
              </div>
            ` : ''}

            <button type="submit" class="btn-send-request" style="margin-top: 14px;">
              ${isAdmin ? 'Publicar Imediatamente' : 'Salvar e Enviar para Aprovação'}
            </button>
          </form>
        </div>
      </div>
    ` : ''}
  `;

  // Interatividade do Pop-up de Detalhes do Pet
  const modalDetail = container.querySelector('#modal-pet-details');
  const btnCloseDetail = container.querySelector('#btn-close-pet-details');
  const btnAdoptModal = container.querySelector('#btn-adopt-from-modal');
  const detailTitle = container.querySelector('#detail-pet-name');
  const detailBody = container.querySelector('#detail-pet-body');

  let selectedPetName = '';

  container.querySelectorAll('.pet-horizontal-card').forEach(card => {
    card.addEventListener('click', () => {
      const idx = card.dataset.petIdx;
      const pet = animals[idx];
      if (!pet) return;

      selectedPetName = pet.name;
      const isFromOng = (pet.ownerName || '').toLowerCase().includes('ong') || 
                        (pet.ownerName || '').toLowerCase().includes('doapets') ||
                        (pet.ownerEmail || '').toLowerCase().includes('ong3');

      detailTitle.textContent = `🐾 ${pet.name}`;
      detailBody.innerHTML = `
        <div style="text-align: center; margin-bottom: 12px;">
          <img src="${pet.photoUrl}" style="width: 100%; max-height: 220px; object-fit: cover; border-radius: var(--radius-md);" alt="${pet.name}">
        </div>

        <div style="background: #FDF8F5; border: 1px solid var(--border-light); border-radius: var(--radius-sm); padding: 12px; margin-bottom: 12px;">
          <div style="font-size: 13px; margin-bottom: 4px;"><strong>Espécie e Sexo:</strong> ${pet.species} • ${pet.sex}</div>
          <div style="font-size: 13px; margin-bottom: 4px;"><strong>Idade e Porte:</strong> ${pet.age} • Porte ${pet.size}</div>
          <div style="font-size: 13px; margin-bottom: 4px;"><strong>Status:</strong> ${pet.status || 'Disponível'}</div>
          <div style="font-size: 13px;">
            <strong>Cadastrado por:</strong> 
            ${isFromOng 
              ? `<span class="author-tag-ong">👑 ONG (ong3)</span>` 
              : `<span class="author-tag-user">👤 ${pet.ownerName || 'Tutor Cadastrado'}</span>`
            }
          </div>
        </div>

        <div style="font-size: 13px; color: var(--text-main); line-height: 1.5; padding: 0 4px;">
          <strong>Histórico e Cuidados:</strong><br>
          ${pet.description}
        </div>
      `;

      modalDetail.style.display = 'flex';
    });
  });

  if (btnCloseDetail) {
    btnCloseDetail.addEventListener('click', () => modalDetail.style.display = 'none');
  }

  if (btnAdoptModal) {
    btnAdoptModal.addEventListener('click', () => {
      modalDetail.style.display = 'none';
      if (onNavigate) onNavigate('requests');
    });
  }

  // Modal Adicionar Pet
  const modal = container.querySelector('#modal-add-pet-animals');
  const btnOpen = container.querySelector('#btn-open-add-pet-animals');
  const btnEmpty = container.querySelector('#btn-empty-add-animals');
  const btnClose = container.querySelector('#btn-close-pet-modal-animals');
  const form = container.querySelector('#form-new-pet-animals');

  const openM = () => { if (modal) modal.style.display = 'flex'; };
  const closeM = () => { if (modal) modal.style.display = 'none'; };

  if (btnOpen) btnOpen.addEventListener('click', openM);
  if (btnEmpty) btnEmpty.addEventListener('click', openM);
  if (btnClose) btnClose.addEventListener('click', closeM);

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const statusInicial = isAdmin ? "Disponível" : "Pendente de Aprovação";
      
      const newAnimal = {
        id: "pet-" + Date.now(),
        name: container.querySelector('#pet-name-a').value.trim(),
        photoUrl: container.querySelector('#pet-photo-a').value.trim(),
        species: container.querySelector('#pet-species-a').value,
        age: container.querySelector('#pet-age-a').value.trim(),
        sex: container.querySelector('#pet-sex-a').value,
        size: container.querySelector('#pet-size-a').value,
        description: container.querySelector('#pet-desc-a').value.trim(),
        status: statusInicial,
        ownerEmail: user ? user.email : '',
        ownerName: isAdmin ? 'ONG DoaPets (ong3)' : (user ? user.name : 'Tutor'),
        date: new Date().toLocaleDateString('pt-BR')
      };

      store.addAnimal(newAnimal);
      closeM();
      alert(isAdmin ? "Animal publicado com sucesso!" : "Animal cadastrado! Ele já está no seu Perfil e aguarda aprovação da ONG.");
      renderAnimalsView(container, onNavigate);
    });
  }
}
