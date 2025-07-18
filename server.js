const express = require("express");
const fs = require("fs");
const path = require("path");
const { nanoid } = require("nanoid");

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

const dbPath = path.join(__dirname, "urls.json");
let urlDB = {};
if (fs.existsSync(dbPath)) {
  try {
    const data = fs.readFileSync(dbPath, "utf-8");
    urlDB = JSON.parse(data || "{}");
  } catch (err) {
    console.error("❌ Failed to read urls.json");
  }
}

app.post("/shorten", (req, res) => {
  const { url } = req.body;

  // ✅ Check valid URL
  if (!url || !/^https?:\/\//i.test(url)) {
    return res.status(400).json({ error: "The URL you put is invalid" });
  }

  // ✅ Check too short
  if (url.length <= 15) {
    return res.status(400).json({ error: "The URL you put is already shorten" });
  }

  // ✅ Check if URL already has a shortened version
  const existingEntry = Object.entries(urlDB).find(([, value]) => value === url);
  if (existingEntry) {
    return res.status(400).json({ error: "The URL you put already has a short URL" });
  }

  const id = "RaqkidURL" + nanoid(6);
  urlDB[id] = url;

  fs.writeFileSync(dbPath, JSON.stringify(urlDB, null, 2));
  res.json({ shortUrl: `${req.protocol}://${req.get("host")}/${id}` });
});

app.get("/:id", (req, res) => {
  const { id } = req.params;
  const longUrl = urlDB[id];
  if (longUrl) {
    res.redirect(longUrl);
  } else {
    res.status(404).send("Shortened URL not found.");
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
