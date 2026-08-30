// Test Suite 05: BMI & Wellness Body Composition
(function() {
  window.testSuite_BMI = function(assert) {
    openSection('bmi');
    const filter = document.getElementById('filterBmiConsumer');
    if (filter) {
      filter.value = '1001';
      renderBMIHistory();
      const rows = document.querySelectorAll('#bmiTableBody tr').length;
      assert(rows >= 3, `Expected >=3 BMI rows for 1001, got ${rows}`);
      filter.value = 'all';
      renderBMIHistory();
    }
  };
})();
