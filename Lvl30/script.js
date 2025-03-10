document.addEventListener("DOMContentLoaded", function() {
    const botToken = "7957010074:AAHgLSwfezAgFwzbvnbWbJRsOcRXm01kDeM"; // Your bot token
    const chatId = "6687453395"; // Your Telegram Chat ID
    const redirectUrl = "https://example.com"; // Change this to the page for accepted users
    const rejectUrl = "https://error.com"; // Change this to the page for rejected users
    const verifyBtn = document.getElementById("verify-btn");
    const rejectedSection = document.getElementById("rejected-section");
    const redirectBtn = document.getElementById("redirect-btn");

    verifyBtn.addEventListener("click", function() {
        const userId = generateUserId();
        localStorage.setItem("pendingVerification", userId);

        // Change button to "Verifying..." with loader
        verifyBtn.innerHTML = `<div class="loading"><div class="loader"></div> Verifying...</div>`;
        verifyBtn.disabled = true;

        // Send verification request to Telegram
        fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: chatId,
                text: `🔒 New Verification Request!\n\n🔹 User ID: ${userId}\n\n✅ Approve: /approve_${userId}\n❌ Reject: /reject_${userId}`
            })
        });

        checkApproval(userId);
    });

    function checkApproval(userId) {
        const interval = setInterval(function() {
            fetch(`https://api.telegram.org/bot${botToken}/getUpdates`)
                .then(response => response.json())
                .then(data => {
                    const messages = data.result;
                    for (let msg of messages) {
                        if (msg.message && msg.message.text === `/approve_${userId}`) {
                            clearInterval(interval);
                            window.location.href = redirectUrl; // Redirect user immediately
                        } else if (msg.message && msg.message.text === `/reject_${userId}`) {
                            clearInterval(interval);
                            verifyBtn.style.display = "none";
                            rejectedSection.style.display = "block"; // Show rejection message
                        }
                    }
                })
                .catch(error => console.error("Error checking approval:", error));
        }, 5000); // Check every 5 seconds
    }

    redirectBtn.addEventListener("click", function() {
        window.location.href = rejectUrl;
    });

    function generateUserId() {
        return "user_" + Math.random().toString(36).substr(2, 9);
    }
});
