if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
        .then(reg => console.log('Service Worker registered', reg))
        .catch(err => console.log('Service Worker registration failed', err));
}

// PWA Install
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    document.getElementById('installPrompt').classList.add('show');
});

function installApp() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
            }
            deferredPrompt = null;
            document.getElementById('installPrompt').classList.remove('show');
        });
    }
}

function dismissInstall() {
    document.getElementById('installPrompt').classList.remove('show');
}

// Password Management
class PasswordManager {
    constructor() {
        this.storageKey = 'passwords';
        this.passwords = this.loadPasswords();
    }

    loadPasswords() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : [];
    }

    savePasswords() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.passwords));
    }

    addPassword(url, login, password) {
        const newPassword = {
            id: Date.now(),
            url,
            login,
            password,
            createdAt: new Date().toISOString()
        };
        this.passwords.push(newPassword);
        this.savePasswords();
        return newPassword;
    }

    deletePassword(id) {
        this.passwords = this.passwords.filter(p => p.id !== id);
        this.savePasswords();
    }

    getAllPasswords() {
        return this.passwords;
    }
}

const passwordManager = new PasswordManager();

// Password Generator
function generatePassword() {
    const length = parseInt(document.getElementById('length').value);
    const uppercase = document.getElementById('uppercase').checked;
    const lowercase = document.getElementById('lowercase').checked;
    const numbers = document.getElementById('numbers').checked;
    const symbols = document.getElementById('symbols').checked;

    let charset = '';
    if (uppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (lowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (numbers) charset += '0123456789';
    if (symbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (charset === '') {
        alert('Выберите хотя бы один тип символов!');
        return;
    }

    let password = '';
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    document.getElementById('password').value = password;
}

// Update length slider value
document.getElementById('length').addEventListener('input', (e) => {
    document.getElementById('lengthValue').textContent = e.target.value;
});

// Form submission
document.getElementById('passwordForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const url = document.getElementById('url').value;
    const login = document.getElementById('login').value;
    const password = document.getElementById('password').value;

    passwordManager.addPassword(url, login, password);

    // Clear form
    document.getElementById('url').value = '';
    document.getElementById('login').value = '';
    document.getElementById('password').value = '';

    renderPasswords();
});

// Copy to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Скопировано в буфер обмена!');
    }).catch(err => {
        console.error('Failed to copy:', err);
    });
}

// Delete password
function deletePassword(id) {
    if (confirm('Вы уверены, что хотите удалить этот пароль?')) {
        passwordManager.deletePassword(id);
        renderPasswords();
    }
}

// Render passwords
function renderPasswords() {
    const container = document.getElementById('passwordList');
    const passwords = passwordManager.getAllPasswords();

    if (passwords.length === 0) {
        container.innerHTML = '<div class="empty-state">Пока нет сохранённых паролей. Добавьте первый!</div>';
        return;
    }

    container.innerHTML = passwords.map(p => `
        <div class="password-item">
            <div class="password-info">
                <strong>${escapeHtml(p.url)}</strong>
                <span>Логин: ${escapeHtml(p.login)}</span>
                <div class="password-display">
                    <code>••••••••••••</code>
                    <button class="copy-btn btn-small" onclick="copyToClipboard('${escapeHtml(p.password)}')">
                        📋 Копировать
                    </button>
                </div>
                <span style="font-size: 0.8em;">Создан: ${new Date(p.createdAt).toLocaleString('ru-RU')}</span>
            </div>
            <div class="password-actions">
                <button class="btn-small btn-secondary" onclick="showPassword(${p.id})">
                    👁️ Показать
                </button>
                <button class="btn-small btn-danger" onclick="deletePassword(${p.id})">
                    🗑️ Удалить
                </button>
            </div>
        </div>
    `).join('');
}

// Show password temporarily
function showPassword(id) {
    const password = passwordManager.getAllPasswords().find(p => p.id === id);
    if (password) {
        alert(`Пароль: ${password.password}`);
    }
}

// prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

renderPasswords();