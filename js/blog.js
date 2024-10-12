// Links data structure
const linksData = [
    {
        name: "Interesting Links and Resources",
        url: "interesting_links.html",
        description: `A powerful website that provides consice information about different careers in tech.
        While the information is not in full it provides a fun "guide" style approach that users can check off.`
    }
];
/**
 * Still to add : https://refine.dev/
 * 
 * 
 */
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