---
layout: page
title: Blog
permalink: /blog/
---

<link rel="stylesheet" href="{{ '/assets/css/styles.css' | relative_url }}">
<ul>
  {% for post in site.posts %}
    <li>
      <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
  {% endfor %}
</ul>

<div class="posts-grid">
  {% for post in site.posts %}
    <div class="post-block">
      <h2><a href="{{ post.url }}">{{ post.title }}</a></h2>
      <p>{{ post.date | date: "%B %d, %Y" }}</p>
    </div>
  {% endfor %}
</div>