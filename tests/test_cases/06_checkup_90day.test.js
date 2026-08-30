// Test Suite 06: 90-Day Checkup Tracking & Follow-up Notifications
(function() {
  window.testSuite_Checkup = function(assert) {
    openSection('checkup');
    renderCheckup();
    updateCheckupNotifications();
    const rows = document.querySelectorAll('#checkupTableBody tr').length;
    assert(rows >= 8, `Checkup rows expected >=8, got ${rows}`);
    assert(checkupData['1001'] !== undefined, 'Checkup record for 1001 exists');
  };
})();
