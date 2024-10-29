---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: home
---

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{ page.title }}</title>
  <link rel="stylesheet" href="{{ '/assets/css/styles.css' | relative_url }}">
</head>
<body>

  <button class="mode-toggle" id="dark-mode-toggle">Switch to Dark Mode</button>

  <script>
    const toggleButton = document.getElementById('dark-mode-toggle');
    const body = document.body;

    if (localStorage.getItem('dark-mode') === 'enabled') {
      body.classList.add('dark-mode');
      toggleButton.textContent = 'Switch to Light Mode';
    }

    toggleButton.addEventListener('click', function() {
      body.classList.toggle('dark-mode');

      if (body.classList.contains('dark-mode')) {
        toggleButton.textContent = 'Switch to Light Mode';
        localStorage.setItem('dark-mode', 'enabled');
      } else {
        toggleButton.textContent = 'Switch to Dark Mode';
        localStorage.setItem('dark-mode', 'disabled');
      }
    });
  </script>

</body>
</html>
