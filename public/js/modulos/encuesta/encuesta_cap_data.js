$( document ).ready(function() {

  jQuery.validator.setDefaults({
    debug: true,
    success: "valid",
    ignore: ""
  });

  $('#form_save_encuesta_data').validate({

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
      $.ajax({
        url: $('base').attr('href') + 'encuesta/save_encuesta_data',
        type: 'POST',
        data: $('#form_save_encuesta_data').serialize(),
        dataType: "json",
        beforeSend: function() {
          $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
        },
        success: function(response) {
          if (response.code==1) {
            var msg = $('#despedida').val();
            swal({
              title : msg,
              text: '',
              type: 'success',
              confirmButtonText: 'Listo!',
            }).then(function () {
              var url = $('base').attr('href') +'encuesta';
              $(location).attr('href',url);
            });
          }
          else
          {
            
          }
        },
        complete: function() {
          $.LoadingOverlay("hide"); 
        }
      });
    }
  });
});
