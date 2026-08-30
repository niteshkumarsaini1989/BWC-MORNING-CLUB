// Test Suite 10: Backup and Restore Data Engine
(function() {
  window.testSuite_Backup = function(assert) {
    assert(typeof exportDataBackup === 'function', 'exportDataBackup function exists');
    assert(typeof importDataBackup === 'function', 'importDataBackup function exists');
  };
})();
