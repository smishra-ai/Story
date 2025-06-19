// MastramGPT v2 - Express + Telegraf + OpenRouter

const express = require("express"); const { Telegraf } = require("telegraf"); const axios = require("axios"); const bodyParser = require("body-parser"); require("dotenv").config();

const app = express(); app.use(bodyParser.json());

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

let currentScene = ""; let locked = false;

const scenePrompts = {
  maa_beti: "Write a desi adult story in Hindi-English mixed style. It should be emotionally intense, with character emotions, realistic dialogue, and deep psychological interaction. Focus on a mother and daughter living with a new male tenant. Use slow buildup, inner thoughts, and realistic pacing. Avoid silly or robotic tone.",

  madarsa: "Write a dark story set in a strict madarsa. Use Hindi-English fusion style. Include fear, shame, obedience, and raw desire. Keep dominant-submissive undertones and no character crossover.",

  tenant: "Write a story about a widow and her daughter in a rented house. A landlord visits often. Build tension slowly, with hesitation, inner conflict, and realistic cultural background. Use Hindi-English tone."
};

bot.start((ctx) => { ctx.reply("MastramGPT v2 activated! Use /set maa_beti or /set madarsa to begin."); });

bot.command("set", (ctx) => { const args = ctx.message.text.split(" "); if (args.length < 2) return ctx.reply("Usage: /set <scenario>"); const key = args[1]; if (!scenePrompts[key]) return ctx.reply("Unknown scene key."); currentScene = scenePrompts[key]; locked = false; ctx.reply(Scene '${key}' loaded. You may now start chatting.); });

bot.command("lock", (ctx) => { if (!currentScene) return ctx.reply("No active scene. Use /set first."); locked = true; ctx.reply("Scene locked. Only your prompts will control the flow now."); });

bot.command("reset", (ctx) => { currentScene = ""; locked = false; ctx.reply("Scene and memory cleared."); });

bot.on("text", async (ctx) => { if (!currentScene) return ctx.reply("Use /set <scene> to begin.");

const prompt = ${currentScene}\n\nUser: ${ctx.message.text}\nAI:;

try { const response = await axios.post("https://openrouter.ai/api/v1/chat/completions", { model: process.env.MODEL_NAME, messages: [ { role: "system", content: currentScene }, { role: "user", content: ctx.message.text } ] }, { headers: { Authorization: Bearer ${process.env.OPENROUTER_API_KEY}, "Content-Type": "application/json" } });

const reply = response.data.choices[0].message.content;
ctx.reply(reply);

} catch (error) { console.error("Error from OpenRouter:", error); ctx.reply("Kuch gadbad ho gayi... try again later."); } });

bot.launch();

app.get("/", (req, res) => { res.send("MastramGPT v2 is live!"); });

const PORT = process.env.PORT || 3000; app.listen(PORT, () => { console.log(Server running on port ${PORT}); });

