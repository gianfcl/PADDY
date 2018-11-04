$(document).on('click', '.ver_periodo', function (e) {
  var padre = $(this).closest('tr');

  var titu = (padre.find('td.det input.titu').val());
  var body = (padre.find('td.det input.contperiodos').val());
  var detrango = (padre.find('td.det input.detrango').val());
  var cabe = (padre.find('td.det input.cabe').val());
  var poner = (padre.find('td.det input.poner').val());

  $('table#detponer thead').html(poner);
  $('table#tb_ver thead').html(cabe);
  $('table#tb_ver tbody').html(body);
  $('#ver_titu').html(titu);
  $('#detrango').html(detrango);
});