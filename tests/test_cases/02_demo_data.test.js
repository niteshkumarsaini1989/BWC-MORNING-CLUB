// Test Suite 02: Demo Data Integrity & Checkup Parsing
(function() {
  window.testSuite_DemoData = function(assert) {
    loadDemoData(true);
    assert(Array.isArray(coaches) && coaches.length >= 4, 'Coaches count >= 4');
    assert(Array.isArray(consumers) && consumers.length >= 8, 'Consumers count >= 8');
    assert(Object.keys(attendanceData).length >= 10, 'Attendance count >= 10');
    assert(Object.keys(btgData).length >= 8, 'BTG data >= 8');
    assert(Array.isArray(bmiRecords) && bmiRecords.length >= 8, 'BMI records >= 8');
    assert(Object.keys(checkupData).length >= 8, 'Checkups count >= 8 (No undefined parse error)');
    assert(Array.isArray(salesRecords) && salesRecords.length >= 10, 'Sales records >= 10');
  };
})();
