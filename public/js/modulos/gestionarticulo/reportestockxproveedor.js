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
      id_almacen: {required:true}
    },
    messages: 
    {
      id_almacen: { required:"seleccionar" }
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
});

function buscar_consolidado()
{
  var url = $('#linkmodulo').val();
  var idalm = parseInt($('#id_almacen').val());
  idalm = (idalm>0) ? (idalm) : (0);
  if(idalm>0)
  {
    url = url+'/buscar'+'/'+idalm;
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