const fs = require('fs');
const path = require('path');

console.log('Building BnC Partner Portal...');

// Create dist directory
if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist');
}

// Copy HTML files
const htmlFiles = ['index.html', 'login.html', 'partner-dashboard.html', 'admin-dashboard.html'];
htmlFiles.forEach(file => {
    if (fs.existsSync(file)) {
        fs.copyFileSync(file, path.join('dist', file));
        console.log(`Copied ${file}`);
    }
});

// Copy public directory contents
function copyDir(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    
    const entries = fs.readdirSync(src, { withFileTypes: true });
    
    for (let entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        
        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
            console.log(`Copied ${srcPath} to ${destPath}`);
        }
    }
}

if (fs.existsSync('public')) {
    copyDir('public', 'dist');
}

// Copy vercel.json
if (fs.existsSync('vercel.json')) {
    fs.copyFileSync('vercel.json', 'dist/vercel.json');
    console.log('Copied vercel.json');
}

console.log('Build completed successfully!');
console.log('Files are ready in the dist/ directory');