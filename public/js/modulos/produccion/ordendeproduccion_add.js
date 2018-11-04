$( document ).ready(function() {
  $('#datetimepicker6').datetimepicker({
    format: 'DD-MM-YYYY',
    locale: moment.locale("es"),
    minDate: moment()
  });
  $.validator.addMethod("formespn",
    function(value, element) {
      if(value.trim().length)
        return /^(0?[1-9]|[12]\d|3[01])[\.\/\-](0?[1-9]|1[012])[\.\/\-]([12]\d)?(\d\d)$/.test( value );
      else
        return false;
  }, "Ingrese est Formato dd-mm-yyyy");

  $.validator.addMethod("regex", function(value, element) {
    var exp = value;
    if (exp <= 0) { return false; }
    else {
        if($.isNumeric(exp)){ return true; }
        else{ return false; }
    }
  }, "Solo #s Mayores a 0");

  $('#saveordendeproduccion').validate({
      rules:
      {
        cantidad:{regex:true},
        fecha_planificacion: {formespn:true},
        id_ordendeproduccionprioridad: {required:true},
        id_operario:{required:true}
      },
      messages: 
      {
        id_ordendeproduccionprioridad: {required:"Seleccionar Prioridad"},
        id_operario:{required:"Seleccionar Operario"}
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
        if(element.parent('.col-md-6').length) 
        {
          error.insertAfter(element.parent()); 
        }
      },
      submitHandler: function() {
        crear_ordenproduccion();
      }
    });
});

function crear_ordenproduccion()
{
  var temp = $('#saveordendeproduccion').serialize();
  var fech = "";
  if($('#fecha_planificacion').length)
  {
    fech = datetoing($('#fecha_planificacion').val());
  }
  temp = temp+'&fecha_planificacion='+fech;
  $.ajax({
    url: $('base').attr('href') + 'ordendeproduccionop/crear_ordenproduccion',
    type: 'POST',
    data: temp,
    dataType: "json",
    beforeSend: function() {
      //showLoader();
    },
    success: function(response) {
      if(response.code == 3)
      {
        alerta('Error', 'Cambiar Articulo.', 'error');
      }
      else
      {
        alerta('Guardo', 'Esta Planeación.', 'success');
      } 
    },
    complete: function(response) {     
    }
  });
}

$(document).on('click', 'div#divestados button', function (e) {
  var text = $('div#divestados button').html();
  $('#estadosmodulos').html(text);
  $('div#divestados button').removeClass('btn-primary');
  $('div#divestados button').removeClass('btn-default');
  $('div#divestados button').addClass('btn-default');
  $(this).removeClass('btn-default');
  $(this).addClass('btn-primary');
  var estadopla = parseInt($(this).attr('estado')); //alert(estadopla)
  $('#checkaestado').val(estadopla);

  if(estadopla==8)
  {
    $('#saveordendeproduccion').submit();
  }
  else
  {
    crear_ordenproduccion();
  }
});

/**/