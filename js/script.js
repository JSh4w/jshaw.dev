const portfolioData = {
    description: "A recent graduate in Computer Engineering I have a love for all things software, hardware, tech and business. I'm eager to excel in all domains whether its GPU design, SWE in finance or tech consulting.",
    projects: [
        {
            name: "Floating Point Arithmetic Tool",
            description: `When working with binary signals, debugging of datapath components often comes down to
             hand calculations. This small programm was made to help with quick conversion of variable width floating point 
             numbers.`,
            link: "https://jsh4w.github.io/",
            github: "https://github.com/JSh4w/JSh4w.github.io",
            image: "assets/float_point_arithmetic_tool.png"
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
            github: "https://github.com/JSh4w/stock_analyser",
            image: "assets/stock_analysis.png"
        },
        {
            name: "System Identification and Model-Based Reinforcement Learning for Control of a Soft Robotic Manipulator",
            description: "4th Year project developing machine learning and neural networks to control a soft pendulum",
            detailPage: "project_pages/4m25.html"
        }        
    ]
};

function addTextElement(parent, tag, text) {
    if (text) {
        const element = document.createElement(tag);
        element.textContent = text;
        parent.appendChild(element);
    }
}

function addLinkElement(parent, href, text) {
    if (href) {
        const link = document.createElement('a');
        link.href = href;
        link.target = "_blank";
        link.textContent = text;
        parent.appendChild(link);
        parent.appendChild(document.createElement('br'));
    }
}

function addImageElement(parent, src, alt, className) {
    if (src) {
        const img = document.createElement('img');
        img.src = src;
        img.alt = alt;
        img.className = className;
        parent.appendChild(img);
    }
}

function renderPortfolio() {
    const descriptionElement = document.getElementById('description');
    addTextElement(descriptionElement, 'p', portfolioData.description);

    const projectsElement = document.getElementById('projects');

    addImageElement(projectsElement, portfolioData.titlePhoto, "Your Photo", "title-photo");

    portfolioData.projects.forEach(project => {
        const projectDiv = document.createElement('div');
        projectDiv.className = 'project';
        
        addTextElement(projectDiv, 'h2', project.name);
        addTextElement(projectDiv, 'p', project.description);
        addLinkElement(projectDiv, project.link, 'Link to project');
        addLinkElement(projectDiv, project.github, 'View on GitHub');
        addLinkElement(projectDiv, project.detailPage, 'View detailed documentation here');
        addImageElement(projectDiv, project.image, `${project.name} image`, 'project-image');

        projectsElement.appendChild(projectDiv);
    });
}

document.addEventListener('DOMContentLoaded', renderPortfolio);     