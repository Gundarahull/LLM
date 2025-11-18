

# 🍽️ AI-Powered Restaurant Assistant (LangChain + Gemini + Node.js)

An intelligent **AI restaurant assistant** built using **Node.js**, **LangChain**, **Gemini 2.5 Flash**, and **Dynamic Tools**.
The system answers restaurant menu queries using an LLM, and automatically calls a custom tool (`getMenuTool`) to fetch menu items for **breakfast**, **lunch**, and **dinner**.

This project demonstrates:

* LLM integration with Google Gemini via LangChain
* Creating structured, dynamic tools
* Building an AI agent that decides **when to call tools**
* A simple Express API to send user messages to the agent
* Clean modular architecture for production-ready LLM applications

---

## 🚀 Features

### ✔️ **AI Chat Endpoint**

Send any message to `/chat` and the agent decides:

* Should it answer normally?
* Should it call `getMenuTool` to fetch the menu?

### ✔️ **LangChain Dynamic Structured Tool**

`getMenuTool` is a Zod-validated tool that returns menu data based on the user query.

### ✔️ **Google Gemini 2.5 Flash**

Fast, efficient LLM model suitable for real-time applications.

### ✔️ **Express Server**

Provides REST API endpoints for easy integration with frontend or mobile apps.

### ✔️ **Clean and Extendable Architecture**

You can easily add:

* MongoDB tools
* Weather tools
* Booking tools
* Payment tools
* Custom logic

---

## 🛠️ Tech Stack

| Component    | Technology                  |
| ------------ | --------------------------- |
| Backend      | Node.js, Express            |
| AI Model     | Google Gemini 2.5 Flash     |
| AI Framework | LangChain                   |
| Tooling      | DynamicStructuredTool + Zod |
| Environment  | dotenv                      |

---

## 📦 Project Structure

```
project/
│
├── public/
│   └── chat.html        # UI for the chat (optional)
│
├── server.js            # Main API + Agent code
├── .env                 # API keys
└── README.md            # Project documentation
```

---

## 🔧 Installation

### 1️⃣ Clone the repository

```bash
git clone <repo-url>
cd project
```

### 2️⃣ Install packages

```bash
npm install
```

Required dependencies:

```
express
dotenv
zod
@langchain/google-genai
@langchain/core
langchain
```

### 3️⃣ Add your Google API key

Create **.env** file:

```
GOOGLE_API_KEY=your_api_key_here
```

---

## 🧠 Agent Overview

The heart of the system is a LangChain **agent** that can:

* Understand user messages
* Choose whether to call the `getMenuTool`
* Return final output to the user

### 🧩 The menu tool

```js
const getMenuTool = new DynamicStructuredTool({
  name: "getMenuTool",
  description:
    "Returns menu for the given category (breakfast, lunch, dinner).",
  schema: z.object({
    category: z.string().describe("Example: breakfast, lunch, dinner"),
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
```

---

## 🧩 The AI Model

```js
const model = new ChatGoogleGenerativeAI({
  model: "models/gemini-2.5-flash",
  temperature: 0.7,
  maxOutputTokens: 2048,
  apiKey: process.env.GOOGLE_API_KEY,
});
```

---

## 🧩 Creating the Agent

```js
const agent = createAgent({
  model,
  tools: [getMenuTool],
  systemPrompt:
    "You are a helpful restaurant assistant that uses tools to answer menu questions.",
});
```

---

## 🔥 Chat API Endpoint

Send a POST request:

**URL**

```
POST /chat
```

**Body**

```json
{
  "message": "What's for lunch?"
}
```

**Example Response**

```json
{
  "response": "Today's lunch is Sangati and chicken curry."
}
```

---

## ▶️ Running the Project

Start the server:

```bash
npm start
```

Server runs at:

```
http://localhost:1105
```

---

## 🧩 How It Works (AI Flow)

1. User sends a message: “What’s for dinner?”
2. LangChain agent analyzes the intent
3. Agent decides:
   👉 Should I call a tool? (Yes)
4. Agent calls `getMenuTool({ category: "dinner" })`
5. Tool returns: `"Chapati and Egg bhurji"`
6. Agent sends final answer to the user

---

## 📄 License

MIT License. Free to use and modify.

