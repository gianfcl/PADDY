$( document ).ready(function() {

  jQuery.validator.setDefaults({
    debug: true,
    success: "valid",
    ignore: ""
  });

  $('#form_busc_kardex').validate({
    rules:
    {
      id_art_sucursal: {required:true},
      fecha_inicio:{ date: true },
      fecha_fin:{ date: true }
    },
    messages: 
    {
      id_art_sucursal: {required:"Buscar"},
      fecha_inicio:{ date: "Fecha Invalida" },
      fecha_fin:{ date: "Fecha Invalida" }
    },      

    highlight: function(element) {
      $(element).closest('.form-group').addClass('has-error');       
    },
    unhighlight: function(element) {
      $(element).closest('.form-group').removeClass('has-error');
    },
    errorElement: 'span',
    errorClass: 'help-block',
    errorPlacement: function(error, element) 
    {
      if(element.parent('.col-md-4').length) 
      { 
        error.insertAfter(element.parent()); 
      }
    },
    submitHandler: function() {
      $('#page').val('0');
      buscar_kardex();      
    }
  });
});

$(document).on('click', '#buscar_arti .limpiarfiltro', function (e) {
  $(this).parents('tr').find('input[type=text]').val('');
  buscar_articulos(0);
});

$(document).on('click', '#buscarart #datatable_paginate li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');

  buscar_articulos(page);
});

$(document).on('click', '#buscarart #datatable_paginate a.paginate_button', function (e) {  
  var page = $(this).attr('tabindex');
  buscar_articulos(page);
});

$(document).on('click', '#buscar_arti a.buscar', function (e) {  
  var page = 0;

  buscar_articulos(page);
});

function buscar_kardex()
{
  $.ajax({
    url: $('base').attr('href') + 'stocktotalxempresa/buscar_stocktotal',
    type: 'POST',
    data: $('#form_busc_kardex').serialize(),
    dataType: "json",
    beforeSend: function() {
      $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
    },
    success: function(response) {
      if (response.code==1) 
      {
        $('.content-main').html(response.data.rta);
      }
    },
    complete: function(response) {
      $.LoadingOverlay("hide");
    }
  });
}

function buscar_articulos(page)
{
  var codigo_busc = $('#codigo_busc').val();
  var descripcion_busc = $('#descripcion_busc').val();
  var temp = "page="+page;
  if(codigo_busc.trim().length)
  {
    temp=temp+'&codigo_busc='+codigo_busc; console.log(codigo_busc);
  }
  if(descripcion_busc.trim().length)
  {
    temp=temp+'&descripcion_busc='+descripcion_busc; console.log(descripcion_busc);
  }

  $.ajax({
    url: $('base').attr('href') + 'stocktotalxempresa/buscar_articulos',
    type: 'POST',
    data: temp,
    dataType: "json",
    beforeSend: function() {
      //showLoader();
    },
    success: function(response) {
      if (response.code==1) {
        $('#buscar_arti tbody').html(response.data.rta);
        $('#pagina_data_buscar').html(response.data.paginacion);
      }
    },
    complete: function() {
        //hideLoader();
    }
  });      
}

$(document).on('click', '.add_arti', function (e)
{
  var padre = $(this).parents('tr');
  var id_articulo = parseInt(padre.attr('idarticulo'));
  if(id_articulo>0)
  {
    lip_busqueda('form_busc_kardex');    
    
    var codigo = padre.find('td.codigo').html();
    var descri = padre.find('td.descrip').html();
    var umbase = padre.find('td.um_base').html();
    $('#codigo').html(codigo);
    $('#descrip').html(descri);
    $('#um_base').html(umbase);
    $('#id_articulo').val(id_articulo);

    $('#buscarart').modal('hide');
  }
  else
  {
    alerta('No puedo Agregar!', 'Seleccionar Articulo', 'error');
  }
});

$(document).on('click', '.add_articulos', function (e) {
  var page = 0;
  buscar_articulos(page);
});

$(document).on('click', '.limpiarform', function (e) {
  lip_busqueda('form_busc_kardex');
});

function lip_busqueda(form)
{
  $('#'+form+' input').each(function (index, value){
    if($(this).attr('type')=="text" || $(this).attr('type')=="hidden")
    {
      if($(this).parents('.form-group').attr('class')=="form-group has-error")
      {
        $(this).parents('.form-group').removeClass('has-error');
      }

      $(this).val('');

      id = $(this).attr('id');
      if($('#'+id+'-error').length>0)
      {
        $('#'+id+'-error').html('');
      }
    }
  });

  $('#'+form+' label.bordelabel').each(function (index, value){
    $(this).html('');
  });

  var validatore = $( '#'+form ).validate();
  validatore.resetForm();
  $('#datatable-buttons tbody#bodyindex').html("<tr><td colspan='11'><h2 class='text-center text-success'>No se hay registro</h2></td></tr>");
  $('#paginacion_data').html('');
}

$(document).on('click', '#datatable-buttons li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  $('#num_page').val(page);
  $('#form_busc_kardex').submit();
});

$(document).on('click', '#datatable-buttons a.paginate_button', function (e) {  
  var page = $(this).attr('tabindex');
  $('#num_page').val(page);
  $('#form_busc_kardex').submit();
});