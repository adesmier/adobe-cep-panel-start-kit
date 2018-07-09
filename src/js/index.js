(function () {

  'use strict';

  var csInterface = new CSInterface();

  document.getElementById('btn_test').addEventListener('click', function () {
    csInterface.evalScript('sayHello()');
  });

}());
