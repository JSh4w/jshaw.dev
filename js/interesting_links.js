// Links data structure
const linksData = [
    {
        name: "Roadmaps",
        url: "https://roadmap.sh/",
        description: `A powerful website that provides consice information about different careers in tech.
        While the information is not in full it provides a fun "guide" style approach that users can check off.`
    }, 
    {
        name: "First Timers Only Blog",
        url: "https://kentcdodds.com/blog/first-timers-only",
        description: `A blog by Kent C. Dodds that aims to help first time programmers get onto open source projects.
        Namely, I believe this helped start the "first-timers-only" tags on Github along with subesquent variations of the tag.`
    },
    {
        name: "Stack Overflow Developer Survey",
        url: "https://survey.stackoverflow.co/2023/#productivity-impacts-industry-ic",
        description: `In May 2023 over 90,000 developers responded to our annual survey about how they learn and level up,
        which tools they're using, and which ones they want.`
    },
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