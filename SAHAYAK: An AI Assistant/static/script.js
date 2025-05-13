function sendMessage() {
    const inputBox = document.getElementById('userInput');
    const userMessage = inputBox.value.trim();
    const duration = document.getElementById("durationFilter").value;
    const stipend = document.getElementById("stipendFilter").value;
    const department = document.getElementById("departmentFilter").value;
  
    if (!userMessage) return;
  
    const chatWindow = document.getElementById('chatWindow');
    const sqlResultTable = document.getElementById('sqlResultTable');
  
    // Show user message in chat
    chatWindow.innerHTML += `<div class="user-msg"><strong>You:</strong> ${escapeHtml(userMessage)}</div>`;
    inputBox.value = "";
  
    // Send POST request to Flask backend
    fetch('/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        question: userMessage,
        filters: {
          Duration: duration,
          Stipend: stipend,
          Department: department
        }
      })
    })
    .then(res => res.json())
    .then(data => {
      // Show bot answer
      if (data.answer) {
        chatWindow.innerHTML += `<div class="bot-msg"><strong>Bot:</strong> ${escapeHtml(data.answer)}</div>`;
      }
  
      // Show result table if available
      if (data.result && data.result.length > 1) {
        const headers = data.result[0];
        const rows = data.result.slice(1);
        let html = "<table><thead><tr>";
        headers.forEach(h => html += `<th>${escapeHtml(h)}</th>`);
        html += "</tr></thead><tbody>";
        rows.forEach(r => {
          html += "<tr>";
          r.forEach(cell => html += `<td>${escapeHtml(cell)}</td>`);
          html += "</tr>";
        });
        html += "</tbody></table>";
        sqlResultTable.innerHTML = html;
      } else {
        sqlResultTable.innerHTML = ""; // Clear if no result
      }
    })
    .catch(err => {
      chatWindow.innerHTML += `<div class="bot-msg"><strong>Bot:</strong> Network or fetch error</div>`;
      console.error("Fetch error:", err);
    });
  }
  
  // Handle Enter key
  function checkEnter(event) {
    if (event.key === "Enter") {
      sendMessage();
    }
  }
  
  // Escape HTML to prevent injection
  function escapeHtml(text) {
    if (!text) return "";
    return text.toString().replace(/[&<>"']/g, match => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;",
      '"': "&quot;", "'": "&#039;"
    }[match]));
  }
  
  // Attach send button click on page load
  document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("sendButton").addEventListener("click", sendMessage);
  });
  