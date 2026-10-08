const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const missionsRoutes    = require('./routes/missions');
const testamentosRoutes = require('./routes/testamentos');
const validateRoutes    = require('./routes/validate');
const adminRoutes       = require('./routes/admin');
const usersRoutes       = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/missions',    missionsRoutes);
app.use('/api/testamentos', testamentosRoutes);
app.use('/api/validate',    validateRoutes);
app.use('/api/admin',       adminRoutes);
app.use('/api/users',       usersRoutes);

// Serve React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../dist/index.html')));
}

if (require.main === module) {
  app.listen(PORT, () => console.log(`🎃 HallowParty server running on http://localhost:${PORT}`));
}

module.exports = app;
