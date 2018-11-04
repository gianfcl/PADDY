$( document ).ready(function() {
    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });
    
    /*Para Ventas*/
    $('#form_save_ventas').validate({
        rules:
        {          
          id_unidadmedida_venta: { required:true},
          factor_venta: { required:true, number: true }
        },
        messages: 
        {          
          id_unidadmedida_venta: { required:"Buscar y Seleccionar UM Compra" },
          factor_venta: { required:"Ingresar Factor de Compra", number: "Solo #s" }
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
                data: $('#form_save_ventas').serialize(),
                dataType: "json",
                beforeSend: function() {

                },
                success: function(response) {
                    if (response.code==1) {
                        var tipo = $('#myTab li.active').attr('tabs');
                        $('#para_ventas_val').val('y');
                        alerta('Guardo!', 'Para Ventas se Guardo.', 'success');
                    }                    
                },
                complete: function() {
                    //hideLoader();
                }
            });/**/
        }
    });
    /*<-->*/

    /*Impuestos*/
    $('#form-add-impuesto').validate({
        rules:{ 
            id_impuesto: { 
                required:true,
                remote: {
                  url: $('base').attr('href') + 'articuloxsucursal/validar_impuesto',
                  type: "post",
                  data: {
                    tipo: function() { return ($( "#id_art_impuesto" ).length>0)?('compra'):('venta'); },
                    id_art_impuesto: function() { return ($( "#id_art_impuesto" ).length>0)?($( "#id_art_impuesto" ).val()):($( "#id_art_impuesto_venta" ).val()); },
                    id_impuesto: function() { return $( "#id_impuesto" ).val(); },
                    id_art_sucursal: function() { return $('#id_art_sucursal').val(); }
                  }
                }
            },
            valor: { required:true, number: true }
        },
        messages:{ 
            id_impuesto: { required:"Seleccionar", remote:"Ya Existe" },
            valor: { required:"", number: "Solo #s" }
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
            if(element.parent('.col-md-6').length) { error.insertAfter(element.parent()); }
        },
        submitHandler: function() {
            var temp = "id_art_sucursal="+$('#id_art_sucursal').val();
            $.ajax({
                url: $('base').attr('href') + 'articuloxsucursal/save_impuesto',
                type: 'POST',
                data: $('#form-add-impuesto').serialize()+'&'+temp,
                dataType: "json",
                beforeSend: function() {
                    //showLoader();
                },
                success: function(response) {
                    if (response.code==1) {
                      var tipo = $('#myTab li.active').attr('tabs');
                      tipo = tipo+'/'+$('#miTab li.active').attr('tabs');
                      var id_art_sucursal = $('#id_art_sucursal').val();
                      window.location.href = $('base').attr('href') +'articuloxsucursal/edit/'+id_art_sucursal+'/'+tipo;
                    }                    
                },
                complete: function(response) {
                    if (response.code==1) {
                        alerta("Guardo Ok!", 'Datos Guardo OK.', 'success');
                    }
                }
            });/**/
        }
    });
    /*<-->*/

    /*Para Ventas*/
    $('#form_save_carta').validate({
        rules:
        {          
          descripcion_carta: { required:true, minlength: 2},
          detalle_carta: { required:true, minlength: 2}
        },
        messages: 
        {          
          descripcion_carta: { required:"Ingresar Descripción", minlength: "Más de 2 Letras"},
          detalle_carta: { required:"Ingresar Detalle", minlength: "Más de 2 Letras"}
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
            var id_art_sucursal=$('#id_art_sucursal').val();
            var es_carta = ($('#escarta').is(':checked')) ? ("1"): ("0");
            $.ajax({
                url: $('base').attr('href') + 'articuloxsucursal/save_articulo',
                type: 'POST',
                data: $('#form_save_carta').serialize()+'&id_art_sucursal='+id_art_sucursal+'&es_carta='+es_carta,
                dataType: "json",
                beforeSend: function() {
                    //showLoader();
                },
                success: function(response) {
                    if (response.code==1) {
                        var tipo = $('#myTab li.active').attr('tabs');
                        alerta('Guardo Ok!', 'Es Carta.', 'success');
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

$(function () {
    /*Ventas*/
    $( "#unidad_medida_venta" ).autocomplete({
        serviceUrl: $('base').attr('href')+"unidadmedida/get_unidadmedida",
        onSelect: function (suggestion) {
            //alert('You selected: ' + suggestion.value + ', ' + suggestion.data);
            $('#id_unidadmedida_venta').val(suggestion.id_unidadmedida);
            if($('#id_unidadmedida_venta-error').length>0)
            {
                if($('#id_unidadmedida_venta-error').attr('class')=="help-block")
                {
                  $('#id_unidadmedida_venta-error').remove();
                }
            }
        }
    });
    /*<-->*/
});

/*Para Ventas*/
$(document).on('change', '#esventas', function (e) {
    var para_ventas = ($(this).is(':checked')) ? ("1"): ("0");
    $('#para_ventas').val(para_ventas);
    if(para_ventas==1)
    {
        $('#div_ventas').removeClass('collapse');
    }
    else
    {
        $('#div_ventas').addClass('collapse');
    }
});
/*<-->*/

/*Impuestos*/
$(document).on('click', '.add_impuesto', function (e) {
    limp_todo('form-add-impuesto');
});

$(document).on('change', '#id_impuesto', function (e) {
    var abrv = $('#id_impuesto option:selected').attr('label');
    $('#abreviatura').val(abrv);
});

$(document).on('click', '.edit_impuestoventa', function (e)
{
    e.preventDefault();

    var idartimpuestoventa = $(this).parents('tr').attr('idartimpuestoventa');
    if(idartimpuestoventa>0)
    {
        limp_todo('form-add-impuesto');
        $.ajax({
            url: $('base').attr('href') + 'articuloxsucursal/edit_impuesto_venta',
            type: 'POST',
            data: 'id_art_impuesto_venta='+idartimpuestoventa,
            dataType: "json",
            beforeSend: function() {
                $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
            },
            success: function(response) {
                if (response.code==1) {
                    var id_imp = response.data.id_impuesto;
                    $('#id_art_impuesto_venta').val(response.data.id_art_impuesto_venta);
                    $('#id_impuesto').val(id_imp);
                    $('#impuesto').val(response.data.impuesto);
                    $('#abreviatura').val(response.data.abreviatura);
                    var tipo_igv = response.data.id_tipo_igv;
                    $('#id_tipo_igv').val(tipo_igv);

                    if(id_imp==3)
                    {
                        var con_valor = response.data.con_valor;
                        $('#id_tipo_igv').closest('.form-group').removeClass('hidden');
                        if(con_valor==1){
                            $('#valor').closest('.form-group').removeClass('hidden');
                            $('#valor').val(response.data.valor);
                        }

                    } 
                }
            },
            complete: function() {
                $.LoadingOverlay("hide");
            }
        });
    }
});
$(document).on('click', '.delete_impuesto_venta', function (e)
{
    e.preventDefault();

    var idartimpuesto = $(this).parents('tr').attr('idartimpuestoventa');
    if(idartimpuesto>0)
    {
        swal({
            title: 'Estad Seguro?',
            text: "Eliminar este Impuesto",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, estoy seguro!'
        }).then(function(isConfirm) {
            if (isConfirm) {     
                $.ajax({
                    url: $('base').attr('href') + 'articuloxsucursal/delete_impuesto_venta',
                    type: 'POST',
                    data: 'id_art_impuesto_venta='+idartimpuesto,
                    dataType: "json",
                    beforeSend: function() {
                        //showLoader();
                    },
                    success: function(response) {
                        if (response.code==1) {
                          var tipo = $('#myTab li.active').attr('tabs');
                          tipo = tipo+'/'+$('#miTab li.active').attr('tabs');
                          var id_art_sucursal = $('#id_art_sucursal').val();
                          window.location.href = $('base').attr('href') +'articuloxsucursal/edit/'+id_art_sucursal+'/'+tipo;
                        }
                    },
                    complete: function() {
                        //hideLoader();
                    }
                });
            }
        });          
    }
});
/*<-->*/

/*ES Carta*/
$(document).on('change', '#escarta', function (e) {
    var es_carta = ($(this).is(':checked')) ? ("1"): ("0");
    $('#es_carta').val(es_carta);
    if(es_carta==1)
    {
        $('#div_carta').removeClass('collapse');
    }
    else
    {
        $('#div_carta').addClass('collapse');
    }
});
/*<-->*/

/*areas de produccion
$(document).on('change', 'ul.to_do li p input', function (e) {
    var id = parseInt($(this).attr('idzonasproduccion')); 
    id = id > 0 ? id : 0;
    var es = ($(this).is(':checked')) ? ("1"): ("0");
    var idart = parseInt($('#id_art_sucursal').val());
    idart = idart > 0 ? idart : 0; //alert(id+' <--> '+idart)

    if(id>0 && idart>0)
    {
        var temp = "id_zonasproduccion="+id+"&id_art_sucursal="+idart+'&checked='+es;
        $.ajax({
            url: $('base').attr('href') + 'articuloxsucursal/save_zonasproduccion',
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
            }
        });
    }
    
});*/
/*<-->*/

/*Validar Al Salir del Formulario*/
function validar_tabs(tipo)
{
    var para_ventas = ($('#esventas').is(':checked')) ? ("1"): ("0");
    var valor = true;
    var para_ventas_val = $('#para_ventas_val').val();
    if(para_ventas== "1" && para_ventas_val == 'n')
    {
        var valor = false;
        var id_unidadmedida_venta = $('#id_unidadmedida_venta').val();
        id_unidadmedida_venta = id_unidadmedida_venta.trim().length;

        var factor_venta = $('#factor_venta').val();
        factor_venta = factor_venta.trim().length;

        if(id_unidadmedida_venta>0 && factor_venta>0)
        {
            var valor = true;
            salidajax(tipo);
        }
    }
    else
    {
        if(para_ventas_val == 'y')
        {
            salidajax(tipo);
        }
        else
        {
            salidajax(tipo);
        }
    }
    return (valor) ? ('') : ('Para Ventas');
}

function salidajax(tipo)
{
    var id_art_sucursal = $('#id_art_sucursal').val();
    var para_ventas = ($('#esventas').is(':checked')) ? ("1"): ("0");
    var para_ventas_val = $('#para_ventas_val').val();
    if(id_art_sucursal>0)
    {
        if(para_ventas_val=="y")
        {
            $.ajax({
                url: $('base').attr('href') + 'articuloxsucursal/save_articulo',
                type: 'POST',
                data: 'id_art_sucursal='+id_art_sucursal+'&para_ventas='+para_ventas,
                dataType: "json",
                beforeSend: function() {
                    //showLoader();
                },
                success: function(response) {
                    if (response.code==1) {
                        window.location.href = $('base').attr('href') +'articuloxsucursal/edit/'+response.data.id+'/'+tipo;
                    }                    
                },
                complete: function() {
                }
            });
        }
        else
        {
            window.location.href = $('base').attr('href') +'articuloxsucursal/edit/'+id_art_sucursal+'/'+tipo;
        }            
    }
}

function salidaformulario(validar, tipo)
{
    swal({
        title: 'Esta Seguro de Salir?',
        text: "Verificar Datos "+validar,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, estoy seguro!',
        allowOutsideClick:false
    }).then(function(isConfirm) {
        if (isConfirm) {     
            salidajax(tipo)
        }
    });        
}

$(document).on('change', '#id_impuesto', function (e) {
    $('#valor').val('');
    $('#valor').closest('.form-group').addClass('hidden');
    $('button[type="submit"]').prop('disabled',false);
    var id = $(this).val();
    $('#id_tipo_igv').val('');
    if(id==3)
    {
        $('#id_tipo_igv').closest('.hidden').removeClass('hidden');
        $('#id_tipo_igv').prop('disabled',false);
    }
    else
    {
        $('#id_tipo_igv').closest('.form-group').addClass('hidden');
        $('#id_tipo_igv').prop('disabled',true);

        $.ajax({
            url: $('base').attr('href') + 'empresa/get_imp_ahora',
            type: 'POST',
            async: false,
            data: 'id_impuesto='+id,
            dataType: "json",
            beforeSend: function() {
                $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
            },
            success: function(response) {
                if (response.code==1) {
                    $('#valor').closest('.hidden').removeClass('hidden');
                    $('#valor').val(response.data);
                }
                else
                {
                    alerta('Error','Falta configurar este impuesto!','error')
                    $('button[type="submit"]').prop('disabled',true);
                }                    
            },
            complete: function() {
                $.LoadingOverlay("hide");
            }
        });
    }
});

$(document).on('change','#id_tipo_igv',function(){
    $('button[type="submit"]').prop('disabled',false);
    var tipo_imp = $('#id_impuesto').val();
    var tiene_valor = $('#id_tipo_igv option:selected').attr('con_valor');
    console.log(tiene_valor);

    if(tiene_valor==1)
    {   
        $('#valor').closest('.hidden').removeClass('hidden');

        $.ajax({
            url: $('base').attr('href') + 'empresa/get_imp_ahora',
            type: 'POST',
            data: 'id_impuesto='+tipo_imp,
            dataType: "json",
            beforeSend: function() {
                $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
            },
            success: function(response) {
                if (response.code==1) {
                   $('#valor').val(response.data);
                }
                else
                {
                    alerta('Error','Falta configurar este impuesto!','error')
                    $('button[type="submit"]').prop('disabled',true);
                }                    
            },
            complete: function() {
                $.LoadingOverlay("hide");
            }
        });
    }
    else
    {
        $('#valor').closest('.form-group').addClass('hidden');
    }
});

/*areas de produccion*/
$(document).on('change', '.selecarea', function (e) {
    var tis = $(this);
    var id = parseInt(tis.val());
    id = id > 0 ? id : 0;
    var es = (tis.is(':checked')) ? ("1"): ("0");    
    var pad = tis.parents('.form-group').find('.col-md-6 ul');

    if(id>0)
    {
        var temp = "id_areasproduccion="+id+'&checked='+es;
        save_zonasproduccion(temp);

        switch(es)
        {
            case '1': pad.removeClass('collapse'); break;
            case '0':
                $('ul.to_do li p input').prop('checked', false);
                pad.addClass('collapse');
                break;
            default: break;
        }
    }

});

$(document).on('change', 'ul.to_do li p input', function (e) {
    var tis = $(this);
    var id = parseInt(tis.attr('idzonasproduccion')); 
    id = id > 0 ? id : 0;
    var ida = parseInt(tis.parents('ul.to_do').attr('idarea'));
    ida = ida > 0 ? ida : 0;
    var es = (tis.is(':checked')) ? ("1"): ("0");    

    if(id>0 && ida>0)
    {
        var temp = "id_areasproduccion="+ida+"&id_zonasproduccion="+id+'&checked='+es;
        save_zonasproduccion(temp);
    }    
});

function save_zonasproduccion(temp)
{
    var idart = parseInt($('#id_art_sucursal').val());
    idart = idart > 0 ? idart : 0;
    if(idart > 0)
    {
        temp = temp+"&id_art_sucursal="+idart;
        $.ajax({
            url: $('base').attr('href') + 'articuloxsucursal/save_zonasproduccion',
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
            }
        });
    }        
}
/*<-->*/