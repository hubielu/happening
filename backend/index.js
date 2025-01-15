const express = require('express');
const path = require('path');
const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const cors = require('cors');

// Initialize Firebase Admin SDK
initializeApp({
  credential: applicationDefault(), // Or use `cert` if you're using a service account key.
});

const db = getFirestore();
const app = express();

// Allow cross-origin requests (from your frontend)
app.use(cors({
  origin: ['http://localhost:3000', 'https://happening.college'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Endpoint to fetch events from Firestore
app.get('/api/events', async (req, res) => {
  try {
    // Fetch events from the Firestore collection
    const eventsSnapshot = await db.collection('events').get();
    const eventsList = eventsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),  // Returns the data of each event
    }));
    res.json(eventsList);  // Sends the events as JSON
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Error fetching events' });
  }
});

// For any request that doesn't match the above, send back the React app's index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});