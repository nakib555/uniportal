import fs from 'fs';

const content = fs.readFileSync('src/MobileLayout.tsx', 'utf-8');
const lines = content.split('\n');
const start = lines.findIndex(l => l.includes('export default function App() {'));
const end = lines.findIndex(l => l.includes('const currentTabParent = '));

if (start !== -1 && end !== -1) {
  const newLines = lines.slice(0, start);
  newLines.push(`import { usePortalLogic } from './hooks/usePortalLogic';`);
  newLines.push(`export function MobileLayout(props: ReturnType<typeof usePortalLogic>) {`);
  newLines.push(`  const {`);
  newLines.push(`    store, is24HourFormat, setIs24HourFormat, profilePic, fileInputRef,`);
  newLines.push(`    toggleDarkMode, handleProfilePicUpload, registeredCourses, completedCourses,`);
  newLines.push(`    registerError, isSelectionLocked, setIsSelectionLocked, isConfirmRegistrationOpen, setIsConfirmRegistrationOpen,`);
  newLines.push(`    pendingCoreqCourse, isCoreqModalOpen, setIsCoreqModalOpen,`);
  newLines.push(`    courseSearchQuery, setCourseSearchQuery, courseDeptFilter, setCourseDeptFilter,`);
  newLines.push(`    courseCreditFilter, setCourseCreditFilter, coursePrereqFilter, setCoursePrereqFilter,`);
  newLines.push(`    courseSortBy, setCourseSortBy, scheduleCourseFilter, setScheduleCourseFilter,`);
  newLines.push(`    scheduleDayFilter, setScheduleDayFilter, student, selectedFees, toggleFee,`);
  newLines.push(`    bankSlipTotal, isBankSlipSuccess, isConfirmPaymentOpen, setIsConfirmPaymentOpen,`);
  newLines.push(`    handleBankSlipSubmitClick, handleConfirmPayment, filteredSchedule, groupedSchedule,`);
  newLines.push(`    groupedCompletedCourses, filteredAvailableCourses, totalDebit, totalCredit, statementChartData,`);
  newLines.push(`    handleMenuToggle, handleNavClick, handleSubItemClick,`);
  newLines.push(`    handleRegister, confirmCoreqsRegistration, handleDropCourse`);
  newLines.push(`  } = props;`);
  newLines.push(`  const [selectedSyllabusCourse, setSelectedSyllabusCourse] = useState<Course | null>(null);`);
  newLines.push(`  const { activeTab, expandedMenus, isSidebarCollapsed, isMobileMenuOpen, setIsMobileMenuOpen, isDarkMode } = store;`);
  newLines.push(...lines.slice(end));
  fs.writeFileSync('src/MobileLayout.tsx', newLines.join('\n'));
  console.log('MobileLayout patched successfully');
} else {
  console.log('not found');
}
