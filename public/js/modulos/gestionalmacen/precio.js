$( document ).ready(function() {
    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

    $.validator.addMethod("regex", function(value, element) {
      var exp = value;
      if (exp < 0) { return false; }
      else {
            
          if($.isNumeric(exp)){ return true; }
          else{ return false; }
      }
    }, "Solo #s Mayores a 0");
    
    /*Precios*/
    $('#form_save_precios').validate({
        rules:
        {          
          id_art_sucursal: { required:true},
          porcentaje_precio: { regex:true },
          precio_venta: { regex:true }
        },
        messages: 
        {          
          id_art_sucursal: { required:"" }
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
                data: $('#form_save_precios').serialize(),
                dataType: "json",
                beforeSend: function() {
                    //showLoader();
                },
                success: function(response) {
                    if (response.code==1) {
                        var tipo = $('#myTab li.active').attr('tabs');
                        window.location.href = $('base').attr('href') +'articuloxsucursal/edit/'+response.data.id+'/'+tipo;
                    }                    
                },
                complete: function() {
                    //hideLoader();
                }
            });/**/
        }
    });
    /*<-->*/

    $('#form_save_decimal').validate({
        rules:
        {          
          id_art_sucursal: { required:true},
          cantidad_decimal: { number:true }
        },
        messages: 
        {          
          id_art_sucursal: { required:"" },
          cantidad_decimal: { number:"Solo #s" }
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
                url: $('base').attr('href') + 'articuloxsucursal/save_decimal',
                type: 'POST',
                data: $('#form_save_decimal').serialize(),
                dataType: "json",
                beforeSend: function() {
                //showLoader();
                },
                success: function(response) {
                    if (response.code==1) {
                        var tipo = $('#myTab li.active').attr('tabs');
              window.location.href = $('base').attr('href') +'articuloxsucursal/edit/'+response.data.id+'/'+tipo;
                    }                    
                },
                complete: function() {
                    //hideLoader();
                }
            });/**/
        }
    });

});

$(document).on('change', '.tipoventa', function (e) {
    var tip = parseInt($(this).val());
    var id = parseInt($('#form_save_precios input:hidden[name=id_art_sucursal]').val());
    if(id>0 && tip>0) 
    {
        var temp = 'tipo_precio='+tip+'&id_art_sucursal='+id;
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
                    var tipo = $('#myTab li.active').attr('tabs');
          window.location.href = $('base').attr('href') +'articuloxsucursal/edit/'+response.data.id+'/ventas/'+tipo;
                }                    
            },
            complete: function() {
                //hideLoader();
            }
        });
    }
        
});

$(document).on('change', 'input:radio[name=val_decimal]', function (e)
{
    var iddec = parseInt($(this).val()); console.log(iddec);
    if(iddec==2)
    {
        $('#contdecimal').removeClass('collapse');
    }
    else
    {
        $('#contdecimal').addClass('collapse');
    }
});

/*Validar Al Salir del Formulario*/
$(document).on('click', '#myTab li.tab a, .breadcrumb li a', function (e) {
    var url = $(this).attr('url');
    window.location.href = url;       
});

$(document).on('click', '#miTab li.tab a', function (e) {
    var url = $(this).attr('url'); //alert(url);
    window.location.href = url;
});
/*<---->*/