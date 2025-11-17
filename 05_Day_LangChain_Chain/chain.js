import { config } from "dotenv";
config();

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";

const model = new ChatGoogleGenerativeAI({
  model: "models/gemini-2.5-flash",
  apiKey: process.env.GOOGLE_API_KEY,
  maxOutputTokens: 2048,
  temperature: 0.7,
});

// Create prompt
const prompt = PromptTemplate.fromTemplate(
  //"Explain the concept of {topic} to a beginner."
  "You are a helpful Assitant, Answer the question {question}"
);

// Build chain
//const chain = RunnableSequence.from([prompt, model]);

const chain=prompt.pipe(model)

//OUTPUT PARSER

// Run
//const result = await chain.invoke({ topic: "quantum computing" });

const result=await chain.invoke({
  question:"What is the Future of AI in healthCare"
})
console.log("Gemini Response:\n", result);


//LCEL >> LangChain Expression Language
