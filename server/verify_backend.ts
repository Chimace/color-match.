// @ts-nocheck
// fetch is global in Node 18+
// Node 18+ has global fetch.

async function testBackend() {
    const baseUrl = 'http://localhost:3000/api';
    const username = `user_${Date.now()}`;
    const password = 'password123';

    console.log(`Testing with user: ${username}`);

    // 1. Register
    console.log('1. Registering...');
    try {
        const regRes = await fetch(`${baseUrl}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (!regRes.ok) {
            const text = await regRes.text();
            throw new Error(`Registration failed: ${regRes.status} ${text}`);
        }

        const regData = await regRes.json();
        console.log('Registration success:', regData);

        const token = regData.token;
        if (!token) throw new Error('No token received');

        // 2. Login (optional, but good to test)
        console.log('2. Logging in...');
        const loginRes = await fetch(`${baseUrl}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (!loginRes.ok) throw new Error(`Login failed: ${loginRes.status}`);
        const loginData = await loginRes.json();
        console.log('Login success');

        // 3. Save Progress
        console.log('3. Saving progress...');
        const saveRes = await fetch(`${baseUrl}/progress/save`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ levelId: 1, score: 100, stars: 3 })
        });

        if (!saveRes.ok) {
            const text = await saveRes.text();
            throw new Error(`Save failed: ${saveRes.status} ${text}`);
        }
        console.log('Save progress success');

        console.log('BACKEND VERIFICATION PASSED');

    } catch (err) {
        console.error('VERIFICATION FAILED:', err);
        process.exit(1);
    }
}

testBackend();
