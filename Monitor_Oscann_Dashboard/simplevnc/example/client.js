var svnc = require('../index.js');


/*function LoadOnce() {
  if (localStorage.getItem('executed') == 'false') {
  window.location.reload()
  localStorage.setItem('executed', true)
  }
  }
  
  setTimeout(function () {
  LoadOnce()
  }, 1000)*/
 /* 
  const reloadUsingLocationHash = () => {
    window.location.reload()
  }
  window.onload = reloadUsingLocationHash();

*/
/* attach screen to canvas, create client */
var canvas = document.getElementById('screen'),
  screen = new svnc.Screen(canvas),
  client = new svnc.Client(screen);

var screenWrapper = document.getElementById('screen-wrapper'),
  formWrapper = document.getElementById('form-wrapper'),
  loginBtn = document.getElementById('login-btn'),
  disconnectBtn = document.getElementById('disconnect-btn'),
  errorBar = document.getElementById('error-bar');

disconnectBtn.addEventListener('click', function() {
  client.disconnect();
  screenWrapper.style.display = 'none';
  formWrapper.style.display = 'block';
});

const params_response = require("./params.json");
console.log(params_response)

document.getElementById('host').value = params_response[0];
document.getElementById('port').value = params_response[1];

loginBtn.addEventListener('click', function() {
  const params_response = require("./params.json");
  console.log(params_response)

  var config = {
    host: document.getElementById('host').value,
    port: document.getElementById('port').value,
    password: document.getElementById('password').value
  };

  /* connect to a vnc server */
  client.connect(config).then(function() {
    formWrapper.style.display = 'none';
    screenWrapper.style.display = 'block';
    errorBar.classList.add("hide");
  }).catch(function(error) {
    console.error('Connect failed:', error);
    errorBar.textContent = "Failed to connect";
    errorBar.classList.remove("hide");
  })
}, false);
