const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const equipmentRoutes = require('./routes/equipment');
const workOrderRoutes = require('./routes/workorders');
const userRoutes = require('./routes/users');
const { connectMongo } = require('./database');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/equipment', equipmentRoutes);
app.use('/workorders', workOrderRoutes);
app.use('/users', userRoutes);


// to run in local
// const PORT = 3001;
// connectMongo().then(() => {
//   app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
// });

// Export handler for Vercel
module.exports = app;