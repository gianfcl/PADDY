    $( document ).ready(function() {
    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });
    
    /*Es Insumo Receta*/
    $('#form_save_es_insumo_receta').validate({
        rules:
        {          
          id_unidadmedida_consumo: { required:true},
          factor_consumo: { required:true, number: true }
        },
        messages: 
        {          
          id_unidadmedida_consumo: { required:"Buscar y Seleccionar UM Consumo" },
          factor_consumo: { required:"Ingresar Factor de Consumo", number: "Solo #s" }
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
                data: $('#form_save_es_insumo_receta').serialize(),
                dataType: "json",
                beforeSend: function() {
                },
                success: function(response) {
                    if (response.code==1) {
                      var tipo = $('#myTab li.active').attr('tabs');
                      window.location.href = $('base').attr('href') +'articuloxsucursal/edit/'+response.data.id+'/'+tipo;
                    }                    
                },
                complete: function() {
                }
            });
        }
    });




    /*<---->*/

    /*Es Receta*/
    $.validator.addMethod("regex", function(value, element) {
        var exp = value;
        if (exp <= 0) { return false; }
        else {
            if($.isNumeric(exp)){ return true; }
            else{ return false; }
        }
    }, "Solo #s Mayores a 0");

    $('#form_save_es_receta').validate({
        rules:
        {          
          lote: { regex:true},
          tolerancia_menos: { nume:true},
          tolerancia_menos: { nume:true}
        },
        messages: 
        {
        },
        highlight: function(element) {
            $(element).closest('.col-md-4').addClass('has-error');  
        },
        unhighlight: function(element) {
            $(element).closest('.col-md-4').removeClass('has-error');
        },
        errorElement: 'span',
        errorClass: 'help-block',
        errorPlacement: function(error, element) 
        {
            if(element.parent('.col-md-4').length) { error.insertAfter(element); }
        },
        submitHandler: function() {
            var temp = "id_art_sucursal="+$('#id_art_sucursal').val();
            $.ajax({
                url: $('base').attr('href') + 'articuloxsucursal/save_articulo',
                type: 'POST',
                data: $('#form_save_es_receta').serialize()+'&'+temp,
                dataType: "json",
                beforeSend: function() {
                    //showLoader();
                },
                success: function(response) {
                    if (response.code==1) {
                      var tipo = $('#myTab li.active').attr('tabs');
                      var id_art_sucursal = $('#id_art_sucursal').val();
                      window.location.href = $('base').attr('href') +'articuloxsucursal/edit/'+id_art_sucursal+'/'+tipo;
                    }                    
                },
                complete: function() {
                    //hideLoader();
                }
            });/**/
        }
    });

    $('#form-add-insumos').validate({
        rules:
        {          
          id_art_sucursal_receta: { required:true},
          cantidad: { regex:true },
          id_almacen: { required:true},
          tolerancia_mas: { regex:true },
          tolerancia_menos: { regex:true }
        },
        messages: 
        {          
          id_art_sucursal_receta: { required:"Buscar y Seleccionar Articulo" },
          id_almacen: { required:"Seleccionar"}
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
            if(element.parent('.col-md-9').length) { error.insertAfter(element.parent()); }
        },
        submitHandler: function() {
            $.ajax({
                url: $('base').attr('href') + 'articuloxsucursal/save_receta',
                type: 'POST',
                data: $('#form-add-insumos').serialize(),
                dataType: "json",
                beforeSend: function() {
                    //showLoader();
                },
                success: function(response) {
                    if (response.code==1) {
                      var tipo = $('#myTab li.active').attr('tabs');
                      var id_art_sucursal = $('#id_art_sucursal').val();
                      window.location.href = $('base').attr('href') +'articuloxsucursal/edit/'+id_art_sucursal+'/'+tipo;
                    }                    
                },
                complete: function() {
                    //hideLoader();
                }
            });/**/
        }
    });
    /*<---->*/

    /*Genera Sub Producto*/
    $('#form-add-subproducto').validate({
        rules:
        {          
          id_art_sucursal_sub_producto: { required:true},
          factor_unitario_subprod: { regex:true},
          id_almacen_sub_producto:{required:true}
        },
        messages: 
        {          
          id_art_sucursal_sub_producto: { required:"Buscar y Seleccionar Articulo" },
          id_almacen_sub_producto: {required: "Seleccionar"}
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
            if(element.parent('.col-md-6').length) { error.insertAfter(element); }
        },
        submitHandler: function() {
                $.ajax({
                url: $('base').attr('href') + 'articuloxsucursal/save_subproducto',
                type: 'POST',
                data: $('#form-add-subproducto').serialize(),
                dataType: "json",
                beforeSend: function() {
                    //showLoader();
                },
                success: function(response) {
                    if (response.code==1) {
                      var tipo = $('#myTab li.active').attr('tabs');
                      var id_art_sucursal = $('#id_art_sucursal').val();
                      window.location.href = $('base').attr('href') +'articuloxsucursal/edit/'+id_art_sucursal+'/'+tipo;
                    }                    
                },
                complete: function() {
                    //hideLoader();
                }
            });/**/
        }
    });

    /*Recetario*/
    $.validator.addMethod("nume", function(value, element) {
        var exp = value;
        if(exp.trim().length)
        {         
            if (exp <= 0) { return false; }
            else {
                if($.isNumeric(exp)){ return true; }
                else{ return false; }
            }
        }
        else
            { return true;}
    }, "Solo #s Mayores a 0");

    $.validator.addMethod("time24", function(value, element) {
        var exp = value;
        if($.trim(exp).length>0)
        {
          return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value);
        }
        else
        {
          return true;
        }
    }, "");

    $('#form-add-recetario').validate({
        rules:
        {
            paso:{required:true, number:true},
            actividad: { required:true},
            tiempo: { time24:true}
        },
        messages: 
        {
            paso:{required:"Paso #", number:"Solo #s"},
            actividad: { required:"Ingresar Actividad" },
            tiempo: { time24:"Verficar el Tiempo"}
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
            if(element.parent('.col-md-9').length) { error.insertAfter(element); }
        },
        submitHandler: function() {
            var id_art_sucursal = $('#id_art_sucursal').val();
            $.ajax({
                url: $('base').attr('href') + 'articuloxsucursal/save_recetario',
                type: 'POST',
                data: $('#form-add-recetario').serialize()+'&id_art_sucursal='+id_art_sucursal,
                dataType: "json",
                beforeSend: function() {
                //showLoader();
                },
            success: function(response) {
                if (response.code==1) {
                  var tipo = $('#myTab li.active').attr('tabs');
                  window.location.href = $('base').attr('href') +'articuloxsucursal/edit/'+id_art_sucursal+'/'+tipo;
                }                    
                },
            complete: function() {
                //hideLoader();
                }
            });/**/
        }
    });

    $('.clockpicker').clockpicker();
    /**/

    /*Lote Sup Produccion*/
    $('#form_save_genera_sub_producto').validate({
        rules:
        {
          id_um_subproduccion: { required:true, number: true }
        },
        messages: 
        {
          id_um_subproduccion: { required:"Buscar y Seleccionar UM Sub Producción", number: "Solo #s" }
        },      

        highlight: function(element) {
            $(element).closest('.col-md-4').addClass('has-error');  
        },
        unhighlight: function(element) {
            $(element).closest('.col-md-4').removeClass('has-error');
        },
        errorElement: 'span',
        errorClass: 'help-block',
        errorPlacement: function(error, element) 
        {
            if(element.parent('.col-md-4').length) { error.insertAfter(element); }
        },
        submitHandler: function() {
            var temp = "&id_art_sucursal="+$('#id_art_sucursal').val();
            $.ajax({
                url: $('base').attr('href') + 'articuloxsucursal/save_articulo',
                type: 'POST',
                data: $('#form_save_genera_sub_producto').serialize()+temp,
                dataType: "json",
                beforeSend: function() {
                    //showLoader();
                },
                success: function(response) {
                    if (response.code==1) {
                        var tipo = $('#myTab li.active').attr('tabs');
                        var id_art_sucursal = $('#id_art_sucursal').val();
                        window.location.href = $('base').attr('href') +'articuloxsucursal/edit/'+id_art_sucursal+'/'+tipo;
                    }                    
                },
                complete: function() {
                    //hideLoader();
                }
            });/**/
        }
    });
    /*<---->*/
});

$(function () {
    $( ".unidad_medida_consumo" ).autocomplete({
    serviceUrl: $('base').attr('href')+"unidadmedida/get_unidadmedida",
    onSelect: function (suggestion) {
        //alert('You selected: ' + suggestion.value + ', ' + suggestion.data);
        $('.id_unidadmedida_consumo').val(suggestion.id_unidadmedida);
        if($('#id_unidadmedida_consumo-error').length>0)
        {
            if($('#id_unidadmedida_consumo-error').attr('class')=="help-block")
            {
                $('#id_unidadmedida_consumo-error').remove();
            }
        }
    }
    });

    /add_unidad_medida, permite agregar varias unidaddes de medida en "es insumo de receta"/
    $(document).ready(function() {
        var maxField = 10; //Input fields increment limitation
        var addButton = $('.add_unidad_medida'); //Add button selector
        var wrapper = $('.field_wrapper'); //Input field wrapper
        var unidad_medida_consumo=$('.lbl_unidad_medida_consumo').text();
        var fieldHTML = '<div class="container">' +
            '<label for="unidad_medida_consumo" class="control-label col-md-4 col-sm-4 col-xs-12">'+unidad_medida_consumo+' &nbsp;</label>\n' +
            '    <div class="col-md-2 col-sm-2 col-xs-12">\n' +
            '      <input type="text" class="form-control factor_consumo" name="factor_consumo" aria-describedby="factor_consumo" placeholder="Factor de UM Consumo">\n' +
            '    </div>\n' +
            '    \n' +
            '    <div class="col-md-2 col-sm-2 col-xs-12">\n' +
            '        <input type="text" class="form-control autocomplete_unidad_medida_consumo unidad_medida_consumo"' +
            'name="unidad_medida_consumo" aria-describedby="unidad_medida_consumo" placeholder="UM de Consumo">\n' +
            '        <input type="hidden" class="id_unidadmedida_consumo" name="id_unidadmedida_consumo">\n' +
            '        <div class="auto_completar autocompleteunidadmedidac"></div>\n' +
            '    </div>' +
            '<a href="javascript:void(0);" class="btn btn-danger delete_prov btn-xs"><i class="fa fa-trash-o"></i></a></div>'; //New input field html
        var x = 1; //Initial field counter is 1
        $(addButton).click(function(){ //Once add button is clicked
            if(x < maxField){ //Check maximum number of input fields
                x++; //Increment field counter
                $(wrapper).append(fieldHTML); // Add field html
                console.log($('.unidad_medida_consumo').value);
            }
        });
        $(wrapper).on('click', '.delete_prov', function(e){ //Once remove button is clicked
            e.preventDefault();
            $(this).parent('div').remove(); //Remove field html
            x--; //Decrement field counter
        });
    });
    
    /*Es Receta*/
    $( "#descripcion_receta" ).autocomplete({
        params:{id_art_sucursal:$('#id_art_sucursal').val()},
        serviceUrl: $('base').attr('href')+"articuloxsucursal/get_articulo_receta",
        type:'POST',
        onSelect: function (suggestion) {          
            $('label#umconsum').html(suggestion.unidad_medida_consumo);
            $('#id_art_sucursal_receta').val(suggestion.id_art_sucursal_receta);
            $('#id_almacen').html(suggestion.cbx);
            if($('#id_art_sucursal_receta-error').length>0)
            {
                if($('#id_art_sucursal_receta-error').attr('class')=="help-block")
                {
                  $('#id_art_sucursal_receta-error').remove();
                }
            }
        }
    });
    /*<---->*/

    /*Genera Sub Producto*/
    $( "#descripcion_subprod" ).autocomplete({
        params:{id_art_sucursal:$('#id_art_sucursal').val()},
        serviceUrl: $('base').attr('href')+"articuloxsucursal/get_articulo_subprod",
        type:'POST',
        onSelect: function (suggestion) {
            $('#id_art_sucursal_sub_producto').val(suggestion.id_art_sucursal_sub_producto);
            $('#id_almacen_sub_producto').html(suggestion.cbx);
            if($('#id_art_sucursal_sub_producto-error').length>0)
            {
                if($('#id_art_sucursal_sub_producto-error').attr('class')=="help-block")
                {
                  $('#id_art_sucursal_sub_producto-error').remove();
                }
            }
        }
    });    

    /*Unidad Medida Sub Producto*/
    $( "#um_subproducto" ).autocomplete({
        serviceUrl: $('base').attr('href')+"unidadmedida/get_unidadmedida",
        onSelect: function (suggestion) {
            //alert('You selected: ' + suggestion.value + ', ' + suggestion.data);
            $('#id_um_subproduccion').val(suggestion.id_unidadmedida);
            if($('#id_um_subproduccion-error').length>0)
            {
                if($('#id_um_subproduccion-error').attr('class')=="help-block")
                {
                  $('#id_um_subproduccion-error').remove();
                }
            }
        }
    });
    /*<---->*/
});
/*Es Insumo Receta*/
$(document).on('change', '#esinsumoreceta', function (e) {
  var es_insumo_receta = ($(this).is(':checked')) ? ("1"): ("0");
  var id_art_sucursal = $('#id_art_sucursal').val();
  if(id_art_sucursal>0)
  {
    $.ajax({
        url: $('base').attr('href') + 'articuloxsucursal/save_articulo',
        type: 'POST',
        data: 'id_art_sucursal='+id_art_sucursal+'&es_insumo_receta='+es_insumo_receta,
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
    });
  }
});
/*<---->*/

/*Es Receta*/
$(document).on('change', '#es_receta', function (e) {
  var es_receta = ($(this).is(':checked')) ? ("1"): ("0");
  var id_art_sucursal = $('#id_art_sucursal').val();
  if(id_art_sucursal>0)
  {
    $.ajax({
        url: $('base').attr('href') + 'articuloxsucursal/save_articulo',
        type: 'POST',
        data: 'id_art_sucursal='+id_art_sucursal+'&es_receta='+es_receta,
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
    });
  }
});

function limpiarinsumos()
{
    var id_padre = $('#id_art_sucursal_padre').val();
    limp_todo('form-add-insumos');
    $('#umconsum').html('');
    $('#id_almacen').html('');
    $('#id_art_sucursal_padre').val(id_padre);
    $('#valor_fijo').prop('checked', false);
    $('#es_edit').prop('checked', false);
    $('#div_es_edit').addClass('collapse');
    $('#div_es_edit input#tolerancia_menos').val(100);
    $('#div_es_edit input#tolerancia_mas').val(100); 
}

$(document).on('click', '.add_insumos, .btn_cancel_insumos', function (e)
{
    limpiarinsumos();
});

$(document).on('hidden.bs.modal', '#insumos', function (e)
{
    limpiarinsumos();
});

$(document).on('click', '.edit_receta', function (e)
{
  e.preventDefault();

    var idreceta = $(this).parents('tr').attr('idreceta');
    if(idreceta>0)
    {
        $.ajax({
            url: $('base').attr('href') + 'articuloxsucursal/edit_receta',
            type: 'POST',
            data: 'id_receta='+idreceta,
            dataType: "json",
            beforeSend: function() {
                //showLoader();
            },
            success: function(response) {
                if (response.code==1) {
                    limpiarinsumos();
                    if(response.data.valor_fijo=="1")
                    {
                        $('#valor_fijo').prop('checked', true);
                    }

                    if(response.data.es_edit=="1")
                    {
                        $('#es_edit').prop('checked', true);
                        $('#div_es_edit').removeClass('collapse');                        
                        $('#div_es_edit input#tolerancia_mas').val(response.data.tolerancia_mas);
                        $('#div_es_edit input#tolerancia_menos').val(response.data.tolerancia_menos);                     
                    }
                    
                    $('#descripcion_receta').val(response.data.descripcion);
                    $('#id_art_sucursal_receta').val(response.data.id_art_sucursal_receta);
                    $('#cantidad').val(response.data.cantidad);
                    $('#id_receta').val(response.data.id_receta);
                    $('#umconsum').html(response.data.unidad_medida);
                    $('#id_almacen').html(response.data.cbx);
                }
            },
            complete: function() {
                //hideLoader();
            }
        });
    }
});

$(document).on('click', '.delete_receta', function (e)
{
  e.preventDefault();
  var idreceta = $(this).parents('tr').attr('idreceta');
  swal({
    title: 'Estas Seguro?',
    text: "De Eliminar este insumo",
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, estoy seguro!'
  }).then(function(isConfirm) {
    if (isConfirm) {     
        console.log(idreceta);
        if(idreceta>0)
        {
          $.ajax({
                url: $('base').attr('href') + 'articuloxsucursal/delete_receta',
                type: 'POST',
                data: 'id_receta='+idreceta,
                dataType: "json",
                beforeSend: function() {
                    //showLoader();
                },
                success: function(response) {
                    if (response.code==1) {
                      var tipo = $('#myTab li.active').attr('tabs');
                      var id_art_sucursal = $('#id_art_sucursal').val();
                      window.location.href = $('base').attr('href') +'articuloxsucursal/edit/'+id_art_sucursal+'/'+tipo;
                    }
                },
                complete: function() {
                    //hideLoader();
                }
            });
        }
    }
  }); 
});

//Es editable insumo
$(document).on('change', '#es_edit', function (e) {
    var es_edit = ($(this).is(':checked')) ? ("1"): ("0"); console.log(es_edit);
    var tole = "";
    if(es_edit=="1")
    {
        $('#div_es_edit').removeClass('collapse');
    }
    else
    {
        $('#div_es_edit').addClass('collapse');
        tole = "100";
    }
    console.log(tole);
    $('#div_es_edit input#tolerancia_mas').val(tole);
    $('#div_es_edit input#tolerancia_menos').val(tole);
});

$(document).on('click', 'table tbody tr td a.pri', function (e)
{
    var pa = $(this);
    var padre = pa.closest('tr');
    var idreceta = parseInt(padre.attr('idreceta')); console.log('idreceta->'+idreceta);
    var id_art_sucursal = $('#id_art_sucursal').val(); console.log('id_art_sucursal->'+id_art_sucursal);
    var papi = "";
    var rec = 0;
    var vapr = $(this).attr('vapr');
    vapr = (vapr==1) ? (0) : (1);

    if(idreceta>0)
    {
        var pinta = "";
        $.ajax({
            url: $('base').attr('href') + 'articuloxsucursal/insumoprincipal',
            type: 'POST',
            data: 'id_receta='+idreceta+'&id_art_sucursal_padre='+id_art_sucursal+'&principal='+vapr,
            dataType: "json",
            beforeSend: function() {
                //showLoader();
            },
            success: function(response) {
                if (response.code==1) {
                    $('table tbody tr td a.pri i').removeClass('fa-check-square-o');
                    $('table tbody tr td a.pri i').removeClass('fa-square-o');
                    $('table tbody tr td a.pri i').each(function (index, value){
                        papi = $(this);
                        papi.removeClass('fa-check-square-o');
                        rec = parseInt(papi.closest('tr').attr('idreceta'));
                        if(rec==idreceta && vapr==1)
                        {
                            papi.addClass('fa-check-square-o'); console.log('ati->'+rec);
                        }
                        else
                        {
                            papi.addClass('fa-square-o'); 
                        }                
                    });
                    pa.attr({'vapr':vapr});
                }
            },
            complete: function() {
                //hideLoader();
            }
        });
    }

});
/*<---->*/

/*Genera Sub Producto*/
$(document).on('change', '#generasubsubproducto', function (e) {
  var genera_sub_producto = ($(this).is(':checked')) ? ("1"): ("0");
  var id_art_sucursal = $('#id_art_sucursal').val();
  if(id_art_sucursal>0)
  {
    $.ajax({
        url: $('base').attr('href') + 'articuloxsucursal/save_articulo',
        type: 'POST',
        data: 'id_art_sucursal='+id_art_sucursal+'&genera_sub_producto='+genera_sub_producto,
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
    });
  }
});
/*<---->*/

/*Es Sub Producto*/
$(document).on('change', '#es_subproducto', function (e) {
  var es_sub_producto = ($(this).is(':checked')) ? ("1"): ("0");
  var id_art_sucursal = $('#id_art_sucursal').val();
  if(id_art_sucursal>0)
  {
    $.ajax({
        url: $('base').attr('href') + 'articuloxsucursal/save_articulo',
        type: 'POST',
        data: 'id_art_sucursal='+id_art_sucursal+'&es_sub_producto='+es_sub_producto,
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
    });
  }
});

$(document).on('hidden.bs.modal', '#subproducto', function (e)
{
  $('#descripcion_subprod').val('');
  $('#id_art_sucursal_sub_producto').val('');
  $('#factor_unitario_subprod').val('');
});

$(document).on('click', '.add_subproducto', function (e)
{
  $('#descripcion_subprod').val('');
  $('#id_art_sucursal_sub_producto').val('');
  $('#factor_unitario_subprod').val('');
});


$(document).on('click', '.delete_subprod', function (e)
{
    e.preventDefault();
    var idsubproducto = parseInt($(this).parents('tr').attr('idsubproducto'));
    var nomb = "Sub Producto";
    swal({
    title: 'Estas Seguro?',
    text: "De Eliminar este "+nomb,
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, estoy seguro!'
    }).then(function(isConfirm) {
        if (isConfirm) {
            $.ajax({
                url: $('base').attr('href') + 'articuloxsucursal/delete_subproducto',
                type: 'POST',
                data: 'id_sub_producto='+idsubproducto,
                dataType: "json",
                beforeSend: function() {
                    //showLoader();
                },
                success: function(response) {
                    if (response.code==1) {
                      var tipo = $('#myTab li.active').attr('tabs');
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
});

$(document).on('click', '.edit_subprod', function (e)
{
    e.preventDefault();
    var idsubproducto = parseInt($(this).parents('tr').attr('idsubproducto'));
    if(idsubproducto>0)
    {
        $('#descripcion_subprod').val('');
        $('#id_art_sucursal_sub_producto').val('');
        $('#factor_unitario_subprod').val('');
        $.ajax({
            url: $('base').attr('href') + 'articuloxsucursal/edit_subproducto',
            type: 'POST',
            data: 'id_sub_producto='+idsubproducto,
            dataType: "json",
            beforeSend: function() {
                //showLoader();
            },
            success: function(response) {
                if (response.code==1) {
                    $('#id_sub_producto').val(response.data.id_sub_producto);
                    $('#id_art_sucursal_sub_producto').val(response.data.id_art_sucursal_sub_producto);
                    $('#descripcion_subprod').val(response.data.descripcion);
                    $('#factor_unitario_subprod').val(response.data.factor_unitario_subprod);
                    $('#id_almacen_sub_producto').html(response.data.cbx);
                }
            },
            complete: function() {
                //hideLoader();
            }
        });
    }
});
/*<---->*/

/*Validar Al Salir del Formulario*/
function validar_tabs(tipo)
{
    var id_art_sucursal = $('#id_art_sucursal').val();
    window.location.href = $('base').attr('href') +'articuloxsucursal/edit/'+id_art_sucursal+'/'+tipo;
}
/*<---->*/

$(document).on('change', '#receta_oculta', function (e)
{
  var receta_oculta = ($(this).is(':checked')) ? ("1"): ("0");
  var id_art_sucursal = $('#id_art_sucursal').val();

  if(id_art_sucursal>0)
  {
    $.ajax({
        url: $('base').attr('href') + 'articuloxsucursal/save_rectaoculta',
        type: 'POST',
        data: 'id_art_sucursal='+id_art_sucursal+'&receta_oculta='+receta_oculta,
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            if (response.code==1) {
              //var tipo = $('#myTab li.active').attr('tabs');
              //window.location.href = $('base').attr('href') +'articuloxsucursal/edit/'+response.data.id+'/'+tipo;
            }                    
        },
        complete: function() {
            //hideLoader();
        }
    });
  }

});

/*Recetario*/
$(document).on('click', '.add_receta, .cancel_recetario', function (e)
{
    var tipo = $(this).attr('tipo');
    limp_todo('form-add-recetario');
    $('#id_recetario').attr({'name':'id_receta_'+tipo});
    var title = (tipo=="preparacion") ? ("Preparación") : ("Mise en Place");
    title = 'Agregar '+title;
    $('h4#titlerecetrio').html(title);
});


$(document).on('change', '#id_almacensubproducto', function (e)
{
    e.preventDefault();
    var id = parseInt($(this).val());
    var idart = parseInt($('#id_art_sucursal').val());
    if(id>0 && idart>0)
    {
        var temp = "id_art_sucursal="+idart+'&id_almacensubproducto='+id;
        $.ajax({
            url: $('base').attr('href') + 'articuloxsucursal/save_articulo',
            type: 'POST',
            data: temp,
            dataType: "json",
            beforeSend: function() {
            },
            success: function(response) {
                if (response.code==1) {
                  var tipo = $('#myTab li.active').attr('tabs');
                  //window.location.href = $('base').attr('href') +'articuloxsucursal/edit/'+response.data.id+'/'+tipo;
                }                    
            },
            complete: function() {
            }
        });
    }
});
$(document).on('click', '.edit_recetario', function (e)
{
  e.preventDefault();

    var idreceta = $(this).parents('tr').attr('idreceta');
    var tipo = $(this).parents('tr').attr('tipo');
    $('#id_recetario').attr({'name':'id_receta_'+tipo});
    var title = (tipo=="preparacion") ? ("Preparación") : ("Mise en Place");
    title = 'Editar '+title;
    $('h4#titlerecetrio').html(title);

    if(idreceta>0)
    {
        $.ajax({
            url: $('base').attr('href') + 'articuloxsucursal/edit_recetario',
            type: 'POST',
            data: 'id_receta='+idreceta+'&tipo='+tipo,
            dataType: "json",
            beforeSend: function() {
                //showLoader();
            },
            success: function(response) {
                if (response.code==1) {
                    $('#id_recetario').val(response.data.id_receta);
                    $('#actividad').val(response.data.actividad);
                    $('#tiempo').val(response.data.tiempo);
                    $('#intensidad').val(response.data.intensidad);
                    $('#utensilio').val(response.data.utensilio);
                    $('#paso').val(response.data.paso);
                }
            },
            complete: function() {
                //hideLoader();
            }
        });
    }
});

$(document).on('click', '.delete_recetario', function (e)
{
    e.preventDefault();
    var idreceta = $(this).parents('tr').attr('idreceta');
    var tipo = $(this).parents('tr').attr('tipo');
    if(idreceta>0)
    {
        var nomb = "Paso";
        swal({
        title: 'Estas Seguro?',
        text: "De Eliminar este "+nomb,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, estoy seguro!'
        }).then(function(isConfirm) {
            if (isConfirm) {
                $.ajax({
                    url: $('base').attr('href') + 'articuloxsucursal/delete_recetario',
                    type: 'POST',
                    data: 'id_receta='+idreceta+'&tipo='+tipo,
                    dataType: "json",
                    beforeSend: function() {
                        //showLoader();
                    },
                    success: function(response) {
                        if (response.code==1) {
                          var tipo = $('#myTab li.active').attr('tabs');
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
/*Fin Recetario*/

/*Print Receta*/
function printData()
{
   var divToPrint=document.getElementById("daleprintreceta");
   newWin= window.open("");
   newWin.document.write(divToPrint.outerHTML);
   newWin.print();
   newWin.close();
}

$(document).on('click', '.daleprint', function (e)
{
    printData();
})
/*Fin Print Receta*/