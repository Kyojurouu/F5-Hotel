// Test script to verify admin login
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function testAdminLogin() {
    try {
        // Connect to MongoDB
        const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI;
        await mongoose.connect(mongoURI);
        console.log('✓ Connected to MongoDB\n');

        // Find the admin user
        const admin = await User.findOne({ username: 'AdminUser' });
        
        if (!admin) {
            console.log('✗ AdminUser not found in database!');
            process.exit(1);
        }

        console.log('Admin User Found:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('Username:', admin.username);
        console.log('Email:', admin.email);
        console.log('First Name:', admin.firstName);
        console.log('Last Name:', admin.lastName);
        console.log('Is Admin:', admin.isAdmin);
        console.log('Created At:', admin.createdAt);
        console.log('Password Hash:', admin.password.substring(0, 20) + '...');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        // Test password comparison
        const testPassword = 'admin12345';
        const isValid = await admin.comparePassword(testPassword);
        
        console.log('Password Test:');
        console.log('Testing password:', testPassword);
        console.log('Password valid:', isValid);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        if (!admin.isAdmin) {
            console.log('⚠ WARNING: User is NOT an admin! Setting isAdmin to true...');
            admin.isAdmin = true;
            await admin.save();
            console.log('✓ User updated to admin\n');
        }

        if (!isValid) {
            console.log('⚠ WARNING: Password does not match!');
            console.log('This might be because the password was changed or hashed differently.');
            console.log('Run this to reset the password:');
            console.log('  admin.password = "admin12345";');
            console.log('  await admin.save();\n');
        } else {
            console.log('✓ Everything looks good! Admin login should work.');
        }

    } catch (error) {
        console.error('✗ Error:', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('\n✓ Database connection closed');
        process.exit(0);
    }
}

testAdminLogin();
