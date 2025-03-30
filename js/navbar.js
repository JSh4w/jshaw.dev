function initializeNavbar() {
    const toggleButton = document.querySelector('.navbar-toggle');
    const navLinks = document.querySelector('.nav-links');
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    const dropdownMenu = document.querySelector('.dropdown');

    //This should prevent the burger failing on mobile
    if (!toggleButton || !navLinks) {
        console.error('Navbar elements not found. Will retry in 100ms.');
        setTimeout(initializeNavbar, 100);
        return;
    }

    // Toggle mobile menu
    toggleButton.addEventListener('click', () => {
        navLinks.classList.toggle('active'); // Toggle visibility of nav links
    });

    // Only add dropdown handlers if dropdown elements exist
    if (dropdownToggle && dropdownMenu) {
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
    }
}

// Call the function when the DOM is loaded
document.addEventListener('DOMContentLoaded', initializeNavbar);

// Also add a global function that can be called after the navbar is loaded
window.initNavbar = initializeNavbar;