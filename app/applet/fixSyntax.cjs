const fs = require('fs');

function fixSyntax(file) {
  let c = fs.readFileSync(file, 'utf8');
  c = c.replace(/\{\s*appStore\.topNotifications\.length === 0 && \(\s*<div className="p-6 text-center text-stone-500 text-sm">No new notifications<\/div>\s*\)\}\}\}/g, 
    `}
                             {appStore.topNotifications.length === 0 && (
                               <div className="p-6 text-center text-stone-500 text-sm">No new notifications</div>
                             )}`);
                             
  fs.writeFileSync(file, c, 'utf8');
  console.log("Fixed syntax in " + file);
}

fixSyntax('src/desktop/TopNav.tsx');
fixSyntax('src/components/layout/TopNav.tsx');
