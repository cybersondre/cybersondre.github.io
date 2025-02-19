const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const matter = require('gray-matter'); // if using gray-matter for metadata

// Directories
const postsDir = path.join(__dirname, 'posts');
const publicDir = path.join(__dirname, 'public');
const outputDir = path.join(__dirname, 'docs');
const partialsDir = path.join(__dirname, 'partials');

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

// Convert Markdown posts to HTML and output them to docs/posts/
function convertMarkdownFiles() {
  const postsOutputDir = path.join(outputDir, 'posts');
  fs.mkdirSync(postsOutputDir, { recursive: true });
  
  fs.readdirSync(postsDir).forEach(file => {
    if (path.extname(file) === '.md') {
      const inputPath = path.join(postsDir, file);
      const markdownContent = fs.readFileSync(inputPath, 'utf8');
      
      // Optionally, parse metadata with gray-matter
      const parsed = matter(markdownContent);
      const metadata = parsed.data;
      const contentMarkdown = parsed.content;
      
      // Convert Markdown content to HTML
      const htmlContent = marked(contentMarkdown);
      
      // Use metadata.title if available, otherwise derive from filename
      const title = metadata.title || file.replace('.md', '').replace(/-/g, ' ');
      
      // Read the header and footer partials
      const header = fs.readFileSync(path.join(partialsDir, 'header.html'), 'utf8');
      const footer = fs.readFileSync(path.join(partialsDir, 'footer.html'), 'utf8');
      
      // Build the full HTML page with header, content, and footer
      const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  ${header}
  <main>
    ${htmlContent}
  </main>
  ${footer}
</body>
</html>`;
      
      // Write the HTML file into docs/posts/
      const outputFilename = file.replace('.md', '.html');
      const outputPath = path.join(postsOutputDir, outputFilename);
      fs.writeFileSync(outputPath, fullHtml);
      console.log(`Generated ${outputPath}`);
    }
  });
}

// Optionally, generate posts.json for dynamic blog index (if needed)
// ...

// Generate .nojekyll to disable Jekyll processing on GitHub Pages
function addNoJekyll() {
  fs.writeFileSync(path.join(outputDir, '.nojekyll'), '');
  console.log('Added .nojekyll to disable Jekyll processing');
}

// Run build steps
clearOutputDir(outputDir);
copyStaticFiles(publicDir, outputDir);
convertMarkdownFiles();
addNoJekyll();

console.log('Site build complete! Files are in the docs/ folder.');