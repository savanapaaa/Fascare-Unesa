const bcrypt = require('bcrypt');
const pool = require('./src/config/database');

const createSuperAdmin = async () => {
  try {
    console.log('Creating super admin...');
    
    // Hash password admin123
    const hashedPassword = await bcrypt.hash('admin123', 10);
    console.log('Password hashed successfully');
    
    // Delete existing superadmin if exists
    await pool.execute('DELETE FROM admins WHERE email = ?', ['admin@urbanaid.com']);
    console.log('Cleaned existing admin');
    
    // Create new superadmin
    const query = `
      INSERT INTO admins (nama, email, password, role)
      VALUES (?, ?, ?, ?)
    `;
    
    const [result] = await pool.execute(query, [
      'Super Admin',
      'admin@urbanaid.com', 
      hashedPassword,
      'superadmin'
    ]);
    
    console.log('Super Admin created successfully!');
    console.log('Login credentials:');
    console.log('Email: admin@urbanaid.com');
    console.log('Password: admin123');
    console.log('Role: superadmin');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating super admin:', error);
    process.exit(1);
  }
};

createSuperAdmin();