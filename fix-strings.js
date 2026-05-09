import fs from 'fs';

const files = [
  'src/desktop/views/HomeView.tsx',
  'src/desktop/views/ScheduleView.tsx',
  'src/desktop/views/AccountsView.tsx'
];

files.forEach(filepath => {
  let content = fs.readFileSync(filepath, 'utf-8');
  content = content.replace(/\\\$/g, '$');
  fs.writeFileSync(filepath, content);
});

console.log('Fixed interpolated strings.');
