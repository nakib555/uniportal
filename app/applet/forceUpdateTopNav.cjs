const fs = require('fs');

function forceUpdate(file) {
  let c = fs.readFileSync(file, 'utf8');

  // Find the exact block starting with {NOTIFICATIONS.map
  // and ending with })}\n                      </div>
  const match = c.match(/\{NOTIFICATIONS\.map\([\s\S]*?\}\)/);
  if (match) {
    const replacement = `{appStore.topNotifications.map(notif => {
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
                         })}`;
                         
    c = c.replace(match[0], replacement);
    fs.writeFileSync(file, c, 'utf8');
    console.log("Fixed NOTIFICATIONS.map in " + file);
  } else {
    console.log("Could not find NOTIFICATIONS.map in " + file);
  }
}

forceUpdate('src/desktop/TopNav.tsx');
forceUpdate('src/components/layout/TopNav.tsx');
