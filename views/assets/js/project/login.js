$(document).ready(function() {

  $('#test').click(function() {
    $.ajax({
      type: 'GET',
      url: '/dashboard',
      beforeSend: function(xhr) {
        if (localStorage.token) {
          xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token);
        }
      },
      success: function(data) {
        alert('Hello ' + data.name + '! You have successfully accessed to /api/profile.');
      },
      error: function() {
        alert("Sorry, you are not logged in.");
      }
    });
  });

  $('#goodLogin').click(function() {
    $.ajax({
      type: "POST",
      url: "/login",
      data: {
        username: "john.doe",
        password: "foobar"
      },
      success: function(data) {
        localStorage.token = data.token;
        alert('Got a token from the server! Token: ' + data.token);
      },
      error: function() {
        alert("Login Failed");
      }
    });
  });

  $('#badLogin').click(function() {
    $.ajax({
      type: "POST",
      url: "/login",
      data: {
        username: "john.doe",
        password: "foobarfoobar"
      },
      success: function(data) {
        alert("ERROR: it is not supposed to alert.");
      },
      error: function() {
        alert("Login Failed");
      }
    });
  });

  $('#logout').click(function() {
    localStorage.clear();
  });
});