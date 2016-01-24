;(function() {
  'use strict';

  var schemaUrlForm = document.getElementById('schema-url-form');
  var schemaUrlInput = document.getElementById('schema-url-input');
  schemaUrlForm.addEventListener('submit', function(event) {
    event.preventDefault();
    Redoc.init(schemaUrlInput.value);
    return false;
  })
})();
