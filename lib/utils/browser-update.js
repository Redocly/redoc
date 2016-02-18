/*eslint no-unused-vars: 0*/
'use strict';
var $buoop = { vs: {i:9, f:25, o:12.1, s:7}, c:2 };
function $buo_f(){
  var e = document.createElement('script');
  e.src = '//browser-update.org/update.min.js';
  document.body.appendChild(e);
}
try {document.addEventListener('DOMContentLoaded', $buo_f, false);}
catch(e){window.attachEvent('onload', $buo_f);}
