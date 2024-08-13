// Links data structure
const linksData = [
    {
        name: "GitHub",
        url: "https://github.com",
        description: "Web-based version-control and collaboration platform for software developers."
    }, 
    {
        name: "Github AI models",
        url: "https://github.com/marketplace/models",
        description: "Playground for GitHub AI models"
    },
    {
        name: "Stack Overflow Developer Survey",
        url: "https://survey.stackoverflow.co/2023/#productivity-impacts-industry-ic",
        description: `In May 2023 over 90,000 developers responded to our annual survey about how they learn and level up,
        which tools they're using, and which ones they want.`
    },
    // Add more links as needed
];
/**
 * Renders a list of links to the page.
 *
 * @return {undefined}
 */
function renderLinks() {
    const linksContainer = document.getElementById('links-container');
    if (!linksContainer) return;

    linksData.forEach(link => {
        const linkDiv = document.createElement('div');
        linkDiv.className = 'link-item';
        
        const nameElement = document.createElement('h2');
        nameElement.textContent = link.name;
        linkDiv.appendChild(nameElement);

        const descriptionElement = document.createElement('p');
        descriptionElement.textContent = link.description;
        linkDiv.appendChild(descriptionElement);

        const linkElement = document.createElement('a');
        linkElement.href = link.url;
        linkElement.target = "_blank";
        linkElement.textContent = "Visit Site";
        linkDiv.appendChild(linkElement);

        linksContainer.appendChild(linkDiv);
    });
}

document.addEventListener('DOMContentLoaded', renderLinks);     