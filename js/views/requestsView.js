import { store } from '../services/store.js';

export function renderRequestsView(container, onNavigate) {
  const isAdmin = store.isAdmin();
  const user = store.getState().currentUser;
  const requests = store.getState().requests;
  const animals = store.getState().animals;

  // VISÃO 1: ADMINISTRADORES (Doapets e Oscar3 - Triagem e Validação)
  if (isAdmin) {
    container.innerHTML = `
      <div class="admin-badge-banner">
        <span>🛡️ Painel Oficial ONG (${user.name})</span>
        <span>${requests.length} para validação</span>
      </div>

      <h3 style="font-size: 17px; font-weight: 800; margin-bottom: 12px; color: var(--text-main);">
        Fila de Validação e Consulta de Dados
      </h3>

      ${requests.length === 0 ? `
        <div style="text-align: center; padding: 40px 16px; color: var(--text-muted);">
          Nenhuma solicitação aguardando validação no momento.
        </div>
      ` : `
        <div>
          ${requests.map(req => `
            <div class="request-card">
              <div class="request-card-header">
                <span class="request-pet-name">🐾 ${req.petName}</span>
                <span class="status-badge status-${req.status.toLowerCase().replace(' ', '-')}">
                  ${req.status}
                </span>
              </div>

              <!-- Indicador de Aptidão e Validação -->
              <div style="background: ${req.isEligible === 'Sim' ? '#E8F5E9' : '#FFEBEE'}; padding: 8px 12px; border-radius: var(--radius-sm); margin-bottom: 10px; font-size: 12px;">
                <strong>Autodeclaração de Aptidão:</strong> ${req.isEligible === 'Sim' ? '✅ Declara-se APTO' : '⚠️ Declarou NÃO APTO'}
                <br>
                <strong>Consentimento de Consulta:</strong> ${req.dataConsent ? '✅ Dados autorizados para consulta pela ONG' : '❌ Não autorizou'}
              </div>

              <div class="request-detail-line"><strong>Solicitante:</strong> ${req.userName}</div>
              <div class="request-detail-line"><strong>Contato:</strong> ${req.userPhone} • ${req.userEmail}</div>
              <div class="request-detail-line"><strong>Cidade:</strong> ${req.userCity}</div>
              <div class="request-detail-line"><strong>Imóvel:</strong> ${req.housingType}</div>
              <div class="request-detail-line"><strong>Outros Pets:</strong> ${req.hasOtherPets}</div>
              <div class="request-detail-line"><strong>Motivação:</strong> ${req.experience}</div>
              <div class="request-detail-line"><strong>Data do Pedido:</strong> ${req.date}</div>

              <div class="admin-actions-bar">
                <button class="btn-status-action btn-review" data-action="Em Análise" data-id="${req.id}">
                  Validando Dados / Em Análise
                </button>
                <button class="btn-status-action btn-approve" data-action="Aprovado" data-id="${req.id}">
                  ✓ Apto & Aprovado
                </button>
                <button class="btn-status-action btn-reject" data-action="Recusado" data-id="${req.id}">
                  ✕ Não Apto / Recusar
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

  // VISÃO 2: USUÁRIO COMUM
  const myRequests = requests.filter(r => r.userEmail === user.email);

  container.innerHTML = `
    <h3 style="font-size: 17px; font-weight: 800; margin-bottom: 12px; color: var(--text-main);">
      Meus Pedidos de Adoção
    </h3>

    ${myRequests.length > 0 ? `
      <div>
        ${myRequests.map(r => `
          <div class="request-card">
            <div class="request-card-header">
              <span class="request-pet-name">🐾 ${r.petName}</span>
              <span class="status-badge status-${r.status.toLowerCase().replace(' ', '-')}">
                ${r.status}
              </span>
            </div>
            <div class="request-detail-line"><strong>Aptidão informada:</strong> ${r.isEligible}</div>
            <div class="request-detail-line"><strong>Status de Validação:</strong> ${r.status}</div>
            <div class="request-detail-line"><strong>Data:</strong> ${r.date}</div>
          </div>
        `).join('')}
      </div>
    ` : `
      <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 14px;">
        Você ainda não enviou nenhum pedido de adoção.
      </p>
    `}

    <!-- Formulário com opções de Aptidão e Validação de Dados -->
    <div class="adoption-form-card">
      <h3>Formulário Oficial de Triagem</h3>
      <form id="form-adoption-request">
        <div class="form-group-field">
          <label>Qual animal você deseja adotar?</label>
          <select id="req-pet" required>
            ${animals.length > 0 
              ? animals.map(a => `<option value="${a.name} (${a.species}, ${a.age})">${a.name} (${a.species}, ${a.age})</option>`).join('')
              : `<option value="Animal Geral da ONG">Animal Geral da ONG</option>`
            }
          </select>
        </div>

        <div class="form-group-field">
          <label>Você se considera apto a receber o animal e arcar com custos (ração, vacinas, veterinário)?</label>
          <select id="req-eligible" required>
            <option value="Sim">Sim, tenho total capacidade e estou apto</option>
            <option value="Não">Não / Tenho dúvidas no momento</option>
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
          <input type="text" id="req-pets-exist" placeholder="Ex: Sim, 1 cãozinho castrado" required>
        </div>

        <div class="form-group-field">
          <label>Rotina e Motivo da adoção</label>
          <textarea id="req-experience" rows="3" placeholder="Conte sobre o espaço e rotina familiar..." required style="resize: none;"></textarea>
        </div>

        <!-- Validação e Consulta de Dados pela ONG -->
        <div style="background: #FFFDF9; border: 1px solid var(--border-light); padding: 12px; border-radius: var(--radius-sm); margin-bottom: 14px;">
          <label style="display: flex; align-items: flex-start; gap: 8px; font-size: 12px; color: var(--text-main); cursor: pointer;">
            <input type="checkbox" id="req-consent" required style="margin-top: 2px;">
            <span>Autorizo a equipe da <strong>DoaPets</strong> a validar meus dados cadastrais e realizar contato para confirmação da adoção.</span>
          </label>
        </div>

        <button type="submit" class="btn-send-request">
          Enviar para Validação da ONG
        </button>
      </form>
    </div>
  `;

  const form = container.querySelector('#form-adoption-request');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const newRequest = {
        id: "SOL-" + Math.floor(1000 + Math.random() * 9000),
        userName: user.name,
        userEmail: user.email,
        userPhone: user.phone || "(37) 99999-0000",
        userCity: user.city || "Formiga, MG",
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
      alert("Solicitação enviada! Seus dados serão consultados e validados pelos coordenadores.");
      renderRequestsView(container, onNavigate);
    });
  }
}
