async function runAuthTests() {
  const baseUrl = 'http://localhost:5000/api/auth';
  const testUser = {
    name: 'Test User',
    email: 'testuser@example.com',
    password: 'Password123!',
    role: 'reporter',
  };

  const registerResponse = await fetch(`${baseUrl}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testUser),
  });

  if (registerResponse.status === 201) {
    const data = await registerResponse.json();
    console.log('REGISTER SUCCESS:', data.user?.email, 'token length:', data.token?.length);
  } else if (registerResponse.status === 409) {
    const data = await registerResponse.json();
    console.log('REGISTER SKIPPED:', data.message);
  } else {
    const body = await registerResponse.text();
    console.error('REGISTER FAILED:', registerResponse.status, body);
    process.exit(1);
  }

  const loginResponse = await fetch(`${baseUrl}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testUser.email, password: testUser.password }),
  });

  if (loginResponse.status !== 200) {
    const body = await loginResponse.text();
    console.error('LOGIN FAILED:', loginResponse.status, body);
    process.exit(1);
  }

  const loginData = await loginResponse.json();
  console.log('LOGIN SUCCESS:', loginData.user?.email);
  console.log('TOKEN:', loginData.token ? `${loginData.token.slice(0, 8)}...${loginData.token.slice(-8)}` : 'missing');

  if (!loginData.token) {
    console.error('LOGIN response did not include a token.');
    process.exit(1);
  }

  console.log('AUTH TEST COMPLETE.');
}

runAuthTests().catch((err) => {
  console.error('AUTH TEST ERROR:', err);
  process.exit(1);
});
