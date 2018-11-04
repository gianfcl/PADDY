$(document).on('click', '#myTab li.tab a', function (e) {
    get_prsn(0);       
});

$(document).on('click', '.add_prsna', function (e)
{
  get_prsn(0);
});

$(document).on('click', '.busc_prn .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
  get_prsn(0);
});

$(document).on('click', '#paginacion_datap li.paginate_button', function (e) {
  get_prsn($(this).find('a').attr('tabindex'));
});

$(document).on('click', '#paginacion_datap a.paginate_button', function (e) {
  get_prsn($(this).attr('tabindex'));
});

$(document).on('click', '.buscarpers', function (e) {
  get_prsn(0);
});

$(document).on('click', '.add_prsn', function (e) {
  var idtipo = $('ul#myTab li.active a').attr('id');
  idtipo = parseInt(idtipo.replace("-tab", ""));
  var tb = $('#controller').val();
  var id = $(this).parents('tr').attr('idpersn');
  var temp = 'id='+id+'&tb='+tb+'&idtipo='+idtipo;

  $.ajax({
    url: $('base').attr('href') + 'clientes/save_prsn',
    type: 'POST',
    data: temp,
    dataType: "json",
    beforeSend: function() {},
    success: function(response) {
      if (response.code==1) {
        get_prsn(0);
        $('#buscarpers').modal('hide');
      }
      var tx = response.code==1 ? "success" : "error";
      alerta(response.message, response.data.error_msg+'.', tx);
    },
    complete: function() {}
  });

});

function get_prsn(page)
{
  var temp = "page="+page;

  var idtipo = $('ul#myTab li.active a').attr('id');
  var tb = $('#controller').val();
  idtipo = parseInt(idtipo.replace("-tab", ""));
  temp = temp+'&tb='+tb+'&idtipo='+idtipo;
  var elemento = "";
  var nam = "";

  $('table tr#filtro'+idtipo+' input').each(function(indice, elemento) {
    elm = $(elemento).val();
    nam = $(elemento).attr('id');
    if(elm.trim().length) { //alert(nam)
      nam = nam.replace("-com", "");
      temp = temp+'&'+nam+'='+elm
    }
  });

  $('#paginacion_datap').html("");
  $.ajax({
    url: $('base').attr('href') + 'clientes/get_prsn',
    type: 'POST',
    data: temp,
    dataType: "json",
    beforeSend: function() {},
    success: function(response) {
      if (response.code==1) {
        $('#paginacion_datap').html(response.data.paginacion);
      }
      $('#buscar_'+idtipo+' tbody').html(response.data.rta);
    },
    complete: function() {}
  });
}