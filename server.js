import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import OpenAI from "openai";

dotenv.config();

const app = express();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// health check
app.get("/api/health", (req, res) => {
  res.json({ ok: true, service: "Tony's AI Assistant - Cleaning" });
});

app.post("/api/chat", async (req, res) => {
  try {
    const {
      message,
      businessName = "Tony's AI Assistant - Cleaning",
      systemPrompt,
      history = []
    } = req.body;

    const baseSystem =
      systemPrompt ||
      process.env.SYSTEM_PROMPT ||
      "You are Tony's AI Assistant for a residential and vacation rental cleaning service in Cape May County, NJ. Be friendly, brief, and professional. Your job is to collect the customer's name, phone number, service address, preferred date/time, and type of cleaning (standard, deep, move-out, or turnover for Airbnb). If the customer doesn't give a phone number, ask for it politely.";

    const messages = [
      {
        role: "system",
        content: `${baseSystem} The business name is: ${businessName}.`
      },
      ...history,
      { role: "user", content: message }
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI request failed" });
  }
});

// serve frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Tony's AI Assistant running on port", port);
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});


