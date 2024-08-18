// Porfolio data structure for each project, name, description, link and image
const portfolioData = {
    heading: "Jonathan Shaw - Portfolio",
    description: `I am a recent engineering graduate with a strong foundation in computer systems
    and a passion for software development. Seeking a challenging Software Engineer position to
    leverage my skills in Python, C++, and web technologies,
    along with my experience in verification, to contribute to innovative software projects. `,
    cv: "assets/CV_Jonathan_Shaw.pdf",
    titlePhoto: "assets/headshot.png",
    projects: [
        {
            name: "Floating Point Arithmetic Tool",
            description: `When working with binary signals, debugging of datapath components often comes down to
             hand calculations. This programme was made to help with quick conversion of variable width floating point 
             numbers. This project is open source and can be found on github.`,
            link: "https://jsh4w.github.io/",
            github: "https://github.com/JSh4w/JSh4w.github.io",
            image: "assets/float_point_arithmetic_tool.png"
        },
        {
            name: "Python package combining Google Sheets, NLP and Web Scraping",
            description: `Web scraping: a powerful method of data extraction for companies and software engineers 
            to gain insights over the internet. However often lying in a grey area this tool helps with easy and safe use
            of web scraping. Utilising natural language processing, googlesheets, numpy and a series python packages this 
            tool can help obtain website information in a safe rate-limited way that respects websites robot.txt files.
            Leveraging goole API's to provide the ability to use google sheets with custom header commands that help with
            location finding (through geocoding and a distance matrix API), cost extraction and other typical web scraping desires
            this tool is a simplistic solution for web scraping. This project is open source and can be found on github.`,
            github: "https://github.com/JSh4w/House_hunter",
            image: "assets/SiteToSheet.png"
        },
        {
            name: "Stock analysis MERN application",
            description: `Applying various filters for data analysis of time series stock data via a web application`,
            github: "https://github.com/JSh4w/stock_analyser",
            image: "assets/stock_analysis.png"
        },
        {
            name: "System Identification and Model-Based Reinforcement Learning for Control of a Soft Robotic Manipulator",
            description: `4th Year project developing machine learning and neural networks to control a soft pendulum. Clicking
            the image will take you to the pdf containing all relevant information.`,
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

/** 
 * Creates a new link element and appends it to the parent element.
 *
 * @param {HTMLElement} parent - The parent element to append the link to.
 * @param {string} href - The URL of the link.
 * @param {string} text - The text content of the link.
 * @return {undefined}
 */
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

/**
 * Creates a new image element and appends it to the parent element.
 * The image can optionally be wrapped in a link element.
 *
 * @param {HTMLElement} parent - The parent element to append the image to.
 * @param {string} src - The source URL of the image.
 * @param {string} alt - The alt text of the image.
 * @param {string} className - The class name of the image.
 * @param {string} link - The URL of the link to wrap the image in.
 * @return {undefined}
 */
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


/**
 * Renders the portfolio page by creating and populating the necessary HTML elements.
 * 
 * @return {undefined}
 */
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
    
    const resumeButton = document.createElement('a');
    resumeButton.href = portfolioData.cv;
    resumeButton.target = "_blank";
    resumeButton.textContent = 'Resume';
    resumeButton.className = 'resume-button';
    
    const descriptionContainer = document.createElement('div');
    descriptionContainer.appendChild(descriptionParagraph);
    descriptionContainer.appendChild(resumeButton);
    
    descriptionElement.appendChild(descriptionContainer);
    
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