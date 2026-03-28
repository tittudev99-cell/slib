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

    console.log("New Contact Form Submission:", { name, phone, message });

    // GOOGLE SHEETS INTEGRATION LOGIC
    // To save to Google Sheets, you can use a Google Apps Script Web App URL.
    // 1. Create a Google Sheet.
    // 2. Go to Extensions > Apps Script.
    // 3. Paste a script that handles doPost(e) and appends data to the sheet.
    // 4. Deploy as Web App (Anyone has access).
    // 5. Add the URL to your .env as GOOGLE_SHEET_URL.

    const googleSheetUrl = process.env.GOOGLE_SHEET_URL;

    if (googleSheetUrl) {
      try {
        const response = await fetch(googleSheetUrl, {
          method: "POST",
          redirect: "follow", // Required for Google Apps Script redirects
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, phone, message, date: new Date().toISOString() }),
        });
        
        if (!response.ok) throw new Error("Failed to save to Google Sheet");
        
        return res.json({ success: true, message: "Details saved to Google Sheet successfully!" });
      } catch (error) {
        console.error("Google Sheet Error:", error);
        return res.status(500).json({ success: false, message: "Error saving to Google Sheet." });
      }
    }

    // Fallback if no URL is provided
    res.json({ 
      success: true, 
      message: "Form received! (Note: Set GOOGLE_SHEET_URL in secrets to save to Google Sheets automatically)" 
    });
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
