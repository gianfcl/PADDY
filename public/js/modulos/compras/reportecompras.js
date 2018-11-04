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
      id_almacen: {required:true},
      fecha_inicio:{ date: true },
      fecha_fin:{ date: true }
    },
    messages: 
    {
      id_art_sucursal: {required:"Buscar"},
      id_almacen: {required:"Buscar"},
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
      $('#filtro').modal('hide');
      buscar_kardex();      
    }
  });

  $('#datetimepicker6').datetimepicker({
    format: 'DD-MM-YYYY',
    locale: moment.locale("es")
  });

  $('#datetimepicker7').datetimepicker({
    format: 'DD-MM-YYYY',
    locale: moment.locale("es"), 
    useCurrent: false //Important! See issue #1075
  });

  $("#datetimepicker6").on("dp.change", function (e) { console.log(e.date);
    $('#datetimepicker7').data("DateTimePicker").minDate(e.date);
  });

  $("#datetimepicker6").on("dp.show", function (e) {
    $('#datetimepicker7 input').prop( "disabled", false );
  });
  

  $("#datetimepicker7").on("dp.change", function (e) {
    console.log(e.date);
    $('#datetimepicker6').data("DateTimePicker").maxDate(e.date);
  });

});

$(document).on('focusout', '#datetimepicker6 input', function (e) {
  var fechi = $(this).val();
  if(fechi.trim().length) {}
  else { $('#datetimepicker7 input').prop( "disabled", true );}

});

$(document).on('click', '#buscar_arti .limpiarfiltro', function (e) {
  
  $(this).parents('tr').find('input[type=text]').val('');
  $(this).parents('tr').find('#grupo_busc').val('');
  $(this).parents('tr').find('#familia_busc').html('');
  $(this).parents('tr').find('#subfamilia_busc').html('');
  $(this).parents('tr').find('#um_busc').val('');

  buscar_articulos(0);
});

$(document).on('click', '#buscar_arti li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');

  buscar_articulos(page);
});

$(document).on('click', '#buscar_arti a.paginate_button', function (e) {  
  var page = $(this).attr('tabindex');

  buscar_articulos(page);
});

$(document).on('click', '#buscar_arti a.buscar', function (e) {  
  var page = 0;

  buscar_articulos(page);
});

$(document).on('click', '#paginacion_data li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  $('#num_page').val(page); console.log('page-> '+page);
  buscar_kardex();
});

$(document).on('click', '#paginacion_data a.paginate_button', function (e) {  
  var page = $(this).attr('tabindex');
  $('#num_page').val(page); console.log('page-> '+page);
  buscar_kardex();
});
function buscar_kardex()
{
  $.ajax({
        url: $('base').attr('href') + 'reportecompras/buscar_reportecompras',
        type: 'POST',
        data: $('#form_busc_kardex').serialize(),
        dataType: "json",
        beforeSend: function() {
          $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
        },
        success: function(response) {
          if (response.code==1) 
          {
            $('#datatable-buttons tbody#bodyindex').html(response.data.rta);
            $('#paginacion_data').html(response.data.paginacion);
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
  var grupo_busc = $('#grupo_busc').val();
  var familia_busc = $('#familia_busc').val();
  var subfamilia_busc = $('#subfamilia_busc').val();
  var um_busc = $('#um_busc').val();
  var temp = "page="+page;
  if(codigo_busc.trim().length)
  {
    temp=temp+'&codigo_busc='+codigo_busc; console.log(codigo_busc);
  }
  if(descripcion_busc.trim().length)
  {
    temp=temp+'&descripcion_busc='+descripcion_busc; console.log(descripcion_busc);
  }
  if(parseInt(grupo_busc)>0)
  {
    temp=temp+'&grupo_busc='+grupo_busc;
  }
  if(parseInt(familia_busc)>0)
  {
    temp=temp+'&familia_busc='+familia_busc;
  }
  if(parseInt(subfamilia_busc)>0)
  {
    temp=temp+'&subfamilia_busc='+subfamilia_busc;
  }
  if(parseInt(um_busc)>0)
  {
    temp=temp+'&um_busc='+um_busc;
  }

  $.ajax({
    url: $('base').attr('href') + 'reportecompras/buscar_articulos',
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
  var id_art_sucursal = parseInt(padre.attr('idartsucursal'));
  var id_almacen = parseInt(padre.find('td select#almacen_'+id_art_sucursal).val()); console.log(id_almacen);
  if(id_art_sucursal>0)
  {
    lip_busqueda('form_busc_kardex');    
    
    var codigo = padre.find('td.codigo').html();
    var descri = padre.find('td.descrip').html();
    var umbase = padre.find('td.um_base').html();
    var almacen = padre.find('td select#almacen_'+id_art_sucursal+' option:selected').text();
    //console.log('id_art_sucursal->'+id_art_sucursal+' codigo->'+codigo+' descri->'+descri+' id_almacen->'+id_almacen+' almacen->'+almacen);
    $('#codigo').html(codigo);
    $('#descrip').html(descri);
    $('#um_base').html(umbase);
    $('#id_art_sucursal').val(id_art_sucursal);
    $('#id_almacen').val(id_almacen);
    $('#almacen').html(almacen);

    $('#buscar_arti').modal('hide');
  }
  else
  {
    alerta('No puedo Agregar!', 'Seleccionar Almacén', 'error');
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

  $('#datetimepicker7 input').prop( "disabled", true );
  $('#num_page').val( "0" );

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

$(document).on('change','#grupo_busc',function(){
  var id_grupo = $(this).val();

  $.ajax({
    url: $('base').attr('href') + 'reportecompras/combox_familia',
    type: 'POST',
    data: 'id_grupo='+id_grupo,
    dataType: "json",
    beforeSend: function() {
      //showLoader();
    },
    success: function(response) {
      if (response.code==1) 
      {
        $('#familia_busc').html(response.data);
      }
    },
    complete: function() {
        //hideLoader();
    }
  }); 
});

$(document).on('change','#familia_busc',function(){
  var id_familia = $(this).val();

  $.ajax({
    url: $('base').attr('href') + 'reportecompras/combox_subfamilia',
    type: 'POST',
    data: 'id_familia='+id_familia,
    dataType: "json",
    beforeSend: function() {
      //showLoader();
    },
    success: function(response) {
      if (response.code==1) 
      {
        $('#subfamilia_busc').html(response.data);
      }
    },
    complete: function() {
        //hideLoader();
    }
  }); 
});

