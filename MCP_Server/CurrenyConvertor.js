import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import * as z from "zod";

//Create MCPServer
const server = new McpServer({
  name: "Currency Converter MCP Server",
  version: "1.0.0",
});

//Connecting the tool with the server
server.tool(
  "ConvertCurrency", 
  "Convert amount from one currency to another currency",
  {
    amount: z.number().describe("Amount to convert, e.g: 100, 200"),
    from: z.string().describe("source currency code e.g: USD"),
    to: z.string().describe("target currency code e.g: INR"),
  },

  async ({ amount, from, to }) => {
    try {
      // Fetch exchange rate from open.er-api.com
      const url = `https://open.er-api.com/v6/latest/${from.toUpperCase()}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch exchange rate for ${from}`);
      }

      const data = await response.json();

      if (!data.rates || !data.rates[to.toUpperCase()]) {
        throw new Error(`Invalid target currency: ${to}`);
      }

      const rate = data.rates[to.toUpperCase()];
      const converted = amount * rate;

      return {
        content: [
          {
            type: "text",
            text: `✔️ Converted ${amount} ${from.toUpperCase()} → ${converted.toFixed(
              2
            )} ${to.toUpperCase()}\n(Exchange Rate: 1 ${from.toUpperCase()} = ${rate} ${to.toUpperCase()})`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `❌ Error occurred: ${error.message}`,
          },
        ],
      };
    }
  }
);

//Starting the Server
try {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("🔥 MCP Server Connected");
} catch (error) {
  console.error("❌ MCP Server Start Failed", error);
}
