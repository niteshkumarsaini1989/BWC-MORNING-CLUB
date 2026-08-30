// Test Suite 07: Product Tracking & Smart Matcher
(function() {
  window.testSuite_Product = function(assert) {
    openSection('productSales');
    const p1 = findMatchingProduct('vanilla');
    assert(p1 !== null, 'Found vanilla product');
    const p2 = findMatchingProduct('1233');
    assert(p2 !== null, 'Found product by SKU 1233');
  };
})();
