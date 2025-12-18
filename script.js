document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Mobile Navigation Toggle ---
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle menu
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // --- 2. Handle Contact Form Submission (Web3Forms) ---
    const form = document.getElementById('consultForm');
    const btnText = document.getElementById('btnText');
    const statusMsg = document.getElementById('formStatus');

    if(form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault(); // Stop page reload
            
            // Check if Access Key is still the placeholder
            const accessKeyInput = form.querySelector('input[name="access_key"]');
            if(accessKeyInput.value === "YOUR_ACCESS_KEY_HERE") {
                alert("Error: Please add your Web3Forms Access Key in index.html to send emails.");
                return;
            }

            // UI Loading State
            const originalText = btnText.innerText;
            btnText.innerText = "Sending...";
            
            const formData = new FormData(form);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);

            // Send Data via Fetch
            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            })
            .then(async (response) => {
                let json = await response.json();
                if (response.status == 200) {
                    statusMsg.innerHTML = "✅ Message sent successfully! We will call you soon.";
                    statusMsg.style.color = "green";
                    form.reset();
                } else {
                    console.log(response);
                    statusMsg.innerHTML = "❌ Something went wrong. Please try again.";
                    statusMsg.style.color = "red";
                }
            })
            .catch(error => {
                console.log(error);
                statusMsg.innerHTML = "❌ Connection error.";
                statusMsg.style.color = "red";
            })
            .finally(() => {
                btnText.innerText = originalText;
                // Clear message after 5 seconds
                setTimeout(() => { statusMsg.innerHTML = ""; }, 5000);
            });
        });
    }
});
