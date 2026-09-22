import { store } from '../services/store.js';

export function renderRequestsView(container, onNavigate) {
  const isAdmin = store.isAdmin();
  const isGuest = store.isGuest();
  const user = store.getState().currentUser;
  const requests = store.getState().requests;
  const animals = store.getState().animals;

  // VISÃO 1: ADMINISTRADORES (ong3, Doapets e Oscar3) COM SEÇÕES MINIMIZÁVEIS
  if (isAdmin) {
    const pendingPets = animals.filter(pet => pet.status === 'Pendente de Aprovação');
    const activeRequests = requests.filter(r => r.status !== 'Recusado');
    const rejectedRequests = requests.filter(r => r.status === 'Recusado');

    const countAttempts = (identifier) => {
      if (!identifier) return 1;
      return requests.filter(r => r.userEmail === identifier || (r.userCpf && r.userCpf === identifier)).length;
    };

    container.innerHTML = `
      <div class="admin-badge-banner">
        <span>🛡️ Painel Oficial ONG (${user.name})</span>
        <button id="btn-open-rejected-popup" style="background: #D62828; color: white; padding: 5px 10px; border-radius: var(--radius-full); font-size: 11px; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 4px;">
          🚫 Recusados (${rejectedRequests.length})
        </button>
      </div>

      <!-- 1. SEÇÃO MINIMIZÁVEL: Animais Aguardando Autorização da ONG -->
      <div class="accordion-item" id="acc-pending-pets" style="margin-bottom: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-light); background: var(--bg-surface); overflow: hidden; box-shadow: var(--shadow-card);">
        <div class="accordion-header" id="header-pending-pets" style="padding: 14px 16px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; user-select: none;">
          <div style="font-size: 14px; font-weight: 800; color: var(--color-primary-dark);">
            🐾 Animais Aguardando Autorização (${pendingPets.length})
          </div>
          <span class="accordion-arrow" id="arrow-pending-pets" style="font-size: 12px; color: var(--text-muted); transition: transform 0.25s ease;">▼</span>
        </div>
        
        <div class="accordion-content" id="content-pending-pets" style="display: none; padding: 0 14px 14px; border-top: 1px dashed var(--border-light);">
          ${pendingPets.length === 0 ? `
            <div style="padding: 12px; text-align: center; color: var(--text-muted); font-size: 12px;">
              Nenhum animal pendente de autorização no momento.
            </div>
          ` : `
            <div style="margin-top: 10px;">
              ${pendingPets.map(p => `
                <div class="request-card" style="margin-bottom: 10px;">
                  <div class="request-card-header">
                    <span class="request-pet-name">🐾 ${p.name} (${p.species}, ${p.age})</span>
                    <span class="status-badge status-pendente">Aguardando Avaliação</span>
                  </div>
                  <div class="request-detail-line"><strong>Cadastrado por:</strong> ${p.ownerName} (${p.ownerEmail})</div>
                  <div class="request-detail-line"><strong>Porte / Sexo:</strong> ${p.size} • ${p.sex}</div>
                  <div class="request-detail-line"><strong>Descrição:</strong> ${p.description}</div>
                  <div class="admin-actions-bar">
                    <button class="btn-status-action btn-approve btn-approve-pet" data-id="${p.id}">
                      ✓ Autorizar e Publicar no App
                    </button>
                    <button class="btn-status-action btn-reject btn-reject-pet" data-id="${p.id}">
                      ✕ Recusar Publicação
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>
      </div>

      <!-- 2. SEÇÃO MINIMIZÁVEL: Solicitações de Tutores em Aberto -->
      <div class="accordion-item active" id="acc-active-requests" style="margin-bottom: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-light); background: var(--bg-surface); overflow: hidden; box-shadow: var(--shadow-card);">
        <div class="accordion-header" id="header-active-requests" style="padding: 14px 16px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; user-select: none;">
          <div style="font-size: 14px; font-weight: 800; color: var(--text-main);">
            📋 Solicitações de Tutores (${activeRequests.length})
          </div>
          <span class="accordion-arrow" id="arrow-active-requests" style="font-size: 12px; color: var(--text-muted); transform: rotate(180deg); transition: transform 0.25s ease;">▼</span>
        </div>
        
        <div class="accordion-content" id="content-active-requests" style="display: block; padding: 0 14px 14px; border-top: 1px dashed var(--border-light);">
          ${activeRequests.length === 0 ? `
            <div style="padding: 14px; text-align: center; color: var(--text-muted); font-size: 12px;">
              Nenhuma solicitação pendente no momento.
            </div>
          ` : `
            <div style="margin-top: 10px;">
              ${activeRequests.map(req => {
                const totalTentativas = countAttempts(req.userEmail);
                return `
                  <div class="request-card" style="margin-bottom: 10px;">
                    <div class="request-card-header">
                      <span class="request-pet-name">${req.type === 'Castração' ? '✂️ Castração: ' : '🐾 Adoção: '}${req.petName}</span>
                      <span class="status-badge status-${req.status.toLowerCase().replace(' ', '-')}">
                        ${req.status}
                      </span>
                    </div>

                    <div style="background: #FDF8F5; border: 1px solid var(--border-light); border-left: 4px solid var(--color-primary); border-radius: var(--radius-sm); padding: 10px 12px; margin-bottom: 10px; font-size: 12px;">
                      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 4px;">
                        <span style="font-weight: 800; color: var(--color-primary-dark);">👤 SOLICITANTE:</span>
                        <span style="background: #E9ECEF; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 700;">
                          📊 Tentativa #${totalTentativas}
                        </span>
                      </div>
                      <div><strong>Nome Completo:</strong> ${req.userName}</div>
                      <div><strong>CPF:</strong> ${req.userCpf || 'Não informado'}</div>
                      <div><strong>Telefone Contato:</strong> <span style="color: #2A9D8F; font-weight: 700;">${req.userPhone}</span></div>
                      <div><strong>Endereço:</strong> ${req.userAddress || 'Não informado'}, ${req.userCity}</div>
                    </div>

                    ${req.type === 'Castração' ? `
                      <div style="background: #FFF3E6; padding: 8px 12px; border-radius: var(--radius-sm); margin-bottom: 10px; font-size: 12px; color: var(--color-primary-dark);">
                        <strong>Modalidade:</strong> Castração Gratuita / Social<br>
                        <strong>Espécie e Sexo:</strong> ${req.species} • ${req.sex} (${req.weight || 'Peso não inf.'})<br>
                        <strong>Situação:</strong> ${req.animalSituation}
                      </div>
                    ` : `
                      <div style="background: ${req.isEligible === 'Sim' ? '#E8F5E9' : '#FFEBEE'}; padding: 8px 12px; border-radius: var(--radius-sm); margin-bottom: 10px; font-size: 12px;">
                        <strong>Autodeclaração de Aptidão:</strong> ${req.isEligible === 'Sim' ? '✅ Apto' : '⚠️ Não Apto'}<br>
                        <strong>Consentimento de Consulta:</strong> ${req.dataConsent ? '✅ Autorizado' : '❌ Não autorizou'}
                      </div>
                      <div class="request-detail-line"><strong>Tipo de Imóvel:</strong> ${req.housingType}</div>
                      <div class="request-detail-line"><strong>Outros Animais:</strong> ${req.hasOtherPets}</div>
                    `}

                    <div class="request-detail-line"><strong>Observações:</strong> ${req.experience || req.notes || 'Sem observações'}</div>
                    <div class="request-detail-line"><strong>Data:</strong> ${req.date}</div>

                    <div class="admin-actions-bar">
                      <button class="btn-status-action btn-review" data-action="Em Análise" data-id="${req.id}">
                        Colocar Em Análise
                      </button>
                      <button class="btn-status-action btn-approve" data-action="Aprovado" data-id="${req.id}">
                        ✓ Aprovar Pedido
                      </button>
                      <button class="btn-status-action btn-reject" data-action="Recusado" data-id="${req.id}">
                        ✕ Recusar (Mover p/ Recusados)
                      </button>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          `}
        </div>
      </div>

      <!-- POPUP / MODAL NO CANTO SUPERIOR DIREITO: LISTA DE NÃO APROVADOS & TENTATIVAS -->
      <div id="modal-rejected-popup" class="modal-backdrop" style="display: none;">
        <div class="modal-sheet">
          <div class="modal-header">
            <h3>🚫 Histórico de Não Aprovados (${rejectedRequests.length})</h3>
            <button class="modal-close-btn" id="btn-close-rejected-popup">✕</button>
          </div>
          <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 12px;">
            Solicitantes reprovados e quantas tentativas cada um já realizou no sistema.
          </p>
          <div style="max-height: 380px; overflow-y: auto;">
            ${rejectedRequests.length === 0 ? `
              <div style="text-align: center; padding: 24px; color: var(--text-muted); font-size: 13px;">
                Nenhum pedido reprovado até o momento.
              </div>
            ` : `
              ${rejectedRequests.map(r => {
                const totalTentativas = countAttempts(r.userEmail);
                return `
                  <div class="request-card" style="border-left: 4px solid #D62828; margin-bottom: 8px;">
                    <div class="request-card-header">
                      <span class="request-pet-name">${r.type || 'Adoção'}: ${r.petName}</span>
                      <span style="background: #FEE2E2; color: #DC2626; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 4px;">
                        REPROVADO
                      </span>
                    </div>
                    <div style="font-size: 12px; line-height: 1.5; color: var(--text-main);">
                      <div><strong>Solicitante:</strong> ${r.userName}</div>
                      <div><strong>CPF:</strong> ${r.userCpf || 'Não informado'}</div>
                      <div><strong>Contato:</strong> ${r.userPhone}</div>
                      <div><strong>Data da Recusa:</strong> ${r.date}</div>
                      <div style="margin-top: 4px; color: #D62828; font-weight: 700;">
                        ⚠️ Total de tentativas no app: ${totalTentativas} vez(es)
                      </div>
                    </div>
                  </div>
                `;
              }).join('')}
            `}
          </div>
        </div>
      </div>
    `;

    // Interatividade de Minimizar para a ONG
    const headerPending = container.querySelector('#header-pending-pets');
    const contentPending = container.querySelector('#content-pending-pets');
    const arrowPending = container.querySelector('#arrow-pending-pets');

    if (headerPending) {
      headerPending.addEventListener('click', () => {
        const isVisible = contentPending.style.display === 'block';
        contentPending.style.display = isVisible ? 'none' : 'block';
        arrowPending.style.transform = isVisible ? 'rotate(0deg)' : 'rotate(180deg)';
      });
    }

    const headerActive = container.querySelector('#header-active-requests');
    const contentActive = container.querySelector('#content-active-requests');
    const arrowActive = container.querySelector('#arrow-active-requests');

    if (headerActive) {
      headerActive.addEventListener('click', () => {
        const isVisible = contentActive.style.display === 'block';
        contentActive.style.display = isVisible ? 'none' : 'block';
        arrowActive.style.transform = isVisible ? 'rotate(0deg)' : 'rotate(180deg)';
      });
    }

    // Modal Recusados
    const modalRejected = container.querySelector('#modal-rejected-popup');
    const btnOpenRejected = container.querySelector('#btn-open-rejected-popup');
    const btnCloseRejected = container.querySelector('#btn-close-rejected-popup');

    if (btnOpenRejected && modalRejected) btnOpenRejected.addEventListener('click', () => modalRejected.style.display = 'flex');
    if (btnCloseRejected && modalRejected) btnCloseRejected.addEventListener('click', () => modalRejected.style.display = 'none');

    // Ações de autorizar/recusar pets
    container.querySelectorAll('.btn-approve-pet').forEach(btn => {
      btn.addEventListener('click', () => {
        store.updateAnimalStatus(btn.dataset.id, 'Disponível');
        alert("Animal autorizado com sucesso!");
        renderRequestsView(container, onNavigate);
      });
    });

    container.querySelectorAll('.btn-reject-pet').forEach(btn => {
      btn.addEventListener('click', () => {
        store.updateAnimalStatus(btn.dataset.id, 'Recusado pela ONG');
        alert("Publicação recusada.");
        renderRequestsView(container, onNavigate);
      });
    });

    // Ações de triagem
    container.querySelectorAll('.btn-status-action:not(.btn-approve-pet):not(.btn-reject-pet)').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const newStatus = btn.dataset.action;
        store.updateRequestStatus(id, newStatus);
        renderRequestsView(container, onNavigate);
      });
    });
    return;
  }

  // VISÃO 2: USUÁRIO COMUM
  const myRequests = isGuest ? [] : requests.filter(r => r.userEmail === user.email);

  container.innerHTML = `
    <h2 style="font-size: 18px; font-weight: 800; color: var(--text-main); margin-bottom: 4px;">
      Central de Pedidos
    </h2>
    <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 14px;">
      ${isGuest ? 'Você está em modo de visualização. Crie uma conta para enviar pedidos.' : 'Toque em qualquer opção abaixo para abrir ou fechar o menu.'}
    </p>

    ${isGuest ? `
      <div style="background: #FFF3E6; border: 1.5px solid var(--color-primary); border-radius: var(--radius-md); padding: 16px; margin-bottom: 16px; text-align: center;">
        <span style="font-size: 24px;">🔒</span>
        <h4 style="font-size: 14px; color: var(--color-primary-dark); margin: 6px 0 4px;">Modo Somente Visualização</h4>
        <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 12px;">Para enviar pedidos de adoção ou castração, faça login com sua conta.</p>
        <button id="btn-guest-login-now" class="btn-send-request" style="margin-top:0; padding: 10px 18px;">
          Fazer Login / Cadastrar
        </button>
      </div>
    ` : ''}

    <div class="accordion-wrapper" style="${isGuest ? 'opacity: 0.6; pointer-events: none;' : ''}">
      <div class="accordion-item ${!isGuest ? 'active' : ''}" id="acc-item-my-requests">
        <div class="accordion-header">
          <div class="accordion-title">
            <span class="accordion-icon">📋</span>
            <span>Meus Pedidos Realizados (${myRequests.length})</span>
          </div>
          <span class="accordion-arrow">▼</span>
        </div>
        <div class="accordion-content">
          ${myRequests.length > 0 ? `
            <div style="margin-top: 12px;">
              ${myRequests.map(r => `
                <div class="request-card" style="margin-bottom: 8px;">
                  <div class="request-card-header">
                    <span class="request-pet-name">${r.type === 'Castração' ? '✂️ Castração' : '🐾 Adoção'}: ${r.petName}</span>
                    <span class="status-badge status-${r.status.toLowerCase().replace(' ', '-')}">
                      ${r.status}
                    </span>
                  </div>
                  <div class="request-detail-line"><strong>Tipo:</strong> ${r.type || 'Adoção'}</div>
                  <div class="request-detail-line"><strong>Status:</strong> ${r.status}</div>
                  <div class="request-detail-line"><strong>Data:</strong> ${r.date}</div>
                </div>
              `).join('')}
            </div>
          ` : `
            <p style="font-size: 13px; color: var(--text-muted); padding: 14px 0 0;">
              Você ainda não enviou nenhum pedido.
            </p>
          `}
        </div>
      </div>

      <div class="accordion-item" id="acc-item-adopt">
        <div class="accordion-header">
          <div class="accordion-title">
            <span class="accordion-icon">🐾</span>
            <span>Solicitar Nova Adoção</span>
          </div>
          <span class="accordion-arrow">▼</span>
        </div>
        <div class="accordion-content">
          <form id="form-adoption-request">
            <div class="form-group-field">
              <label>Qual animal você deseja adotar?</label>
              <select id="req-pet" ${isGuest ? 'disabled' : ''} required>
                ${animals.length > 0 
                  ? animals.map(a => `<option value="${a.name} (${a.species}, ${a.age})">${a.name} (${a.species},${a.age})</option>`).join('')
                  : `<option value="Animal Geral da ONG">Animal Geral da ONG</option>`
                }
              </select>
            </div>

            <div class="form-group-field">
              <label>Você se declara apto a arcar com os custos e cuidados?</label>
              <select id="req-eligible" ${isGuest ? 'disabled' : ''} required>
                <option value="Sim">Sim, estou 100% apto</option>
                <option value="Não">Não / Tenho dúvidas</option>
              </select>
            </div>

            <div class="form-group-field">
              <label>Tipo de Moradia</label>
              <select id="req-housing" ${isGuest ? 'disabled' : ''} required>
                <option value="Casa com quintal seguro/telado">Casa com quintal seguro/telado</option>
                <option value="Casa sem quintal">Casa sem quintal</option>
                <option value="Apartamento com rede de proteção">Apartamento com rede de proteção</option>
                <option value="Sítio / Chácara fechada">Sítio / Chácara fechada</option>
              </select>
            </div>

            <div class="form-group-field">
              <label>Possui outros animais atualmente?</label>
              <input type="text" id="req-pets-exist" placeholder="Ex: Sim, 1 cãozinho vacinado" ${isGuest ? 'disabled' : ''} required>
            </div>

            <div class="form-group-field">
              <label>Rotina e Motivação</label>
              <textarea id="req-experience" rows="2" placeholder="Conte brevemente sobre sua família e rotina..." ${isGuest ? 'disabled' : ''} required style="resize:none;"></textarea>
            </div>

            <div style="background: #FFFDF9; border: 1px solid var(--border-light); padding: 12px; border-radius: var(--radius-sm); margin-top: 14px;">
              <label style="display: flex; align-items: flex-start; gap: 8px; font-size: 12px; color: var(--text-main); cursor: pointer;">
                <input type="checkbox" id="req-consent" required style="margin-top: 2px;">
                <span>Declaro que meus dados cadastrados (<strong>Nome, CPF, Endereço e Telefone Real</strong>) são verdadeiros e autorizo a consulta pela ONG.</span>
              </label>
            </div>

            <button type="submit" class="btn-send-request" ${isGuest ? 'disabled' : ''}>
              Enviar Solicitação de Adoção
            </button>
          </form>
        </div>
      </div>

      <div class="accordion-item" id="acc-item-castration">
        <div class="accordion-header">
          <div class="accordion-title">
            <span class="accordion-icon">✂️</span>
            <span>Solicitar Castração Gratuita</span>
          </div>
          <span class="accordion-arrow">▼</span>
        </div>
        <div class="accordion-content">
          <form id="form-castration-request">
            <div class="form-group-field">
              <label>Nome ou Apelido do Animal</label>
              <input type="text" id="cast-pet-name" placeholder="Ex: Neguinho" ${isGuest ? 'disabled' : ''} required>
            </div>

            <div class="form-group-field">
              <label>Espécie e Sexo</label>
              <div style="display: flex; gap: 8px;">
                <select id="cast-species" ${isGuest ? 'disabled' : ''} required>
                  <option value="Canino">Cachorro</option>
                  <option value="Felino">Gato</option>
                </select>
                <select id="cast-sex" ${isGuest ? 'disabled' : ''} required>
                  <option value="Fêmea">Fêmea</option>
                  <option value="Macho">Macho</option>
                </select>
              </div>
            </div>

            <div class="form-group-field">
              <label>Idade e Peso Estimados</label>
              <div style="display: flex; gap: 8px;">
                <input type="text" id="cast-age" placeholder="Ex: 1 ano e meio" ${isGuest ? 'disabled' : ''} required>
                <input type="text" id="cast-weight" placeholder="Ex: Aprox. 8 kg" ${isGuest ? 'disabled' : ''} required>
              </div>
            </div>

            <div class="form-group-field">
              <label>Situação do Animal</label>
              <select id="cast-situation" ${isGuest ? 'disabled' : ''} required>
                <option value="Animal Resgatado da Rua">Animal Resgatado da Rua</option>
                <option value="Família de Baixa Renda">Tutor de Baixa Renda</option>
                <option value="Animal Comunitário do Bairro">Animal Comunitário do Bairro</option>
              </select>
            </div>

            <div class="form-group-field">
              <label>Observações ou Cuidados de Saúde</label>
              <textarea id="cast-notes" rows="2" placeholder="O animal toma remédio ou teve filhotes recentemente?" ${isGuest ? 'disabled' : ''} required style="resize:none;"></textarea>
            </div>

            <button type="submit" class="btn-send-request" style="background: linear-gradient(135deg, #2A9D8F 0%, #21867a 100%);" ${isGuest ? 'disabled' : ''}>
              Enviar Solicitação de Castração
            </button>
          </form>
        </div>
      </div>
    </div>
  `;

  if (isGuest) {
    const btnLoginNow = container.querySelector('#btn-guest-login-now');
    if (btnLoginNow) {
      btnLoginNow.addEventListener('click', () => {
        store.setState({ currentUser: null });
        onNavigate('profile');
      });
    }
    return;
  }

  container.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isOpen = item.classList.contains('active');
      container.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('active'));
      if (!isOpen) item.classList.add('active');
    });
  });

  const formAdopt = container.querySelector('#form-adoption-request');
  if (formAdopt) {
    formAdopt.addEventListener('submit', (e) => {
      e.preventDefault();
      const newRequest = {
        id: "ADOPT-" + Math.floor(1000 + Math.random() * 9000),
        type: "Adoção",
        userName: user.name,
        userCpf: user.cpf || "Pendente de atualização",
        userPhone: user.phone || "(00) 00000-0000",
        userAddress: user.address || "Pendente de atualização",
        userCity: user.city || "Não informado",
        userEmail: user.email,
        petName: container.querySelector('#req-pet').value,
        isEligible: container.querySelector('#req-eligible').value,
        dataConsent: container.querySelector('#req-consent').checked,
        housingType: container.querySelector('#req-housing').value,
        hasOtherPets: container.querySelector('#req-pets-exist').value.trim(),
        experience: container.querySelector('#req-experience').value.trim(),
        status: "Pendente",
        date: new Date().toLocaleDateString('pt-BR')
      };

      store.addRequest(newRequest);
      alert("Solicitação de Adoção enviada com sucesso! A ONG recebeu seus dados completos.");
      renderRequestsView(container, onNavigate);
    });
  }

  const formCast = container.querySelector('#form-castration-request');
  if (formCast) {
    formCast.addEventListener('submit', (e) => {
      e.preventDefault();
      const newCastRequest = {
        id: "CAST-" + Math.floor(1000 + Math.random() * 9000),
        type: "Castração",
        userName: user.name,
        userCpf: user.cpf || "Pendente de atualização",
        userPhone: user.phone || "(00) 00000-0000",
        userAddress: user.address || "Pendente de atualização",
        userCity: user.city || "Não informado",
        userEmail: user.email,
        petName: container.querySelector('#cast-pet-name').value.trim(),
        species: container.querySelector('#cast-species').value,
        sex: container.querySelector('#cast-sex').value,
        weight: container.querySelector('#cast-weight').value.trim() + " / " + container.querySelector('#cast-age').value.trim(),
        animalSituation: container.querySelector('#cast-situation').value,
        notes: container.querySelector('#cast-notes').value.trim(),
        status: "Pendente",
        date: new Date().toLocaleDateString('pt-BR')
      };

      store.addRequest(newCastRequest);
      alert("Solicitação de Castração cadastrada com sucesso! A ONG recebeu seus dados completos.");
      renderRequestsView(container, onNavigate);
    });
  }
}
