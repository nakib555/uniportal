const fs = require('fs');

let content = fs.readFileSync('src/views/ProfileView.tsx', 'utf8');

// Update biometric block in ProfileView to be more mobile-friendly
const oldBlock = `<div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-stone-900 dark:text-stone-100">Biometric Login</p>
                      <p className="text-xs text-stone-500 mb-2">{isBiometricEnabled ? 'Enabled for this device' : 'Use Face ID / Touch ID to login'}</p>
                    </div>
                    <button `;

const newBlock = `<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
                    <div>
                      <p className="text-sm font-medium text-stone-900 dark:text-stone-100">Biometric Login</p>
                      <p className="text-xs text-stone-500 mb-2">{isBiometricEnabled ? 'Enabled for this device' : 'Use Face ID / Touch ID to login'}</p>
                    </div>
                    <button `;

content = content.replace(oldBlock, newBlock);

fs.writeFileSync('src/views/ProfileView.tsx', content);
