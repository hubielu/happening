const express = require("express");
const { google } = require("googleapis");
const router = express.Router();

const sheets = google.sheets({ version: "v4" });
const SPREADSHEET_ID = "1Duw8TlDwG2LlIxq0BvRg4YsRPygb_KytpSfAhrSoP28"; // Replace with your actual spreadsheet ID

// Authentication setup
async function getAuth() {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: "service-account.json", // Ensure this file exists and the path is correct
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    return await auth.getClient();
  } catch (error) {
    console.error("Authentication Error:", error.message);
    throw new Error("Authentication Failed");
  }
}

// Subscribe endpoint
router.post("/subscribe", async (req, res) => {
  const { email, name } = req.body;
  if (!email || !name) {
    return res.status(400).send("Email and Name are required.");
  }

  try {
    const auth = await getAuth();
    const now = new Date().toISOString();

    await sheets.spreadsheets.values.append({
      auth,
      spreadsheetId: SPREADSHEET_ID,
      range: "Network Insider Signup (Responses)", // Ensure this matches your sheet name
      valueInputOption: "RAW",
      resource: {
        values: [[now, name, email]],
      },
    });
    res.status(200).send("Subscribed successfully!");
  } catch (error) {
    console.error("Error subscribing:", error.message);
    res.status(500).send("Error subscribing. Please check server logs for details.");
  }
});

// Unsubscribe endpoint (Optional adjustments)
router.post("/unsubscribe", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).send("Email is required.");
  }

  try {
    const auth = await getAuth();
    const response = await sheets.spreadsheets.values.get({
      auth,
      spreadsheetId: SPREADSHEET_ID,
      range: "Network Insider Signup (Responses)!A2:C", // Adjust range as needed
    });

    const rows = response.data.values || [];
    let emailRow = null;

    for (let i = 0; i < rows.length; i++) {
      if (rows[i][2] === email) { // Assuming email is in column C (index 2)
        emailRow = i + 2; // Account for header row
        break;
      }
    }

    if (emailRow) {
      await sheets.spreadsheets.values.update({
        auth,
        spreadsheetId: SPREADSHEET_ID,
        range: `Network Insider Signup (Responses)!D${emailRow}`, // Assuming column D is "Status"
        valueInputOption: "RAW",
        resource: {
          values: [["Unsubscribed"]],
        },
      });
      res.status(200).send("Unsubscribed successfully!");
    } else {
      res.status(404).send("Email not found");
    }
  } catch (error) {
    console.error("Error unsubscribing:", error.message);
    res.status(500).send("Error unsubscribing");
  }
});

module.exports = router;