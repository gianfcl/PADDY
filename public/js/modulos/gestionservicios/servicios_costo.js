$( document ).ready(function() {

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

    $('#form_costo_servicio').validate({
        
        submitHandler: function() {
            var temp = "&id_serv_sucursal="+$('#id_serv_sucursal').val();
            $.ajax({
                url: $('base').attr('href') + 'serviciosxsucursal/save_costo_servicio',
                type: 'POST',
                data: $('#form_costo_servicio').serialize()+temp,
                dataType: "json",
                beforeSend: function() {
                    //showLoader();
                },
                success: function(response) {
                    if (response.code==1) {

                        swal('Cambios','guardados correctamente','success');
                        window.location.reload();
                    }
                },
                complete: function() {

                }
            });
        }
    });
});

