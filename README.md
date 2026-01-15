# ExitIntentOffer
A module that adds a pop-up on magento that aims to retain the user with a discount.

//this code needs to be nestled inside the Confirmation Div in the dot digital form's source code:

<script>
    (function () {
      var sent = false;
      function send() {
        if (sent) return;
        sent = true;
        try {
          window.parent.postMessage('VIRIDIAN_EXIT_INTENT_SUCCESS', 'https://magento.test');
          window.top.postMessage('VIRIDIAN_EXIT_INTENT_SUCCESS', 'https://magento.test');
        } catch (e) {}
      }
      send();
    })();
    </script>
    
//This one needs to be nestled inside the body after the form ends in the dot digital form's source code:

<script>
(function () {
  function notifySubmit(e) {
    var t = e.target;
    if (t && t.matches && t.matches('input.paging-button-submit[type="submit"]')) {
      try {
        window.parent.postMessage('VIRIDIAN_EXIT_INTENT_SUBMIT', 'https://magento.test');
        window.top.postMessage('VIRIDIAN_EXIT_INTENT_SUBMIT', 'https://magento.test');
      } catch (err) {}
    }
  }
  document.addEventListener('click', notifySubmit, true);
})();
</script>
