// =====================================================
// FRONTEND AUTHENTICATION UTILITY
// Included in all protected pages
// =====================================================

const API_BASE_URL = 'http://localhost:5000/api';

// Check if user is logged in
function checkAuth() {
    const token = localStorage.getItem('adminToken');
    if (!token) {
        // Redirect to login page if no token is found
        window.location.href = 'login.html';
    }
    return token;
}

// Get the authorization header for fetch requests
function getAuthHeaders() {
    const token = localStorage.getItem('adminToken');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}

// Perform logout
function logout() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    window.location.href = 'login.html';
}

// Update the Topbar Profile UI
function updateProfileUI() {
    const userStr = localStorage.getItem('adminUser');
    if (userStr) {
        const user = JSON.parse(userStr);
        const profileDivs = document.querySelectorAll('.profile');
        
        profileDivs.forEach(div => {
            div.innerHTML = `👤 ${user.full_name} <span style="font-size:11px;opacity:0.8;">(${user.role})</span>`;
        });
    }

    // Attach logout functionality to topbar if not already there
    const headerRight = document.querySelector('.header-right');
    if (headerRight && !document.getElementById('logoutBtn')) {
        const logoutBtn = document.createElement('button');
        logoutBtn.id = 'logoutBtn';
        logoutBtn.textContent = 'Logout';
        logoutBtn.style.cssText = 'background: #f87171; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 500; margin-left: 10px;';
        logoutBtn.onclick = logout;
        headerRight.appendChild(logoutBtn);
    }
}

// Run auth check immediately upon script load
checkAuth();

// Update UI when DOM is ready
document.addEventListener('DOMContentLoaded', updateProfileUI);
