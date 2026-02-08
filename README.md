###################
# ExitIntentOffer #
###################

A module that adds a pop-up on magento that aims to retain the user with a discount.
This will deactivate the pop-up for a month once user submits their mail.

//this code needs to be nestled inside the Confirmation Div in the dot digital form's source code:

<script>
(function () {
  function notifySubmit(e) {
    var t = e.target;
    if (t && t.matches && t.matches('input.paging-button-submit[type="submit"]')) {
      try {
        window.parent.postMessage('VIRIDIAN_EXIT_INTENT_SUBMIT', '*');
        window.top.postMessage('VIRIDIAN_EXIT_INTENT_SUBMIT', '*');
      } catch (err) {}
    }
  }
  document.addEventListener('click', notifySubmit, true);
})();
</script>
    
//This one needs to be nestled inside the body after the form ends in the dot digital form's source code:<br>

<script>
(function () {
  try {
    window.parent.postMessage('VIRIDIAN_EXIT_INTENT_SUCCESS', '*');
    window.top.postMessage('VIRIDIAN_EXIT_INTENT_SUCCESS', '*');
  } catch (e) {}
})();
</script>
