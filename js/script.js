const portfolioData = {
    description: "I'm a passionate developer interested in creating innovative solutions.",
    projects: [
        {
            name: "Floating Point Arithmetic Tool",
            description: `When working with binary signals, debugging of datapath components often comes down to
             hand calculations. This small programm was made to help with quick conversion of variable width floating point 
             numbers.`,
            link: "https://jsh4w.github.io/",
            github: "https://github.com/JSh4w/JSh4w.github.io"
        },
        {
            name: "Python tool for hunting rental properties in London",
            description: `Leveraging goole API's and webscraping to extract useful information and process 
            tenant relevant data such as time to work in the morning. Data is then pushed to a google sheet.`,
            github: "https://github.com/JSh4w/House_hunter"
        },
        {
            name: "Stock analysis MERN application",
            description: `Simply collection and analysis of time series stock data via a web application`,
            github: "https://github.com/JSh4w/stock_analyser"
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
        
        let projectHTML = '';
        
        if (project.name) {
            projectHTML += `<h2>${project.name}</h2>`;
        }
        
        if (project.description) {
            projectHTML += `<p>${project.description}</p>`;
        }
        
        if (project.link) {
            projectHTML += `<a href="${project.link}" target="_blank">Link to project / more information</a>`;
        }
        
        if (project.github) {
            projectHTML += `<a href="${project.github}" target="_blank">View on GitHub</a>`;
        }
        
        projectDiv.innerHTML = projectHTML;
        projectsElement.appendChild(projectDiv);
    });
}

document.addEventListener('DOMContentLoaded', renderPortfolio);