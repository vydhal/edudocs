const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const documentRoutes = require('./src/routes/documentRoutes');
const settingRoutes = require('./src/routes/settingRoutes');
const analyticsRoutes = require('./src/routes/analyticsRoutes');
const classificationRoutes = require('./src/routes/classificationRoutes');
const linkRoutes = require('./src/routes/linkRoutes');

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/classifications', classificationRoutes);
app.use('/api/links', linkRoutes);

app.get('/', (req, res) => {
  res.send('Edudocs Backend API is running');
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
