import { store } from '../services/store.js';

export function renderAnimalsView(container, onNavigate) {
  const isAdmin = store.isAdmin();
  const isGuest = store.isGuest();
  const user = store.getState().currentUser;
  
  const allAnimals = store.getState().animals;
  const animals = isAdmin 
    ? allAnimals 
    : allAnimals.filter(pet => pet.status === 'Disponível' || pet.status === 'Aprovado');

  container.innerHTML = `
    <div class="home-top-bar">
      <div>
        <h2 class="home-top-title">Todos os Animais</h2>
        <span style="font-size: 12px; color: var(--text-muted);">${animals.length} cadastrados na ONG</span>
      </div>
      ${!isGuest ? `
        <button class="btn-add-pet" id="btn-open-add-pet-animals" title="Cadastrar animal">+</button>
      ` : ''}
    </div>

    <div id="pets-container-animals">
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
        ${animals.map(pet => `
          <div class="pet-full-card">
            <div class="pet-card-image-box">
              <img src="${pet.photoUrl}" alt="${pet.name}" loading="lazy">
              <span class="pet-card-badge">${pet.status || 'Disponível'}</span>
            </div>
            <div class="pet-card-content">
              <h3 class="pet-card-name">${pet.name}</h3>
              <div class="pet-card-tags">${pet.species} • ${pet.age} • ${pet.sex} • Porte ${pet.size}</div>
              <p class="pet-card-desc">${pet.description}</p>
              <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 10px;">
                Cadastrado por: <strong>${pet.ownerName || 'ONG DoaPets'}</strong>
              </div>
              <button class="btn-send-request btn-request-adopt" data-pet-name="${pet.name}" style="margin-top:0;">
                Solicitar Adoção de ${pet.name}
              </button>
            </div>
          </div>
        `).join('')}
      `}
    </div>

    <!-- Modal Adicionar Animal com CSS robusto, alinhado e 100% formatado -->
    ${!isGuest ? `
      <div id="modal-add-pet-animals" class="modal-backdrop" style="display: none;">
        <div class="modal-sheet">
          <div class="modal-header">
            <h3>Cadastrar Animal</h3>
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
        ownerName: user ? user.name : 'ONG DoaPets',
        date: new Date().toLocaleDateString('pt-BR')
      };

      store.addAnimal(newAnimal);
      closeM();
      alert(isAdmin ? "Animal publicado com sucesso!" : "Animal cadastrado! Ele já está visível no seu Perfil e aguarda autorização da ONG para aparecer na lista pública.");
      renderAnimalsView(container, onNavigate);
    });
  }

  container.querySelectorAll('.btn-request-adopt').forEach(btn => {
    btn.addEventListener('click', () => onNavigate('requests'));
  });
}
