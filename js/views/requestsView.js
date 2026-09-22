import { store } from '../services/store.js';

export function renderRequestsView(container, onNavigate) {
  const isAdmin = store.isAdmin();
  const user = store.getState().currentUser;
  const requests = store.getState().requests;
  const animals = store.getState().animals;

  // VISÃO 1: ADMINISTRADORES (Doapets e Oscar3)
  if (isAdmin) {
    container.innerHTML = `
      <div class="admin-badge-banner">
        <span>🛡️ Painel Oficial ONG (${user.name})</span>
        <span>${requests.length} solicitações</span>
      </div>

      <h3 style="font-size: 17px; font-weight: 800; margin-bottom: 12px; color: var(--text-main);">
        Fila de Triagem e Aprovação
      </h3>

      ${requests.length === 0 ? `
        <div style="text-align: center; padding: 40px 16px; color: var(--text-muted);">
          Nenhuma solicitação aguardando no momento.
        </div>
      ` : `
        <div>
          ${requests.map(req => `
            <div class="request-card">
              <div class="request-card-header">
                <span class="request-pet-name">${req.type === 'Castração' ? '✂️ Castração: ' : '🐾 Adoção: '}${req.petName}</span>
                <span class="status-badge status-${req.status.toLowerCase().replace(' ', '-')}">
                  ${req.status}
                </span>
              </div>

              ${req.type === 'Castração' ? `
                <div style="background: #FFF3E6; padding: 8px 12px; border-radius: var(--radius-sm); margin-bottom: 10px; font-size: 12px; color: var(--color-primary-dark);">
                  <strong>Modalidade:</strong> Castração Gratuita / Social<br>
                  <strong>Espécie e Sexo:</strong> ${req.species} • ${req.sex} (${req.weight || 'Peso não inf.'})<br>
                  <strong>Situação:</strong> ${req.animalSituation}
                </div>
              ` : `
                <div style="background: ${req.isEligible === 'Sim' ? '#E8F5E9' : '#FFEBEE'}; padding: 8px 12px; border-radius: var(--radius-sm); margin-bottom: 10px; font-size: 12px;">
                  <strong>Autodeclaração de Aptidão:</strong> ${req.isEligible === 'Sim' ? '✅ Apto' : '⚠️ Declarou Não Apto'}<br>
                  <strong>Consentimento de Consulta:</strong> ${req.dataConsent ? '✅ Autorizado' : '❌ Não autorizou'}
                </div>
                <div class="request-detail-line"><strong>Imóvel:</strong> ${req.housingType}</div>
                <div class="request-detail-line"><strong>Outros Animais:</strong> ${req.hasOtherPets}</div>
              `}

              <div class="request-detail-line"><strong>Solicitante:</strong> ${req.userName}</div>
              <div class="request-detail-line"><strong>Contato:</strong> ${req.userPhone} • ${req.userEmail}</div>
              <div class="request-detail-line"><strong>Cidade:</strong> ${req.userCity}</div>
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
                  ✕ Recusar
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      `}
    `;

    container.querySelectorAll('.btn-status-action').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const newStatus = btn.dataset.action;
        store.updateRequestStatus(id, newStatus);
        renderRequestsView(container, onNavigate);
      });
    });
    return;
  }

  // VISÃO 2: USUÁRIO COMUM (Com Menus Suspensos / Accordion)
  const myRequests = requests.filter(r => r.userEmail === user.email);

  container.innerHTML = `
    <h2 style="font-size: 18px; font-weight: 800; color: var(--text-main); margin-bottom: 4px;">
      Central de Pedidos
    </h2>
    <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 14px;">
      Toque em qualquer opção abaixo para abrir ou fechar o menu.
    </p>

    <div class="accordion-wrapper">
      <!-- 1. Menu Suspenso: Meus Pedidos em Andamento -->
      <div class="accordion-item active" id="acc-item-my-requests">
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
                  <div class="request-detail-line"><strong>Tipo de Pedido:</strong> ${r.type || 'Adoção'}</div>
                  <div class="request-detail-line"><strong>Status Atual:</strong> ${r.status}</div>
                  <div class="request-detail-line"><strong>Data de Envio:</strong> ${r.date}</div>
                </div>
              `).join('')}
            </div>
          ` : `
            <p style="font-size: 13px; color: var(--text-muted); padding: 14px 0 0;">
              Você ainda não enviou nenhum pedido. Escolha uma das opções abaixo para solicitar.
            </p>
          `}
        </div>
      </div>

      <!-- 2. Menu Suspenso: Solicitar Adoção -->
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
              <select id="req-pet" required>
                ${animals.length > 0 
                  ? animals.map(a => `<option value="${a.name} (${a.species}, ${a.age})">${a.name} (${a.species},${a.age})</option>`).join('')
                  : `<option value="Animal Geral da ONG">Animal Geral da ONG</option>`
                }
              </select>
            </div>

            <div class="form-group-field">
              <label>Você se declara apto a arcar com os custos e cuidados?</label>
              <select id="req-eligible" required>
                <option value="Sim">Sim, estou 100% apto</option>
                <option value="Não">Não / Tenho dúvidas</option>
              </select>
            </div>

            <div class="form-group-field">
              <label>Tipo de Moradia</label>
              <select id="req-housing" required>
                <option value="Casa com quintal seguro/telado">Casa com quintal seguro/telado</option>
                <option value="Casa sem quintal">Casa sem quintal</option>
                <option value="Apartamento com rede de proteção">Apartamento com rede de proteção</option>
                <option value="Sítio / Chácara fechada">Sítio / Chácara fechada</option>
              </select>
            </div>

            <div class="form-group-field">
              <label>Possui outros animais atualmente?</label>
              <input type="text" id="req-pets-exist" placeholder="Ex: Sim, 1 cãozinho vacinado" required>
            </div>

            <div class="form-group-field">
              <label>Rotina e Motivação</label>
              <textarea id="req-experience" rows="2" placeholder="Conte brevemente sobre sua família e rotina..." required style="resize:none;"></textarea>
            </div>

            <div style="background: #FFFDF9; border: 1px solid var(--border-light); padding: 12px; border-radius: var(--radius-sm); margin-top: 14px;">
              <label style="display: flex; align-items: flex-start; gap: 8px; font-size: 12px; color: var(--text-main); cursor: pointer;">
                <input type="checkbox" id="req-consent" required style="margin-top: 2px;">
                <span>Autorizo a equipe da <strong>DoaPets</strong> a validar meus dados cadastrais e realizar contato para confirmação da adoção.</span>
              </label>
            </div>

            <button type="submit" class="btn-send-request">
              Enviar Solicitação de Adoção
            </button>
          </form>
        </div>
      </div>

      <!-- 3. Menu Suspenso: Solicitar Castração -->
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
              <input type="text" id="cast-pet-name" placeholder="Ex: Neguinho" required>
            </div>

            <div class="form-group-field">
              <label>Espécie e Sexo</label>
              <div style="display: flex; gap: 8px;">
                <select id="cast-species" required>
                  <option value="Canino">Cachorro</option>
                  <option value="Felino">Gato</option>
                </select>
                <select id="cast-sex" required>
                  <option value="Fêmea">Fêmea</option>
                  <option value="Macho">Macho</option>
                </select>
              </div>
            </div>

            <div class="form-group-field">
              <label>Idade e Peso Estimados</label>
              <div style="display: flex; gap: 8px;">
                <input type="text" id="cast-age" placeholder="Ex: 1 ano e meio" required>
                <input type="text" id="cast-weight" placeholder="Ex: Aprox. 8 kg" required>
              </div>
            </div>

            <div class="form-group-field">
              <label>Situação do Animal</label>
              <select id="cast-situation" required>
                <option value="Animal Resgatado da Rua">Animal Resgatado da Rua</option>
                <option value="Família de Baixa Renda">Tutor de Baixa Renda</option>
                <option value="Animal Comunitário do Bairro">Animal Comunitário do Bairro</option>
              </select>
            </div>

            <div class="form-group-field">
              <label>Observações ou Cuidados de Saúde</label>
              <textarea id="cast-notes" rows="2" placeholder="O animal tem alguma doença, toma remédio ou teve filhotes recentemente?" required style="resize:none;"></textarea>
            </div>

            <div style="background: #FFFDF9; border: 1px solid var(--border-light); padding: 12px; border-radius: var(--radius-sm); margin-top: 14px;">
              <label style="display: flex; align-items: flex-start; gap: 8px; font-size: 12px; color: var(--text-main); cursor: pointer;">
                <input type="checkbox" id="cast-consent" required style="margin-top: 2px;">
                <span>Comprometo-me a cumprir o jejum pré-operatório e os cuidados pós-cirúrgicos indicados pela equipe veterinária da <strong>DoaPets</strong>.</span>
              </label>
            </div>

            <button type="submit" class="btn-send-request" style="background: linear-gradient(135deg, #2A9D8F 0%, #21867a 100%);">
              Enviar Solicitação de Castração
            </button>
          </form>
        </div>
      </div>
    </div>
  `;

  // Comportamento dos Menus Suspensos (Accordion)
  container.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isOpen = item.classList.contains('active');
      
      // Fecha outros e abre o clicado (ou apenas alterna)
      container.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('active'));
      if (!isOpen) {
        item.classList.add('active');
      }
    });
  });

  // Envio de Solicitação de Adoção
  const formAdopt = container.querySelector('#form-adoption-request');
  if (formAdopt) {
    formAdopt.addEventListener('submit', (e) => {
      e.preventDefault();
      const newRequest = {
        id: "ADOPT-" + Math.floor(1000 + Math.random() * 9000),
        type: "Adoção",
        userName: user.name,
        userEmail: user.email,
        userPhone: user.phone || "(00) 00000-0000",
        userCity: user.city || "Não informado",
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
      alert("Solicitação de Adoção enviada com sucesso!");
      renderRequestsView(container, onNavigate);
    });
  }

  // Envio de Solicitação de Castração
  const formCast = container.querySelector('#form-castration-request');
  if (formCast) {
    formCast.addEventListener('submit', (e) => {
      e.preventDefault();
      const newCastRequest = {
        id: "CAST-" + Math.floor(1000 + Math.random() * 9000),
        type: "Castração",
        userName: user.name,
        userEmail: user.email,
        userPhone: user.phone || "(00) 00000-0000",
        userCity: user.city || "Não informado",
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
      alert("Solicitação de Castração cadastrada com sucesso! A equipe da ONG entrará em contato para agendamento.");
      renderRequestsView(container, onNavigate);
    });
  }
}
