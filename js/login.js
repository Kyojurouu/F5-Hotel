document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('loginForm');
    if (!form) return console.error('loginForm not found');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const usernameEl = document.getElementById('username');
        const passwordEl = document.getElementById('password');

        const username = usernameEl ? usernameEl.value.trim() : '';
        const password = passwordEl ? passwordEl.value : '';

        // hide previous errors
        document.querySelectorAll('.error-message').forEach(el => el.style.display = 'none');

        let valid = true;
        if (!username) {
            const el = document.getElementById('usernameError'); if (el) el.style.display = 'block';
            valid = false;
        }
        if (!password) {
            const el = document.getElementById('passwordError'); if (el) el.style.display = 'block';
            valid = false;
        }
        if (!valid) return;

        try {
            const resp = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await resp.json().catch(() => null);

            if (!resp.ok) {
                alert(data?.message || 'Login failed');
                console.error('Login error', resp.status, data);
                return;
            }

            if (data && data.success) {
                if (data.token) localStorage.setItem('authToken', data.token);
                localStorage.setItem('userData', JSON.stringify(data.user || {}));
                sessionStorage.setItem('userLoggedIn', 'true');
                sessionStorage.setItem('username', (data.user && data.user.username) || username);
                
                // Redirect based on admin status
                if (data.user && data.user.isAdmin) {
                    window.location.href = 'admin-dashboard.html';
                } else {
                    window.location.href = 'home.html';
                }
            } else {
                alert('Login failed: ' + (data?.message || 'Unknown'));
            }
        } catch (err) {
            console.error('Login request failed', err);
            alert('Server error. Ensure backend is running.');
        }
    });
});