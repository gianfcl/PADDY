$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
  buscar_articulos(0);
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
    var inid_med_venta_busc = $('#inid_med_venta_busc').val();
    var grupo_busc = $('#grupo_busc').val();
    var familia_busc = $('#familia_busc').val();
    var id_formulario = $('#datatable-buttons').attr('idformulario');
    var temp = "page="+page+'&id_formulario='+id_formulario;

    if(codigo_busc.trim().length)
    {
    temp=temp+'&codigo_busc='+codigo_busc;
    }

    if(descripcion_busc.trim().length)
    {
    temp=temp+'&descripcion_busc='+descripcion_busc;
    }

    if(inid_med_venta_busc.trim().length)
    {
    temp=temp+'&inid_med_venta_busc='+inid_med_venta_busc;
    }

    if(grupo_busc.trim().length)
    {
    temp=temp+'&grupo_busc='+grupo_busc;
    }

    if(familia_busc.trim().length)
    {
    temp=temp+'&familia_busc='+familia_busc;
    }
    $.ajax({
      url: $('base').attr('href') + 'formulario/buscar_articulos',
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

$(document).on('click', '.addformulario', function (e) {
  var padre = $(this);
  var estado = '&estado=1';
  var idformularioart = padre.parents('tr').attr('idformularioart');
  var idarticulo = padre.parents('tr').attr('idarticulo');
  var id_formulario = padre.parents('table').attr('idformulario');  
  var temp = 'id_formulario_art='+idformularioart+'&id_articulo='+idarticulo+'&id_formulario='+id_formulario+estado;
  addsucu(temp,'Agregado!');
});

$(document).on('click', '.delete', function (e) {  
  e.preventDefault();
  var padre = $(this);
  var estado = '&estado=0';
  var idformularioart = padre.parents('tr').attr('idformularioart');
  var idarticulo = padre.parents('tr').attr('idarticulo');
  var id_formulario = padre.parents('table').attr('idformulario');  
  swal({
    title: 'Estas Seguro?',
    text: "De Eliminar este Artículo!",
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, estoy seguro!'
  }).then(function(isConfirm) {
    if (isConfirm) {      
      var temp = 'id_formulario_art='+idformularioart+'&id_articulo='+idarticulo+'&id_formulario='+id_formulario+estado;
      addsucu(temp,'Elininado!');
    }
  });
});

function addsucu(temp, text)
{
  $.ajax({
    url: $('base').attr('href') + 'formulario/addformulario',
    type: 'POST',
    data: temp,
    dataType: "json",
    beforeSend: function() {
        //showLoader();
    },
    success: function(response) {
      if (response.code==1) {
        var page = 0;
        if($('#paginacion_data ul.pagination li.active a').length>0)
        {
          page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
        }
        buscar_articulos(page);
        alerta(text, 'Este Artículo a sido'+text+'.', 'success');
      }
    },
    complete: function() {
        //hideLoader();
    }
  });
}