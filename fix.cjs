const fs = require('fs');
const path = require('path');

function replaceInDir(dir, replacements) {
    fs.readdirSync(dir, { withFileTypes: true }).forEach(ent => {
        const fullPath = path.join(dir, ent.name);
        if (ent.isDirectory()) {
            replaceInDir(fullPath, replacements);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;
            for (const [from, to] of replacements) {
                if (content.includes(from)) {
                    // Use a regular expression with global flag to replace all occurrences.
                    // Important: be careful since the from string might contain regex special chars, 
                    // However for path strings it's fine except for periods which we should escape or just use split.join.
                    content = content.split(from).join(to);
                    modified = true;
                }
            }
            if (modified) {
                fs.writeFileSync(fullPath, content);
                console.log(`Updated ${fullPath}`);
            }
        }
    });
}

replaceInDir('src/views', [
    ['../../hooks/', '../hooks/'],
    ['../../data', '../data'],
    ['../../components/', '../components/'],
    ['../components/ui/Card', '../components/ui/card'],
    ['../components/ui/Badge', '../components/ui/badge']
]);

replaceInDir('src/views/admin', [
    ['../../../components/', '../../components/'],
    ['../../../store', '../../store'],
    ['../../../data', '../../data'],
    ['../../components/ui/Card', '../../components/ui/card'],
    ['../../components/ui/Badge', '../../components/ui/badge']
]);

// Also MobileLayout and DesktopLayout moved, so they need fixes.
replaceInDir('src/components/layout', [
    ['./data', '../../data'],
    ['./components/', '../'],
    ['./views/', '../../views/'],
    ['./desktop/views/', '../../views/'],
    ['./desktop/navData', '../../data/navData'],
    ['./hooks/', '../../hooks/'],
    ['./store', '../../store'],
    ['../views/', '../../views/'],
    ['../hooks/', '../../hooks/']
]);

