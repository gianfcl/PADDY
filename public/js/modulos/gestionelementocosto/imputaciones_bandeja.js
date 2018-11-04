/*Validar Al Salir del Formulario*/
$( document ).ready(function() {
  $('#selemes').datetimepicker({    
    viewMode: 'years',
    format: 'MM-YYYY',
    locale: moment.locale("es")
  });
});

$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
  $('#'+id).find('select').val('');
  buscar_documentos(0);
});

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  buscar_documentos(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_documentos(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_documentos(page);
});

function buscar_documentos(page)
{
  var sist_busc = $('#sist_busc').val();
  var codigo_busc = $('#codigo_busc').val();
  var descrip_busc = $('#descrip_busc').val();
  var idcectro = parseInt($('#idcectro').val());
  var idactiv = parseInt($('#idactiv').val());
  var mes = $('#mes').val();

  var temp = "page="+page;
  if(sist_busc.trim().length)
  {
    temp=temp+'&sist_busc='+sist_busc;
  }
  if(codigo_busc.trim().length)
  {
    temp=temp+'&codigo_busc='+codigo_busc;
  }
  if(descrip_busc.trim().length)
  {
    temp=temp+'&descrip_busc='+descrip_busc;
  }
  if(idcectro>0)
  {
    temp=temp+'&idcectro='+idcectro;
    if(idactiv>0)
    {
      temp=temp+'&idactiv='+idactiv;
    }
  }
  if(mes.trim().length)
  {
    temp=temp+'&mes='+mes;
  }

  $.ajax({
    url: $('base').attr('href') + 'imputaciones/buscar_documentos',
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
      }
    },
    complete: function() {        
    }
  });
}

$(document).on('change', '#idcectro', function (e) {
  var padre = $(this);
  var idcc = parseInt(padre.val());
  if(idcc>0)
  {
    $.ajax({
    url: $('base').attr('href') + 'areacosto/cbx_areacosto',
    type: 'POST',
    data: 'id_centrocosto='+idcc,
    dataType: "json",
    beforeSend: function() {
    },
    success: function(response) {
      if (response.code==1) {
        $('select#idactiv').html(response.data);
      }
    },
    complete: function() {
    }
  });
  }
  else
  {
    $('select#idactiv').html("");
  }
});