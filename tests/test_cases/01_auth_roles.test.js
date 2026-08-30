// Test Suite 01: Authentication & Role-Based Access Control
(function() {
  window.testSuite_Auth = function(assert) {
    // 1. Master Admin Login
    quickLogin('ADMIN');
    assert(currentUser !== null, 'currentUser should be set');
    assert(currentUser.role === 'ADMIN', 'currentUser.role should be ADMIN');
    const authOverlay = document.getElementById('authOverlay');
    assert(authOverlay && authOverlay.style.display === 'none', 'authOverlay hidden');

    // 2. Coach Login
    quickLogin('COACH', 'COACH_101', 'Rahul Sharma');
    assert(currentUser.role === 'COACH', 'currentUser.role should be COACH');
    assert(currentUser.id === 'COACH_101', 'Coach ID match');

    // 3. Re-login Admin
    quickLogin('ADMIN');
    assert(currentUser.role === 'ADMIN', 'Re-login Admin OK');
  };
})();
