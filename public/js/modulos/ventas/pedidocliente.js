$( document ).ready(function() {
  $('#fecha_entrega').daterangepicker({
    singleDatePicker: true,
    format: 'DD-MM-YYYY',
    calender_style: "picker_4"
  }, function(start, end, label) {
    console.log(start.toISOString(), end.toISOString(), label);
  });

  $('#fecha_ingreso').daterangepicker({
    singleDatePicker: true,
    format: 'DD-MM-YYYY',
    calender_style: "picker_4"
  }, function(start, end, label) {
    console.log(start.toISOString(), end.toISOString(), label);
  });
});

$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
  $('#'+id).find('select').val('');
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

$(document).on('change', '#para_hoy', function (e) {
  var page = 0;
  buscar_pedidos(page);
});

function buscar_pedidos(page)
{
  var codigo_busc = $('#codigo_busc').val();
  var formulario_busc = $('#formulario_busc').val();
  var cliente_busc = $('#cliente_busc').val();
  var sede_busc = $('#sede_busc').val();
  var fecha_entrega_busc = $('#fecha_entrega').val();
  var fecha_ingreso_busc = $('#fecha_ingreso').val();
  var estado_busc = $('#estado_busc').val();
  var temp = "page="+page;
  
  if($('#para_hoy').is(':checked'))
  {
    temp=temp+'&para_hoy=1';
  }

  if(codigo_busc.trim().length)
  {
    temp=temp+'&codigo_busc='+codigo_busc;
  }
  if(formulario_busc.trim().length)
  {
    temp=temp+'&formulario_busc='+formulario_busc;
  }
  if(cliente_busc.trim().length)
  {
    temp=temp+'&cliente_busc='+cliente_busc;
  }
  if(sede_busc.trim().length)
  {
    temp=temp+'&sede_busc='+sede_busc;
  }
  if(fecha_entrega_busc.trim().length)
  {
    temp=temp+'&fecha_entrega_busc='+fecha_entrega_busc;
  }

  if(fecha_ingreso_busc.trim().length)
  {
    temp=temp+'&fecha_ingreso_busc='+fecha_ingreso_busc;
  }
  
  if(estado_busc.trim().length)
  {
    temp=temp+'&estado_busc='+estado_busc;
  }

  $.ajax({
    url: $('base').attr('href') + 'pedidocliente/buscar_pedidos',
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
        $('#fecha_entrega').daterangepicker({
          singleDatePicker: true,
          format: 'YYYY-MM-DD',
          calender_style: "picker_4"
        }, function(start, end, label) {
          console.log(start.toISOString(), end.toISOString(), label);
        });

        $('#fecha_ingreso').daterangepicker({
          singleDatePicker: true,
          format: 'YYYY-MM-DD',
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