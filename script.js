// ----------------------
// FAKE DATABASE
// ----------------------
const menu = {
  "pizza": 200,
  "burger": 150,
  "pasta": 180,
  "fries": 100,
  "sandwich": 120
};

const orderStatusDB = {
  "1001": "Order confirmed and being prepared.",
  "1002": "Order is out for delivery.",
  "1003": "Order delivered successfully.",
  "1004": "Order cancelled."
};

// ----------------------
// ADD MESSAGE TO CHAT UI
// ----------------------
function addMessage(text, sender) {
  let chat = document.getElementById("chatbox");
  let msg = document.createElement("div");
  msg.className = sender;
  msg.innerText = text;
  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
}

// ----------------------
// CUSTOM LOGIC CHECK
// ----------------------
function detectCustomLogic(text) {
  text = text.toLowerCase();

  // Price check
  if (text.includes("price of")) {
    let item = text.replace("price of", "").trim();
    if (menu[item]) {
      return `The price of ${item} is ₹${menu[item]}.`;
    }
    return `Sorry babe, ${item} is not in the menu.`;
  }

  // Order tracking
  if (text.includes("track order")) {
    let id = text.replace("track order", "").trim();
    if (orderStatusDB[id]) {
      return `Order ${id}: ${orderStatusDB[id]}`;
    }
    return `No record found for Order ID ${id}.`;
  }

  return null;
}

// ----------------------
// SEND MESSAGE FUNCTION
// ----------------------
function sendMessage() {
  let text = document.getElementById("userInput").value;

  if (!text) return;

  addMessage(text, "user");

  let custom = detectCustomLogic(text);
  if (custom) {
    addMessage(custom, "bot");
    return;
  }

  // Send to Dialogflow
  sendToDialogflow(text);

  document.getElementById("userInput").value = "";
}

// ----------------------
// DIALOGFLOW API CALL
// ----------------------
async function sendToDialogflow(query) {
  const response = await fetch(
    `https://api.dialogflow.com/v1/query?v=20150910`,
    {
      method: "POST",
      headers: {
        "Authorization": "Bearer YOUR_ACCESS_TOKEN",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query: query,
        lang: "en",
        sessionId: "12345"
      })
    }
  );

  const data = await response.json();
  let reply = data.result.fulfillment.speech;
  addMessage(reply, "bot");
}
