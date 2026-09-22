import { store } from '../services/store.js';

export function renderHomeView(container, onNavigate) {
  const isAdmin = store.isAdmin();
  const isGuest = store.isGuest();
  const user = store.getState().currentUser;
  
  const allAnimals = store.getState().animals;
  const animals = isAdmin 
    ? allAnimals 
    : allAnimals.filter(pet => pet.status === 'Disponível' || pet.status === 'Aprovado');

  const newsList = store.getState().news || [];

  container.innerHTML = `
    <div class="home-top-bar">
      <div>
        <h2 class="home-top-title">Início</h2>
        <span style="font-size: 12px; color: var(--text-muted);">
          ${isGuest ? 'Modo Visitante (Apenas Visualização)' : 'DoaPets Oficial'}
        </span>
      </div>
      <div style="display: flex; gap: 8px;">
        ${isAdmin ? `
          <button class="btn-add-pet" id="btn-open-news" title="Adicionar Notícia/Aviso" style="background: #2B2D42;">📢</button>
        ` : ''}
        ${!isGuest ? `
          <button class="btn-add-pet" id="btn-open-add-pet" title="Cadastrar animal">+</button>
        ` : ''}
      </div>
    </div>

    <!-- Hero de Acolhimento -->
    <div class="home-hero">
      <h2>Encontre seu amigo! 🐾</h2>
      <p>Cadastre e adote animais com proteção, carinho e responsabilidade.</p>
      <button class="btn-hero-action" id="btn-hero-adopt">
        Ver Animais Disponíveis →
      </button>
    </div>

    <!-- Mural de Notícias -->
    ${newsList.length > 0 ? `
      <div class="home-top-bar" style="margin-bottom: 8px;">
        <h3 style="font-size: 15px; font-weight: 800; color: var(--text-main);">Informativos da ONG 📢</h3>
      </div>
      <div style="margin-bottom: 18px;">
        ${newsList.map(n => `
          <div style="background: var(--bg-surface); border: 1px solid var(--border-light); border-left: 4px solid var(--color-primary); border-radius: var(--radius-sm); padding: 12px 14px; margin-bottom: 8px; box-shadow: var(--shadow-card);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <strong style="font-size: 13px; color: var(--text-main);">${n.title}</strong>
              <span style="font-size: 10px; color: var(--text-muted);">${n.date}</span>
            </div>
            <p style="font-size: 12px; color: var(--text-muted); line-height: 1.4;">${n.content}</p>
          </div>
        `).join('')}
      </div>
    ` : ''}

    <div class="home-top-bar" style="margin-bottom: 10px;">
      <h3 style="font-size: 15px; font-weight: 800; color: var(--text-main);">Destaques para Adoção</h3>
    </div>

    <div id="pets-container">
      ${animals.length === 0 ? `
        <div class="empty-pets-notice">
          <p>Nenhum animal publicado no momento.</p>
          ${!isGuest ? `
            <button class="btn-send-request" id="btn-empty-add" style="width: auto; padding: 10px 22px; margin-top: 10px; display: inline-block;">
              + Cadastrar Primeiro Animal
            </button>
          ` : `
            <p style="font-size: 11px; color: var(--color-primary); margin-top: 6px;">Entre com uma conta para cadastrar animais.</p>
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
              <button class="btn-send-request btn-request-adopt" data-pet-name="${pet.name}" style="margin-top:0;">
                Solicitar Adoção de ${pet.name}
              </button>
            </div>
          </div>
        `).join('')}
      `}
    </div>

    <!-- Modal Adicionar Animal -->
    ${!isGuest ? `
      <div id="modal-add-pet" class="modal-backdrop" style="display: none;">
        <div class="modal-sheet">
          <div class="modal-header">
            <h3>Cadastrar Animal</h3>
            <button class="modal-close-btn" id="btn-close-pet-modal">✕</button>
          </div>
          <form id="form-new-pet">
            <div class="form-group-field">
              <label>Nome do Pet</label>
              <input type="text" id="pet-name" placeholder="Ex: Mel" required>
            </div>
            <div class="form-group-field">
              <label>URL da Foto Real</label>
              <input type="url" id="pet-photo" placeholder="https://..." required>
            </div>
            <div class="form-group-field">
              <label>Espécie</label>
              <select id="pet-species" required>
                <option value="Cachorro">Cachorro</option>
                <option value="Gato">Gato</option>
                <option value="Outro">Outro</option>
              </select>
            </div>
            <div class="form-group-field">
              <label>Idade e Sexo</label>
              <div style="display: flex; gap: 8px;">
                <input type="text" id="pet-age" placeholder="Ex: 1 ano" required>
                <select id="pet-sex" required>
                  <option value="Macho">Macho</option>
                  <option value="Fêmea">Fêmea</option>
                </select>
              </div>
            </div>
            <div class="form-group-field">
              <label>Porte</label>
              <select id="pet-size" required>
                <option value="Pequeno">Pequeno</option>
                <option value="Médio">Médio</option>
                <option value="Grande">Grande</option>
              </select>
            </div>
            <div class="form-group-field">
              <label>História / Temperamento</label>
              <textarea id="pet-desc" rows="2" placeholder="Dócil, castrado, vacinado..." required style="resize:none;"></textarea>
            </div>
            
            ${!isAdmin ? `
              <div style="background: #FFF3E6; border: 1px solid var(--border-light); border-radius: var(--radius-sm); padding: 10px; margin-top: 10px; font-size: 11px; color: var(--color-primary-dark);">
                ℹ️ O animal será submetido para avaliação da ONG. Você poderá acompanhá-lo no seu Perfil.
              </div>
            ` : ''}

            <button type="submit" class="btn-send-request" style="margin-top: 12px;">
              ${isAdmin ? 'Publicar Imediatamente' : 'Enviar para Aprovação da ONG'}
            </button>
          </form>
        </div>
      </div>
    ` : ''}

    <!-- Modal Adicionar Notícia -->
    ${isAdmin ? `
      <div id="modal-add-news" class="modal-backdrop" style="display: none;">
        <div class="modal-sheet">
          <div class="modal-header">
            <h3>Publicar Aviso da ONG</h3>
            <button class="modal-close-btn" id="btn-close-news-modal">✕</button>
          </div>
          <form id="form-new-news">
            <div class="form-group-field">
              <label>Título da Notícia / Aviso</label>
              <input type="text" id="news-title" placeholder="Ex: Feira de Adoção Especial" required>
            </div>
            <div class="form-group-field">
              <label>Conteúdo da Informação</label>
              <textarea id="news-content" rows="3" placeholder="Escreva o comunicado para os tutores..." required style="resize:none;"></textarea>
            </div>
            <button type="submit" class="btn-send-request">Publicar Aviso</button>
          </form>
        </div>
      </div>
    ` : ''}
  `;

  const modalPet = container.querySelector('#modal-add-pet');
  const btnOpenPet = container.querySelector('#btn-open-add-pet');
  const btnEmptyAdd = container.querySelector('#btn-empty-add');
  const btnClosePet = container.querySelector('#btn-close-pet-modal');
  const formPet = container.querySelector('#form-new-pet');

  const modalNews = container.querySelector('#modal-add-news');
  const btnOpenNews = container.querySelector('#btn-open-news');
  const btnCloseNews = container.querySelector('#btn-close-news-modal');
  const formNews = container.querySelector('#form-new-news');

  if (btnOpenPet && modalPet) btnOpenPet.addEventListener('click', () => modalPet.style.display = 'flex');
  if (btnEmptyAdd && modalPet) btnEmptyAdd.addEventListener('click', () => modalPet.style.display = 'flex');
  if (btnClosePet && modalPet) btnClosePet.addEventListener('click', () => modalPet.style.display = 'none');

  if (btnOpenNews && modalNews) btnOpenNews.addEventListener('click', () => modalNews.style.display = 'flex');
  if (btnCloseNews && modalNews) btnCloseNews.addEventListener('click', () => modalNews.style.display = 'none');

  if (formPet) {
    formPet.addEventListener('submit', (e) => {
      e.preventDefault();
      const statusInicial = isAdmin ? "Disponível" : "Pendente de Aprovação";

      const newAnimal = {
        id: "pet-" + Date.now(),
        name: container.querySelector('#pet-name').value.trim(),
        photoUrl: container.querySelector('#pet-photo').value.trim(),
        species: container.querySelector('#pet-species').value,
        age: container.querySelector('#pet-age').value.trim(),
        sex: container.querySelector('#pet-sex').value,
        size: container.querySelector('#pet-size').value,
        description: container.querySelector('#pet-desc').value.trim(),
        status: statusInicial,
        ownerEmail: user ? user.email : '',
        ownerName: user ? user.name : 'ONG DoaPets',
        date: new Date().toLocaleDateString('pt-BR')
      };
      store.addAnimal(newAnimal);
      modalPet.style.display = 'none';
      alert(isAdmin ? "Animal publicado com sucesso!" : "Animal cadastrado! Ele já está visível no seu Perfil e aguarda autorização da ONG para aparecer na lista pública.");
      renderHomeView(container, onNavigate);
    });
  }

  if (formNews) {
    formNews.addEventListener('submit', (e) => {
      e.preventDefault();
      const item = {
        id: "news-" + Date.now(),
        title: container.querySelector('#news-title').value.trim(),
        content: container.querySelector('#news-content').value.trim(),
        date: new Date().toLocaleDateString('pt-BR'),
        author: "Administração DoaPets"
      };
      store.addNews(item);
      modalNews.style.display = 'none';
      renderHomeView(container, onNavigate);
    });
  }

  const btnHero = container.querySelector('#btn-hero-adopt');
  if (btnHero) btnHero.addEventListener('click', () => onNavigate('animals'));

  container.querySelectorAll('.btn-request-adopt').forEach(btn => {
    btn.addEventListener('click', () => onNavigate('requests'));
  });
}
