const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const matter = require('gray-matter');

// Directories
const postsDir = path.join(__dirname, 'posts');
const publicDir = path.join(__dirname, 'public');
const outputDir = path.join(__dirname, 'docs');
const partialsDir = path.join(__dirname, 'public', 'partials');

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

      // Parse front matter and content with gray-matter
      const parsed = matter(markdownContent);
      const metadata = parsed.data;
      const contentMarkdown = parsed.content;

      // Convert Markdown content to HTML
      const htmlContent = marked(contentMarkdown);

      // Use metadata.title if available, otherwise derive from filename
      const title = metadata.title || file.replace('.md', '').replace(/-/g, ' ');

      // Read header and footer partials
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

// Generate posts.json for a dynamic blog index using gray-matter metadata
function generatePostsJson() {
  let posts = [];
  fs.readdirSync(postsDir).forEach(file => {
    if (path.extname(file) === '.md') {
      const filePath = path.join(postsDir, file);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const parsed = matter(fileContents);
      const metadata = parsed.data;

      // Use metadata.title if available, else derive title from filename
      const title = metadata.title || file.replace('.md', '').replace(/-/g, ' ');
      const date = metadata.date || '';
      // Construct URL based on the file name
      const url = `/posts/${file.replace('.md', '.html')}`;

      posts.push({ title, date, url });
    }
  });

  // Optionally sort posts by date (assuming date is in dd-mm-yyyy format)
  posts.sort((a, b) => {
    if (a.date && b.date) {
      const [aDay, aMonth, aYear] = a.date.split('-').map(Number);
      const [bDay, bMonth, bYear] = b.date.split('-').map(Number);
      const dateA = new Date(aYear, aMonth - 1, aDay);
      const dateB = new Date(bYear, bMonth - 1, bDay);
      return dateB - dateA; // Newest first
    }
    return 0;
  });

  fs.writeFileSync(path.join(outputDir, 'posts.json'), JSON.stringify(posts, null, 2));
  console.log('Generated posts.json with metadata');
}

// Create .nojekyll file to disable Jekyll processing on GitHub Pages
function addNoJekyll() {
  fs.writeFileSync(path.join(outputDir, '.nojekyll'), '');
  console.log('Added .nojekyll to disable Jekyll processing');
}

// Run build steps
clearOutputDir(outputDir);
copyStaticFiles(publicDir, outputDir);
convertMarkdownFiles();
generatePostsJson();
addNoJekyll();

// Define your custom domain and create the CNAME file
const customDomain = 'cybersondre.no';
fs.writeFileSync(path.join(outputDir, 'CNAME'), customDomain);
console.log('Added CNAME file with custom domain:', customDomain);

console.log('Site build complete! Files are in the docs/ folder.');
