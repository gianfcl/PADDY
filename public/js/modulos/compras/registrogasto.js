$( document ).ready(function() {
  $('#fecha_busc').daterangepicker({
    singleDatePicker: true,
    format: 'YYYY-MM-DD',
    calender_style: "picker_4"
    }, 
    function(start, end, label) {}
  );

});

$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
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
  var codigo_busc = $('#codigo_busc').val();
  var serie_busc = $('#serie_busc').val();
  var numero_busc = $('#numero_busc').val();
  var tipodoc_busc = $('#tipodoc_busc').val();
  var fecha_busc = $('#fecha_busc').val();
  var ruc_dni = $('#ruc_dni').val();
  var nombres_com = $('#nombres_com').val();
  var id_tipomov = $('#id_tipomovimiento').val();
  //var estado_busc = $('#estado_busc').val();

  var temp = "page="+page+'&id_tipomovimiento='+id_tipomov;
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
  if(tipodoc_busc.trim().length)
  {
    temp=temp+'&tipodoc_busc='+tipodoc_busc;
  }  
  if(fecha_busc.trim().length)
  {
    temp=temp+'&fecha_busc='+fecha_busc;
  }
  if(ruc_dni.trim().length)
  {
    temp=temp+'&ruc_dni='+ruc_dni;
  }
  if(nombres_com.trim().length)
  {
    temp=temp+'&nombres_com='+nombres_com;
  }

  $.ajax({
    url: $('base').attr('href') + 'registrogasto/buscar_documentos',
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