const fs = require('fs');
const path = require('path');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.jsx')) {
            let content = fs.readFileSync(fullPath, 'utf-8');
            let originalContent = content;

            const tagRegex = /<([a-zA-Z0-9]+)[^>]*\bonClick=[^>]*>/g;
            content = content.replace(tagRegex, (match, tagName) => {
                if (['Button', 'button', 'a', 'Link', 'AlertBox', 'Alert'].includes(tagName)) return match;
                if (match.includes('cursor-pointer') || match.includes('cursor-default')) return match;

                if (match.includes('className="')) {
                    return match.replace('className="', 'className="cursor-pointer ');
                } else if (match.includes("className={'")) {
                    return match.replace("className={'", "className={'cursor-pointer ");
                } else if (match.includes('className={`')) {
                    return match.replace('className={`', 'className={`cursor-pointer ');
                } else if (match.includes('className={')) {
                    return match.replace('className={', 'className={`cursor-pointer ` + ');
                } else {
                    return match.replace('onClick=', 'className="cursor-pointer" onClick=');
                }
            });

            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content, 'utf-8');
                console.log('Updated', fullPath);
            }
        }
    }
}

// process.cwd() is /app/applet normally.
processDir(path.join(process.cwd(), 'src'));
