const fs = require('fs');

function addAutocomplete(file) {
  let c = fs.readFileSync(file, 'utf8');

  // Insert state for hints
  if (!c.includes('showHints')) {
    c = c.replace(/const \[error, setError\] = useState\(''\);/, 
`const [error, setError] = useState('');
  const [showHints, setShowHints] = useState(false);`);
  }

  // Insert the helper hints render function or list inside the component
  const hintLogic = `
  const hints = loginType === 'student' 
    ? [{ id: 'class', label: 'Demo Student', pass: 'class' }]
    : [{ id: 'admin', label: 'Demo Admin', pass: 'admin' }];
`;
  
  if (!c.includes('const hints = loginType ===')) {
    c = c.replace(/const handleLogin = \(/, hintLogic + '\n  const handleLogin = (');
  }

  // Update input area
  const inputSectionRegex = /<input\s*type="text"\s*value=\{studentId\}\s*onChange=\{\(e\) => setStudentId\(e\.target\.value\)\}([\s\S]*?)placeholder=\{loginType === 'student' \? "e\.g\. 21104104" : "e\.g\. FAC-2098"\}\s*\/>/m;

  const replaceWith = `<input
                           type="text"
                           value={studentId}
                           onChange={(e) => { setStudentId(e.target.value); setShowHints(true); }}
                           onFocus={() => setShowHints(true)}
                           onBlur={() => setTimeout(() => setShowHints(false), 200)}
                           className="w-full bg-stone-50 dark:bg-stone-950/50 border border-stone-200 dark:border-stone-800 rounded-xl py-3 pl-10 pr-4 text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#8c1515]/20 dark:focus:ring-[#ef4444]/20 focus:border-[#8c1515] dark:focus:border-[#ef4444] transition-all font-medium"
                           placeholder={loginType === 'student' ? "e.g. class" : "e.g. admin"}
                           autoComplete="off"
                        />
                        <AnimatePresence>
                           {showHints && hints.filter(h => h.id.includes(studentId.toLowerCase())).length > 0 && (
                              <motion.div 
                                 initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                                 className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xl rounded-xl overflow-hidden z-50"
                              >
                                 {hints.filter(h => h.id.includes(studentId.toLowerCase())).map((hint, idx) => (
                                    <div 
                                       key={idx} 
                                       onClick={() => { setStudentId(hint.id); setPassword(hint.pass); setShowHints(false); }}
                                       className="px-4 py-3 cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors flex items-center justify-between"
                                    >
                                       <div>
                                          <div className="font-bold text-sm text-stone-900 dark:text-white">{hint.id}</div>
                                          <div className="text-xs text-stone-500">{hint.label}</div>
                                       </div>
                                       <div className="text-xs font-semibold text-[#8c1515] dark:text-[#ef4444] bg-[#8c1515]/10 dark:bg-[#ef4444]/10 px-2 py-1 rounded">Auto-fill</div>
                                    </div>
                                 ))}
                              </motion.div>
                           )}
                        </AnimatePresence>`;

  c = c.replace(inputSectionRegex, replaceWith);
  
  // also change the placeholder text just in case its defined directly in the UI instead of variable
  if (c.includes(`placeholder={loginType === 'student' ? "e.g. 21104104" : "e.g. FAC-2098"}`)) {
     c = c.replace(`placeholder={loginType === 'student' ? "e.g. 21104104" : "e.g. FAC-2098"}`, `placeholder="Account ID" autoComplete="off"`);
  }

  fs.writeFileSync(file, c);
  console.log("Autocomplete added to " + file);
}

addAutocomplete('src/views/LoginView.tsx');
