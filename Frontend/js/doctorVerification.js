/*
=====================================================
DOCTOR VERIFICATION MODULE

NOTE FOR BACKEND TEAM

Replace static applications with API data.

Suggested APIs:
GET /api/doctor-applications
POST /api/doctors/approve
POST /api/doctors/reject
=====================================================
*/


let doctors = [];
let currentTab = "All";

async function fetchApplications() {
    try {
        const res = await fetch(`${API_BASE_URL}/doctor-applications`, {
            headers: getAuthHeaders()
        });
        if (res.ok) {
            const data = await res.json();
            doctors = data.data;
            renderDoctors();
        }
    } catch (e) {
        console.error('Error fetching applications:', e);
    }
}

function setTab(tab, event) {
    currentTab = tab;
    document.querySelectorAll(".tab").forEach(b => b.classList.remove("active"));
    if (event && event.target) {
        event.target.classList.add("active");
    }
    renderDoctors();
}

document.getElementById("searchDoctor").addEventListener("input", renderDoctors);

function renderDoctors() {
    const search = document.getElementById("searchDoctor").value.toLowerCase();
    const table = document.getElementById("doctorTable");
    table.innerHTML = "";

    const filtered = doctors.filter(d => {
        const tabMatch = currentTab === "All" || d.status === currentTab;
        const searchMatch = 
            d.full_name.toLowerCase().includes(search) ||
            d.specialization.toLowerCase().includes(search) ||
            d.license_number.toLowerCase().includes(search);
        return tabMatch && searchMatch;
    });

    filtered.forEach(d => {
        let actions = "—";
        if (d.status === "Pending") {
            actions = `
                <button class="approve-btn" onclick="handleAction(${d.id}, 'approve')">Approve</button>
                <button class="reject-btn" onclick="handleAction(${d.id}, 'reject')">Reject</button>
            `;
        } else if (d.status === "Approved") {
            actions = `
                <button onclick="handleAction(${d.id}, 'suspend')" style="background-color:#f59e0b; color:white; border:none; padding:6px 12px; border-radius:4px; cursor:pointer; font-size:13px;">Suspend</button>
                <button onclick="handleDelete(${d.id})" style="background-color:#ef4444; color:white; border:none; padding:6px 12px; border-radius:4px; cursor:pointer; margin-left:5px; font-size:13px;">Remove</button>
            `;
        } else if (d.status === "Suspended") {
            actions = `
                <button class="approve-btn" onclick="handleAction(${d.id}, 'approve')">Approve</button>
                <button onclick="handleDelete(${d.id})" style="background-color:#ef4444; color:white; border:none; padding:6px 12px; border-radius:4px; cursor:pointer; margin-left:5px; font-size:13px;">Remove</button>
            `;
        }

        const dateObj = new Date(d.applied_at);
        const formattedDate = dateObj.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });

        table.innerHTML += `
            <tr>
                <td>
                    <strong>${d.full_name}</strong><br>
                    <span class="small">${d.email}</span>
                </td>
                <td>${d.specialization}</td>
                <td>${d.license_number}</td>
                <td>${formattedDate}</td>
                <td><span class="status ${d.status}">${d.status}</span></td>
                <td>${actions}</td>
            </tr>
        `;
    });
}

// Global action handler for approve/reject buttons
window.handleAction = async function(id, action) {
    if (!confirm(`Are you sure you want to ${action} this application?`)) return;
    
    try {
        const res = await fetch(`${API_BASE_URL}/doctor-applications/${id}/${action}`, {
            method: 'PUT',
            headers: getAuthHeaders()
        });
        if (res.ok) {
            fetchApplications(); // Refresh list
        } else {
            const data = await res.json();
            alert(`Error: ${data.message}`);
        }
    } catch (e) {
        console.error('Error:', e);
        alert('Action failed. Check console.');
    }
};

window.handleDelete = async function(id) {
    if (!confirm(`Are you sure you want to completely REMOVE this doctor from the platform? This will delete their profile from the active doctors list. This cannot be undone.`)) return;
    
    try {
        const res = await fetch(`${API_BASE_URL}/doctor-applications/${id}/remove`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        if (res.ok) {
            fetchApplications(); // Refresh list
        } else {
            const data = await res.json();
            alert(`Error: ${data.message}`);
        }
    } catch (e) {
        console.error('Error:', e);
        alert('Action failed. Check console.');
    }
};

// Initial fetch
fetchApplications();