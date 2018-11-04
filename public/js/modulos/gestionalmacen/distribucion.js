$( document ).ready(function() {
    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });
    
    /*Para Ventas*/
    $('#form_save_distribucion').validate({
        rules:
        {
          peso_estandar: { required:true, number: true }
        },
        messages: 
        {
          peso_estandar: { required:"Ingresar Peso Estandar", number: "Solo #s" }
        },      

        highlight: function(element) {
            $(element).closest('.col-md-2').addClass('has-error');  
        },
        unhighlight: function(element) {
            $(element).closest('.col-md-2').removeClass('has-error');
        },
        errorElement: 'span',
        errorClass: 'help-block',
        errorPlacement: function(error, element) 
        {
            if(element.parent('.col-md-2').length) { error.insertAfter(element); }
        },
        submitHandler: function() {
            $.ajax({
                url: $('base').attr('href') + 'articuloxsucursal/save_articulo',
                type: 'POST',
                data: $('#form_save_distribucion').serialize(),
                dataType: "json",
                beforeSend: function() {
                    //showLoader();
                },
                success: function(response) {
                    if (response.code==1) {
                        var tipo = $('#myTab li.active').attr('tabs');
                        alerta('Ok!', 'Distribución se Guardo.', 'success');
                    }                    
                },
                complete: function() {
                    //hideLoader();
                }
            });/**/
        }
    });
    /*<-->*/

    
});

$(document).on('change', '.activopa', function (e) {
    if($('.activopa').not(':disabled').length>1)
    {
        $('.activopa').each(function (index, value){
            $(this).prop('checked', false);
        });
        $(this).prop('checked', true);
    }        

    var checked = ($(this).is(':checked')) ? ("1"): ("0");
    var id_arti_almacen = $(this).parents('tr').attr('idartialmacen');
    var id_art_sucursal = $('#id_art_sucursal').val();
    var temp = 'id_arti_almacen='+id_arti_almacen+'&id_art_sucursal='+id_art_sucursal+'&checked='+checked;

    $.ajax({
        url: $('base').attr('href') + 'articuloxsucursal/save_arti_check',
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

$(document).on('click', '#miTab li.tab a, .breadcrumb li a', function (e) {
    var url = $(this).attr('url');
    window.location.href = url;
});
/*<---->*/