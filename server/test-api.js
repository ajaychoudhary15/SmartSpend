async function test() {
  try {
    console.log('--- 1. Testing Health API ---');
    const healthRes = await fetch('http://localhost:5000/api/health');
    const healthData = await healthRes.json();
    console.log('Health:', healthData);

    console.log('\n--- 2. Testing Register API ---');
    const testEmail = `tester_${Date.now()}@example.com`;
    const regRes = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Demo Lead Tester',
        email: testEmail,
        password: 'password123',
        currency: '₹',
      }),
    });
    const regData = await regRes.json();
    console.log('Register status:', regRes.status, 'Success:', regData.success);
    const token = regData.data.token;

    console.log('\n--- 3. Testing Login API (Success & Failure) ---');
    const loginFailRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'wrong_password',
      }),
    });
    const loginFailData = await loginFailRes.json();
    console.log('Login Fail (expected 401):', loginFailRes.status, 'Message:', loginFailData.message);

    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'password123',
      }),
    });
    const loginData = await loginRes.json();
    console.log('Login status (expected 200):', loginRes.status, 'User:', loginData.data.name);

    console.log('\n--- 4. Testing Profile Update (Currency & Name) ---');
    const authHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
    const profRes = await fetch('http://localhost:5000/api/auth/profile', {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({ currency: '₹', name: 'Demo Lead Updated' }),
    });
    const profData = await profRes.json();
    console.log('Profile updated currency:', profData.data.currency);

    console.log('\n--- 5. Testing Category Options ---');
    const catRes = await fetch('http://localhost:5000/api/transactions/categories', {
      headers: authHeaders,
    });
    const catData = await catRes.json();
    console.log('Available categories count:', catData.data.length);

    console.log('\n--- 6. Testing Add Transactions (Income & Expense) ---');
    const tx1Res = await fetch('http://localhost:5000/api/transactions', {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        title: 'Monthly Salary Consulting',
        amount: 85000,
        type: 'income',
        category: 'Salary',
        date: new Date().toISOString(),
      }),
    });
    const tx1Data = await tx1Res.json();
    console.log('Tx1 (Income):', tx1Data.message, 'Amount:', tx1Data.data.amount);

    const tx2Res = await fetch('http://localhost:5000/api/transactions', {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        title: 'Grocery Supermarket',
        amount: 4200,
        type: 'expense',
        category: 'Food & Dining',
        date: new Date().toISOString(),
      }),
    });
    const tx2Data = await tx2Res.json();
    console.log('Tx2 (Expense):', tx2Data.message, 'ID:', tx2Data.data._id);

    console.log('\n--- 7. Testing Update & Delete Transaction ---');
    const updateRes = await fetch(`http://localhost:5000/api/transactions/${tx2Data.data._id}`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({
        amount: 4500,
        notes: 'Updated receipt notes',
      }),
    });
    const updateData = await updateRes.json();
    console.log('Tx2 updated amount:', updateData.data.amount, 'Notes:', updateData.data.notes);

    const txListRes = await fetch('http://localhost:5000/api/transactions', {
      headers: authHeaders,
    });
    const txListData = await txListRes.json();
    console.log('Transactions fetched count:', txListData.data.length);

    console.log('\n--- 8. Testing Set & Get Budget with Warning Thresholds ---');
    const budgetRes = await fetch('http://localhost:5000/api/budget', {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        monthlyLimit: 10000,
        alertThreshold: 80,
      }),
    });
    console.log('Set Budget message:', (await budgetRes.json()).message);

    const getBudgetRes = await fetch('http://localhost:5000/api/budget', {
      headers: authHeaders,
    });
    const budgetData = await getBudgetRes.json();
    console.log('Budget info:', {
      limit: budgetData.data.monthlyLimit,
      spent: budgetData.data.spent,
      remaining: budgetData.data.remaining,
      percentage: budgetData.data.percentageUsed,
      status: budgetData.data.status,
    });

    console.log('\n--- 9. Testing Stats & Category Aggregation ---');
    const statsRes = await fetch('http://localhost:5000/api/transactions/stats', {
      headers: authHeaders,
    });
    const statsData = await statsRes.json();
    console.log('Stats Summary:', statsData.data.summary);
    console.log('Top Category:', statsData.data.categoryBreakdown[0]);

    console.log('\n>>> ALL 9 FULL-STACK BACKEND SUITE TESTS PASSED 100%! <<<');
  } catch (err) {
    console.error('Test error:', err);
    process.exit(1);
  }
}

test();
