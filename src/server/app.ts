import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());

// API Route for Contact Form
app.post("/api/contact", async (req, res) => {
  const { name, phone, message } = req.body;
  const googleSheetUrl = process.env.GOOGLE_SHEET_URL;

  if (googleSheetUrl) {
    try {
      const now = new Date();
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      const formattedDate = `${day}-${month}-${year} ${String(hours).padStart(2, '0')}:${minutes}:${seconds} ${ampm}`;

      const response = await fetch(googleSheetUrl, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ action: "contact", name, phone, message, date: formattedDate, plan: "Contact Form" }),
        redirect: "follow"
      });
      
      if (!response.ok) throw new Error(`Failed to save: ${response.status}`);
      return res.json({ success: true, message: "Details saved successfully!" });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Error saving to Google Sheet." });
    }
  }
  res.json({ success: true, message: "Form received!" });
});

// API Route for Booking
app.post("/api/book", async (req, res) => {
  const { name, phone, date, plan, slot, seatId } = req.body;
  const googleSheetUrl = process.env.GOOGLE_SHEET_URL;

  if (!googleSheetUrl) return res.status(500).json({ success: false, message: "Google Sheet URL not configured." });

  try {
    const response = await fetch(googleSheetUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ 
        action: "book", 
        name, 
        phone, 
        date, 
        plan, 
        slot,
        seatId,
        message: `Slot: ${slot} | Seat: #${seatId}` 
      }),
      redirect: "follow"
    });
    
    if (!response.ok) {
      const text = await response.text();
      console.error("Google Sheet Error Response:", text);
      return res.status(500).json({ success: false, message: "Google Sheet communication error." });
    }

    const result = await response.json();
    res.json(result);
  } catch (error: any) {
    console.error("Booking API Error:", error);
    res.status(500).json({ success: false, message: "Booking failed. Please check your connection or try again later." });
  }
});

// API Route to fetch availability
app.get("/api/availability", async (req, res) => {
  const googleSheetUrl = process.env.GOOGLE_SHEET_URL;
  if (!googleSheetUrl) return res.status(500).json({ success: false, message: "Not configured." });

  try {
    const response = await fetch(`${googleSheetUrl}?action=getAvailability`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch availability." });
  }
});

// API Route to fetch booked seats for a specific date and slot
app.get("/api/booked-seats", async (req, res) => {
  const { date, slot } = req.query;
  const googleSheetUrl = process.env.GOOGLE_SHEET_URL;
  if (!googleSheetUrl) return res.status(500).json({ success: false, message: "Not configured." });

  try {
    const response = await fetch(`${googleSheetUrl}?action=getBookedSeats&date=${date}&slot=${slot}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch booked seats." });
  }
});

// Admin API to fetch all bookings
app.get("/api/admin/bookings", async (req, res) => {
  const { password } = req.query;
  if (password !== "admin123") return res.status(401).json({ success: false, message: "Unauthorized" });

  const googleSheetUrl = process.env.GOOGLE_SHEET_URL;
  try {
    const response = await fetch(`${googleSheetUrl}?action=getBookings`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch bookings." });
  }
});

// Admin API to fetch all contacts
app.get("/api/admin/contacts", async (req, res) => {
  const { password } = req.query;
  if (password !== "admin123") return res.status(401).json({ success: false, message: "Unauthorized" });

  const googleSheetUrl = process.env.GOOGLE_SHEET_URL;
  try {
    const response = await fetch(`${googleSheetUrl}?action=getContacts`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch contacts." });
  }
});

export { app };
