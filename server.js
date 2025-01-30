const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/user.routes');
const authRoutes = require('./routes/auth.routes');
const caseRoutes = require('./routes/case.routes');
const Role = require('./models/role.model');

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('Successfully connected to MongoDB.');
        await seedRoles(); 
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cases', caseRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

async function seedRoles() {
  const roles = [
    { 
      name: 'superAdmin', 
      permissions: ['create_user', 'manage_roles', 'full_access', 'create_case', 'assign_case', 'view_all_cases', 'update_case', 'delete_case'] 
    },
    { 
      name: 'analyst', 
      permissions: ['view_data', 'generate_reports', 'view_assigned_cases', 'update_case'] 
    },
    { 
      name: 'investigator', 
      permissions: ['conduct_investigations', 'access_case_files', 'view_assigned_cases', 'update_case'] 
    },
    { 
      name: 'labExpert', 
      permissions: ['run_tests', 'analyze_samples', 'view_assigned_cases', 'update_case'] 
    }
  ];

  for (let role of roles) {
    await Role.findOneAndUpdate(
      { name: role.name }, 
      role, 
      { upsert: true }
    );
  }
}