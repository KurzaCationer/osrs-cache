const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DOCS_DIR = 'reference-material/docs';
const REQUIRED_FIELDS = ['source_url', 'archived_at', 'summary', 'version'];

function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(file));
    } else if (file.endsWith('.md')) {
      results.push(file);
    }
  });
  return results;
}

function verifyMetadata() {
  if (!fs.existsSync(DOCS_DIR)) {
    console.log('Docs directory does not exist yet.');
    return;
  }
  
  const files = getFiles(DOCS_DIR);
  let allPassed = true;

  if (files.length === 0) {
    console.log('No documentation files found to verify.');
    return;
  }

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    
    // Check Frontmatter
    const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!frontmatterMatch) {
      console.error(`FAIL: ${file} has no YAML frontmatter.`);
      allPassed = false;
    } else {
      const frontmatter = frontmatterMatch[1];
      const missingFields = REQUIRED_FIELDS.filter(field => !frontmatter.includes(field + ':'));
      if (missingFields.length > 0) {
        console.error(`FAIL: ${file} is missing fields: ${missingFields.join(', ')}`);
        allPassed = false;
      }
    }

    // Check Links
    const linkRegex = /\[.*?\]\((.*?)\)/g;
    let match;
    while ((match = linkRegex.exec(content)) !== null) {
      const url = match[1];
      if (!url || url.trim() === '') {
        console.error(`FAIL: ${file} has an empty link.`);
        allPassed = false;
      }
    }
    
    // Check Markdown format (basic)
    if (!file.endsWith('.md')) {
      console.error(`FAIL: ${file} is not a .md file.`);
      allPassed = false;
    }
  }

  if (!allPassed) {
    process.exit(1);
  }
}

verifyMetadata();