const pool = require("../database/db");

class Chat {
  static getChatResponse = async (req, res) => {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    try {
      // Step 1: Send prompt to Ollama LLM
      const fetch = (await import("node-fetch")).default;
      const llmRes = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "tinyllama",
          prompt: message,
          stream: false,
        }),
      });

      const text = await llmRes.text();
      console.log("LLM Raw Response:", text);

      const data = JSON.parse(text);
      const response = data.response;

    
      // Step 2: Save message and response to DB
      await pool.query(
        "INSERT INTO chats (message, response) VALUES ($1, $2)",
        [message, response]
      );

      // Step 3: Return response
      res.status(200).json({ response });

    } catch (error) {
      console.error("Error in getChatResponse:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  static getChatHistory = async (req, res) => {
    try {
      const result = await pool.query(
        "SELECT * FROM chats ORDER BY created_at ASC"
      );
      res.status(200).json({ history: result.rows });
    } catch (error) {
      console.error("Error fetching chat history:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
}

module.exports = Chat;

