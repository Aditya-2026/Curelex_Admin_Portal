/*
=====================================================
CURELEX ADMIN PORTAL
Patient Analytics Charts

NOTE FOR BACKEND TEAM
Currently this file uses static demo data.

Replace datasets with API responses.

Suggested APIs:
GET /api/analytics/patient-growth
GET /api/analytics/daily-visits
GET /api/analytics/age-distribution
GET /api/analytics/gender-distribution
GET /api/analytics/new-vs-returning
=====================================================
*/


// Initialize analytics charts with API data
(async function initAnalytics() {
    try {
        const headers = getAuthHeaders();

        // 1. Patient Growth
        const growthRes = await fetch(`${API_BASE_URL}/analytics/patient-growth`, { headers });
        if (growthRes.ok) {
            const { data } = await growthRes.json();
            new Chart(document.getElementById("growthChart"), {
                type: "line",
                data: {
                    labels: data.labels,
                    datasets: [{
                        label: "Patients",
                        data: data.values,
                        borderColor: "#2563eb",
                        backgroundColor: "rgba(37,99,235,0.1)",
                        fill: true,
                        tension: 0.4
                    }]
                }
            });
        }

        // 2. Daily Activity
        const dailyRes = await fetch(`${API_BASE_URL}/analytics/daily-visits`, { headers });
        if (dailyRes.ok) {
            const { data } = await dailyRes.json();
            new Chart(document.getElementById("dailyChart"), {
                type: "bar",
                data: {
                    labels: data.labels,
                    datasets: [{
                        label: "Visits",
                        data: data.values,
                        backgroundColor: "#2563eb"
                    }]
                }
            });
        }

        // 3. Age Distribution
        const ageRes = await fetch(`${API_BASE_URL}/analytics/age-distribution`, { headers });
        if (ageRes.ok) {
            const { data } = await ageRes.json();
            new Chart(document.getElementById("ageChart"), {
                type: "bar",
                data: {
                    labels: data.map(d => d.label),
                    datasets: [{
                        label: "Patients",
                        data: data.map(d => d.count),
                        backgroundColor: "#2563eb"
                    }]
                },
                options: { indexAxis: "y" }
            });
        }

        // 4. Gender Distribution
        const genderRes = await fetch(`${API_BASE_URL}/analytics/gender-distribution`, { headers });
        if (genderRes.ok) {
            const { data } = await genderRes.json();
            new Chart(document.getElementById("genderChart"), {
                type: "pie",
                data: {
                    labels: data.map(d => d.label),
                    datasets: [{
                        data: data.map(d => d.count),
                        backgroundColor: ["#2563eb", "#ec4899", "#f59e0b"]
                    }]
                }
            });
        }

        // 5. New vs Returning
        const nvrRes = await fetch(`${API_BASE_URL}/analytics/new-vs-returning`, { headers });
        if (nvrRes.ok) {
            const { data } = await nvrRes.json();
            new Chart(document.getElementById("returnChart"), {
                type: "bar",
                data: {
                    labels: data.labels,
                    datasets: [
                        { label: "New Patients", data: data.newPatients, backgroundColor: "#2563eb" },
                        { label: "Returning", data: data.returning, backgroundColor: "#16a34a" }
                    ]
                }
            });
        }

    } catch (e) {
        console.error("Failed to load analytics:", e);
    }
})();