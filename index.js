const express = require('express');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');
const connectDB = require('./config/connection');

// Import Entities to ensure they are registered
require('./entities/User');
require('./entities/Admin');
require('./entities/HomePage');
require('./entities/Contact');
require('./entities/About');
require('./entities/News');
require('./entities/Program');
require('./entities/Volunteer');
require('./entities/VolunteerAppForm');
require('./entities/Consultation');
require('./entities/Donation');
require('./entities/DonationTransaction');
require('./entities/Notification');

// Import Routes
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const homePageRoutes = require('./routes/homePageRoutes');
const contactRoutes = require('./routes/contactRoutes');
const aboutRoutes = require('./routes/aboutRoutes');
const newsRoutes = require('./routes/newsRoutes');
const programRoutes = require('./routes/programRoutes');
const volunteerRoutes = require('./routes/volunteerRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const consultationRoutes = require('./routes/consultationRoutes');
const donationRoutes = require('./routes/donationRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// Connect to Database
connectDB();

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// CORS Middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }
  next();
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/homepage', homePageRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/program', programRoutes);
app.use('/api/volunteer', volunteerRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/consultation', consultationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/donation', donationRoutes);

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Basic Route
app.get('/', (req, res) => {
  res.send('NGO Backend API is running...');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
