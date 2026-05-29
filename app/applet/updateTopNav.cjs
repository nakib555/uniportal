const fs = require('fs');

function updateTopNav(file) {
  if (!fs.existsSync(file)) return;
  let c = fs.readFileSync(file, 'utf8');

  // remove NOTIFICATIONS array completely
  c = c.replace(/const NOTIFICATIONS = \[\s*\{ id: 1[\s\S]*?\];\n*/, '');

  // Add useAppStore import
  if (!c.includes("import { useAppStore } from")) {
    const importPath = file.includes('desktop') ? '../store' : '../../store';
    c = c.replace(/import { usePortalLogic } from '[^']+';/, `import { usePortalLogic } from '${file.includes('desktop') ? '../hooks/usePortalLogic' : '../../hooks/usePortalLogic'}';\nimport { useAppStore } from '${importPath}';`);
  }

  // Use topNotifications inside TopNav
  // Find where TopNav starts
  if (c.includes("const { store, toggleDarkMode, profilePic } = portal;")) {
    c = c.replace("const { store, toggleDarkMode, profilePic } = portal;", "const { store, toggleDarkMode, profilePic } = portal;\n  const appStore = useAppStore();");
  }

  // Update notification rendering
  c = c.replace(/\{NOTIFICATIONS\.map\(notif => \{[\s\S]*?return \([\s\S]*?<Icon className="w-5 h-5" \/>[\s\S]*?\([\s\S]*?\n\s*\}\)\}/, `{appStore.topNotifications.map(notif => {
                            const Icon = notif.type === 'alert' ? AlertCircle :
                                         notif.type === 'success' ? CheckCircle2 :
                                         notif.type === 'info' ? Info : Calendar;
                            return (
                               <div key={notif.id} onClick={() => appStore.removeTopNotification(notif.id)} className="p-4 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors flex gap-4 cursor-pointer group">
                                  <div className={\`w-10 h-10 rounded-full flex items-center justify-center bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shrink-0 \${notif.color}\`}>
                                     <Icon className="w-5 h-5" />
                                  </div>
                                  <div>
                                     <h4 className={\`font-bold text-sm transition-colors \${notif.read ? 'text-stone-500' : 'text-stone-900 dark:text-white group-hover:text-[#8c1515] dark:group-hover:text-[#ef4444]'}\`}>{notif.title}</h4>
                                     <p className="text-sm text-stone-500 dark:text-stone-400 mt-0.5 line-clamp-2">{notif.desc}</p>
                                     <span className="text-xs text-stone-400 mt-2 block font-medium">{notif.time}</span>
                                  </div>
                               </div>
                            )
                         })}`);

  // Update mark all as read button
  c = c.replace(/<button className="text-xs text-\[#8c1515\].*?Mark all as read<\/button>/, `<button onClick={() => appStore.markAllTopNotificationsAsRead()} className="text-xs text-[#8c1515] dark:text-[#ef4444] font-medium hover:underline">Mark all as read</button>`);

  // Update bell red dot icon to only show if there are unread notifications
  c = c.replace(/{!showNotifications && <span className="absolute top-1\.5 right-1\.5[^>]+><\/span>}/, `{!showNotifications && appStore.topNotifications.some(n => !n.read) && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#8c1515] dark:bg-[#ef4444] rounded-full ring-2 ring-white dark:ring-stone-900 border-none inline-block"></span>}`);

  fs.writeFileSync(file, c, 'utf8');
  console.log("Updated " + file);
}

updateTopNav('src/desktop/TopNav.tsx');
updateTopNav('src/components/layout/TopNav.tsx');

