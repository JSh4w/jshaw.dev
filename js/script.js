// Porfolio data structure for each project, name, description, link and image
const portfolioData = {
    heading: "Jonathan Shaw - Portfolio",
    description: `A recent engineering graduate with foundations in computer systems
    and a passion for software development. Excited by advancements in AI, data analysis and GPU 
    design I enjoy leveraging my skills in Python, C++, and web technologies,
    along with my experience in verification, to contribute to innovative software projects. `,
    cv: "assets/CV_Jonathan_Shaw.pdf",
    github: "https://github.com/JSh4w",
    linkedin: "https://linkedin.com/in/j-m-shaw",
    titlePhoto: "assets/headshot.png",
    projects: [ 
        {
            name: "Floating Point Arithmetic Tool",
            description: `When working with floating point signals, debugging of datapath components often comes down to
             hand calculations. This programme was made to help with quick conversion of variable width floating point 
             numbers. This project is open source and can be found on github.`,
            link: "https://jsh4w.github.io/",
            github: "https://github.com/JSh4w/JSh4w.github.io",
            image: "assets/float_point_arithmetic_tool.png"
        },
        {
            name: "Python package combining Google Sheets, NLP and Web Scraping",
            description: `This tool helps with easy and safe use of web scraping, outputting the data to a user-defined
            google sheets file. By utilising natural language processing, googlesheets, NumPy and a series python packages this tool
            can help obtain website information in a safe rate-limited way that respects websites robot.txt files. 
            Use of Google's distance matrix API allows users to set custom locations to search for journey times.
            This project is open source and can be found on github.`,
            github: "https://github.com/JSh4w/House_hunter",
            image: "assets/SiteToSheet.png"
        },
        {
            name: "Stock analysis MERN application",
            description: `A MongoDB, Express.js, React.js, Node.js, and C++ application that allows users to analyse stock prices,
            providing a prediction of closing stock values for the next day`,
            github: "https://github.com/JSh4w/stock_analyser",
            image: "assets/stock_analysis.png"
        },
        {
            name: "System Identification and Model-Based Reinforcement Learning for Control of a Soft Robotic Manipulator",
            description: `4th Year project developing machine learning and neural networks to control a soft pendulum. Clicking
            the image will take you to the pdf containing all relevant information.`,
            link: "project_pages/4M25_Robotics.pdf",
            image: "project_pages/4M25_robotics.png"
        },
        {
            name: "Molecular Electronic Devices",
            description:   `4th Year Master's Project on developing molecular devices as an alternative to transistor technology`,
            link: "project_pages/Masters_Thesis_Jonathan_Shaw.pdf",
            image: "project_pages/Masters_Thesis_Jonathan_Shaw.png"
        }
    ]
};

//Creating buttons for resume, linkedin, github etc
function createButton(href, text) {
    const button = document.createElement('a');
    button.href = href;
    button.target = "_blank";
    button.textContent = text;
    button.className = 'portfolio-button';
    return button;
}

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
    
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';

    const resumeButton = createButton(portfolioData.cv, 'Resume');
    const githubButton = createButton(portfolioData.github, 'Github');
    const linkedinButton = createButton(portfolioData.linkedin, 'Linkedin');

    buttonContainer.appendChild(resumeButton);
    buttonContainer.appendChild(githubButton);
    buttonContainer.appendChild(linkedinButton);

    const descriptionContainer = document.createElement('div');
    descriptionContainer.appendChild(descriptionParagraph);
    descriptionContainer.appendChild(buttonContainer);
    
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