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
        return false;
  }, "");

  $('#form_busc_consolidado').validate({
    rules:
    {
      fecha_inicio:{ formespn:true },
      id_cliente: {required:true},
      id_sucursal: {required:true}
    },
    messages: 
    {
      id_cliente: { required:"Buscar" },
      id_sucursal: { required:"seleccionar" }
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
      buscar_consolidado();      
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

$(function () {
  $( "#cliente" ).autocomplete({
    type:'POST',
    serviceUrl: $('base').attr('href')+"clientes/get_all_info_cliente",
    onSelect: function (suggestion) 
    {
      $('#id_cliente').val(suggestion.id_cliente);
      $('#cliente').val(suggestion.value);
      $('#id_sucursal').html(suggestion.cbx_sucur);
      if($('#id_cliente-error').size())
      {
        $('#id_cliente-error').remove();
      }
    }
  });
});

function buscar_consolidado()
{
  var url = $('#linkmodulo').val();
  var fechai = $('#fecha_inicio').val();
  var fechaf = $('#fecha_fin').val();
  fechaf = (fechaf.trim().length) ? (fechaf) : ("_");

  var idcliente = parseInt($('#id_cliente').val());
  var idsucursal = parseInt($('#id_sucursal').val());

  var porcomprar = "_";
  if($('#porcomprar').is(":checked"))  {
    porcomprar = 2;
  }  

  if(idsucursal>0 && fechai.trim().length)
  {
    idcliente = (idcliente>0) ? (idcliente) : ("_");
    idsucursal = (idsucursal>0) ? (idsucursal) : ("_");

    url = url+'/buscar/'+fechai+'/'+fechaf+'/'+idcliente+'/'+idsucursal+'/'+porcomprar;

    window.location.href = url;
  }
  else
  {
    alerta('seleccionar','Escojer Atributos','error');
  } 
}

$(document).on('click', '.buscar', function (e)
{
  $('#form_busc_consolidado').submit();
});