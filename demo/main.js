;(function() {
  'use strict';

  var loadButton = document.getElementById('load-button');
  var schemaUrlInput = document.getElementById('schema-url-input');
  loadButton.addEventListener('click', function() {
    Redoc.init(schemaUrlInput.value);
  })
})();
