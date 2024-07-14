import User from '../models/User';
import bcrypt from 'bcryptjs';

export async function createInitialAdmin() {
  try {
    const adminCount = await User.countDocuments({ role: 'manager' });
    if (adminCount === 0) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD!, 12);
      const adminUser = new User({
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword,
        role: 'manager'
      });
      await adminUser.save();
      console.log('Initial admin user created');
    }
  } catch (error) {
    console.error('Error creating initial admin user:', error);
  }
}
