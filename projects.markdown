---
layout: page
title: Projects
permalink: /projects/
---

<link rel="stylesheet" href="{{ '/assets/css/styles.css' | relative_url }}">

<div class="projects-grid">
  {% for post in site.posts %}
    {% if post.category == "project" %}
      <div class="project-block">
        <h2><a href="{{ post.url }}">{{ post.title }}</a></h2>
        <p>{{ post.date | date: "%B %d, %Y" }}</p>
      </div>
    {% endif %}
  {% endfor %}
</div>
