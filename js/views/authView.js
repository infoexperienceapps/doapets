import { store } from '../services/store.js';

export function renderAuthView(container, onSuccess) {
  let mode = 'login'; // 'login' ou 'register'

  function render() {
    container.innerHTML = `
      <div class="auth-wrapper">
        <div class="auth-hero-banner">
          <div class="auth-hero-paw">🐾</div>
          <h2>DoaPets</h2>
          <p>${mode === 'login' ? 'Entre para transformar a vida de um animalzinho' : 'Crie seu cadastro com os dados oficiais para verificação'}</p>
        </div>

        <div class="auth-floating-card">
          <div class="auth-pill-switch">
            <button class="pill-btn ${mode === 'login' ? 'active' : ''}" id="switch-login">Entrar</button>
            <button class="pill-btn ${mode === 'register' ? 'active' : ''}" id="switch-reg">Cadastrar</button>
          </div>

          <div id="auth-alert" class="auth-alert-box"></div>

          ${mode === 'login' ? `
            <form id="form-login">
              <div class="auth-field">
                <label class="auth-field-label">Seu E-mail</label>
                <input class="auth-field-input" type="email" id="login-email" placeholder="seu@email.com" required>
              </div>
              <div class="auth-field">
                <label class="auth-field-label">Sua Senha</label>
                <input class="auth-field-input" type="password" id="login-pwd" placeholder="••••••••" required>
              </div>
              <button type="submit" class="btn-auth-action">Acessar Conta</button>
            </form>
          ` : `
            <form id="form-reg">
              <div class="auth-field">
                <label class="auth-field-label">Nome Completo *</label>
                <input class="auth-field-input" type="text" id="reg-name" placeholder="Nome e sobrenome" required>
              </div>
              <div class="auth-field">
                <label class="auth-field-label">CPF *</label>
                <input class="auth-field-input" type="text" id="reg-cpf" placeholder="000.000.000-00" required>
              </div>
              <div class="auth-field">
                <label class="auth-field-label">Telefone Contato Real (WhatsApp) *</label>
                <input class="auth-field-input" type="tel" id="reg-phone" placeholder="(37) 90000-0000" required>
              </div>
              <div class="auth-field">
                <label class="auth-field-label">Endereço Completo (Rua, Nº, Bairro) *</label>
                <input class="auth-field-input" type="text" id="reg-address" placeholder="Ex: Rua das Flores, 120, Centro" required>
              </div>
              <div class="auth-field">
                <label class="auth-field-label">Cidade e Estado *</label>
                <input class="auth-field-input" type="text" id="reg-city" placeholder="Ex: Formiga, MG" required>
              </div>
              <div class="auth-field">
                <label class="auth-field-label">E-mail *</label>
                <input class="auth-field-input" type="email" id="reg-email" placeholder="seu@email.com" required>
              </div>
              <div class="auth-field">
                <label class="auth-field-label">Crie uma Senha *</label>
                <input class="auth-field-input" type="password" id="reg-pwd" placeholder="Mínimo 6 dígitos" minlength="6" required>
              </div>
              <button type="submit" class="btn-auth-action">Concluir Cadastro</button>
            </form>
          `}

          <div style="margin-top: 18px; text-align: center; border-top: 1px solid var(--border-light); padding-top: 14px;">
            <button id="btn-enter-guest" style="color: var(--color-primary); font-size: 13px; font-weight: 700; text-decoration: underline; background: none; cursor: pointer;">
              👀 Entrar como Visitante (Apenas Visualizar)
            </button>
          </div>
        </div>
      </div>
    `;

    container.querySelector('#switch-login').addEventListener('click', () => {
      mode = 'login';
      render();
    });

    container.querySelector('#switch-reg').addEventListener('click', () => {
      mode = 'register';
      render();
    });

    // Visitante
    container.querySelector('#btn-enter-guest').addEventListener('click', () => {
      const guestUser = {
        name: "Visitante",
        email: "visitante@doapets.com",
        cpf: "Não informado",
        phone: "Apenas visualização",
        address: "Modo Leitura",
        city: "Modo Leitura",
        avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80",
        isGuest: true
      };
      store.setState({ currentUser: guestUser });
      if (onSuccess) onSuccess();
    });

    const alertBox = container.querySelector('#auth-alert');

    // Login
    const formLogin = container.querySelector('#form-login');
    if (formLogin) {
      formLogin.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = container.querySelector('#login-email').value.trim();
        const pwd = container.querySelector('#login-pwd').value;

        if (!email || !pwd) {
          alertBox.textContent = 'Informe e-mail e senha.';
          alertBox.className = 'auth-alert-box error';
          return;
        }

        const userData = {
          name: email.split('@')[0].toUpperCase(),
          email: email,
          cpf: "Não cadastrado",
          phone: "(37) 99999-0000",
          address: "Endereço a atualizar",
          city: "Formiga, MG",
          avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80",
          isGuest: false
        };

        store.setState({ currentUser: userData });
        if (onSuccess) onSuccess();
      });
    }

    // Registro com os 4 dados obrigatórios
    const formReg = container.querySelector('#form-reg');
    if (formReg) {
      formReg.addEventListener('submit', (e) => {
        e.preventDefault();
        const newUser = {
          name: container.querySelector('#reg-name').value.trim(),
          cpf: container.querySelector('#reg-cpf').value.trim(),
          phone: container.querySelector('#reg-phone').value.trim(),
          address: container.querySelector('#reg-address').value.trim(),
          city: container.querySelector('#reg-city').value.trim(),
          email: container.querySelector('#reg-email').value.trim(),
          avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80",
          isGuest: false
        };

        store.setState({ currentUser: newUser });
        if (onSuccess) onSuccess();
      });
    }
  }

  render();
}
