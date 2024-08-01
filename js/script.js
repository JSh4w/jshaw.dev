// Porfolio data structure for each project, name, description, link and image
const portfolioData = {
    heading: "Jonathan Shaw - Portfolio",
    description: `Hello, I am a computer engineer with experience in semiconductor design and an interest in the HW/ SW divide.
    Here is my portfolio. Feel free to look at my`,
    cv: "assets/CV_Jonathan_Shaw.pdf",
    titlePhoto: "assets/headshot.png",
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
            name: "Python tool combining Google Sheets, NLP and Web Scraping",
            description: `Leveraging goole API's and webscraping to extract useful information and process 
            tenant relevant data such as time to work in the morning. Data is then pushed to a google sheet.`,
            github: "https://github.com/JSh4w/House_hunter",
            image: "assets/SiteToSheet.png"
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
            link: "project_pages/4M25_Robotics.pdf",
            image: "assets/4M25_robotics.png"
        }        
    ]
};

//Different elements to be added/ generated for each project
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

function addImageElement(parent, src, alt, className, link) {
    if (src) {
        const imgContainer = document.createElement('div');
        imgContainer.className = 'image-link-container';

        const img = document.createElement('img');
        img.src = src;
        img.alt = alt;
        img.className = className;

        if (link) {
            const anchor = document.createElement('a');
            anchor.href = link;
            anchor.target = "_blank";
            anchor.appendChild(img);
            imgContainer.appendChild(anchor);
        } else {
            imgContainer.appendChild(img);
        }

        parent.appendChild(imgContainer);
    }
}

//main function to render it all 
function renderPortfolio() {

    const headerElement = document.getElementById('header');
    
    const headerContent = document.createElement('div');
    headerContent.id = 'header-content';
    
    const headingElement = document.createElement('div');
    headingElement.id = 'heading';
    
    const descriptionElement = document.createElement('div');
    descriptionElement.id = 'description';
    
    const titlePhotoElement = document.createElement('div');
    titlePhotoElement.id = 'title-photo';

    headerContent.appendChild(headingElement);
    headerContent.appendChild(descriptionElement);
    headerElement.appendChild(headerContent);
    headerElement.appendChild(titlePhotoElement);

    addTextElement(headingElement, 'h1', portfolioData.heading);
    const descriptionParagraph = document.createElement('p');
    descriptionParagraph.textContent = portfolioData.description;
    descriptionElement.appendChild(descriptionParagraph);
    const resumeButton = document.createElement('a');
    resumeButton.href = portfolioData.cv;
    resumeButton.target = "_blank";
    resumeButton.textContent = 'Resume';
    resumeButton.className = 'resume-button';
    descriptionParagraph.appendChild(resumeButton);
    addImageElement(titlePhotoElement, portfolioData.titlePhoto, "Your Photo", "title-photo");

    const projectsElement = document.getElementById('projects');

    portfolioData.projects.forEach(project => {
        const projectDiv = document.createElement('div');
        projectDiv.className = 'project';
        
        if (project.image) {
            const imageContainer = document.createElement('div');
            imageContainer.className = 'project-image-container';
            // Use project.link as the first choice, then project.github if link doesn't exist
            const linkToUse = project.link || project.github || null;
            addImageElement(imageContainer, project.image, `${project.name} image`, 'project-image', linkToUse);
            projectDiv.appendChild(imageContainer);
        }

        const projectContent = document.createElement('div');
        projectContent.className = 'project-content';
        
        addTextElement(projectContent, 'h2', project.name);
        addTextElement(projectContent, 'p', project.description);
        addLinkElement(projectContent, project.link, 'Link to project');
        addLinkElement(projectContent, project.github, 'View on GitHub');
        addLinkElement(projectContent, project.detailPage, 'View detailed documentation here');
        
        projectDiv.appendChild(projectContent);

        projectsElement.appendChild(projectDiv);
    });
    
}

document.addEventListener('DOMContentLoaded', renderPortfolio);     