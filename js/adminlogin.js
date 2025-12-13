document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('adminLoginForm');
    if (!form) return console.error('adminLoginForm not found');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const usernameEl = document.getElementById('username');
        const passwordEl = document.getElementById('password');

        const username = usernameEl ? usernameEl.value.trim() : '';
        const password = passwordEl ? passwordEl.value : '';

        // Hide previous errors
        document.querySelectorAll('.error-message').forEach(el => el.style.display = 'none');

        let valid = true;
        if (!username) {
            const el = document.getElementById('usernameError'); 
            if (el) el.style.display = 'block';
            valid = false;
        }
        if (!password) {
            const el = document.getElementById('passwordError'); 
            if (el) el.style.display = 'block';
            valid = false;
        }
        if (!valid) return;

        try {
            const resp = await fetch('/api/auth/admin-login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await resp.json().catch(() => null);

            if (!resp.ok) {
                // Show specific error messages
                if (resp.status === 403) {
                    alert('Access Denied: You do not have administrator privileges.');
                } else if (resp.status === 401) {
                    alert('Invalid admin credentials. Please try again.');
                } else {
                    alert(data?.message || 'Admin login failed');
                }
                console.error('Admin login error', resp.status, data);
                return;
            }

            if (data && data.success) {
                // Store admin token and data
                if (data.token) localStorage.setItem('adminAuthToken', data.token);
                localStorage.setItem('adminData', JSON.stringify(data.user || {}));
                sessionStorage.setItem('adminLoggedIn', 'true');
                sessionStorage.setItem('adminUsername', (data.user && data.user.username) || username);
                
                
                
                // Redirect to admin dashboard
                window.location.href = 'admin-dashboard.html';
            } else {
                alert('Admin login failed: ' + (data?.message || 'Unknown error'));
            }
        } catch (err) {
            console.error('Network or fetch error:', err);
            alert('Network error. Please check your connection and try again.');
        }
    });
});
