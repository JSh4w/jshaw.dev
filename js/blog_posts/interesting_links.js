// Links data structure
const IMAGE_BASE_PATH = "../assets/interesting_links" ;
const linksData = [
    { 
        name: "Animejs",
        url: "https://animejs.com/",
        description: "A animation library for use with React, one of the most impressive demonstrations of dynamic animations on a static web page",
        image: `${IMAGE_BASE_PATH}/animejs.png`
    },
    {
        name: "Roadmaps",
        url: "https://roadmap.sh/",
        description: `A powerful website that provides consice information about different careers in tech.
        While the information is not in full it provides a fun "guide" style approach that users can check off.`,
        image: `${IMAGE_BASE_PATH}/roadmap.png`
    }, 
    {
        name: "First Timers Only Blog",
        url: "https://kentcdodds.com/blog/first-timers-only",
        description: `A blog by Kent C. Dodds that aims to help first time programmers get onto open source projects.
        Namely, I believe this helped start the "first-timers-only" tags on Github along with subesquent variations of the tag.`,
        image: `${IMAGE_BASE_PATH}/first_timers_only.png`
    },
    {
        name: "Stack Overflow Developer Survey",
        url: "https://survey.stackoverflow.co/2023/#productivity-impacts-industry-ic",
        description: `In May 2023 over 90,000 developers responded to our annual survey about how they learn and level up,
        which tools they're using, and which ones they want.`,
        image: `${IMAGE_BASE_PATH}/stack_overflow_developer_survey.png`
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
function addImageElement(parent, src, alt, className, link_) {
    if (src) {
        const imgContainer = document.createElement('div');
        imgContainer.className = 'image-link-container';

        const img = document.createElement('img');
        img.src = src;
        img.alt = alt;
        img.className = className;

        if (link_) {
            const anchor = document.createElement('a');
            anchor.href = link_;
            anchor.target = "_blank";
            anchor.appendChild(img);
            imgContainer.appendChild(anchor);
        } else {
            imgContainer.appendChild(img);
        }

        parent.appendChild(imgContainer);
    }
}

function renderLinks() {
    const linksContainer = document.getElementById('links-container');
    if (!linksContainer) return;

    linksData.forEach(link => {
        const linkDiv = document.createElement('div');
        linkDiv.className = 'link-item';

        if (link.image) {
            const imageContainer = document.createElement('div');
            imageContainer.className = 'link-image';
            addImageElement(imageContainer, link.image, `${link.name} image`, 'link-image', link.url);
            linkDiv.appendChild(imageContainer);
        }
        
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