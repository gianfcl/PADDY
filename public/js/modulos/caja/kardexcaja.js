$( document ).ready(function() {

  jQuery.validator.setDefaults({
    debug: true,
    success: "valid",
    ignore: ""
  });

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
      id_caja: {required:true},
      formespn:{ date: true },
      formespn:{ date: true }
    },
    messages: 
    {
      id_moneda: {required:"Buscar"},
      id_caja: {required:"Buscar"}
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
        url: $('base').attr('href') + 'kardexcaja/buscar_kardexcaja',
        type: 'POST',
        data: $('#form_busc_kardex').serialize(),
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
  $('#id_caja').html('');
  if(idmon>0)
  {
    var temp = 'idmoneda='+idmon;
    
    $.ajax({
      url: $('base').attr('href') + 'moventrecaja/cbx_cajadetin',
      type: 'POST',
      data: temp,
      dataType: "json",
      beforeSend: function() {
      },
      success: function(response) {
        if (response.code==1) {
          $('#id_caja').html(response.data.cbxcaja);
        }
      },
      complete: function() {
        //hideLoader();
      }
    }); 
  }
});

$(document).on('click', '.ver_info', function (e) {
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
      url: $('base').attr('href') + 'kardexcaja/ver_documento',
      type: 'POST',
      data: 'id_cobranza='+idcob+'&idtipo='+idtipo+'&det='+det,
      dataType: "json",
      beforeSend: function() {
      },
      success: function(response) {
        if (response.code==1) {
          $('#verdocu').html(response.data.codigo);
          $('#verform_cobranza').html(response.data.html);
        }
      },
      complete: function() {
        //hideLoader();
      }
    });
  }
});