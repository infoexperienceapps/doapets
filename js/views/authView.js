import { store } from '../services/store.js';

export function renderAuthView(container, onSuccess) {
  let mode = 'login'; // 'login' ou 'register'

  function render() {
    container.innerHTML = `
      <div class="auth-wrapper">
        <!-- Banner de Boas-Vindas Superior -->
        <div class="auth-hero-banner">
          <div class="auth-hero-paw">🐾</div>
          <h2>DoaPets</h2>
          <p>${mode === 'login' ? 'Entre para transformar a vida de um animalzinho' : 'Crie sua conta e encontre seu novo companheiro'}</p>
        </div>

        <!-- Cartão de Acesso -->
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
                <label class="auth-field-label">Nome Completo</label>
                <input class="auth-field-input" type="text" id="reg-name" placeholder="Ex: Ana Souza" required>
              </div>
              <div class="auth-field">
                <label class="auth-field-label">E-mail</label>
                <input class="auth-field-input" type="email" id="reg-email" placeholder="seu@email.com" required>
              </div>
              <div class="auth-field">
                <label class="auth-field-label">WhatsApp / Telefone</label>
                <input class="auth-field-input" type="tel" id="reg-phone" placeholder="(37) 99999-0000" required>
              </div>
              <div class="auth-field">
                <label class="auth-field-label">Cidade e Estado</label>
                <input class="auth-field-input" type="text" id="reg-city" placeholder="Ex: Formiga, MG" required>
              </div>
              <div class="auth-field">
                <label class="auth-field-label">Crie uma Senha</label>
                <input class="auth-field-input" type="password" id="reg-pwd" placeholder="Mínimo 6 dígitos" minlength="6" required>
              </div>
              <button type="submit" class="btn-auth-action">Concluir Cadastro</button>
            </form>
          `}
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

    const alertBox = container.querySelector('#auth-alert');

    // Submissão Login
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
          phone: "(37) 99999-0000",
          city: "Formiga, MG",
          avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80"
        };

        store.setState({ currentUser: userData });
        if (onSuccess) onSuccess();
      });
    }

    // Submissão Registro
    const formReg = container.querySelector('#form-reg');
    if (formReg) {
      formReg.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = container.querySelector('#reg-name').value.trim();
        const email = container.querySelector('#reg-email').value.trim();
        const phone = container.querySelector('#reg-phone').value.trim();
        const city = container.querySelector('#reg-city').value.trim();

        const newUser = {
          name,
          email,
          phone,
          city,
          avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80"
        };

        store.setState({ currentUser: newUser });
        if (onSuccess) onSuccess();
      });
    }
  }

  render();
}
