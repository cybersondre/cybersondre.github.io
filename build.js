const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

// Directories
const postsDir = path.join(__dirname, 'posts');
const publicDir = path.join(__dirname, 'public');
const outputDir = path.join(__dirname, 'docs');

// Clear the output directory
function clearOutputDir(dir) {
    if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true, force: true });
    }
    fs.mkdirSync(dir, { recursive: true });
}

// Copy static files from public/ to docs/
function copyStaticFiles(src, dest) {
    fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach(file => {
        const srcPath = path.join(src, file);
        const destPath = path.join(dest, file);
        if (fs.statSync(srcPath).isDirectory()) {
            copyStaticFiles(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    });
}

// Convert Markdown posts to HTML
function convertMarkdownFiles() {
    const postsOutputDir = path.join(outputDir, 'posts');
    fs.mkdirSync(postsOutputDir, { recursive: true });
    fs.readdirSync(postsDir).forEach(file => {
        if (path.extname(file) === '.md') {
            const inputPath = path.join(postsDir, file);
            const outputFilename = file.replace('.md', '.html');
            const outputPath = path.join(postsOutputDir, outputFilename);
            const markdownContent = fs.readFileSync(inputPath, 'utf8');
            const htmlContent = marked(markdownContent);
            const title = path.basename(file, '.md').replace(/-/g, ' ');
            const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <header>
    <h1>${title}</h1>
    <nav>
      <a href="/index.html">Home</a>
      <a href="/about.html">About</a>
    </nav>
  </header>
  <main>
    ${htmlContent}
  </main>
  <footer>
    <p>&copy; 2025 Your Name</p>
  </footer>
</body>
</html>`;
            fs.writeFileSync(outputPath, fullHtml);
            console.log(`Generated ${outputPath}`);
        }
    });
}

// Run build steps
clearOutputDir(outputDir);
copyStaticFiles(publicDir, outputDir);
convertMarkdownFiles();

// Create .nojekyll to disable Jekyll processing on GitHub Pages
fs.writeFileSync(path.join(outputDir, '.nojekyll'), '');
console.log('Added .nojekyll to disable Jekyll processing');

console.log('Site build complete! Files are in the docs/ folder.');
