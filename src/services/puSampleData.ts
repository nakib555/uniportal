/**
 * Presidency University SIMS Raw HTML templates & structured response templates
 * Provided by Presidency University Student Information Management System (SIMS)
 */

export const SAMPLE_PU_HTML = {
  profile: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<body>
    <div id="content" class="grid_16">
    <div class="node">
    <h3>Quick Profile</h3>
        <div class="itable">
                <table border="1" cellspacing="0">                    
                        <tbody>
                                <tr>
                                        <td class="txt">Student ID:</td>
                                        <td class="txt">2610329040</td>
                                </tr>
                                <tr>
                                        <td class="txt">Student Name:</td>
                                        <td class="txt">Nakib Hassan Prince</td>
                                </tr>
                                <tr>
                                        <td class="txt">Status:</td>
                                        <td class="txt">Registered</td>
                                </tr>
                                <tr>
                                        <td class="txt">Admission Semester:</td>
                                        <td class="txt">Spring-26</td>
                                </tr>
                                <tr>
                                        <td class="txt">Current Semester:</td>
                                        <td class="txt">Summer-26</td>
                                </tr>
                                <tr>
                                        <td class="txt">Program:</td>
                                        <td class="txt">Bachelor of Science in Electrical & Electronic Engineering</td>
                                </tr>
                                <tr>
                                        <td class="txt">Credits Taken:</td>
                                        <td class="txt">13 credits</td>
                                </tr>
                                <tr>
                                        <td class="txt">Credits Completed:</td>
                                        <td class="txt">22 credits</td>
                                </tr>
							   <tr>
                                        <td class="txt">CGPA:</td>
                                        <td class="txt">3.11</td>
                                </tr>
                                <tr>
                                        <td class="txt">Account Balance:</td>
                                        <td class="txt">0.00 (Tk.)</td>
                                </tr>
                        </tbody>
                </table>
        </div>
    </div>
    </div>
</body>
</html>`,

  completedCourses: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<body>
<div class="node">
    <h3>Courses completed</h3>
    <p>List of all courses you have completed so far.</p>
    <div class="itable"><table cellpadding="0" cellspacing="0">
    <tr><th>Course</th> <th>Title</th> <th>Section</th> <th>Credit</th> <th>Grade</th></tr>
    <tr class="rp_subtotal"><td class="rp_group_title" colspan="5">Spring-26</td></tr>
    <tr><td class="txt">EEE201</td> <td class="txt">Electrical Circuits I</td> <td class="default">5</td> <td class="default">3.00</td> <td class="default">B-</td></tr>
    <tr class="altRow"><td class="txt">ENG099</td> <td class="txt">Basic English</td> <td class="default">18</td> <td class="default">3.00</td> <td class="default">A-</td></tr>
    <tr><td class="txt">MAT121</td> <td class="txt">Pre-Calculus</td> <td class="default">18</td> <td class="default">3.00</td> <td class="default">C+</td></tr>
    <tr class="rp_subtotal"><td class="rp_group_title" colspan="5">Summer-26</td></tr>
    <tr class="altRow"><td class="txt">EEE203</td> <td class="txt">Electrical Circuits II</td> <td class="default">5</td> <td class="default">3.00</td> <td class="default">C+</td></tr>
    <tr><td class="txt">ENG101</td> <td class="txt">English Reading & Composition</td> <td class="default">21</td> <td class="default">3.00</td> <td class="default">A+</td></tr>
    <tr class="altRow"><td class="txt">MAT123</td> <td class="txt">Calculus I</td> <td class="default">6</td> <td class="default">3.00</td> <td class="default">B-</td></tr>
    <tr><td class="txt">PHY107</td> <td class="txt">General Physics I</td> <td class="default">6</td> <td class="default">3.00</td> <td class="default">A-</td></tr>
    <tr class="altRow"><td class="txt">PHY108</td> <td class="txt">General Physics I Laboratory</td> <td class="default">6</td> <td class="default">1.00</td> <td class="default">A+</td></tr>
    </table></div>
</div>
</body>
</html>`,

  registeredCourses: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<body>
<div class="node">
    <h3>Registered Courses</h3>
    <p>List of courses you have registered for the current semester.</p>
    <div class="itable"><table cellpadding="0" cellspacing="0">
    <tr><th>No.</th> <th>Code</th> <th>Course Title</th> <th>Section</th> <th>Credit</th> <th>Faculty</th> <th>Semester</th></tr>
    <tr><td class="serial_number">1</td> <td class="default">EEE203</td> <td class="txt">Electrical Circuits II</td> <td class="default">5</td> <td class="default">3.00</td> <td class="default">mushfika</td> <td class="default">Summer-26</td></tr>
    <tr class="altRow"><td class="serial_number">2</td> <td class="default">ENG101</td> <td class="txt">English Reading & Composition</td> <td class="default">21</td> <td class="default">3.00</td> <td class="default">Harisun</td> <td class="default">Summer-26</td></tr>
    <tr><td class="serial_number">3</td> <td class="default">MAT123</td> <td class="txt">Calculus I</td> <td class="default">6</td> <td class="default">3.00</td> <td class="default">ibrahim</td> <td class="default">Summer-26</td></tr>
    <tr class="altRow"><td class="serial_number">4</td> <td class="default">PHY107</td> <td class="txt">General Physics I</td> <td class="default">6</td> <td class="default">3.00</td> <td class="default">Alif</td> <td class="default">Summer-26</td></tr>
    <tr><td class="serial_number">5</td> <td class="default">PHY108</td> <td class="txt">General Physics I Laboratory</td> <td class="default">6</td> <td class="default">1.00</td> <td class="default">Alif</td> <td class="default">Summer-26</td></tr>
    </table></div>
</div>
</body>
</html>`,

  classSchedule: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<body>
<div class="node">
    <h3>Class Schedule</h3>
    <p>View your class schedule for the running semester.</p>
    <div class="itable"><table cellpadding="0" cellspacing="0">
    <tr><th>Course</th> <th>Section</th> <th>Day</th> <th>Start</th> <th>End</th> <th>Room</th> <th>Campus</th> <th>Faculty</th> <th>Semester</th></tr>
    <tr><td class="default">PHY107</td> <td class="default">6</td> <td class="txt">Tuesday</td> <td class="default">15:05:00</td> <td class="default">17:30:00</td> <td class="txt">502</td> <td class="txt">Gulshan</td> <td class="txt">Alif</td> <td class="default">Summer-26</td></tr>
    <tr class="altRow"><td class="default">EEE203</td> <td class="default">5</td> <td class="txt">Monday</td> <td class="default">11:20:00</td> <td class="default">12:30:00</td> <td class="txt">513</td> <td class="txt">Gulshan</td> <td class="txt">mushfika</td> <td class="default">Summer-26</td></tr>
    <tr><td class="default">PHY108</td> <td class="default">6</td> <td class="txt">Tuesday</td> <td class="default">12:35:00</td> <td class="default">15:00:00</td> <td class="txt">601</td> <td class="txt">Gulshan</td> <td class="txt">Alif</td> <td class="default">Summer-26</td></tr>
    <tr class="altRow"><td class="default">ENG101</td> <td class="default">21</td> <td class="txt">Monday</td> <td class="default">13:50:00</td> <td class="default">15:00:00</td> <td class="txt">613</td> <td class="txt">Gulshan</td> <td class="txt">Harisun</td> <td class="default">Summer-26</td></tr>
    <tr><td class="default">MAT123</td> <td class="default">6</td> <td class="txt">Monday</td> <td class="default">12:35:00</td> <td class="default">13:45:00</td> <td class="txt">613</td> <td class="txt">Gulshan</td> <td class="txt">ibrahim</td> <td class="default">Summer-26</td></tr>
    </table></div>
</div>
</body>
</html>`,

  examSchedule: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<body>
<div class="node">
    <h3>Exam Schedule</h3>
    <div class="itable"><table cellpadding="0" cellspacing="0">
    <tr><th>Course</th> <th>Section</th> <th>Day</th> <th>date</th> <th>Start</th> <th>End</th> <th>Room</th> <th>Campus</th> <th>Faculty</th> <th>Semester</th></tr>
    <tr><td class="default">PHY108</td> <td class="default">6</td> <td class="txt">Monday</td> <td class="default">17 Aug, 26</td> <td class="default">03:00 pm</td> <td class="default">05:00 pm</td> <td class="txt">410</td> <td class="txt">Gulshan</td> <td class="txt">Alif</td> <td class="default">Summer-26</td></tr>
    <tr class="altRow"><td class="default">EEE203</td> <td class="default">5</td> <td class="txt">Saturday</td> <td class="default">22 Aug, 26</td> <td class="default">03:00 pm</td> <td class="default">05:00 pm</td> <td class="txt">204</td> <td class="txt">Gulshan</td> <td class="txt">mushfika</td> <td class="default">Summer-26</td></tr>
    <tr><td class="default">MAT123</td> <td class="default">6</td> <td class="txt">Monday</td> <td class="default">24 Aug, 26</td> <td class="default">03:00 pm</td> <td class="default">05:00 pm</td> <td class="txt">204</td> <td class="txt">Gulshan</td> <td class="txt">ibrahim</td> <td class="default">Summer-26</td></tr>
    <tr class="altRow"><td class="default">PHY107</td> <td class="default">6</td> <td class="txt">Tuesday</td> <td class="default">25 Aug, 26</td> <td class="default">03:00 pm</td> <td class="default">05:00 pm</td> <td class="txt">204</td> <td class="txt">Gulshan</td> <td class="txt">Alif</td> <td class="default">Summer-26</td></tr>
    <tr><td class="default">ENG101</td> <td class="default">21</td> <td class="txt">Thursday</td> <td class="default">27 Aug, 26</td> <td class="default">03:00 pm</td> <td class="default">05:00 pm</td> <td class="txt">204</td> <td class="txt">Gulshan</td> <td class="txt">Harisun</td> <td class="default">Summer-26</td></tr>
    </table></div>
</div>
</body>
</html>`,

  examAdmitCard: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<body>
<div class="node">
    <h3>Exam Admit Card</h3>
    <div class="itable"><table cellpadding="0" cellspacing="0">
    <tr><th>Security Code</th> <th>Course</th> <th>Section</th> <th>Day</th> <th>date</th> <th>Start</th> <th>End</th> <th>Room</th> <th>Faculty</th> <th>Semester</th></tr>
    <tr><td class="default">516935</td> <td class="default">EEE203</td> <td class="default">5</td> <td class="txt">Saturday</td> <td class="default">22 Aug, 26</td> <td class="default">03:00 pm</td> <td class="default">05:00 pm</td> <td class="txt">204</td> <td class="txt">mushfika</td> <td class="default">Summer-26</td></tr>
    <tr class="altRow"><td class="default">516936</td> <td class="default">ENG101</td> <td class="default">21</td> <td class="txt">Thursday</td> <td class="default">27 Aug, 26</td> <td class="default">03:00 pm</td> <td class="default">05:00 pm</td> <td class="txt">204</td> <td class="txt">Harisun</td> <td class="default">Summer-26</td></tr>
    <tr><td class="default">516937</td> <td class="default">MAT123</td> <td class="default">6</td> <td class="txt">Monday</td> <td class="default">24 Aug, 26</td> <td class="default">03:00 pm</td> <td class="default">05:00 pm</td> <td class="txt">204</td> <td class="txt">ibrahim</td> <td class="default">Summer-26</td></tr>
    <tr class="altRow"><td class="default">516938</td> <td class="default">PHY107</td> <td class="default">6</td> <td class="txt">Tuesday</td> <td class="default">25 Aug, 26</td> <td class="default">03:00 pm</td> <td class="default">05:00 pm</td> <td class="txt">204</td> <td class="txt">Alif</td> <td class="default">Summer-26</td></tr>
    <tr><td class="default">516939</td> <td class="default">PHY108</td> <td class="default">6</td> <td class="txt">Monday</td> <td class="default">17 Aug, 26</td> <td class="default">03:00 pm</td> <td class="default">05:00 pm</td> <td class="txt">410</td> <td class="txt">Alif</td> <td class="default">Summer-26</td></tr>
    </table></div>
</div>
</body>
</html>`,

  semesterTransactions: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<body>
<div class="node">
    <h3>Statement of Account</h3>
    <div class="itable"><table cellpadding="0" cellspacing="0">
    <tr><th>No.</th> <th>Date</th> <th>Sem.</th> <th>Code</th> <th>Description</th> <th>Debit (Paid)</th> <th>Credit  (Fees)</th> <th>Balance (Unpaid)</th></tr>
    <tr><td class="serial_number">1</td> <td class="txt">05-05-26</td> <td class="txt">262</td> <td class="txt">PAY099</td> <td class="txt">API Payment - nagad</td> <td class="amount">7,500</td> <td class="amount">0</td> <td class="amount">7,500</td></tr>
    <tr class="altRow"><td class="serial_number">2</td> <td class="txt">05-05-26</td> <td class="txt">262</td> <td class="txt">PAY099</td> <td class="txt">API Payment - nagad</td> <td class="amount">105</td> <td class="amount">0</td> <td class="amount">7,605</td></tr>
    <tr><td class="serial_number">3</td> <td class="txt">07-05-26</td> <td class="txt">262</td> <td class="txt">EEE203</td> <td class="txt">Electrical Circuits II</td> <td class="amount">0</td> <td class="amount">7,500</td> <td class="amount">105</td></tr>
    <tr class="altRow"><td class="serial_number">4</td> <td class="txt">07-05-26</td> <td class="txt">262</td> <td class="txt">ENG101</td> <td class="txt">English Reading & Composition</td> <td class="amount">0</td> <td class="amount">7,500</td> <td class="amount">-7,395</td></tr>
    <tr><td class="serial_number">5</td> <td class="txt">07-05-26</td> <td class="txt">262</td> <td class="txt">MAT123</td> <td class="txt">Calculus I</td> <td class="amount">0</td> <td class="amount">7,500</td> <td class="amount">-14,895</td></tr>
    <tr class="altRow"><td class="serial_number">6</td> <td class="txt">07-05-26</td> <td class="txt">262</td> <td class="txt">PHY107</td> <td class="txt">General Physics I</td> <td class="amount">0</td> <td class="amount">7,500</td> <td class="amount">-22,395</td></tr>
    <tr><td class="serial_number">7</td> <td class="txt">07-05-26</td> <td class="txt">262</td> <td class="txt">PHY108</td> <td class="txt">General Physics I Laboratory</td> <td class="amount">0</td> <td class="amount">2,500</td> <td class="amount">-24,895</td></tr>
    <tr class="altRow"><td class="serial_number">8</td> <td class="txt">07-05-26</td> <td class="txt">262</td> <td class="txt">FEE400</td> <td class="txt">Semester Fee w.e.f 261</td> <td class="amount">0</td> <td class="amount">6,000</td> <td class="amount">-30,895</td></tr>
    <tr><td class="serial_number">9</td> <td class="txt">07-05-26</td> <td class="txt">262</td> <td class="txt">WAV001</td> <td class="txt">Less 25.00% Tuition Waiver</td> <td class="amount">8,125</td> <td class="amount">0</td> <td class="amount">-22,770</td></tr>
    <tr class="altRow"><td class="serial_number">10</td> <td class="txt">11-05-26</td> <td class="txt">262</td> <td class="txt">PAY099</td> <td class="txt">API Payment - nagad</td> <td class="amount">20</td> <td class="amount">0</td> <td class="amount">-22,750</td></tr>
    <tr><td class="serial_number">11</td> <td class="txt">13-05-26</td> <td class="txt">262</td> <td class="txt">PAY099</td> <td class="txt">Cash Payment (Tuition Fee (Received by Bkash, Dated: 05/12/2026))</td> <td class="amount">19</td> <td class="amount">0</td> <td class="amount">-22,731</td></tr>
    <tr class="altRow"><td class="serial_number">12</td> <td class="txt">29-06-26</td> <td class="txt">262</td> <td class="txt">FEE127</td> <td class="txt">Late Fee, Payment-1, w.e.f Fall 2022</td> <td class="amount">0</td> <td class="amount">500</td> <td class="amount">-23,231</td></tr>
    <tr><td class="serial_number">13</td> <td class="txt">06-07-26</td> <td class="txt">262</td> <td class="txt">PAY099</td> <td class="txt">API Payment - nagad</td> <td class="amount">10,200</td> <td class="amount">0</td> <td class="amount">-13,031</td></tr>
    <tr class="altRow"><td class="serial_number">14</td> <td class="txt">25-07-26</td> <td class="txt">262</td> <td class="txt">FEE128</td> <td class="txt">Late Fee, Payment-2, w.e.f Fall 2022</td> <td class="amount">0</td> <td class="amount">500</td> <td class="amount">-13,531</td></tr>
    <tr><td class="serial_number">15</td> <td class="txt">06-08-26</td> <td class="txt">262</td> <td class="txt">PAY099</td> <td class="txt">API Payment - nagad</td> <td class="amount">13,531</td> <td class="amount">0</td> <td class="amount">0</td></tr>
    </table></div>
</div>
</body>
</html>`
};
