/*Save Estado*/
$(document).on('click', '#estado label', function (e) {
    var padre = $(this);
    var estado = padre.find('input').val();
    var id = $('#id_servicios').val();
    var temp = 'id_servicios='+id+'&estado='+estado;

    $.ajax({
        url: $('base').attr('href') + 'servicios/save_servicios',
        type: 'POST',
        data: temp,
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            if (response.code==1) {
            }                    
        },
        complete: function() {
            //hideLoader();
        }
    });
    console.log(estado);
});
/**/