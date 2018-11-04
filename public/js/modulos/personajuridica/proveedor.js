$( document ).ready(function() {


  /*$('#id_tipodocumento').selectpicker();
  $('#id_formapago').selectpicker();
  $('#id_moneda').selectpicker();*/

  var url_modulo = $('#url_modulo').val();

  jQuery.validator.setDefaults({
    debug: true,
    success: "valid",
    ignore: ""
  });

  $('#form_save_pers_juridica').validate({
    rules:
    {
      id_persona_juridica: { required:true }   
    },
    messages: 
    {
      ruc: { required:"" }
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
      if(element.parent('.form-group').length) 
      {
        error.insertAfter(element.parent());
      } 
      else if(element.parent('.col-md-12').length){ 
        error.insertAfter(element.parent());
      }
      else if(element.parent('.col-md-9').length){ 
        error.insertAfter(element.parent());
      }
      else
      {
        error.insertAfter(element.parent());
      }
    },
    submitHandler: function() {
      $.ajax({
        url: $('base').attr('href') + url_modulo+'/save_proveedor',
          type: 'POST',
          async:false,
          data: $('#form_save_pers_juridica').serialize(),
          dataType: "json",
          beforeSend: function() {
            $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
          },
          success: function(response) {
            if (response.code==1) {
              swal({
                title: 'Se ha guardado',
                text: "correctamente esta configuración!!",
                type: 'success',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Listo!'
              }).then((result) => {
                console.log(result);
                if (result) {
                  direccionar();
                }
              })
            }
          },
          complete: function() {
            $.LoadingOverlay("hide");
          }
      });/**/
    }
  });
  
});

$(document).on('change','input[name="agente_percepcion"]',function(){
  if($(this).is(':checked'))
  {
    $('input[name="percepcion"]').prop('disabled',false);
  }
  else
  {
    $('input[name="percepcion"]').prop('disabled',true);
    $('input[name="percepcion"]').val('');
  }
});