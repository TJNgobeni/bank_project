import { User } from './models/User.js';
import bcrypt from 'bcrypt';

const STATIC_EMPLOYEES = [
  {
    username: 'employee1',
    fullName: 'Operations Officer 1',
    idNumber: 'EMP-OPS-0001',
    accountNumber: '0000000001',
    password: 'Employee@123'
  },
  {
    username: 'employee2',
    fullName: 'Operations Officer 2',
    idNumber: 'EMP-OPS-0002',
    accountNumber: '0000000002',
    password: 'Employee@123'
  },
  {
    username: 'employee3',
    fullName: 'Operations Officer 3',
    idNumber: 'EMP-OPS-0003',
    accountNumber: '0000000003',
    password: 'Employee@123'
  }
];

const SALT_ROUNDS = 12;

export async function seedStaticEmployees() {
  let created = 0;
  let existing = 0;

  for (const employee of STATIC_EMPLOYEES) {
    const current = await User.findByUsername(employee.username);

    if (current) {
      existing += 1;
      continue;
    }

    const passwordHash = await bcrypt.hash(employee.password, SALT_ROUNDS);

    await User.create({
      username: employee.username,
      fullName: employee.fullName,
      idNumber: employee.idNumber,
      accountNumber: employee.accountNumber,
      password: employee.password,
      role: 'employee'
    });

    created += 1;
  }

  return { created, existing };
}
