document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. MOBILE NAVIGATION
    // ==========================================
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (hamburger) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });

    // ==========================================
    // 2. MODAL POPUP LOGIC
    // ==========================================
    const modal = document.getElementById("enquiryModal");
    const closeBtn = document.querySelector(".close-btn");
    const openBtns = document.querySelectorAll(".open-modal-btn");

    if (modal) {
        // Open Modal on button click
        openBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                modal.classList.add("show");
            });
        });

        // Close on X click
        if(closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.classList.remove("show");
            });
        }

        // Close on click outside the modal content
        window.addEventListener('click', (e) => {
            if (e.target == modal) {
                modal.classList.remove("show");
            }
        });
    }

    // ==========================================
    // 3. FORM SUBMISSION (Universal Handler)
    // ==========================================
    function setupForm(formId) {
        
        const form = document.getElementById(formId);
        if (form) {
            // Select the submit button and its text span
            const submitBtn = form.querySelector('button[type="submit"]');
            const btnText = submitBtn.querySelector('span') || submitBtn;
            const statusMsg = form.querySelector('.status-msg');

            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Check if Access Key is still the placeholder
                const accessKeyInput = form.querySelector('input[name="access_key"]');
                if(accessKeyInput && accessKeyInput.value === "YOUR_ACCESS_KEY_HERE") {
                    alert("Please add your Web3Forms Access Key in the HTML.");
                    return;
                }

                // UI Loading State
                const originalText = btnText.innerText;
                btnText.innerText = "Sending...";
                submitBtn.disabled = true; // Prevent double submission
                
                const formData = new FormData(form);
                const object = Object.fromEntries(formData);
                const json = JSON.stringify(object);

                fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: json
                })
                .then(async (response) => {
                    if (response.status == 200) {
                        if(statusMsg) {
                            statusMsg.innerHTML = "✅ Message sent successfully!";
                            statusMsg.style.color = "#166534"; // Green
                        }
                        form.reset();
                        
                        // If it's the modal, close it automatically after 2 seconds
                        if(formId === 'modalForm' && modal) {
                            setTimeout(() => {
                                modal.classList.remove("show");
                                if(statusMsg) statusMsg.innerHTML = "";
                            }, 2000);
                        }
                    } else {
                        if(statusMsg) {
                            statusMsg.innerHTML = "❌ Something went wrong. Please try again.";
                            statusMsg.style.color = "#dc2626"; // Red
                        }
                    }
                })
                .catch(error => {
                    console.error(error);
                    if(statusMsg) {
                        statusMsg.innerHTML = "❌ Connection error. Please check your internet.";
                        statusMsg.style.color = "#dc2626";
                    }
                })
                .finally(() => {
                    btnText.innerText = originalText;
                    submitBtn.disabled = false;
                    // Clear status message after 5 seconds
                    setTimeout(() => {
                        if(statusMsg) statusMsg.innerHTML = "";
                    }, 5000);
                });
            });
        }
    }

    // Initialize all forms found on any page
    setupForm('contactForm');      // For Contact Page
    setupForm('eligibilityForm');  // For Eligibility Page
    setupForm('modalForm');        // For Popup Modal
});

// ==========================================
// 4. TNEA CUTOFF CALCULATOR
// ==========================================
function calculateCutoff() {
    // Select elements
    const mathsInput = document.getElementById('maths');
    const physicsInput = document.getElementById('physics');
    const chemistryInput = document.getElementById('chemistry');
    
    if(!mathsInput || !physicsInput || !chemistryInput) return;

    const maths = parseFloat(mathsInput.value);
    const physics = parseFloat(physicsInput.value);
    const chemistry = parseFloat(chemistryInput.value);
    
    const resultBox = document.getElementById('resultBox');
    const cutoffDisplay = document.getElementById('cutoffValue');
    const errorMsg = document.getElementById('calcError');

    // Reset previous state
    if(errorMsg) errorMsg.innerText = "";
    if(resultBox) resultBox.classList.add('hidden');

    // Validation
    if (isNaN(maths) || isNaN(physics) || isNaN(chemistry)) {
        if(errorMsg) errorMsg.innerText = "Please enter marks for all subjects.";
        return;
    }

    if (maths > 100 || physics > 100 || chemistry > 100 || maths < 0 || physics < 0 || chemistry < 0) {
        if(errorMsg) errorMsg.innerText = "Marks must be between 0 and 100.";
        return;
    }

    // Calculation logic: Maths (100) + Physics (50) + Chemistry (50)
    const cutoff = maths + (physics / 2) + (chemistry / 2);

    // Display Result
    if(cutoffDisplay) cutoffDisplay.innerText = cutoff.toFixed(2);
    if(resultBox) resultBox.classList.remove('hidden');
}
