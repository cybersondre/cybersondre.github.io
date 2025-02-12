const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const matter = require('gray-matter'); // Import gray-matter

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

// Convert Markdown posts to HTML and output them to docs/posts/
function convertMarkdownFiles() {
    const postsOutputDir = path.join(outputDir, 'posts');
    fs.mkdirSync(postsOutputDir, { recursive: true });

    fs.readdirSync(postsDir).forEach(file => {
        if (path.extname(file) === '.md') {
            const inputPath = path.join(postsDir, file);
            const markdownContent = fs.readFileSync(inputPath, 'utf8');

            // Use gray-matter to parse the front matter and content
            const parsed = matter(markdownContent);
            const metadata = parsed.data;
            const contentMarkdown = parsed.content;

            // Convert Markdown content to HTML
            const htmlContent = marked(contentMarkdown);

            // Use metadata.title if available, otherwise fallback to a title derived from the filename
            const title = metadata.title || file.replace('.md', '').replace(/-/g, ' ');

            // Build the final HTML with a simple template
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
      <a href="/blog.html">Blog</a>
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

            // Write the HTML file into docs/posts/
            const outputFilename = file.replace('.md', '.html');
            const outputPath = path.join(postsOutputDir, outputFilename);
            fs.writeFileSync(outputPath, fullHtml);
            console.log(`Generated ${outputPath}`);
        }
    });
}

// Generate posts.json using gray-matter metadata from each Markdown file
function generatePostsJson() {
    let posts = [];

    // Loop over each Markdown file in postsDir
    fs.readdirSync(postsDir).forEach(file => {
        if (path.extname(file) === '.md') {
            const filePath = path.join(postsDir, file);
            const fileContents = fs.readFileSync(filePath, 'utf8');
            const parsed = matter(fileContents);
            const metadata = parsed.data;

            // Use metadata.title if provided, else derive a title from the filename
            const title = metadata.title || file.replace('.md', '').replace(/-/g, ' ');
            // Use metadata.date if provided
            const date = metadata.date || '';

            // Construct the URL for the post based on the file name
            const url = `/posts/${file.replace('.md', '.html')}`;

            posts.push({
                title,
                date,
                url
            });
        }
    });

    // Optionally, sort posts by date (newest first) if the date field exists
    posts.sort((a, b) => {
        if (a.date && b.date) {
            return new Date(b.date) - new Date(a.date);
        }
        return 0;
    });

    // Write the JSON file into the output folder
    fs.writeFileSync(path.join(outputDir, 'posts.json'), JSON.stringify(posts, null, 2));
    console.log('Generated posts.json with metadata');
}

// Run build steps
clearOutputDir(outputDir);
copyStaticFiles(publicDir, outputDir);
convertMarkdownFiles();
generatePostsJson();

// Create .nojekyll to disable Jekyll processing on GitHub Pages
fs.writeFileSync(path.join(outputDir, '.nojekyll'), '');
console.log('Added .nojekyll to disable Jekyll processing');

console.log('Site build complete! Files are in the docs/ folder.');
