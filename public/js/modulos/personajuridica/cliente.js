$(document).on('click', '#estado label', function (e) {
    var padre = $(this);
    var estado = padre.find('input').val();
    var id_cliente = $('#id_cliente').val();
    var temp = 'id_cliente='+id_cliente+'&estado='+estado;

    $.ajax({
        url: $('base').attr('href') + 'personajuridica/save_cliente',
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
});