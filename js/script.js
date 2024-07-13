const portfolioData = {
    description: "I'm a passionate developer interested in creating innovative solutions.",
    projects: [
        {
            name: "Project 1",
            description: "A web application for task management",
            link: "https://github.com/username/project1"
        },
        {
            name: "Project 2",
            description: "An AI-powered chatbot for customer service",
            link: "https://github.com/username/project2"
        }
    ]
};

function renderPortfolio() {
    const descriptionElement = document.getElementById('description');
    descriptionElement.textContent = portfolioData.description;

    const projectsElement = document.getElementById('projects');
    portfolioData.projects.forEach(project => {
        const projectDiv = document.createElement('div');
        projectDiv.className = 'project';
        projectDiv.innerHTML = `
            <h2>${project.name}</h2>
            <p>${project.description}</p>
            <a href="${project.link}" target="_blank">View on GitHub</a>
        `;
        projectsElement.appendChild(projectDiv);
    });
}

document.addEventListener('DOMContentLoaded', renderPortfolio);