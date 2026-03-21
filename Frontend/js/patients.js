/*
=====================================================
PATIENT MANAGEMENT MODULE

NOTE FOR BACKEND TEAM

Replace static patient data with API response.

Suggested API:
GET /api/patients
=====================================================
*/


let patients = [];

async function fetchPatients() {
    try {
        const res = await fetch(`${API_BASE_URL}/patients`, {
            headers: getAuthHeaders()
        });
        if (res.ok) {
            const data = await res.json();
            patients = data.data;
            renderPatients();
        }
    } catch (e) {
        console.error('Error fetching patients:', e);
    }
}

document.getElementById("searchPatient").addEventListener("input", renderPatients);

function renderPatients() {
    const search = document.getElementById("searchPatient").value.toLowerCase();
    const table = document.getElementById("patientTable");
    table.innerHTML = "";

    const filtered = patients.filter(p =>
        p.full_name.toLowerCase().includes(search) ||
        p.status.toLowerCase().includes(search)
    );

    if (filtered.length === 0) {
        table.innerHTML = `
        <tr>
            <td colspan="4" style="text-align:center;padding:20px">No patients found.</td>
        </tr>
        `;
        return;
    }

    filtered.forEach(p => {
        const dateObj = new Date(p.last_visit);
        const formattedDate = dateObj.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });

        table.innerHTML += `
        <tr>
            <td>${p.full_name}</td>
            <td>${p.age}</td>
            <td>${formattedDate}</td>
            <td>
                <span class="status ${p.status}">${p.status}</span>
            </td>
        </tr>
        `;
    });
}

fetchPatients();