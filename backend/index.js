const express = require('express');
const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const cors = require('cors');

// Initialize Firebase Admin SDK
initializeApp({
  credential: applicationDefault(), // Or use `cert` if you're using a service account key.
});

const db = getFirestore();
const app = express();
app.use(cors()); // Allow cross-origin requests (from your frontend)

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

// Start the Express server
app.listen(5001, () => {
  console.log('Server is running on http://localhost:5001');
});