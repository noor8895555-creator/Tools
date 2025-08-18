const fs = require('fs');
const path = require('path');

// Load manifest
const manifestPath = path.resolve(__dirname, '../manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const tools = manifest.tools || [];

// Template with placeholders {{name}}, {{slug}}, {{description}}, {{icon}}
const templatePath = path.resolve(__dirname, '../templates/tool-template.html');
let template;
try {
    template = fs.readFileSync(templatePath, 'utf8');
} catch (e) {
    console.error('Error reading template file:', e);
    process.exit(1);
}


// Ensure output directory exists
const outDir = path.resolve(__dirname, '../tools');
console.log('Output directory:', outDir);
try {
    if (!fs.existsSync(outDir)) {
        console.log('Creating output directory...');
        fs.mkdirSync(outDir);
        console.log('Output directory created.');
    }
} catch (e) {
    console.error('Error creating output directory:', e);
    process.exit(1);
}

// Generate
tools.forEach(t => {
  const content = template
    .replace(/{{name}}/g, t.name)
    .replace(/{{description}}/g, t.description)
    .replace(/{{icon}}/g, t.icon || '🧰');

  const outPath = path.join(outDir, t.slug);
  try {
    fs.writeFileSync(outPath, content, 'utf8');
    console.log('Generated:', outPath);
  } catch (e) {
    console.error('Error writing file:', outPath, e);
  }
});

console.log('Finished generating tools.');
