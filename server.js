const express = require('express');
const cors = require('cors');
const admin = require('./firebaseAdminConfig'); // Import the Admin SDK config
const db = admin.firestore(); // Access Firestore through Admin SDK

const app = express();
app.use(cors()); // Allow requests from other domains
app.use(express.json()); // Parse JSON data in requests

app.get('/', (req, res) => {
  res.send('Hello, world! Server is running!');
});

// Define a route to get events
app.get('/events', async (req, res) => {
  try {
    const eventsCollection = db.collection('events'); // Admin SDK query
    const snapshot = await eventsCollection.get();
    const events = snapshot.docs.map(doc => doc.data()); // Extract data
    res.json(events); // Send the events to the frontend
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).send('Error fetching events');
  }
});

// Start the server
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});