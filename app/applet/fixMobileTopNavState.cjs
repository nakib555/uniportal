const fs = require('fs');

function fixMobileTopNav(file) {
  let c = fs.readFileSync(file, 'utf8');

  // Insert state
  if (!c.includes('const [showNotifications, setShowNotifications] = useState(false);')) {
    c = c.replace(/const \[selectedSyllabusCourse, setSelectedSyllabusCourse\] = useState/, `const [showNotifications, setShowNotifications] = useState(false);\n  const [selectedSyllabusCourse, setSelectedSyllabusCourse] = useState`);
  }
  
  if(!c.includes('AlertCircle,')) {
    c = c.replace(/import \{ \n  Home/, 'import { \n  Home, AlertCircle');
  }

  fs.writeFileSync(file, c, 'utf8');
}

fixMobileTopNav('src/components/layout/MobileLayout.tsx');
