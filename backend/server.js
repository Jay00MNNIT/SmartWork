const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(express.json());

// Swagger API Docs Route 
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { background-color: #16213e }',
    customSiteTitle: 'SmartWork API Docs'
}));

// Routes 
const taskRoutes = require('./routes/tasks');
const authRoutes = require('./routes/auth');
const aiRoutes = require('./routes/ai');
app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);

// Connect MongoDB 
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('✅ MongoDB Connected Successfully!');
    app.listen(process.env.PORT, () => {
        console.log(`✅ SmartWork Server running on port ${process.env.PORT}`);
        console.log(`✅ API Docs available at http://localhost:5000/api-docs`);
    });
})
.catch((error) => {
    console.log('❌ MongoDB Connection Failed!', error);
});