# 🚀 Currency Converter MCP Server

A professional Model Context Protocol (MCP) tool that provides **real-time currency conversion** using live foreign-exchange API rates. This project is built using:

* **Node.js**
* **Model Context Protocol SDK** (`@modelcontextprotocol/sdk`)
* **Zod validation**
* **Stdio transport** for server-client communication

---

## 📌 Overview

This MCP tool exposes a single function — `ConvertCurrency` — which takes:

* **amount** (number)
* **from** (source currency code)
* **to** (target currency code)

It fetches live exchange rates from a **free, no-auth API** and returns the converted value.

The server automatically:

* Validates input
* Fetches real-time FX rates
* Performs currency conversion
* Returns a clean, formatted response
* Handles all errors gracefully

---

## 🧠 How It Works

### 1. MCP Server Initialization

The server is created using the `McpServer` class:

```js
const server = new McpServer({
  name: "Currency Converter MCP Server",
  version: "1.0.0",
});
```

### 2. Defining the `ConvertCurrency` Tool

A tool (function) is registered with:

* Name
* Description
* Input schema (using Zod)
* Logic for executing the action

```js
server.tool(
  "ConvertCurrency",
  "Convert amount from one currency to another currency",
  {
    amount: z.number(),
    from: z.string(),
    to: z.string(),
  },
  async ({ amount, from, to }) => { /* logic */ }
);
```

### 3. Fetching Live Exchange Rates

The server calls:

```
https://open.er-api.com/v6/latest/<FROM_CURRENCY>
```

This returns a JSON object with exchange rates for 160+ currencies.

### 4. Performing Conversion

```js
const rate = data.rates[to.toUpperCase()];
const converted = amount * rate;
```

### 5. Returning Output

```js
return {
  content: [{ type: "text", text: `Converted Amount: ...` }]
};
```

---

## 🛠️ Complete Code Example

```js
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import * as z from "zod";

const server = new McpServer({
  name: "Currency Converter MCP Server",
  version: "1.0.0",
});

server.tool(
  "ConvertCurrency",
  "Convert amount from one currency to another currency",
  {
    amount: z.number().describe("Amount to convert"),
    from: z.string().describe("Source currency e.g. USD"),
    to: z.string().describe("Target currency e.g. INR"),
  },
  async ({ amount, from, to }) => {
    try {
      const url = `https://open.er-api.com/v6/latest/${from.toUpperCase()}`;
      const response = await fetch(url);

      if (!response.ok) throw new Error(`Failed to fetch exchange rate`);

      const data = await response.json();

      if (!data.rates[to.toUpperCase()])
        throw new Error(`Invalid target currency: ${to}`);

      const rate = data.rates[to.toUpperCase()];
      const converted = amount * rate;

      return {
        content: [
          {
            type: "text",
            text: `✔️ Converted ${amount} ${from.toUpperCase()} → ${converted.toFixed(2)} ${to.toUpperCase()} (Rate: ${rate})`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `❌ Error: ${error.message}`,
          },
        ],
      };
    }
  }
);

try {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("🔥 MCP Server Connected");
} catch (error) {
  console.error("❌ MCP Server Failed", error);
}
```

---

## 🧪 Usage Example

Call the tool through your MCP client:

```
ConvertCurrency(amount=100, from="USD", to="INR")
```

📈 Output:

```
✔️ Converted 100 USD → 8330.45 INR (Rate: 83.3045)
```

---

## ⚙️ Requirements

* Node.js 18+
* MCP-compatible client
* Internet access for fetching exchange rates

---

## 💡 Future Improvements

Possible enhancements:

* 🔄 Cache exchange rates in Redis
* 📉 Add historical rate lookup
* 🧮 Convert between cryptocurrencies
* 📦 Add batch conversion
* 📊 Add conversion logs

---

## 📜 License

MIT License © 2025

---

## ✨ Author

**Shaik Rahul || BackEnd Node JS Developer**
