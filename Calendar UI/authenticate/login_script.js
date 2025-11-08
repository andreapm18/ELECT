
        // Tab switching
        const tabs = document.querySelectorAll('.auth-tab');
        const forms = document.querySelectorAll('.auth-form');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.dataset.tab;
                
                // Update active tab
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Show corresponding form
                forms.forEach(form => form.classList.remove('active'));
                document.getElementById(`${tabName}Form`).classList.add('active');
            });
        });

        // Login form submission
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            // Static credentials for demo
            if (email === 'user@example.com' && password === 'password') {
                alert('Login successful! Redirecting...');
                window.location.href = '../index.html';
            } else {
                alert('Invalid credentials. Use: user@example.com / password');
            }
        });

        // Signup form submission
        document.getElementById('signupForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('signupConfirmPassword').value;
            
            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }
            
            alert('Account created successfully! You can now login.');
            
            // Switch to login tab
            tabs.forEach(t => t.classList.remove('active'));
            forms.forEach(form => form.classList.remove('active'));
            document.querySelector('[data-tab="login"]').classList.add('active');
            document.getElementById('loginForm').classList.add('active');
        });

        // Forgot password
        document.getElementById('forgotPassword').addEventListener('click', function(e) {
            e.preventDefault();
            alert('Password reset feature would be implemented here!');
        });
