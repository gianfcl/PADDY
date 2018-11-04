$( document ).ready(function() {
  $('#fechadocu_busc').daterangepicker({
    singleDatePicker: true,
    format: 'DD-MM-YYYY',
    calender_style: "picker_4"
    }, 
    function(start, end, label) {}
  );

  $('#datatable-buttons a.editfecha').editable({
    url: $('base').attr('href') + 'salidaxconsumointerno/edit_fecha',
    ajaxOptions: { type: 'post', dataType: 'json'},
    title: 'Editar Fecha',
    combodate:{
      showbuttons: true,
      roundTime: false,
      smartDays: true
    } 
  });

});

$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
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
  var fechadocu_busc = $('#fechadocu_busc').val();
  var fechadocu_busc = $('#fechadocu_busc').val();

  var idtipomov = $('#datatable-buttons').attr('idtipomov');
  var temp = "page="+page+'&id_tipomovimiento='+idtipomov;
  if(codigo_busc.trim().length)
  {
    temp=temp+'&codigo_busc='+codigo_busc;
  }

  if(fechadocu_busc.trim().length)
  {
    temp=temp+'&fechadocu_busc='+fechadocu_busc;
  }
  
  if(fechadocu_busc.trim().length)
  {
    temp=temp+'&fechadocu_busc='+fechadocu_busc;
  }

  $.ajax({
    url: $('base').attr('href') + 'ingresoxajusteinvent/buscar_documentos',
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