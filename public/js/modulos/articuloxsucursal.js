$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
  $('#'+id).find('select').val('');
  var page = 0;

  buscar_articulos(page);
});

$(document).on('click', '.btn_limp_art', function (e) {
  $('#id_art_sucursal').val('');
  $('#articulo').val('');
  $("select").val("").trigger("change");    
});

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');

  buscar_articulos(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {  
  var page = $(this).attr('tabindex');

  buscar_articulos(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;

  buscar_articulos(page);
});

function buscar_articulos(page)
{
    var codigo_busc = $('#codigo_busc').val();
    var descripcion_busc = $('#descripcion_busc').val();
    var inid_med_base_busc = $('#inid_med_base_busc').val();
    var grupo_busc = $('#grupo_busc').val();
    var familia_busc = $('#familia_busc').val();
    var subfamilia_busc = $('#subfamilia_busc').val();
    var estado_busc = $('#estado_busc').val();
    var temp = "page="+page;

    if(estado_busc.trim().length)
    {
    temp=temp+'&estado_busc='+estado_busc;
    }
    
    if(codigo_busc.trim().length)
    {
    temp=temp+'&codigo_busc='+codigo_busc;
    }

    if(descripcion_busc.trim().length)
    {
    temp=temp+'&descripcion_busc='+descripcion_busc;
    }

    if(inid_med_base_busc.trim().length)
    {
    temp=temp+'&inid_med_base_busc='+inid_med_base_busc;
    }

    if(grupo_busc.trim().length)
    {
    temp=temp+'&grupo_busc='+grupo_busc;
    }

    if(familia_busc.trim().length)
    {
    temp=temp+'&familia_busc='+familia_busc;
    }
    
    if(subfamilia_busc.trim().length)
    {
      temp=temp+'&subfamilia_busc='+subfamilia_busc;
    }
    $.ajax({
      url: $('base').attr('href') + 'articuloxsucursal/buscar_articulos',
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
          //hideLoader();
      }
  });
}

$(document).on('click', '.delete', function (e) {
  e.preventDefault();
  var nomb = "Artículo!";
  var idarticulo = $(this).parents('tr').attr('idarticulo');
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');

  swal({
    title: 'Estas Seguro?',
    text: "De Desactivar este "+nomb,
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, estoy seguro!'
  }).then(function(isConfirm) {
    if (isConfirm) {     
      $.ajax({
        url: $('base').attr('href') + 'articuloxsucursal/delete',
        type: 'POST',
        data: 'id_art_sucursal='+idarticulo,
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            if (response.code==1) {
              var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
              buscar_articulos(page);
            }
        },
        complete: function() {
          var text = "Desactivo!";
          alerta(text, 'Este '+nomb+' se '+text+'.', 'success');
        }
      });
    }
  });    
});