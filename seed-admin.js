const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const adminData = {
    firstName: 'Admin',
    middleName: '',
    lastName: 'ForensicFive',
    dateOfBirth: new Date('1990-01-01'),
    email: 'admin@f5hotel.com',
    contactNumber: '+1234567890',
    username: 'admin',
    password: 'Admin@123456',
    isAdmin: true
};

async function createAdmin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✓ Connected to MongoDB');

        const existingAdmin = await User.findOne({ username: 'admin' });
        
        if (existingAdmin) {
            console.log('⚠ Admin user already exists');
            console.log('Username:', existingAdmin.username);
            console.log('Email:', existingAdmin.email);
            console.log('Is Admin:', existingAdmin.isAdmin);
        } else {
            const admin = new User(adminData);
            await admin.save();
            
            console.log('✓ Admin user created successfully!');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('Admin Credentials:');
            console.log('Username:', adminData.username);
            console.log('Email:', adminData.email);
            console.log('Password:', adminData.password);
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        }

        await mongoose.connection.close();
        console.log('✓ Database connection closed');
        
    } catch (error) {
        console.error('✗ Error:', error.message);
        process.exit(1);
    }
}

createAdmin();
