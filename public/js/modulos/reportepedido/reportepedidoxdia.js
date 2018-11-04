$( document ).ready(function() {

  jQuery.validator.setDefaults({
    debug: true,
    success: "valid",
    ignore: ""
  });

  /*$.validator.addMethod("formespn",
    function(value, element) {
      if(value.trim().length)
        return /^(0?[1-9]|[12]\d|3[01])[\.\/\-](0?[1-9]|1[012])[\.\/\-]([12]\d)?(\d\d)$/.test( value );
      else
        return false;
  }, "");*/

  $('#form_busc_consolidado').validate({
    rules:
    {
      fecha_inicio:{ required:true },
      id_cliente: {required:true},
      id_sucursal: {required:true}
    },
    messages: 
    {
      fecha_inicio:{ required:'Error' },
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
      if(element.parent('.col-md-8').length) 
      { 
        error.insertAfter(element.parent()); 
      }
      if(element.parent('.col-md-4').length) 
      { 
        error.insertAfter(element.parent()); 
      }
    },
    submitHandler: function() { alert('mostro3')
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

  $("#datetimepicker6").on("dp.change", function (e) {
    $('#datetimepicker7').data("DateTimePicker").minDate(e.date);
    $('#datetimepicker7').data("DateTimePicker").maxDate(e.date.add(20,'day'));
  });

  $("#datetimepicker6").on("dp.show", function (e) {
    $('#datetimepicker7 input').prop( "disabled", false );
  });
  

  $("#datetimepicker7").on("dp.change", function (e) {
    $('#datetimepicker6').data("DateTimePicker").maxDate(e.date);
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
  var idformulario = parseInt($('#id_formulario').val());

  if(fechai.trim().length)
  {
    idcliente = (idcliente>0) ? (idcliente) : ("_");
    idsucursal = (idsucursal>0) ? (idsucursal) : ("_");
    idformulario = (idformulario>0) ? (idformulario) : ("_");

    url = url+'/buscar'+'/'+fechai+'/'+fechaf+'/'+idcliente+'/'+idsucursal+'/'+idformulario;

    var idgrupo = parseInt($('#id_grupo').val());
    idgrupo = (idgrupo>0) ? (idgrupo) : ('-');

    var idfamilia = parseInt($('#id_familia').val());
    idfamilia = (idfamilia>0) ? (idfamilia) : ('-');

    var idusub = parseInt($('#id_subfamilia').val());
    idusub = (idusub>0) ? (idusub) : ('-');
    url = url+'/'+idgrupo+'/'+idfamilia+'/'+idusub;

    window.location.href = url;
  }
  else
  {
    alerta('seleccionar','Escojer Atributos','error');
  } 
}

$(document).on('click', '.buscar', function (e)
{
  buscar_consolidado();
  //$('#form_busc_consolidado').submit();
});

$(document).on('change', '.id_grupo', function (e) {
  var idgrupo = parseInt($(this).val());
  idgrupo = (idgrupo>0) ? (idgrupo) : (0);
  
  $('.id_familia').html('');
  $('.id_subfamilia').html('');
  if(idgrupo>0)
  {
    $.ajax({
      url: $('base').attr('href') + 'familia/cbox_familia',
      type: 'POST',
      data: 'id_grupo='+idgrupo,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
        if (response.code==1) { console.log(response.data)
          $('select.id_familia').html(response.data);
        }
      },
      complete: function() {
        //hideLoader();
      }
    });
  }
});

$(document).on('change', '.id_familia', function (e) {
  var idfamilia = parseInt($(this).val());
  idfamilia = (idfamilia>0) ? (idfamilia) : (0);

  
  $('.id_subfamilia').html('');
  if(idfamilia>0)
  {
    $.ajax({
      url: $('base').attr('href') + 'subfamilia/cbox_subfamilia',
      type: 'POST',
      data: 'id_subfamilia='+idfamilia,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
        if (response.code==1) {
          $('.id_subfamilia').html(response.data);
        }
      },
      complete: function() {
        //hideLoader();
      }
    });
  }
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

$('#pro_a input[type="checkbox"]').on('change', function() {
  var valor = false;
  var id = $(this).attr('id');
  if($(this).is(":checked"))  {
    valor = true;
  }

  $('#pro_a input[type="checkbox"]').prop('checked', false);
  

  if(valor)
  {
    $('#'+id).prop('checked', valor );
  }
});