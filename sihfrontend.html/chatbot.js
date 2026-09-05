
        function toggleChat() {
            const chatWindow = document.getElementById('chatWindow');
            if (chatWindow.style.display === 'flex') {
                chatWindow.style.display = 'none';
            } else {
                chatWindow.style.display = 'flex';
            }
        }

       
        function sendMessage() {
            const inputField = document.getElementById('userInput');
            const messageText = inputField.value.trim();
            
            if (messageText === "") return;

            const chatMessages = document.getElementById('chatMessages');

            
            const userDiv = document.createElement('div');
            userDiv.className = 'message user-message';
            userDiv.textContent = messageText;
            chatMessages.appendChild(userDiv);

            inputField.value = "";
            chatMessages.scrollTop = chatMessages.scrollHeight; // Auto scroll to bottom

            // 2. Simulate a simple Frontend-Only "Bot Reply"
            setTimeout(() => {
                const botDiv = document.createElement('div');
                botDiv.className = 'message bot-message';
                botDiv.textContent = "I received your message! (Connect a backend server here to process real answers).";
                chatMessages.appendChild(botDiv);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 800);
        }

        function handleKeyPress(event) {
            if (event.key === 'Enter') {
                sendMessage();
            }
        }
