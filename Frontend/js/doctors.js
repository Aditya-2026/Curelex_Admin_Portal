/*
=====================================================
DOCTOR MANAGEMENT MODULE

NOTE FOR BACKEND TEAM

Replace static doctor list with API response.

Suggested API:
GET /api/doctors
=====================================================
*/


// Sample doctors list
// TODO: Replace with backend API

let doctors = [];
let currentTab = "All";

async function fetchDoctors() {
    try {
        const res = await fetch(`${API_BASE_URL}/doctors`, {
            headers: getAuthHeaders()
        });
        if (res.ok) {
            const data = await res.json();
            doctors = data.data;
            renderDoctors();
        }
    } catch (e) {
        console.error('Error fetching doctors:', e);
    }
}

function renderDoctors() {
    const table = document.getElementById("doctorTable");
    table.innerHTML = "";

    const search = document.getElementById("searchDoctor").value.toLowerCase();

    const filtered = doctors.filter(doc => {
        const matchName = doc.full_name.toLowerCase().includes(search) || doc.specialization.toLowerCase().includes(search);
        const matchTab = currentTab === "All" || doc.status === currentTab;
        return matchName && matchTab;
    });

    if (filtered.length === 0) {
        table.innerHTML = '<tr><td colspan="5" style="text-align:center;">No doctors found.</td></tr>';
        return;
    }

    filtered.forEach(doc => {
        table.innerHTML += `
        <tr>
            <td>${doc.full_name}</td>
            <td>${doc.specialization}</td>
            <td>${doc.experience_years} yrs</td>
            <td>
                <span class="status ${doc.status}">${doc.status}</span>
            </td>
            <td>
                <button class="view-btn" onclick="viewDoctor(${doc.id})">View</button>
            </td>
        </tr>
        `;
    });
}

window.viewDoctor = function(id) {
    const doc = doctors.find(d => d.id === id);
    if (!doc) return;
    
    document.getElementById('modalName').textContent = doc.full_name;
    document.getElementById('modalDetails').innerHTML = `
        <p><strong>Email:</strong> ${doc.email}</p>
        <p><strong>Phone:</strong> ${doc.phone || 'Not Provided'}</p>
        <p><strong>Specialization:</strong> ${doc.specialization}</p>
        <p><strong>Experience:</strong> ${doc.experience_years} Years</p>
        <p><strong>License:</strong> ${doc.license_number}</p>
        <p><strong>Qualification:</strong> ${doc.qualification || 'Not Provided'}</p>
        <p><strong>Status:</strong> <span class="status ${doc.status}">${doc.status}</span></p>
        <p><strong>Registered Date:</strong> ${new Date(doc.created_at).toLocaleDateString()}</p>
    `;
    
    document.getElementById('doctorModal').style.display = 'flex';
};

function setTab(tab, event) {
    currentTab = tab;
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    if (event && event.target) {
        event.target.classList.add("active");
    }
    renderDoctors();
}

document.getElementById("searchDoctor").addEventListener("input", renderDoctors);

fetchDoctors();