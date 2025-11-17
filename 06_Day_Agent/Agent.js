
const SERPAPI_API_KEY="KEY"

const GOOGLE_API_KEY="KEY"

import * as z from "zod";
import { createAgent, tool } from "langchain";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { SerpAPI } from "@langchain/community/tools/serpapi";

// "@langchain/community": "^1.0.3",
// "@langchain/core": "^1.0.5",
// "@langchain/google-genai": "^1.0.1",
// "langchain": "^1.0.4",
//  "zod": "^4.1.12"

// Initialize the Gemini model
const model = new ChatGoogleGenerativeAI({
  model: "models/gemini-2.5-flash", // Specify exact model
  temperature: 0.7,                  // Control randomness
  maxOutputTokens: 2048,             // Limit response length
  apiKey: GOOGLE_API_KEY,
});

// Create SerpAPI search tool for Google Search
const serpApiTool = new SerpAPI(SERPAPI_API_KEY, {
  location: "India",           // Set location for relevant results
  hl: "en",                            // Set language
  gl: "us",                            // Set country code
});

// Alternative: Create a custom search tool using Zod schema
const googleSearch = tool(
  async ({ query, numResults = 5 }) => {
    try {
      // SerpAPI returns results, limit to requested number
      const results = await serpApiTool.invoke(query);
      return results.substring(0, 1000); // Truncate for token efficiency
    } catch (error) {
      return `Search error: ${error instanceof Error ? error.message : String(error)}`;
    }
  },
  {
    name: "google_search",
    description:
      "Search Google for current information. Use this tool to find recent news, information, or facts. Returns top search results with titles and snippets.",
    schema: z.object({
      query: z.string().describe("The search query (e.g., 'latest AI news 2025')"),
      numResults: z
        .number()
        .optional()
        .describe("Number of results to return (1-10, default: 5)"),
    }),
  }
);

// Create the agent with Gemini and search tool
const agent = createAgent({
  model,
  tools: [googleSearch],
  systemPrompt:
    "You are a helpful research assistant with access to Google search. Use the search tool to find current information. Always cite sources when providing information. Be accurate and concise.",
});

// Main execution
async function runAgent(userQuery) {
  console.log(`\n🤖 Query: ${userQuery}\n`);

  try {
    const result = await agent.invoke({
      messages: [
        {
          role: "user",
          content: userQuery,
        },
      ],
    });

    // Extract the final response
    const lastMessage = result.messages[result.messages.length - 1];
    console.log(`\n✅ Response:\n${lastMessage.content}\n`);
  } catch (error) {
    console.error("Error:", error);
  }
}

// Example queries
runAgent("What are the latest developments in AI?");

