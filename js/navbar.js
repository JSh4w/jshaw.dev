document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.querySelector('.navbar-toggle');
    const navLinks = document.querySelector('.nav-links');
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    const dropdownMenu = document.querySelector('.dropdown');

    // Toggle mobile menu
    toggleButton.addEventListener('click', () => {
        navLinks.classList.toggle('active'); // Toggle visibility of nav links
    });

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
});