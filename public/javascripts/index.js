$(function() {
  $('form').submit(function(e) {
    e.preventDefault();
    window.location.href = "/user/"+$('#user_input').val()
  });
});