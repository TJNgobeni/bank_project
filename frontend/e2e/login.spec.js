const { test, expect } = require('@playwright/test');

test('employee login succeeds', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  await page.fill('input[name="username"]', 'employee1');
  await page.fill('input[name="accountNumber"]', '1234567890');
  await page.fill('input[name="password"]', 'Employee@123');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/\/dashboard/);
});
