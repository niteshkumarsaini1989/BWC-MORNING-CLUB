// Test Suite 03: Attendance Daily & Monthly Register
(function() {
  window.testSuite_Attendance = function(assert) {
    openSection('attendance');
    renderDailySheet();
    toggleDailyAttendance('2026-08-29', 1001, true);
    assert(attendanceData['2026-08_1001_29'] === true, 'Daily attendance marked true');

    toggleAttendanceViewMode();
    assert(!document.getElementById('monthViewContainer').classList.contains('d-none'), 'Month view visible');

    toggleMonthlyCell('2026-08_1001_10', true);
    assert(attendanceData['2026-08_1001_10'] === true, 'Monthly cell toggled');

    toggleAttendanceViewMode();
    assert(!document.getElementById('dayViewContainer').classList.contains('d-none'), 'Day view visible');
  };
})();
