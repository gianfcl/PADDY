$( document ).ready(function() {
  $('#fecha_busc,#fecha_doc_busc').daterangepicker({
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
    var fecha_busc = $('#fecha_busc').val();
    var usuario_busc = $('#usuario_busc').val();
    var registro_busc = $('#registro_busc').val();
    var fecha_doc_busc = $('#fecha_doc_busc').val();
    var orden_busc = $('#orden_busc').val();
    var costo_busc = $('#costo_busc').val();
    var idtipmov = parseInt($('#idtipmov').val());


    var temp = "page="+page;
    if(idtipmov>0)
    {
      temp=temp+'&idtipmov='+idtipmov;
    }
    
    if(fecha_busc.trim().length)
    {
      temp=temp+'&fecha_busc='+fecha_busc;
    }
    if(usuario_busc.trim().length)
    {
        temp=temp+'&usuario_busc='+usuario_busc;
    }
    if(registro_busc.trim().length)
    {
        temp=temp+'&registro_busc='+registro_busc;
    }
    if(fecha_doc_busc.trim().length)
    {
        temp=temp+'&fecha_doc_busc='+fecha_doc_busc;
    }
    if(orden_busc.trim().length)
    {
        temp=temp+'&orden_busc='+orden_busc;
    }
    if(costo_busc.trim().length)
    {
        temp=temp+'&costo_busc='+costo_busc;
    }

  $.ajax({
    url: $('base').attr('href') + 'salidaxproduccion/buscar_documentos',
    type: 'POST',
    data: temp,
    dataType: "json",
    beforeSend: function() {
      $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
    },
    success: function(response) {
      if (response.code==1) {
        $('#datatable-buttons tbody#bodyindex').html(response.data.rta);
        $('#paginacion_data').html(response.data.paginacion);
        $('#fecha_busc').daterangepicker({
          singleDatePicker: true,
          format: 'YYYY-MM-DD',
          calender_style: "picker_4"
        }, function(start, end, label) {
          console.log(start.toISOString(), end.toISOString(), label);
        });
      }
    },
    complete: function() {
      $.LoadingOverlay("hide");    
    }
  });
}
$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
  $('#'+id+' select').val('');
  buscar_documentos(0);
});