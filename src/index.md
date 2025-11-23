---
layout: base.njk
title: Home
---

<div id="header">
    <div id="header-content">
        <div id="heading">
            <h1>Jonathan Shaw - Portfolio</h1>
        </div>
        <div id="description">
            <p>Datapath engineer interested in complex systems, systems engineering, and computer architecture. Currently excited about AI inference cloud solutions and GPU developments. I enjoy applying my skills in software and hardware engineering, combined with critical thinking, to solve complex technical and business challenges.</p>
            <div class="button-container">
                <a href="/assets/CV_Jonathan_Shaw.pdf" target="_blank" class="portfolio-button">Resume</a>
                <a href="https://github.com/JSh4w" target="_blank" class="portfolio-button">Github</a>
                <a href="https://linkedin.com/in/j-m-shaw" target="_blank" class="portfolio-button">Linkedin</a>
            </div>
        </div>
    </div>
    <div id="title-photo">
        <img src="/assets/headshot.png" alt="Jonathan Shaw" class="title-photo">
    </div>
</div>

<div id="projects">
    <h2>Projects</h2>
    {%- for project in collections.projects %}
    <div class="project">
        {%- if project.data.image %}
        <div class="project-image-container">
            {%- if project.data.link %}
            <a href="{{ project.data.link }}" target="_blank">
                <img src="{{ project.data.image }}" alt="{{ project.data.title }} image" class="project-image">
            </a>
            {%- else %}
            <a href="{{ project.url }}">
                <img src="{{ project.data.image }}" alt="{{ project.data.title }} image" class="project-image">
            </a>
            {%- endif %}
        </div>
        {%- endif %}

        <div class="project-content">
            <h3><a href="{{ project.url }}">{{ project.data.title }}</a></h3>
            <p>{{ project.data.brief }}</p>
            <div class="project-links">
                {%- if project.data.link %}
                <a href="{{ project.data.link }}" target="_blank">Link to project</a><br>
                {%- endif %}
                {%- if project.data.github %}
                <a href="{{ project.data.github }}" target="_blank">View on GitHub</a><br>
                {%- endif %}
                <a href="{{ project.url }}">View detailed documentation here</a>
            </div>
        </div>
    </div>
    {%- endfor %}
</div>