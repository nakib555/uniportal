const fs = require('fs');
let code = fs.readFileSync('src/server/puProxy.ts', 'utf8');

const replacement = `
    // (g) Related Teachers Parsing
    const teachHtml = tabMap.get('Related Teachers') || '';
    const $teach = cheerio.load(teachHtml);
    const teachers: Instructor[] = [];

    $teach('table tr').each((_, tr) => {
      const tds = $teach(tr).find('td');
      if (tds.length >= 4) {
        const t0 = cleanText($teach(tds[0]).text());
        const t1 = cleanText($teach(tds[1]).text());
        const t2 = cleanText($teach(tds[2]).text());
        const t3 = cleanText($teach(tds[3]).text());

        let name = t1;
        let initial = name.split(' ').pop() || name;
        if (t0.length < t1.length && t0.length > 0) {
          initial = t0;
        }

        teachers.push({
          initial,
          name,
          email: t2,
          department: 'Unknown',
          courses: t3
        });
      }
    });

    // (h) Bank Slips Parsing
    const bankHtml = tabMap.get('Bank Slips') || '';
    const $bank = cheerio.load(bankHtml);
    const bankSlipFees: { code: string; description: string; amount: number }[] = [];

    $bank('table tr').each((_, tr) => {
      const tds = $bank(tr).find('td');
      
      let feeCode = '';
      let feeDesc = '';
      let feeAmt = 0;
      
      // Look through tds for one that looks like a fee code (e.g. FEE123)
      for (let i = 0; i < tds.length; i++) {
        const text = cleanText($bank(tds[i]).text());
        if (/^FEE\\d+$/i.test(text)) {
           feeCode = text.toUpperCase();
           if (i + 1 < tds.length) {
              feeDesc = cleanText($bank(tds[i+1]).text());
           }
           if (i + 2 < tds.length) {
              feeAmt = parseFloat(cleanText($bank(tds[i+2]).text()).replace(/,/g, '')) || 0;
           }
           break;
        }
      }
      
      if (feeCode && feeDesc) {
        bankSlipFees.push({ code: feeCode, description: feeDesc, amount: feeAmt });
      }
    });
`;

code = code.replace(/(\/\/ \(g\) Related Teachers Parsing[\s\S]+?\}\);\s*\}\);)/, replacement);
fs.writeFileSync('src/server/puProxy.ts', code);
console.log("Patched puProxy.ts!");
