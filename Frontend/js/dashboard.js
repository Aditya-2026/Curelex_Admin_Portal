/*
=====================================================
CURELEX ADMIN DASHBOARD

NOTE FOR BACKEND TEAM
Replace static data with API responses.

Suggested API:
GET /api/dashboard/overview
GET /api/dashboard/recent-doctors
=====================================================
*/


/* ===============================
PATIENT ACTIVITY CHART
=============================== */

// Sample chart data
// TODO: Replace with API data

const patients=[420,380,510,470,590,620,680]
const newPatients=[85,72,110,95,130,142,158]

new Chart(document.getElementById("patientChart"),{

type:"line",

data:{

labels:["Jan","Feb","Mar","Apr","May","Jun","Jul"],

datasets:[

{
label:"Total Visits",
data:patients,
borderColor:"#2563eb",
tension:0.4
},

{
label:"New Patients",
data:newPatients,
borderColor:"#16a34a",
borderDash:[5,5],
tension:0.4
}

]

}

})


// Dashboard Data Fetcher
(async function initDashboard() {
    try {
        // Populate stat cards from API
        const statsResponse = await fetch(`${API_BASE_URL}/dashboard/stats`, {
            headers: getAuthHeaders()
        });
        
        if (statsResponse.ok) {
            const statsData = await statsResponse.json();
            const { totalDoctors, totalPatients, dailyPatients, pendingApplications, todaysAppointments } = statsData.data;
            
            const statValues = document.querySelectorAll('.stat-value');
            if (statValues.length >= 5) {
                statValues[0].textContent = totalDoctors.toLocaleString();
                statValues[1].textContent = totalPatients.toLocaleString();
                statValues[2].textContent = dailyPatients.toLocaleString();
                statValues[3].textContent = pendingApplications.toLocaleString();
                statValues[4].textContent = todaysAppointments.toLocaleString();
            }
        }

        // Fetch recent applications for the table
        const appsResponse = await fetch(`${API_BASE_URL}/dashboard/recent-applications`, {
            headers: getAuthHeaders()
        });

        if (appsResponse.ok) {
            const appsData = await appsResponse.json();
            const tableBody = document.getElementById('recentApplications');
            tableBody.innerHTML = '';
            
            if (appsData.data.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No recent applications found.</td></tr>';
            } else {
                appsData.data.forEach(app => {
                    const tr = document.createElement('tr');
                    
                    const dateObj = new Date(app.applied_at);
                    const formattedDate = dateObj.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
                    
                    let statusClass = 'status-pending';
                    if (app.status === 'Approved') statusClass = 'status-approved';
                    if (app.status === 'Rejected') statusClass = 'status-rejected';

                    tr.innerHTML = `
                        <td>
                            <div style="font-weight: 500; color: var(--text-color);">${app.full_name}</div>
                            <div style="font-size: 13px; color: var(--text-light);">${app.email}</div>
                        </td>
                        <td>${app.specialization}</td>
                        <td>${app.experience_years} Years</td>
                        <td>${formattedDate}</td>
                        <td><span class="status-badge ${statusClass}">${app.status}</span></td>
                    `;
                    tableBody.appendChild(tr);
                });
            }
        }
    } catch (e) {
        console.error("Dashboard fetch error:", e);
    }
})();