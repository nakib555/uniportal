const fs = require('fs');

function fixMobileTopNav(file) {
  if (!fs.existsSync(file)) return;
  let c = fs.readFileSync(file, 'utf8');

  // Add state for notifications
  if (!c.includes('const [showNotifications, setShowNotifications] = useState(false);')) {
    c = c.replace(/const \[isMobileMenuOpen, setIsMobileMenuOpen\] = useState\(false\);/, 
        `const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);`);
  }

  // Find the button
  const oldButton = `<button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 dark:text-stone-400 relative transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-[#8c1515] dark:bg-[#ef4444] rounded-full ring-2 ring-white dark:ring-stone-900"></span>
              </button>`;
              
  const oldButtonRegex = /<button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 dark:text-stone-400 relative transition-colors">\s*<Bell className="w-5 h-5" \/>\s*<span className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-\[#8c1515\] dark:bg-\[#ef4444\] rounded-full ring-2 ring-white dark:ring-stone-900"><\/span>\s*<\/button>/;

  const replaceStr = `<div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={\`w-9 h-9 flex items-center justify-center rounded-full relative transition-colors \${showNotifications ? 'bg-[#8c1515] text-white dark:bg-[#ef4444]' : 'hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 dark:text-stone-400'}\`}
                >
                  <Bell className="w-5 h-5" />
                  {!showNotifications && store.topNotifications.some(n => !n.read) && <span className="absolute top-2 right-2 w-2 h-2 bg-[#8c1515] dark:bg-[#ef4444] rounded-full ring-2 ring-white dark:ring-stone-900 border-none inline-block"></span>}
                </button>
                
                <AnimatePresence>
                   {showNotifications && (
                     <>
                       <div className="cursor-pointer fixed inset-0 z-40" onClick={() => setShowNotifications(false)}></div>
                       <motion.div 
                         initial={{ opacity: 0, y: 10, scale: 0.95 }}
                         animate={{ opacity: 1, y: 0, scale: 1 }}
                         exit={{ opacity: 0, y: 10, scale: 0.95 }}
                         transition={{ duration: 0.15 }}
                         className="absolute top-full right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-stone-900 rounded-2xl shadow-xl shadow-stone-200/50 dark:shadow-black/50 border border-stone-200 dark:border-stone-800 z-50 overflow-hidden"
                       >
                          <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex justify-between items-center bg-stone-50/50 dark:bg-stone-900/50">
                             <h3 className="font-bold text-stone-900 dark:text-white">Notifications</h3>
                             <button onClick={() => store.markAllTopNotificationsAsRead()} className="text-xs text-[#8c1515] dark:text-[#ef4444] font-medium hover:underline">Mark all as read</button>
                          </div>
                          <div className="max-h-[400px] overflow-y-auto divide-y divide-stone-100 dark:divide-stone-800">
                             {store.topNotifications.map(notif => {
                                const Icon = notif.type === 'alert' ? AlertCircle :
                                             notif.type === 'success' ? CheckCircle2 :
                                             notif.type === 'info' ? Info : Calendar;
                                return (
                                   <div key={notif.id} onClick={() => store.removeTopNotification(notif.id)} className="p-4 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors flex gap-4 cursor-pointer group">
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
                             })}
                             {store.topNotifications.length === 0 && (
                               <div className="p-6 text-center text-stone-500 text-sm">No new notifications</div>
                             )}
                          </div>
                          <div className="p-3 bg-stone-50 dark:bg-stone-900/50 border-t border-stone-200 dark:border-stone-800">
                             <button onClick={() => store.clearAllTopNotifications()} className="w-full py-2 text-sm font-semibold text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors">Clear All</button>
                          </div>
                       </motion.div>
                     </>
                   )}
                </AnimatePresence>
              </div>`;

  c = c.replace(oldButtonRegex, replaceStr);
  fs.writeFileSync(file, c, 'utf8');
}

fixMobileTopNav('src/components/layout/MobileLayout.tsx');

