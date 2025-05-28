function initializeNavbar() {
    console.log('Initializing navbar...'); // Debug log
    
    const toggleButton = document.querySelector('.navbar-toggle');
    const navLinks = document.querySelector('.nav-links');
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    const dropdownMenu = document.querySelector('.dropdown');

    console.log('Toggle button:', toggleButton); // Debug log
    console.log('Nav links:', navLinks); // Debug log

    //This should prevent the burger failing on mobile
    if (!toggleButton || !navLinks) {
        console.error('Navbar elements not found. Will retry in 100ms.');
        setTimeout(initializeNavbar, 100);
        return;
    }

    console.log('Adding click event listener...'); // Debug log

    // Toggle mobile menu
    toggleButton.addEventListener('click', (e) => {
        console.log('Burger clicked!'); // Debug log
        e.preventDefault(); // Prevent any default behavior
        navLinks.classList.toggle('active'); // Toggle visibility of nav links
        toggleButton.classList.toggle('active'); // Animate the burger icon
        console.log('Nav links classes:', navLinks.className); // Debug log
    });

    // Only add dropdown handlers if dropdown elements exist
    if (dropdownToggle && dropdownMenu) {
        console.log('Setting up dropdown handlers...'); // Debug log
        
        // Show dropdown on mouse enter
        dropdownToggle.addEventListener('mouseenter', () => {
            dropdownMenu.classList.add('show'); // Show dropdown
        });

        // Hide dropdown when mouse leaves the dropdown or the toggle
        dropdownToggle.addEventListener('mouseleave', () => {
            dropdownMenu.classList.remove('show'); // Hide dropdown
        });

        // Keep dropdown open when hovering over it
        dropdownMenu.addEventListener('mouseenter', () => {
            dropdownMenu.classList.add('show'); // Keep dropdown open
        });

        // Hide dropdown when mouse leaves the dropdown
        dropdownMenu.addEventListener('mouseleave', () => {
            dropdownMenu.classList.remove('show'); // Hide dropdown
        });
    } else {
        console.log('No dropdown elements found'); // Debug log
    }
}

// Call the function when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, calling initializeNavbar...'); // Debug log
    initializeNavbar();
});

// Also add a global function that can be called after the navbar is loaded
window.initNavbar = initializeNavbar;