$( document ).ready(function() {

  jQuery.validator.setDefaults({
    debug: true,
    success: "valid",
    ignore: ""
  });

  $('#form_busc_detserv').validate({
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
      if(element.parents('.col-md-4').length) 
      { 
        error.insertAfter(element.parent()); 
      }
    },
    submitHandler: function() {
      $('#page').val('0');
      buscar_detservicios();      
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

$(document).on('click', '#buscarserv .limpiarfiltro', function (e) {
  $(this).parents('tr').find('input[type=text]').val('');
  $(this).parents('tr').find('#familia_busc').html('');
  $(this).parents('tr').find('select').val('');
  buscar_servicios(0);
});

$(document).on('click', '#buscarserv li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');

  buscar_servicios(page);
});

$(document).on('click', '#buscarserv a.paginate_button', function (e) {  
  var page = $(this).attr('tabindex');

  buscar_servicios(page);
});

$(document).on('click', '#buscarserv a.buscar', function (e) {  
  var page = 0;
  buscar_servicios(page);
});

$(document).on('click', '#paginacion_data li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  $('#num_page').val(page); console.log('page-> '+page);
  buscar_detservicios();
});

$(document).on('click', '#paginacion_data a.paginate_button', function (e) {  
  var page = $(this).attr('tabindex');
  $('#num_page').val(page); console.log('page-> '+page);
  buscar_detservicios();
});

function buscar_detservicios()
{
  $.ajax({
        url: $('base').attr('href') + 'reporteservicios/buscar_reporteservicios',
        type: 'POST',
        data: $('#form_busc_detserv').serialize(),
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
          if (response.code==1) 
          {
            $('#datatable-buttons tbody#bodyindex').html(response.data.rta);
            $('#paginacion_data').html(response.data.paginacion);
          }
        },
        complete: function(response) {}
      });
}

function buscar_servicios(page)
{
  var codigo_busc = $('#codigo_busc').val();
  var descripcion_busc = $('#descripcion_busc').val();
  var grupo_busc = $('#grupo_busc').val();
  var familia_busc = $('#familia_busc').val();
  var umc_busc = $('#umc_busc').val();
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
  if(parseInt(umc_busc)>0)
  {
    temp=temp+'&umc_busc='+umc_busc; 
  }

  $.ajax({
    url: $('base').attr('href') + 'reporteservicios/buscar_servicios',
    type: 'POST',
    data: temp,
    dataType: "json",
    beforeSend: function() {
      $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
    },
    success: function(response) {
      if (response.code==1) {
        $('#buscar_arti tbody').html(response.data.rta);
        $('#pagina_data_buscar').html(response.data.paginacion);
      }
    },
    complete: function() {
      $.LoadingOverlay("hide");
    }
  });      
}

$(document).on('click', '.add_serv', function (e)
{
  var padre = $(this).parents('tr');
  var id_servicio = parseInt(padre.attr('idservicio'));
  if(id_servicio>0)
  {
    lip_busqueda('form_busc_detserv');    
    
    var codigo = padre.find('td.cod').html();
    var servicio = padre.find('td.serv').html();
    var umcosto = padre.find('td.um').html();
    $('#codigo').html(codigo);
    $('#servicio').html(servicio);
    $('#um_costo').html(umcosto);
    $('#id_servicio').val(id_servicio);

    $('#buscarserv').modal('hide');
  }
  else
  {
    alerta('No puedo Agregar!', 'Seleccionar Almacén', 'error');
  }
});

$(document).on('click', '.add_servicios', function (e) {
  var page = 0;
  buscar_servicios(page);
});

$(document).on('click', '.limpiarform', function (e) {
  lip_busqueda('form_busc_detserv');
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
  $('#form_busc_detserv').submit();
});

$(document).on('click', '#datatable-buttons a.paginate_button', function (e) {  
  var page = $(this).attr('tabindex');
  $('#num_page').val(page);
  $('#form_busc_detserv').submit();
});

$(document).on('change','#grupo_busc',function(){
  var id_grupo = $(this).val();

  $.ajax({
    url: $('base').attr('href') + 'reporteservicios/combox_familia',
    type: 'POST',
    data: 'id_gruposervicios='+id_grupo,
    dataType: "json",
    beforeSend: function() {
      $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
    },
    success: function(response) {
      if (response.code==1) 
      {
        $('#familia_busc').html(response.data);  
      }
    },
    complete: function() {
      $.LoadingOverlay("hide");
    }
  });   

});