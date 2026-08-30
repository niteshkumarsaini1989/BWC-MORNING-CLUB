// Test Suite 09: Coaches Management & Password Update
(function() {
  window.testSuite_Coaches = function(assert) {
    openSection('coaches');
    renderCoaches();
    const rows = document.querySelectorAll('#coachTableBody tr').length;
    assert(rows >= 4, `Coaches rows expected >=4, got ${rows}`);
  };
})();
