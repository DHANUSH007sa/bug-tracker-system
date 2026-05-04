const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Bug = require('./models/Bug');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('Missing MONGO_URI in environment variables.');
  process.exit(1);
}

const usersToSeed = [
  {
    name: 'Dhanush',
    email: 'dhanush@test.com',
    password: '123456',
    role: 'admin',
  },
  {
    name: 'Ravi',
    email: 'ravi@test.com',
    password: '123456',
    role: 'developer',
  },
  {
    name: 'Priya',
    email: 'priya@test.com',
    password: '123456',
    role: 'reporter',
  },
];

const bugsToSeed = [
  {
    title: 'Login button not working',
    project: 'Frontend',
    severity: 'critical',
    status: 'open',
  },
  {
    title: 'API returns 500 error',
    project: 'Backend',
    severity: 'high',
    status: 'open',
  },
  {
    title: 'Dashboard data not loading',
    project: 'Frontend',
    severity: 'medium',
    status: 'in-progress',
  },
  {
    title: 'Password reset email not sent',
    project: 'Backend',
    severity: 'high',
    status: 'open',
  },
  {
    title: 'Mobile navbar broken',
    project: 'UI/UX',
    severity: 'low',
    status: 'open',
  },
  {
    title: 'Database query too slow',
    project: 'Database',
    severity: 'critical',
    status: 'open',
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const createdUsers = [];
    for (const userData of usersToSeed) {
      const existingUser = await User.findOne({ email: userData.email.toLowerCase().trim() });
      if (existingUser) {
        console.log(`User already exists: ${userData.email}`);
        createdUsers.push(existingUser);
        continue;
      }

      const newUser = new User(userData);
      await newUser.save();
      console.log(`Created user: ${userData.email}`);
      createdUsers.push(newUser);
    }

    const adminUser = createdUsers.find((user) => user.role === 'admin');
    if (!adminUser) {
      throw new Error('Admin user not found after seeding users.');
    }

    for (const bugData of bugsToSeed) {
      const existingBug = await Bug.findOne({ title: bugData.title.trim() });
      if (existingBug) {
        console.log(`Bug already exists: ${bugData.title}`);
        continue;
      }

      const bug = new Bug({
        ...bugData,
        createdBy: adminUser._id,
      });
      await bug.save();
      console.log(`Created bug: ${bugData.title}`);
    }

    console.log('Seed data complete.');
  } catch (err) {
    console.error('Seed script failed:', err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seed();
