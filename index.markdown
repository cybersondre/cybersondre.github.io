---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: home
---

<link rel="stylesheet" href="{{ '/assets/css/styles.css' | relative_url }}">

## Dark Mode Toggle

<button id="theme-toggle">🌙 Dark Mode</button>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    const toggleButton = document.getElementById("theme-toggle");
    const body = document.body;

    // Check for saved theme in localStorage
    if (localStorage.getItem("dark-mode") === "enabled") {
      body.classList.add("dark-mode");
      toggleButton.textContent = "☀️ Light Mode";
    }

    // Toggle Dark Mode
    toggleButton.addEventListener("click", function () {
      body.classList.toggle("dark-mode");

      if (body.classList.contains("dark-mode")) {
        localStorage.setItem("dark-mode", "enabled");
        toggleButton.textContent = "☀️ Light Mode";
      } else {
        localStorage.setItem("dark-mode", "disabled");
        toggleButton.textContent = "🌙 Dark Mode";
      }
    });
  });
</script>
