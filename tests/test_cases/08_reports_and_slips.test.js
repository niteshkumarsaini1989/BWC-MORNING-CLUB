// Test Suite 08: Reports & Print Engine Slips
(function() {
  window.testSuite_Reports = function(assert) {
    openSection('reports');
    generateSingleProfileReport(1001);
    assert(document.getElementById('reportModalTitle').innerText.includes('Profile'), 'Profile slip OK');

    generateAttendanceReportOnly(1001);
    assert(document.getElementById('reportModalTitle').innerText.includes('Attendance'), 'Attendance slip OK');

    generateBTGReportOnly(1001);
    assert(document.getElementById('reportModalTitle').innerText.includes('BTG') || document.getElementById('reportModalTitle').innerText.includes('Food'), 'BTG slip OK');

    generateBMIReportOnly(1001);
    assert(document.getElementById('reportModalTitle').innerText.includes('BMI') || document.getElementById('reportModalTitle').innerText.includes('Evaluation'), 'BMI slip OK');

    generateCheckupReportOnly(1001);
    assert(document.getElementById('reportModalTitle').innerText.includes('Checkup'), 'Checkup slip OK');
  };
})();
