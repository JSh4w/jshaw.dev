---
layout: base.njk
title: Home
---

<section class="page hero" id="top">
  <div>
    <h1>Jonathan Shaw</h1>
    <p class="hero-intro">Engineer @ <a href="https://anqa.ai" target="_blank">Anqa</a>, working on multi-user complex workflows. Previously worked on GPUs @ <a href="https://www.imaginationtech.com" target="_blank">imagination</a> on the Datapath team, doing critical path modelling and verification. Currently interested in AI &amp; HPC chips, as well as post-training AI optimisations.</p>
    <div class="hero-links">
      <a href="/assets/Curriculum_Vitae_Jonathan_Shaw_2025.pdf" target="_blank" class="label">Resume</a>
      <a href="https://github.com/JSh4w" target="_blank" class="label">Github</a>
      <a href="https://linkedin.com/in/j-m-shaw" target="_blank" class="label">Linkedin</a>
    </div>
  </div>
  <div class="hero-photo">
    <img src="/assets/headshot.png" alt="Jonathan Shaw" width="320" height="380">
  </div>
</section>

<section class="page work" id="work">
  <div class="section-head">
    <h2>Selected work</h2>
    <p class="section-count">{{ collections.projects | length }} projects</p>
  </div>

  {%- for project in collections.projects %}
  <article class="project">
    <a href="{{ project.url }}" class="project-thumb">
      <img src="{{ project.data.image }}" alt="{{ project.data.title }}" loading="lazy" decoding="async" width="600" height="330">
    </a>
    <div>
      <h3><a href="{{ project.url }}">{{ project.data.title }}</a></h3>
      <p class="project-brief">{{ project.data.brief }}</p>
      {%- if project.data.tags %}
      <p class="project-tags">{{ project.data.tags | join(" | ") }}</p>
      {%- endif %}
      <div class="project-links">
        {%- if project.data.link %}
        <a href="{{ project.data.link }}" target="_blank" class="label is-live">Live</a>
        {%- endif %}
        {%- if project.data.github %}
        <a href="{{ project.data.github }}" target="_blank" class="label">Source</a>
        {%- endif %}
        <a href="{{ project.url }}" class="label">Documentation</a>
      </div>
    </div>
  </article>
  {%- endfor %}
</section>
