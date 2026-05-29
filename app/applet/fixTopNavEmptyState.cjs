const fs = require('fs');

function addEmptyState(file) {
  if (!fs.existsSync(file)) return;
  let c = fs.readFileSync(file, 'utf8');

  if (!c.includes('No new notifications')) {
    c = c.replace(/\{\s*\appStore\.topNotifications\.map.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n\s*\}\)/s, (match) => {
      return match + `\n                             {appStore.topNotifications.length === 0 && (
                               <div className="p-6 text-center text-stone-500 text-sm">No new notifications</div>
                             )}`;
    });
    
    // Add "Clear All" button
    if (!c.includes('clearAllTopNotifications')) {
      c = c.replace(/<\/div>\s*<\/motion.div>/s, `</div>\n                          <div className="p-3 bg-stone-50 dark:bg-stone-900/50 border-t border-stone-200 dark:border-stone-800">
                             <button onClick={() => appStore.clearAllTopNotifications()} className="w-full py-2 text-sm font-semibold text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors">Clear All</button>
                          </div>\n                       </motion.div>`);
    }

    fs.writeFileSync(file, c, 'utf8');
    console.log("Updated empty state in " + file);
  }
}

addEmptyState('src/desktop/TopNav.tsx');
addEmptyState('src/components/layout/TopNav.tsx');
