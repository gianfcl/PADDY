$( document ).ready(function() {

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
          url: $('base').attr('href') + 'personajuridica/save_proveedor',
          type: 'POST',
          data: $('#form_save_pers_juridica').serialize(),
          dataType: "json",
          beforeSend: function() {
              //showLoader();
          },
          success: function(response) {
            if (response.code==1) {
              //direccionar();
            }
          },
          complete: function() {
              //hideLoader();
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