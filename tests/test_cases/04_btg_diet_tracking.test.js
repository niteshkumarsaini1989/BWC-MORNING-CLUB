// Test Suite 04: BTG Food Tracker & Consumer Modal
(function() {
  window.testSuite_BTG = function(assert) {
    openSection('btg');
    assert(Array.isArray(btgFields) && btgFields.length === 8, 'btgFields exists with 8 keys');
    renderBTG();

    toggleBTGCell('2026-08-29_1001', 'afresh');
    openBtgConsumerModal(1001);
    assert(activeBtgModalConsumerId === 1001, 'Active BTG modal ID set');

    switchBtgModalTab('month');
    assert(!document.getElementById('btgModalMonthView').classList.contains('d-none'), 'BTG month view active');

    switchBtgModalTab('day');
    assert(!document.getElementById('btgModalDayView').classList.contains('d-none'), 'BTG day view active');
  };
})();
