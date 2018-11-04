$(document).on('click', '#estado label', function (e) {
    var padre = $(this);
    var estado = padre.find('input').val();
    var id_art_sucursal = $('#id_art_sucursal').val();
    var temp = 'id_art_sucursal='+id_art_sucursal+'&estado='+estado;

    $.ajax({
        url: $('base').attr('href') + 'articuloxsucursal/save_articulo',
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

/*Validar Al Salir del Formulario*/
$(document).on('click', '#myTab li.tab a, .breadcrumb li a', function (e) {
    var url = $(this).attr('url');
    window.location.href = url;       
});
/*<---->*/