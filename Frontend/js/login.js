// =====================================================
// LOGIN LOGIC
// =====================================================

// Check if already logged in
if (localStorage.getItem('adminToken')) {
    window.location.href = 'dashboard.html';
}

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const btn = document.getElementById('loginBtn');
    const errorMsg = document.getElementById('errorMsg');

    // Reset UI
    btn.textContent = 'Signing in...';
    btn.disabled = true;
    errorMsg.style.display = 'none';

    try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            // Store token and user data
            localStorage.setItem('adminToken', data.data.token);
            localStorage.setItem('adminUser', JSON.stringify(data.data.user));

            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        } else {
            // Show error
            errorMsg.textContent = data.message || 'Login failed.';
            errorMsg.style.display = 'block';
            btn.textContent = 'Sign In';
            btn.disabled = false;
        }
    } catch (error) {
        console.error('Login error:', error);
        errorMsg.textContent = 'Cannot connect to server.';
        errorMsg.style.display = 'block';
        btn.textContent = 'Sign In';
        btn.disabled = false;
    }
});
