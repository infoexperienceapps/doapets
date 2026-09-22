import { store } from '../services/store.js';

export function renderAnimalsView(container, onNavigate) {
  const animals = store.getState().animals;

  container.innerHTML = `
    <div class="home-top-bar">
      <div>
        <h2 class="home-top-title">Todos os Animais</h2>
        <span style="font-size: 12px; color: var(--text-muted);">${animals.length} cadastrados na ONG</span>
      </div>
      <button class="btn-add-pet" id="btn-open-add-pet" title="Cadastrar novo animal">+</button>
    </div>

    <div id="pets-container">
      ${animals.length === 0 ? `
        <div class="empty-pets-notice">
          <p>Nenhum animal cadastrado no momento.</p>
          <button class="btn-adopt-this" id="btn-empty-add" style="display:inline-block; width:auto; padding: 10px 20px;">
            + Cadastrar Primeiro Animal
          </button>
        </div>
      ` : `
        ${animals.map(pet => `
          <div class="pet-full-card" data-id="${pet.id}">
            <div class="pet-card-image-box">
              <img src="${pet.photoUrl}" alt="${pet.name}" loading="lazy">
              <span class="pet-card-badge">${pet.status || 'Disponível'}</span>
            </div>
            <div class="pet-card-content">
              <h3 class="pet-card-name">${pet.name}</h3>
              <div class="pet-card-tags">${pet.species} • ${pet.age} • ${pet.sex} • Porte ${pet.size}</div>
              <p class="pet-card-desc">${pet.description}</p>
              <button class="btn-adopt-this btn-request-adopt" data-pet-name="${pet.name}">
                Solicitar Adoção de ${pet.name}
              </button>
            </div>
          </div>
        `).join('')}
      `}
    </div>

    <!-- Modal de Cadastro Preservado -->
    <div id="modal-add-pet" class="modal-backdrop" style="display: none;">
      <div class="modal-sheet">
        <div class="modal-header">
          <h3>Cadastrar Animal</h3>
          <button class="modal-close-btn" id="btn-close-pet-modal">✕</button>
        </div>
        <form id="form-new-pet">
          <div class="form-group">
            <label class="form-label">Nome do Animal</label>
            <input class="form-input" type="text" id="pet-name" placeholder="Ex: Bob" required>
          </div>
          <div class="form-group">
            <label class="form-label">URL da Foto Real</label>
            <input class="form-input" type="url" id="pet-photo" placeholder="https://..." required>
          </div>
          <div class="form-group">
            <label class="form-label">Espécie</label>
            <select class="form-input" id="pet-species" required>
              <option value="Cachorro">Cachorro</option>
              <option value="Gato">Gato</option>
              <option value="Outro">Outro</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Idade e Sexo</label>
            <div style="display: flex; gap: 8px;">
              <input class="form-input" type="text" id="pet-age" placeholder="Ex: 2 anos" required>
              <select class="form-input" id="pet-sex" required>
                <option value="Macho">Macho</option>
                <option value="Fêmea">Fêmea</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Porte</label>
            <select class="form-input" id="pet-size" required>
              <option value="Pequeno">Pequeno</option>
              <option value="Médio">Médio</option>
              <option value="Grande">Grande</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">História / Cuidados / Castrado?</label>
            <textarea class="form-input" id="pet-desc" rows="2" placeholder="Ex: Dócil, vacinado, se dá bem com crianças..." required style="resize:none;"></textarea>
          </div>
          <button type="submit" class="btn-save-modal">Salvar e Publicar</button>
        </form>
      </div>
    </div>
  `;

  const modal = container.querySelector('#modal-add-pet');
  const btnOpen = container.querySelector('#btn-open-add-pet');
  const btnEmptyAdd = container.querySelector('#btn-empty-add');
  const btnClose = container.querySelector('#btn-close-pet-modal');
  const form = container.querySelector('#form-new-pet');

  const openModal = () => { modal.style.display = 'flex'; };
  const closeModal = () => { modal.style.display = 'none'; };

  if (btnOpen) btnOpen.addEventListener('click', openModal);
  if (btnEmptyAdd) btnEmptyAdd.addEventListener('click', openModal);
  if (btnClose) btnClose.addEventListener('click', closeModal);

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const newAnimal = {
        id: "pet-" + Date.now(),
        name: container.querySelector('#pet-name').value.trim(),
        photoUrl: container.querySelector('#pet-photo').value.trim(),
        species: container.querySelector('#pet-species').value,
        age: container.querySelector('#pet-age').value.trim(),
        sex: container.querySelector('#pet-sex').value,
        size: container.querySelector('#pet-size').value,
        description: container.querySelector('#pet-desc').value.trim(),
        status: "Disponível"
      };

      store.addAnimal(newAnimal);
      closeModal();
      renderAnimalsView(container, onNavigate);
    });
  }

  container.querySelectorAll('.btn-request-adopt').forEach(btn => {
    btn.addEventListener('click', () => {
      if (onNavigate) onNavigate('requests');
    });
  });
}
