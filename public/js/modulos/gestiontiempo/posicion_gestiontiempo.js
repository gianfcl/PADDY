$( document ).ready(function() {

    $(function () {
        $('.date').datetimepicker({
          format: 'LT'
        });
    });

    $('#form_save_gestion_tiempo').validate({
        
      submitHandler: function() {
        var id_posicion = $('#id_posicion').val()
        $.ajax({
            url: $('base').attr('href') + 'posicion/save_gestiontiempo',
            type: 'POST',
            data: $('#form_save_gestion_tiempo').serialize()+'&id_posicion='+id_posicion,
            dataType: "json",
            beforeSend: function() {
                //showLoader();
            },
            success: function(response) {
                if(response.code==1)
                {
                  window.location.reload();
                }
                else
                {
                  swal('error','Hubo un error, no guardó','error');
                }
            },
            complete: function() {

            }
        });
      }
    });
});