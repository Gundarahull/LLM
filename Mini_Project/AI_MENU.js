import { config } from "dotenv";
config();

import express from "express";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { DynamicStructuredTool } from "@langchain/core/tools";
import * as z from "zod";
import { createAgent } from "langchain";
import path from "path";

const dirname = path.resolve();

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(dirname, "public", "chat.html"));
});

// //First Model then Tool then Prompt....

// Setting up the LLM
const model = new ChatGoogleGenerativeAI({
  model: "models/gemini-2.5-flash",
  temperature: 0.7,
  maxOutputTokens: 2048,
  apiKey: process.env.GOOGLE_API_KEY,
});

// Define the menu tool
//Dynamic TOOL- we will feed th data
const getMenuTool = new DynamicStructuredTool({
  //which is responsible for thinking dyanmically according to the Cause..
  name: "getMenuTool",
  description:
    "Returns the final answer for today's menu for the given category (breakfast,lunch or dinner). Use this tool to directly answer the user's menu question.",
  //When to use this Tool...
  // description will be in the statte when this dynmaictool will work for the agent under the conditions...
  schema: z.object({
    category: z.string("Type of food. Example: breakfast, lunch, dinner"),
  }),
  func: async ({ category }) => {
    const menu = {
      breakfast: "Egg Dosa, Idly, Chutney",
      lunch: "Sangati and chicken curry",
      dinner: "Chapati and Egg bhurji",
    };
    return menu[category.toLowerCase()] || "No Menu Found";
  },
});

// Create the agent - createAgent handles model, tools, and system prompt
const agent = createAgent({
  model,
  tools: [getMenuTool],
  systemPrompt:
    "You are a helpful restaurant assistant that uses tools to answer menu questions.",
});

// Route to handle chat requests
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    // Invoke the agent with the user message
    const result = await agent.invoke({
      messages: [
        {
          role: 'human',
          content: message,
        },
      ],
    });

    // Extract the response content
    const responseContent = result.messages[result.messages.length - 1].content;

    res.json({ response: responseContent });
  } catch (error) {
    console.error("Agent error:", error);
    res.status(500).json({ error: "Failed to process request" });
  }
});

app.listen(1105, () => {
  console.log("Server is started at 1105");
});
