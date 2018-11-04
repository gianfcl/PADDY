$( document ).ready(function() {
    $('#fechat_busc').daterangepicker({
    singleDatePicker: true,
    format: 'DD-MM-YYYY',
    calender_style: "picker_4"
  }, function(start, end, label) {
    console.log(start.toISOString(), end.toISOString(), label);
  });

  $('#fechat_crea').daterangepicker({
    singleDatePicker: true,
    format: 'DD-MM-YYYY',
    calender_style: "picker_4"
  }, function(start, end, label) {
    console.log(start.toISOString(), end.toISOString(), label);
  });

  $( "#formulario" ).autocomplete({
    type:'POST',
    serviceUrl: $('base').attr('href')+"formulario/get_formulario",
    onSelect: function (suggestion) {
      $('#id_formulario').val(suggestion.id_formulario);
    }
  });
});

$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
  $('#'+id).find('input[type=hidden]').val('');
  $("#estadoGuia").val('1')
  buscar_pedidos(0);
});

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  buscar_pedidos(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_pedidos(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_pedidos(page);
});

function buscar_pedidos(page)
{
  var codigo_busc = $('#codigo_busc').val();
  var serie_busc = $('#serie_busc').val();
  var numero_busc = $('#numero_busc').val();
  var fechat_crea = $('#fechat_crea').val();
  var fechat_busc = $('#fechat_busc').val();
  var ruc_dni = $('#ruc_dni').val();
  var nombres_com = $('#nombres_com').val();
  var idformu = $('#id_formulario').val();
  var formu = $('#formulario').val();
  var idsuculle = $('#idsuculle').val();
  var usuario = $('#usuario').val();
  //var mtraslado = $('#mtraslado').val();
  var estadoGuia = $('#estadoGuia').val();

  var temp = "page="+page;
  /*if(mtraslado.trim().length)
  {
    temp=temp+'&mtraslado='+mtraslado;
  }*/
  if(usuario.trim().length)
  {
    temp=temp+'&usuario='+usuario;
  }
  if(fechat_crea.trim().length)
  {
    temp=temp+'&fechat_crea='+fechat_crea;
  }
  if(idsuculle.trim().length)
  {
    temp=temp+'&idsuculle='+idsuculle;
  }
  if (idformu === undefined){}else{
  if(idformu.trim().length && formu.trim().length)
  {
    temp=temp+'&id_formulario='+idformu;
  }}
  if(codigo_busc.trim().length)
  {
    temp=temp+'&codigo_busc='+codigo_busc;
  }
  if(numero_busc.trim().length)
  {
    temp=temp+'&numero_busc='+numero_busc;
  }
  if(serie_busc.trim().length)
  {
    temp=temp+'&serie_busc='+serie_busc;
  }

  if(fechat_busc.trim().length)
  {
    temp=temp+'&fechat_busc='+fechat_busc;
  }
  if(ruc_dni.trim().length)
  {
    temp=temp+'&ruc_dni='+ruc_dni;
  }
  if(nombres_com.trim().length)
  {
    temp=temp+'&nombres_com='+nombres_com;
  }
  if(estadoGuia.trim().length)
  {
    temp=temp+'&estadoGuia='+estadoGuia;
  }

  $.ajax({
    url: $('base').attr('href') + 'guiaremision/buscar_guiasremision',
    type: 'POST',
    data: temp,
    dataType: "json",
    beforeSend: function() {
        //showLoader();
    },
    success: function(response) {
      if (response.code==1) {
        $('#datatable-buttons tbody#bodyindex').html(response.data.rta);
        $('#paginacion_data').html(response.data.paginacion);
        $('#fechat_busc').daterangepicker({
          singleDatePicker: true,
          format: 'DD-MM-YYYY',
          calender_style: "picker_4"
        }, function(start, end, label) {
          console.log(start.toISOString(), end.toISOString(), label);
        });
      }
    },
    complete: function() {        
    }
  });
}