// login_script.js

// Helper: switch active tab + form
const tabs = document.querySelectorAll('.auth-tab');
const forms = document.querySelectorAll('.auth-form');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const target = tab.getAttribute('data-tab');

        // Toggle active tab
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Toggle active form
        forms.forEach(form => {
            if (form.id === target + 'Form') {
                form.classList.add('active');
            } else {
                form.classList.remove('active');
            }
        });

                // Update heading + subtitle dynamically
        const title = document.getElementById('authTitle');
        const subtitle = document.getElementById('authSubtitle');

        if (target === 'login') {
            title.textContent = 'Welcome back';
            subtitle.textContent = 'Sign in to view your calendar and keep everything in flow.';
        } else {
            title.textContent = 'Create an account';
            subtitle.textContent = 'Start your journey — create an account to begin organizing with Zenned.';
        }


    });
});

// Login form logic (simple demo)
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value.trim();

        // Demo credentials
        const demoEmail = 'user@example.com';
        const demoPassword = 'password';

        if (email === demoEmail && password === demoPassword) {
            loginError.textContent = '';
            // Redirect to calendar (adjust path if needed)
            window.location.href = '../index.html';
        } else {
            loginError.textContent = 'Incorrect email or password. Try the demo credentials above.';
        }
    });
}

// Signup form logic (basic client-side check)
const signupForm = document.getElementById('signupForm');
const signupError = document.getElementById('signupError');

if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const password = document.getElementById('signupPassword').value.trim();
        const confirm = document.getElementById('signupConfirmPassword').value.trim();

        if (password.length < 6) {
            signupError.textContent = 'Password should be at least 6 characters long.';
            return;
        }

        if (password !== confirm) {
            signupError.textContent = 'Passwords do not match.';
            return;
        }

        signupError.textContent = '';
        alert('Account created (demo). Replace this with real backend integration.');
        // Optionally auto-switch to login tab
        tabs.forEach(t => {
            if (t.getAttribute('data-tab') === 'login') t.click();
        });
    });
    
/* ===== Add 3 floating bees on the login page ===== */
document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector(".auth-container");
    if (!container) return;

    for (let i = 0; i < 3; i++) {
        const bee = document.createElement("div");
        bee.classList.add("bee");

        // random start position
        bee.style.left = Math.random() * 90 + "%";
        bee.style.top = Math.random() * 70 + "%";

        // slight delay so they don't animate in sync
        bee.style.animationDelay = `${Math.random() * 4}s`;

        container.appendChild(bee);
    }
});

    
}
