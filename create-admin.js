// Script to create the admin user in MongoDB
// Run this file with: node create-admin.js

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const adminData = {
    firstName: 'Admin',
    lastName: 'User',
    dateOfBirth: '1990-01-01',
    email: 'admin@gmail.com',
    contactNumber: '09123456789',
    username: 'AdminUser',
    password: 'admin12345',
    isAdmin: true  // This makes the user an administrator
};

async function createAdmin() {
    try {
        // Connect to MongoDB
        console.log('Connecting to MongoDB...');
        const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI;
        if (!mongoURI) {
            console.error('✗ MONGODB_URI or MONGO_URI not found in .env file');
            process.exit(1);
        }
        await mongoose.connect(mongoURI);
        console.log('✓ Connected to MongoDB');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ 
            $or: [
                { email: adminData.email }, 
                { username: adminData.username }
            ] 
        });

        if (existingAdmin) {
            console.log('\n⚠ Admin user already exists!');
            console.log('Email:', existingAdmin.email);
            console.log('Username:', existingAdmin.username);
            console.log('Is Admin:', existingAdmin.isAdmin);
            
            // Update existing user to admin if not already
            if (!existingAdmin.isAdmin) {
                existingAdmin.isAdmin = true;
                await existingAdmin.save();
                console.log('✓ Updated existing user to admin');
            }
        } else {
            // Create new admin user
            const admin = new User(adminData);
            await admin.save();
            
            console.log('\n✓ Admin user created successfully!');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('Admin Credentials:');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('Email:', adminData.email);
            console.log('Username:', adminData.username);
            console.log('Password:', adminData.password);
            console.log('Admin Access:', adminData.isAdmin);
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        }

        console.log('\n✓ Admin account is ready!');
        console.log('✓ You can now login at: http://localhost:3000/adminlogin.html');
        
    } catch (error) {
        console.error('✗ Error creating admin:', error.message);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        console.log('\n✓ Database connection closed');
        process.exit(0);
    }
}

// Run the script
createAdmin();
