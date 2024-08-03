// Links data structure
const linksData = [
    {
        name: "GitHub",
        url: "https://github.com",
        description: "Web-based version-control and collaboration platform for software developers."
    },
    {
        name: "Stack Overflow",
        url: "https://stackoverflow.com",
        description: "Q&A platform for programmers to find and contribute answers to technical challenges."
    },
    {
        name: "Github AI models",
        url: "https://github.com/marketplace/models",
        description: "Playground for GitHub AI models"
    },
    // Add more links as needed
];
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