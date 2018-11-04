$( document ).ready(function() {

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

    $('#fecha_ingreso').datetimepicker({
      format: 'DD-MM-YYYY',
      locale: moment.locale('es')
    });

    $('#form_save_ajusteinventario').validate({
      rules:
      {
        fecha_ingreso:{required:true}
      },
      messages: 
      {
        fecha_ingreso: {required:"Fecha Documneto" }
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
        $.ajax({
          url: $('base').attr('href') + 'ingresoxajusteinvent/editar_ajusteinvent',
          type: 'POST',
          data: $('#form_save_ajusteinventario').serialize(),
          dataType: "json",
          beforeSend: function() {
            $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
          },
          success: function(response) {
            if (response.code==1) 
            {
              alerta('Editó!','Este ajuste de Inventario se ha editado','success');  
            }
            else
            {
              alerta('Error!!','No se pudo guardar!! :( ...','error');
            }
          },
          complete: function(response) {
            $.LoadingOverlay("hide");

          }
        });
      }
    });
});

$(document).on('click','.btn_limpiar',function(){
  location.reload();
});