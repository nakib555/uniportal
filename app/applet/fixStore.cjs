const fs = require('fs');

function useStoreInAttendance(file, relPathToStore) {
  if (!fs.existsSync(file)) return;
  let c = fs.readFileSync(file, 'utf8');
  let newC = c;
  
  if (c.includes('import { REGISTERED_COURSES }')) {
    newC = newC.replace(/import { REGISTERED_COURSES } from '[^']+';/, `import { useAppStore } from '${relPathToStore}';`);
    newC = newC.replace(/export function AttendanceView\(\) \{/, `export function AttendanceView() {\n  const registeredCourses = useAppStore(state => state.registeredCourses);`);
    newC = newC.replace(/REGISTERED_COURSES\.map/g, 'registeredCourses.map');
    
    fs.writeFileSync(file, newC);
    console.log("Updated to use store: " + file);
  }
}

useStoreInAttendance('src/desktop/views/AttendanceView.tsx', '../../store');
useStoreInAttendance('src/views/AttendanceView.tsx', '../store');
