export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    return res.status(200).send("API is working ✅");
  }
  if (req.method === "POST") {
    try {
      const sheetUrl = process.env.GOOGLE_SHEET_URL;
      if (!sheetUrl) {
        return res.status(500).json({ error: "Missing GOOGLE_SHEET_URL" });
      }
      const response = await fetch(sheetUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body),
      });
      const data = await response.text();
      return res.status(200).json({ message: "Details saved successfully ✅", response: data });
    } catch {
      return res.status(500).json({ error: "Server error" });
    }
  }
  return res.status(405).send("Method Not Allowed");
}
