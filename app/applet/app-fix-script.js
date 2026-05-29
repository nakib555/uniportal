import fs from 'fs';
import path from 'path';

function fix(d) {
  fs.readdirSync(d).forEach(f => {
    let p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) {
        fix(p);
    } else if (p.endsWith('.tsx') || p.endsWith('.jsx')) {
      let c = fs.readFileSync(p, 'utf-8');
      let c2 = c;
      
      const tagRegex = /<([a-zA-Z0-9_\.]+)(\s+[^>]*?onClick=(?:{(?:[^{}]|{(?:[^{}]|{})*})*}|"[^"]*"|'[^']*')[^>]*?)>/g;
      
      c2 = c2.replace(tagRegex, (m, tag, attrs) => {
          console.log("Matched tag:", tag);
          if (['Button', 'button', 'a', 'Link', 'AlertBox', 'Alert', 'Dialog', 'Sheet', 'DropdownMenu', 'Card', 'Badge', 'SelectItem', 'TabsTrigger', 'DropdownMenuItem', 'DropdownMenuTrigger'].includes(tag)) return m;
          
          if (attrs.includes('cursor-') || attrs.includes('disabled')) return m;
          
          if (attrs.includes('className="')) {
              return '<' + tag + attrs.replace('className="', 'className="cursor-pointer ');
          } else if (attrs.includes("className={'")) {
              return '<' + tag + attrs.replace("className={'", "className={'cursor-pointer ");
          } else if (attrs.includes('className={`')) {
              return '<' + tag + attrs.replace('className={`', 'className={`cursor-pointer ');
          } else if (attrs.includes('className={')) {
              return '<' + tag + attrs.replace('className={', 'className={`cursor-pointer ` + ');
          } else {
              return '<' + tag + ' className="cursor-pointer"' + attrs + '>';
          }
      });
      
      if (c !== c2) {
          fs.writeFileSync(p, c2);
          console.log('Fixed:', p);
      }
    }
  });
}

fix('src');
