const express = require('express');
const app = express();
const helmet = require('helmet');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const logger = require('morgan');
const userRoutes = require("./routes/userRoutes");

const PORT = process.env.PORT || 5001;
 const DB_PATH = "mongodb://localhost:27017/user";
//  "mongodb+srv://chinduanurag:csmodel@52@cluster0.iumja.mongodb.net/user?retryWrites=true&w=majority&appName=Cluster0";

app.use(express.json()); 
app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true, 
}));

// Use Helmet for security
app.use(helmet());

// Routes
app.use('/api/routes', userRoutes);

// Middleware
app.use(logger('dev'));
app.use(express.urlencoded({ extended: true }));

// Database Connection
mongoose.connect(DB_PATH)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Could not connect to MongoDB:', error));

// Start the server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
