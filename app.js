// MastramGPT v2 - Express + Telegraf + OpenRouter

const express = require("express"); const { Telegraf } = require("telegraf"); const axios = require("axios"); const bodyParser = require("body-parser"); require("dotenv\config");

const app = express(); app.use(bodyParser.json());

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

let currentScene = ""; let locked = false;

const scenePrompts = {
  maa_beti: `Write a desi adult story in Hindi-English mixed style, based on classic pulp like Mastram. It should be emotionally intense, with vivid character emotions, realistic dialogue, deep physical and psychological interaction. Focus on a mother and daughter who share a house with a new male tenant. Use progressive buildup, inner thoughts, sensory detail, and realistic pacing. Never rush. Avoid any silly or robotic tone.`,

  madarsa: `Write a dark, intense story set in an orthodox madarsa. Use Hindi-English style similar to underground desi novels. Include emotional tension, forced obedience, fear, shame, and raw desires. The story should have realistic pacing, dominant-submissive undertone, and no character crossover.`,

  tenant: `Write an intense desi-style story about a lonely widow and her young daughter living in a rented house. A mysterious landlord visits often. Build tension, background, hesitation, cultural conflict and slow burning physical interactions. Include emotional realism and raw detail. Use Hindi-English mixed tone.`
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
