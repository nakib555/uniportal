const fs = require('fs');

function updateStatementView(file) {
  let c = fs.readFileSync(file, 'utf8');

  // Add import
  if (!c.includes('import { PaymentPortal } from')) {
    c = c.replace(/import \{ PrintableStatement \} from/, `import { PrintableStatement } from '../components/print/PrintableStatement';\nimport { PaymentPortal } from '../components/PaymentPortal';`);
  }

  // Remove processPayment and amountToPay etc, as we use PaymentPortal.
  // Actually, wait, StatementView logic:
  
  const paymentLogicRegex = /const \[isPaymentModalOpen, setIsPaymentModalOpen.*?processPayment = \(\) => \{[\s\S]*?\}, 2000\);\n  \};/s;
  
  const newPaymentLogic = `const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [simulatedCashPaid, setSimulatedCashPaid] = useState(7605);
  const totalFeesToPay = 30375;
  const simulatedDues = totalFeesToPay - simulatedCashPaid;

  const handlePayOnline = () => {
    setIsPaymentModalOpen(true);
  };
  
  const handlePaymentSuccess = (amount) => {
    setSimulatedCashPaid(prev => prev + amount);
    setIsPaymentModalOpen(false);
  };`;
  
  if (paymentLogicRegex.test(c)) {
     c = c.replace(paymentLogicRegex, newPaymentLogic);
  }

  // Now replace the AnimatePresence that contains the old modal
  const oldModalRegex = /<AnimatePresence>[\s]*\{isPaymentModalOpen && \([\s\S]*?\{paymentStep === 'success' && \([\s\S]*?\}[\s]*\)\]*[\s]*\}[\s]*<\/AnimatePresence>/m;
  
  const oldModalRegex2 = /<AnimatePresence>[\s\S]*?<\/AnimatePresence>/g;
  
  // Find all AnimatePresence blocks, one of them has isPaymentModalOpen
  // To be safe, I'm just going to search for the specific modal signature
  const findModal = /<AnimatePresence>\s*\{isPaymentModalOpen && \([\s\S]*?<\/AnimatePresence>/;
  
  c = c.replace(findModal, `<PaymentPortal 
        isOpen={isPaymentModalOpen} 
        onClose={() => setIsPaymentModalOpen(false)} 
        outstandingBalance={simulatedDues} 
        onPaymentSuccess={handlePaymentSuccess} 
      />`);

  fs.writeFileSync(file, c);
  console.log("Updated " + file);
}

updateStatementView('src/views/StatementView.tsx');
