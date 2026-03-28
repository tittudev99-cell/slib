import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

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

    // Pre-check: Is the seat already booked?
    try {
      const checkRes = await fetch(`${googleSheetUrl}?action=booked-seats&date=${date}&slot=${slot}`);
      if (checkRes.ok) {
        const checkData = await checkRes.json();
        if (checkData.bookedSeats && checkData.bookedSeats.includes(Number(seatId))) {
          return res.json({ success: false, message: "Sorry, this seat was just booked by someone else. Please select another seat." });
        }
      }
    } catch (e) {
      console.error("Pre-check failed", e);
    }

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
      const result = await response.json();
      res.json(result);
    } catch (error) {
      res.status(500).json({ success: false, message: "Booking failed." });
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

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
