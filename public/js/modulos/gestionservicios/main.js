$("input[name=estado]").change(function(){
    var val =$(this).val();
    var id = $('#id_serv_sucursal').val();
    console.log(val);
    if(id)
    {
        $.ajax({
            url: $('base').attr('href') + 'serviciosxsucursal/edit_column',
            type: 'POST',
            data: 'id_serv_sucursal='+id+'&estado='+val,
            dataType: "json",
            beforeSend: function() {

            },
            success: function(response) {
                if (response.code==1) {

                }                    
            },
            complete: function() {
                //hideLoader();
            }
        });
    }
});