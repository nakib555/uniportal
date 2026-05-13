const fs = require('fs');
const path = require('path');

function replaceInDir(dir, replacements) {
    fs.readdirSync(dir, { withFileTypes: true }).forEach(ent => {
        const fullPath = path.join(dir, ent.name);
        if (ent.isDirectory()) {
            replaceInDir(fullPath, replacements);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;
            for (let [from, to] of replacements) {
                // simple replace logic
                if (content.includes(from)) {
                    content = content.split(from).join(to);
                    modified = true;
                }
            }
            if (modified) {
                fs.writeFileSync(fullPath, content);
            }
        }
    });
}

replaceInDir('src/components/layout', [
    ['.../../../hooks/usePortalLogic', '../../hooks/usePortalLogic'],
    ['../../../views/HomeView', '../../views/HomeView'],
    ['../../../views/ProfileView', '../../views/ProfileView'],
    ['../../../views/CoursesView', '../../views/CoursesView'],
    ['../../../views/ScheduleWeeklyView', '../../views/ScheduleWeeklyView'],
    ['../../../views/DegreeAuditView', '../../views/DegreeAuditView'],
    ['../../../views/GradesView', '../../views/GradesView'],
    ['../../../views/ExamsView', '../../views/ExamsView'],
    ['../../../views/AttendanceView', '../../views/AttendanceView'],
    ['../../../views/FacultyEvalView', '../../views/FacultyEvalView'],
    ['../../../views/LibraryView', '../../views/LibraryView'],
    ['../../../views/ClubsView', '../../views/ClubsView'],
    ['../../../views/AdvisingView', '../../views/AdvisingView'],
    ['../../../views/FinancialAidView', '../../views/FinancialAidView'],
    ['.../../../views/StatementView', '../../views/StatementView'],
    ['../../../views/admin/', '../../views/admin/'],
    ['../../../hooks/usePortalLogic', '../../hooks/usePortalLogic'],
    ['../.../../store', '../../store'],
    ['./navData', '../../data/navData'],
]);

