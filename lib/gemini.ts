type ChatMessage = {
  role: string
  content: string
}

export async function generateChatResponse(previousMessages: ChatMessage[], userInput: string): Promise<string> {
  try {
    // Format the conversation history for the API
    const messages = [...previousMessages, { role: "user", content: userInput }]

    // Prepare the prompt with context about being a stock market assistant
    const systemPrompt = `You are StockSage, an AI assistant specialized in stock market analysis and financial advice. 
    Provide helpful, accurate, and concise information about stocks, market trends, investment strategies, and financial concepts.
    Always maintain a professional tone and provide balanced perspectives on investment opportunities.
    If asked about specific stock predictions, remind the user that you cannot predict future stock prices with certainty.
    
    IMPORTANT FORMATTING INSTRUCTIONS:
    1. Format your responses with clear section headings using double asterisks. For example: **Market Analysis**
    2. Organize your response into 2-4 relevant sections based on the query.
    3. Use bullet points for lists and keep paragraphs concise.
    4. Common sections might include: **Market Trends**, **Stock Analysis**, **Investment Advice**, **Risk Assessment**, etc.
    5. Each section should be followed by relevant information in paragraph or bullet point format.
    
    Example format:
    **Market Analysis**
    The current market shows signs of volatility due to recent Fed announcements. Key indicators suggest...
    • S&P 500 is up 0.8% this week
    • Tech sector continues to outperform other sectors
    
    **Investment Strategy**
    Based on your question, consider the following approach...`

    // Combine system prompt with user messages
    const prompt = `${systemPrompt}\n\n${messages.map((msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`).join("\n")}`

    // Call the Google Gemini API directly
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": "AIzaSyDn71JmujQgiwlLYBkJqCspTdV_iieqRnI", // Use the API key directly
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      },
    )

    if (!response.ok) {
      const errorData = await response.json()
      console.error("API Error:", errorData)
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()

    // Extract the response text from the Gemini API response format
    const responseText =
      data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't generate a response at this time."

    return responseText
  } catch (error) {
    console.error("Error generating chat response:", error)
    return "I apologize, but I encountered an error while processing your request. Please try again later."
  }
}
