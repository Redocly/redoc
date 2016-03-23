;(function() {
  'use strict';

  var schemaUrlForm = document.getElementById('schema-url-form');
  var schemaUrlInput = document.getElementById('schema-url-input');
  schemaUrlForm.addEventListener('submit', function(event) {
    event.preventDefault();
    event.stopPropagation();
    location.search = updateQueryStringParameter(location.search, 'url', schemaUrlInput.value)
    return false;
  })

  var url = window.location.search.match(/url=([^&]+)/);
  if (url && url.length > 1) {
    url = decodeURIComponent(url[1]);
    document.getElementsByTagName('redoc')[0].setAttribute('spec-url', url);
    schemaUrlInput.value = url;
  }

  function updateQueryStringParameter(uri, key, value) {
    var re = new RegExp("([?|&])" + key + "=.*?(&|#|$)", "i");
    if (uri.match(re)) {
      return uri.replace(re, '$1' + key + "=" + value + '$2');
    } else {
      var hash =  '';
      if( uri.indexOf('#') !== -1 ){
          hash = uri.replace(/.*#/, '#');
          uri = uri.replace(/#.*/, '');
      }
      var separator = uri.indexOf('?') !== -1 ? "&" : "?";
      return uri + separator + key + "=" + value + hash;
    }
  }
  //window.redocDebugMode = true;
})();
