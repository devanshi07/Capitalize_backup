// run cmd in terminal node generateImageIndex.js
const fs = require('fs');
const path = require('path');

// Directory paths
const imageDirectory = path.join(__dirname, 'src/images');
const secondaryImageDirectory = path.join(__dirname, 'src/images');
const outputPath = path.join(imageDirectory, 'index.js');

// Helper function to create variable names
const createVariableName = (fileName) => {
  return fileName
    .replace(/(\.[\w\d_-]+)$/i, '') // remove file extension
    .replace(/[^a-zA-Z0-9]/g, '_'); // replace non-alphanumeric characters with '_'
};

// Scan primary image directory
fs.readdir(imageDirectory, (err, primaryFiles) => {
  if (err) {
    return console.log('Unable to scan directory: ' + err);
  }

  // Scan secondary image directory
  fs.readdir(secondaryImageDirectory, (err, secondaryFiles) => {
    if (err) {
      return console.log('Unable to scan secondary directory: ' + err);
    }

    // Combine files from both directories
    const allFiles = [...primaryFiles, ...secondaryFiles];

    // Create export statements
    const exportStatements = allFiles
      .filter(file => /\.(png|jpe?g|gif|svg)$/.test(file))
      .map(file => {
        const variableName = createVariableName(file);
        const relativePath = file.includes('images') ? `../images/${file}` : `./${file}`;
        return `  ${variableName}: require('${relativePath}'),`;
      })
      .join('\n');

    // Generate the final content
    const fileContent = `const images = {\n${exportStatements}\n};\nexport default images;\n`;

    // Write to index.js file
    fs.writeFile(outputPath, fileContent, err => {
      if (err) {
        return console.log('Error writing file: ' + err);
      }
      console.log('index.js file has been created');
    });
  });
});
