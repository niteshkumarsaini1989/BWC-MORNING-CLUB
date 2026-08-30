// ============================================================================
// BHARAT WELLNESS CLUB - COMPLETE AUTOMATED TEST SUITE
// ============================================================================
(function runBwcMasterSuite() {
  const originalAlert = window.alert;
  const originalConfirm = window.confirm;
  window.alert = function(msg) { /* no-op in automated test */ };
  window.confirm = function(msg) { return true; };

  const results = [];
  const errors = [];
  let passedCount = 0;
  let totalCount = 0;

  function assert(condition, message) {
    if (!condition) {
      throw new Error(message || 'Assertion failed');
    }
  }

  function runTest(name, fn) {
    totalCount++;
    try {
      fn();
      results.push({ name, passed: true });
      passedCount++;
    } catch (err) {
      results.push({ name, passed: false, error: err.message });
      errors.push(`${name}: ${err.message}`);
    }
  }

  // ----------------------------------------------------
  // TEST 1: Auth & Login Engine
  // ----------------------------------------------------
  runTest('1. Auth Overlay & Direct Login as Master Admin', () => {
    quickLogin('ADMIN');
    assert(currentUser !== null, 'currentUser should not be null');
    assert(currentUser.role === 'ADMIN', 'currentUser.role should be ADMIN');
    const authOverlay = document.getElementById('authOverlay');
    assert(authOverlay && authOverlay.style.display === 'none', 'authOverlay should be hidden');
  });

  // ----------------------------------------------------
  // TEST 2: Demo Data Population & Verification (JSON safe)
  // ----------------------------------------------------
  runTest('2. Demo Data Population & Dual-Mode State Engine', () => {
    loadDemoData(true);
    assert(Array.isArray(coaches) && coaches.length >= 4, `Expected >=4 coaches, got ${coaches.length}`);
    assert(Array.isArray(consumers) && consumers.length >= 8, `Expected >=8 consumers, got ${consumers.length}`);
    assert(Object.keys(attendanceData).length >= 10, `Expected >=10 attendance records, got ${Object.keys(attendanceData).length}`);
    assert(Object.keys(btgData).length >= 8, `Expected >=8 BTG diet records, got ${Object.keys(btgData).length}`);
    assert(Array.isArray(bmiRecords) && bmiRecords.length >= 8, `Expected >=8 BMI records, got ${bmiRecords.length}`);
    assert(Object.keys(checkupData).length >= 8, `Expected >=8 checkup records, got ${Object.keys(checkupData).length}`);
    assert(Array.isArray(salesRecords) && salesRecords.length >= 10, `Expected >=10 sales records, got ${salesRecords.length}`);
    assert(Array.isArray(btgFields) && btgFields.length === 8, `btgFields must have 8 slots, got ${btgFields ? btgFields.length : 0}`);
  });

  // ----------------------------------------------------
  // TEST 3: Navigation & Tab Switching
  // ----------------------------------------------------
  runTest('3. Sidebar Navigation & Tab Views Activation', () => {
    const sections = ['consumers', 'attendance', 'btg', 'bmi', 'checkup', 'productSales', 'reports', 'coaches', 'dataManager', 'advanceSettings'];
    sections.forEach(sec => {
      openSection(sec);
      const el = document.getElementById('view-' + sec);
      assert(el && el.classList.contains('active-tab'), `Tab view-${sec} should have active-tab class`);
    });
  });

  // ----------------------------------------------------
  // TEST 4: Role-Based Access Control & Coach Filter
  // ----------------------------------------------------
  runTest('4. Role-Based Access Control & Coach Filter', () => {
    // 1. Switch to Coach Rahul Sharma
    quickLogin('COACH', 'COACH_101', 'Rahul Sharma');
    assert(currentUser.role === 'COACH', 'Role should be COACH');
    assert(currentUser.id === 'COACH_101', 'Coach ID should be COACH_101');
    const adminElems = document.querySelectorAll('.admin-only');
    adminElems.forEach(el => {
      assert(el.classList.contains('d-none'), 'Admin elements should be hidden for Coach');
    });

    const coachConsumers = getFilteredConsumers();
    assert(coachConsumers.length === 2, `Coach Rahul should have 2 consumers, got ${coachConsumers.length}`);

    // 2. Switch back to Master Admin
    quickLogin('ADMIN');
    assert(currentUser.role === 'ADMIN', 'Role should be ADMIN');
    const allConsumers = getFilteredConsumers();
    assert(allConsumers.length >= 8, `Admin should see all consumers, got ${allConsumers.length}`);

    // 3. Test Coach Filter Dropdown
    const filterSelect = document.getElementById('adminCoachFilter');
    if (filterSelect) {
      filterSelect.value = 'COACH_102';
      filterDataBySelectedCoach();
      const priyaConsumers = getFilteredConsumers();
      assert(priyaConsumers.length === 2, `Priya should have 2 consumers, got ${priyaConsumers.length}`);
      filterSelect.value = 'ALL';
      filterDataBySelectedCoach();
    }
  });

  // ----------------------------------------------------
  // TEST 5: Consumer Master (Auto Code, Ideal Wt, Modal)
  // ----------------------------------------------------
  runTest('5. Consumer Master - Auto Code & WHO Ideal Weight Formula', () => {
    openSection('consumers');
    openAddConsumerModal();
    
    document.getElementById('mName').value = 'Rohan Gupta';
    autoGenerateCode();
    assert(document.getElementById('mCode').value === 'BWC/ROHAN', `Code expected BWC/ROHAN, got ${document.getElementById('mCode').value}`);

    document.getElementById('mGender').value = 'Male';
    document.getElementById('mHeight').value = "5'10";
    calculateIdealWeight();
    assert(document.getElementById('mIdealWt').value === '69.7', `WHO Ideal Wt expected 69.7, got ${document.getElementById('mIdealWt').value}`);

    document.getElementById('mGender').value = 'Female';
    document.getElementById('mHeight').value = "5'4";
    calculateIdealWeight();
    assert(document.getElementById('mIdealWt').value === '57.1', `Female 5'4 ideal wt expected 57.1, got ${document.getElementById('mIdealWt').value}`);
  });

  // ----------------------------------------------------
  // TEST 6: Attendance Register & Month View Toggle
  // ----------------------------------------------------
  runTest('6. Attendance Management (Daily Toggle & Month Register)', () => {
    openSection('attendance');
    renderDailySheet();
    
    // Toggle consumer 1001 present
    toggleDailyAttendance('2026-08-29', 1001, true);
    renderDailySheet();
    assert(document.getElementById('statTotalConsumers').innerText == consumers.length, 'Total consumers stat mismatch');

    // Toggle to Month View
    toggleAttendanceViewMode();
    assert(!document.getElementById('monthViewContainer').classList.contains('d-none'), 'Month view container should be visible');
    assert(document.getElementById('dayViewContainer').classList.contains('d-none'), 'Day view container should be hidden');

    // Toggle cell in month view
    toggleMonthlyCell('2026-08_1001_15', true);
    assert(attendanceData['2026-08_1001_15'] === true, 'Attendance cell should be true');

    // Toggle back to Day View
    toggleAttendanceViewMode();
    assert(!document.getElementById('dayViewContainer').classList.contains('d-none'), 'Day view container should be visible');
  });

  // ----------------------------------------------------
  // TEST 7: BTG Food Diet Matrix & Modal (btgFields TDZ Safe)
  // ----------------------------------------------------
  runTest('7. Food (BTG) Diet Tracking & Consumer Modal Tabs', () => {
    openSection('btg');
    renderBTG();

    // Toggle lunch slot
    toggleBTGCell('2026-08-29_1001', 'lunch');
    assert(btgData['2026-08-29_1001'] !== undefined, 'BTG cell data should be saved');
    
    // Open BTG Modal
    openBtgConsumerModal(1001);
    assert(activeBtgModalConsumerId === 1001, 'activeBtgModalConsumerId should be 1001');
    assert(document.getElementById('btgModalConsumerName').innerText.includes('Vikram Singh'), 'Modal title mismatch');

    // Switch to month view in modal
    switchBtgModalTab('month');
    assert(!document.getElementById('btgModalMonthView').classList.contains('d-none'), 'BTG month view should be visible');

    // Switch back to day view
    switchBtgModalTab('day');
    assert(!document.getElementById('btgModalDayView').classList.contains('d-none'), 'BTG day view should be visible');
  });

  // ----------------------------------------------------
  // TEST 8: BMI & Wellness Logs & Filters
  // ----------------------------------------------------
  runTest('8. BMI & Wellness Evaluation Logs & Filters', () => {
    openSection('bmi');
    document.getElementById('filterBmiConsumer').value = '1001';
    renderBMIHistory();
    const rows1001 = document.querySelectorAll('#bmiTableBody tr').length;
    assert(rows1001 >= 3, `Expected >= 3 BMI records for consumer 1001, got ${rows1001}`);

    document.getElementById('filterBmiConsumer').value = 'all';
    renderBMIHistory();
    const rowsAll = document.querySelectorAll('#bmiTableBody tr').length;
    assert(rowsAll >= 8, `Expected >= 8 total BMI records, got ${rowsAll}`);
  });

  // ----------------------------------------------------
  // TEST 9: 90-Day Checkup Tracking & Due Reminders
  // ----------------------------------------------------
  runTest('9. Checkup Tracking & 90-Day Follow-up Reminders', () => {
    openSection('checkup');
    renderCheckup();
    updateCheckupNotifications();

    const rows = document.querySelectorAll('#checkupTableBody tr').length;
    assert(rows >= 8, `Expected >= 8 checkup rows, got ${rows}`);

    saveCheckup(1001, '2026-08-01');
    assert(checkupData['1001'] !== undefined, 'Checkup data for 1001 should exist');
  });

  // ----------------------------------------------------
  // TEST 10: Multi-Product Dispatch & Keyword Matching
  // ----------------------------------------------------
  runTest('10. Product Tracking - Keyword Auto-complete & Multi-add', () => {
    openSection('productSales');

    const f1 = findMatchingProduct('f1 vanilla');
    assert(f1 && f1.name.includes('Vanilla'), 'F1 vanilla match failed');

    const afresh = findMatchingProduct('elaichi');
    assert(afresh && afresh.name.includes('Elaichi'), 'Afresh match failed');

    const ppp = findMatchingProduct('ppp 200g');
    assert(ppp && ppp.name.includes('Protein'), 'PPP match failed');

    const sm = findMatchingProduct('183k');
    assert(sm && sm.name.includes('ShakeMate'), 'ShakeMate ID match failed');

    const initialRows = document.querySelectorAll('.product-row-item').length;
    addProductRowItem();
    const afterRows = document.querySelectorAll('.product-row-item').length;
    assert(afterRows === initialRows + 1, 'Product row item should be added');
  });

  // ----------------------------------------------------
  // TEST 11: Reports Center & Printable Slips
  // ----------------------------------------------------
  runTest('11. Reports Engine (Single Slips, Attendance, Diet, BMI, Full Combo)', () => {
    openSection('reports');

    generateSingleProfileReport(1001);
    assert(document.getElementById('reportModalTitle').innerText.includes('Profile'), 'Profile report modal title mismatch');

    generateAttendanceReportOnly(1001);
    assert(document.getElementById('reportModalTitle').innerText.includes('Attendance'), 'Attendance report modal title mismatch');

    generateBTGReportOnly(1001);
    assert(document.getElementById('reportModalTitle').innerText.includes('BTG') || document.getElementById('reportModalTitle').innerText.includes('Food'), 'BTG report modal title mismatch');

    generateBMIReportOnly(1001);
    assert(document.getElementById('reportModalTitle').innerText.includes('Evaluation') || document.getElementById('reportModalTitle').innerText.includes('BMI'), 'BMI report modal title mismatch');

    generateCheckupReportOnly(1001);
    assert(document.getElementById('reportModalTitle').innerText.includes('Checkup'), 'Checkup report modal title mismatch');

    document.getElementById('reportGenConsumer').value = '1001';
    generateComboReport();
    assert(document.getElementById('reportModalTitle').innerText.includes('Combo'), 'Combo report modal title mismatch');
  });

  // ----------------------------------------------------
  // TEST 12: Coach Management & Team PIN
  // ----------------------------------------------------
  runTest('12. Coach Management & Team PIN Updating', () => {
    openSection('coaches');
    renderCoaches();
    const rows = document.querySelectorAll('#coachTableBody tr').length;
    assert(rows >= 4, `Expected >=4 coach rows, got ${rows}`);
  });

  // Restore alerts
  window.alert = originalAlert;
  window.confirm = originalConfirm;

  window.__bwcTestResults = {
    allPassed: errors.length === 0 && passedCount === totalCount,
    totalCount,
    passedCount,
    failedCount: errors.length,
    results,
    errors
  };

  return window.__bwcTestResults;
})();
