$( document ).ready(function() {

  jQuery.validator.setDefaults({
    debug: true,
    success: "valid",
    ignore: ""
  });

  $('#filtro').modal('show');
  $('#id_moneda').change();

  $.validator.addMethod("formespn",
    function(value, element) {
      if(value.trim().length)
        return /^(0?[1-9]|[12]\d|3[01])[\.\/\-](0?[1-9]|1[012])[\.\/\-]([12]\d)?(\d\d)$/.test( value );
      else
        return true;
  }, "Ingrese est Formato dd-mm-yyyy");

  $('#form_busc_kardex').validate({
    rules:
    {
      id_moneda: {required:true},
      id_cuenta: {required:true},
      formespn:{ date: true },
      formespn:{ date: true }
    },
    messages: 
    {
      id_moneda: {required:"Buscar"},
      id_cuenta: {required:"Buscar"}
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

$('#datetimepicker7').datetimepicker({
  format: 'DD-MM-YYYY',
  locale: moment.locale("es"), 
  useCurrent: false //Important! See issue #1075
});

$(function () {
  $('#datetimepicker6').datetimepicker({
    format: 'DD-MM-YYYY',
    locale: moment.locale("es")
  });
});
  $("#datetimepicker6").on("dp.change", function (e) { console.log(e.date);
    if($('#datetimepicker7').data("DateTimePicker").date())
    {
      $('#datetimepicker7').data("DateTimePicker").minDate(e.date);
    }
  });

  $("#datetimepicker6").on("dp.show", function (e) {
    $('#datetimepicker7 input').prop( "disabled", false );
  });
  

  $("#datetimepicker7").on("dp.change", function (e) {
    $('#datetimepicker6').data("DateTimePicker").maxDate(e.date);
  });

});

$(document).on('focusout', '#datetimepicker6 input', function (e) {
  var fechi = $(this).val();
  if(fechi.trim().length) {}
  else { $('#datetimepicker7 input').prop( "disabled", true );}

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
        url: $('base').attr('href') + 'kardexcuenta/buscar_kardexcuenta',
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
            $('#txt').text(response.data.cuenta);
            $('#filtro').modal('hide');
          }
        },
        complete: function(response) {
          $.LoadingOverlay("hide");
        }
      });
}

$(document).on('click', '.limpiarform', function (e) {
  lip_busqueda('form_busc_kardex');
});

function lip_busqueda(form)
{
  $('#datetimepicker7 input').prop( "disabled", true );
  $('#num_page').val( "0" );

  var validatore = $( '#'+form ).validate();
  validatore.resetForm();
  $('#datatable-buttons tbody#bodyindex').html("<tr><td colspan='7'><h2 class='text-center text-success'>No se hay registro</h2></td></tr>");
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


$(document).on('change', '#id_moneda', function (e) {
  var padre = $(this);
  var idmon = parseInt(padre.val());
  $('#id_cuenta').html('');
  if(idmon>0)
  {
    var temp = 'idmoneda='+idmon;
    
    $.ajax({
      url: $('base').attr('href') + 'moventrecuenta/cbx_cuentadetin',
      type: 'POST',
      data: temp,
      dataType: "json",
      beforeSend: function() {
        $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
      },
      success: function(response) {
        if (response.code==1) {
          $('#id_cuenta').html(response.data.cbxcuenta);
        }
      },
      complete: function() {
        $.LoadingOverlay("hide");
      }
    }); 
  }
});

$(document).on('click', '.ver_docu', function (e) {
  var tis = $(this);
  var padre = tis.closest('tr');
  var idcob = parseInt(padre.attr('idcobranza'));
  var idtipo = parseInt(padre.attr('idtipo'));
  var det = parseInt(padre.attr('det'));
  $('#verform_cobranza').html('');
  $('#verdocu').html('');
  if(idcob>0 && idtipo>0)
  {
    $.ajax({
      url: $('base').attr('href') + 'kardexcuenta/ver_documento',
      type: 'POST',
      data: 'id_cobranza='+idcob+'&idtipo='+idtipo+'&det='+det,
      dataType: "json",
      beforeSend: function() {
        $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
      },
      success: function(response) {
        if (response.code==1) {
          $('#verdocu').html(response.data.codigo);
          $('#verform_nuevoingreso').html(response.data.html);
          $('#verform_sis').html(response.data.htm);
        }
      },
      complete: function() {
        $.LoadingOverlay("hide");
      }
    });
  }
});