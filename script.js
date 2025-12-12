document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Handle Form Submission
    const form = document.getElementById('consultForm');
    
    if(form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault(); // Stop page reload
            
            // Get values
            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const course = document.getElementById('course').value;

            // Simple Alert for now (Since we don't have a backend in this version)
            alert(`Thank you ${name}! \n\nWe have received your inquiry for ${course}.\nOur expert counselor will call you at ${phone} shortly.`);
            
            // Clear form
            form.reset();
        });
    }

    // 2. Smooth Scrolling for Navbar Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});