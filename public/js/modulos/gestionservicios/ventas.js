$('#esventas').change(function(){
    var val = $(this).is(':checked') ? 1 : 0;
    var id = $('#id_serv_sucursal').val();
    if(id)
    {
        $.ajax({
            url: $('base').attr('href') + 'serviciosxsucursal/edit_column',
            type: 'POST',
            data: 'id_serv_sucursal='+id+'&para_ventas='+val,
            dataType: "json",
            beforeSend: function() {

            },
            success: function(response) {
                if (response.code==1) {
                    var tipo = $('#myTab li.active').attr('tabs');
                    alerta('Se guardó', 'la configuración correctamente!!', 'success');
                    window.location.reload();
                }                    
            },
            complete: function() {
                //hideLoader();
            }
        });
    }
});