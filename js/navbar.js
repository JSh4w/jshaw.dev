function initializeNavbar() {
    const toggleButton = document.querySelector('.navbar-toggle');
    const navLinks = document.querySelector('.nav-links');
    const dropdownParent = document.querySelector('li[style*="position: relative"]');
    const dropdownMenu = document.querySelector('.dropdown');

    if (!toggleButton || !navLinks) return;

    // Mobile menu toggle
    toggleButton.addEventListener('click', (e) => {
        e.preventDefault();
        navLinks.classList.toggle('active');
        toggleButton.classList.toggle('active');
    });

    // Dropdown handling
    if (dropdownParent && dropdownMenu) {
        // Desktop hover
        dropdownParent.addEventListener('mouseenter', () => {
            if (window.innerWidth > 768) dropdownMenu.classList.add('show');
        });

        dropdownParent.addEventListener('mouseleave', () => {
            if (window.innerWidth > 768) dropdownMenu.classList.remove('show');
        });

        // Mobile click for blog link
        const blogLink = dropdownParent.querySelector('a[href*="links.html"]');
        if (blogLink) {
            blogLink.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    dropdownMenu.classList.toggle('show');
                }
            });
        }
    }

    // Close mobile menu on outside click
    document.addEventListener('click', (e) => {
        const navbar = document.querySelector('#navbar');
        if (navbar && !navbar.contains(e.target) && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            toggleButton.classList.remove('active');
        }
    });

    // Reset on resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            navLinks.classList.remove('active');
            toggleButton.classList.remove('active');
            if (dropdownMenu) dropdownMenu.classList.remove('show');
        }
    });
}

document.addEventListener('DOMContentLoaded', initializeNavbar);