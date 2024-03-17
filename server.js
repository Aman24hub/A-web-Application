const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(express.json());

// MongoDB connection string
const uri = 'mongodb://localhost:27017';

// Connect to MongoDB
MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to MongoDB');

    const db = client.db('student_db');
    const collection = db.collection('tasks');

    // Add task
    app.post('/tasks', async (req, res) => {
      try {
        const task = req.body;
        const result = await collection.insertOne(task);
        res.status(201).json(result.ops[0]);
      } catch (err) {
        console.error('Error adding task:', err);
        res.status(500).send('Internal Server Error');
      }
    });

    // Start the server
    app.listen(port, () => {
      console.log(`Server listening at http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });
