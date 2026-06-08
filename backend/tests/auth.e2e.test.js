const base = 'http://localhost:3001/api/auth';

describe('Auth e2e via fetch', () => {
  it('rejects wrong password', async () => {
    const res = await fetch(`${base}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'employee1', accountNumber: '1234567890', password: 'wrong' })
    });
    expect(res.status).toBe(401);
  });

  it('accepts valid employee login', async () => {
    const res = await fetch(`${base}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'employee1', accountNumber: '1234567890', password: 'Employee@123' })
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.token).toBeTruthy();
  });
});
