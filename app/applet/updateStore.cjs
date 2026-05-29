const fs = require('fs');

const storeFile = 'src/store.ts';
let storeContent = fs.readFileSync(storeFile, 'utf8');

if (!storeContent.includes('topNotifications:')) {
  // Add to AppState interface
  storeContent = storeContent.replace(
    '  // Admin Data',
    `  topNotifications: { id: number; type: string; title: string; desc: string; time: string; color: string; read?: boolean }[];
  clearAllTopNotifications: () => void;
  removeTopNotification: (id: number) => void;
  markAllTopNotificationsAsRead: () => void;

  // Admin Data`
  );

  const notificationsState = `
  topNotifications: [
    { id: 1, type: 'alert', title: 'Tuition Fee Due', desc: 'Fall 2026 tuition fee is due in 3 days.', time: '2 hours ago', color: 'text-amber-500' },
    { id: 2, type: 'success', title: 'Grade Posted', desc: 'Your final grade for CSE-305 has been posted.', time: '5 hours ago', color: 'text-emerald-500' },
    { id: 3, type: 'info', title: 'New Course Material', desc: 'Dr. Rahman uploaded "Chapter 4 Notes".', time: '1 day ago', color: 'text-blue-500' },
    { id: 4, type: 'event', title: 'Robotics Club Meeting', desc: 'Tomorrow at 4:00 PM in Room 301.', time: '1 day ago', color: 'text-indigo-500' },
  ],
  clearAllTopNotifications: () => set({ topNotifications: [] }),
  removeTopNotification: (id) => set(state => ({ topNotifications: state.topNotifications.filter(n => n.id !== id) })),
  markAllTopNotificationsAsRead: () => set(state => ({ topNotifications: state.topNotifications.map(n => ({ ...n, read: true })) })),
`;

  storeContent = storeContent.replace(
    '  // Added Logic State',
    `// Added Logic State`
  );
  
  storeContent = storeContent.replace(
    '  students: [',
    notificationsState + '\n  students: ['
  );

  fs.writeFileSync(storeFile, storeContent, 'utf8');
  console.log("Updated store.ts with topNotifications");
} else {
  console.log("store.ts already has topNotifications");
}

