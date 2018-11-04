$(document).on('click', '.irmas', function (e) {

  var url = $('base').attr('href');
  url = url+$(this).attr('url');
  window.location.href = url;
});