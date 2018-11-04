$( document ).ready(function() {

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

    $('#form_save_articulo').validate({
        rules:
        {          
          descripcion: { required:true, minlength: 2 },
          id_marca: { required:true },
          id_grupo: { required:true },
          id_familia: { required:true },
          id_unidadmedida_base: {required:true}
        },
        messages: 
        {          
          descripcion: { required:"Ingresar Descripción", minlength: "Más de 2 Letras" },
          id_marca: { required:"Buscar y Seleccionar" },
          id_grupo: { required:"Seleccionar Grupo" },
          id_familia: { required:"Seleccionar Familia" },
          id_unidadmedida_base: { required:"Buscar y Seleccionar" }
        },      

        highlight: function(element) {
            $(element).closest('.col-md-6').addClass('has-error');  
        },
        unhighlight: function(element) {
            $(element).closest('.col-md-6').removeClass('has-error');
        },
        errorElement: 'span',
        errorClass: 'help-block',
        errorPlacement: function(error, element) 
        {
            if(element.parent('.col-md-6').length) { error.insertAfter(element.parent()); }
        },
        submitHandler: function() {
            $.ajax({
                url: $('base').attr('href') + 'articuloxsucursal/save_articulo',
                type: 'POST',
                data: $('#form_save_articulo').serialize(),
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

    $('#form_save_compras').validate({
        rules:
        {          
          id_unidadmedida_compra: { required:true},
          factor_compra: { required:true },
          id_unidadmedida_pago: { required:true },
          igv_compra: { required:true }
        },
        messages: 
        {          
          id_unidadmedida_compra: { required:"Buscar y Seleccionar UM Compra" },
          factor_compra: { required:"Ingresar Factor de Compra" },
          id_unidadmedida_pago: { required:"Buscar y Seleccionar UM Pago" },
          igv_compra: { required:"Ingresar IGV" }
        },      

        highlight: function(element) {
            $(element).closest('.col-md-6').addClass('has-error');  
        },
        unhighlight: function(element) {
            $(element).closest('.col-md-6').removeClass('has-error');
        },
        errorElement: 'span',
        errorClass: 'help-block',
        errorPlacement: function(error, element) 
        {
            if(element.parent('.col-md-6').length) { error.insertAfter(element.parent()); }
        },
        submitHandler: function() {
            $.ajax({
                url: $('base').attr('href') + 'articuloxsucursal/save_articulo',
                type: 'POST',
                data: $('#form_save_compras').serialize(),
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

    $('#form-add-pj').validate({
        rules:
        {          
          id_proveedor: { required:true}
        },
        messages: 
        {          
          id_proveedor: { required:"Buscar y Seleccionar" }
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
            if(element.parent('.col-md-8').length) { error.insertAfter(element.parent()); }
        },
        submitHandler: function() {
            var temp = "id_art_sucursal="+$('#id_art_sucursal').val()+'&tipo=pj&id_provart='+$('#id_provart').val();
            $.ajax({
                url: $('base').attr('href') + 'articuloxsucursal/save_proveedor_articulo',
                type: 'POST',
                data: $('#form-add-pj').serialize()+'&'+temp,
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


    $('#form-add-pn').validate({
        rules:
        {          
          id_proveedor: { required:true}
        },
        messages: 
        {          
          id_proveedor: { required:"Buscar y Seleccionar" }
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
            if(element.parent('.col-md-8').length) { error.insertAfter(element.parent()); }
        },
        submitHandler: function() {
            var temp = "id_art_sucursal="+$('#id_art_sucursal').val()+'&tipo=pn&id_provart='+$('#id_provart').val();
            $.ajax({
                url: $('base').attr('href') + 'articuloxsucursal/save_proveedor_articulo',
                type: 'POST',
                data: $('#form-add-pn').serialize()+'&'+temp,
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

    $('#form-add-marca').validate({
        rules:
        {          
          id_marca: { required:true}
        },
        messages: 
        {          
          id_marca: { required:"Buscar y Seleccionar" }
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
            var temp = "id_art_sucursal="+$('#id_art_sucursal').val();
            $.ajax({
                url: $('base').attr('href') + 'articuloxsucursal/save_marca_articulo',
                type: 'POST',
                data: $('#form-add-marca').serialize()+'&'+temp,
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

    $('#form_save_almacen').validate({
        rules:
        {          
          id_area: { required:true},
          id_ubicacion: { required:true}
        },
        messages: 
        {          
          id_area: { required:"Seleccionar Área" },
          id_ubicacion: { required:"Seleccionar Ubicación" }
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
            if(element.parent('.col-md-8').length) { error.insertAfter(element.parent()); }
        },
        submitHandler: function() {
            $.ajax({
                url: $('base').attr('href') + 'articuloxsucursal/save_articulo',
                type: 'POST',
                data: $('#form_save_almacen').serialize(),
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

    $('#form_save_es_insumo_receta').validate({
        rules:
        {          
          id_unidadmedida_consumo: { required:true},
          factor_consumo: { required:true }
        },
        messages: 
        {          
          id_unidadmedida_consumo: { required:"Buscar y Seleccionar UM Consumo" },
          factor_consumo: { required:"Ingresar Factor de Consumo" }
        },      

        highlight: function(element) {
            $(element).closest('.col-md-6').addClass('has-error');  
        },
        unhighlight: function(element) {
            $(element).closest('.col-md-6').removeClass('has-error');
        },
        errorElement: 'span',
        errorClass: 'help-block',
        errorPlacement: function(error, element) 
        {
            if(element.parent('.col-md-6').length) { error.insertAfter(element.parent()); }
        },
        submitHandler: function() {
            $.ajax({
                url: $('base').attr('href') + 'articuloxsucursal/save_articulo',
                type: 'POST',
                data: $('#form_save_es_insumo_receta').serialize(),
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

    $('#form_save_es_receta').validate({
        rules:
        {          
          lote: { required:true}
        },
        messages: 
        {          
          lote: { required:"" }
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
            if(element.parent('.col-md-7').length) { error.insertAfter(element.parent()); }
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
          cantidad: { required:true, number:true },
          tolerancia_mas: { number:true },
          tolerancia_menos: { number:true }
        },
        messages: 
        {          
          id_art_sucursal_receta: { required:"Buscar y Seleccionar Articulo" },
          cantidad: { required:"Ingresar Cantidad", number:"Solo #s" },
          tolerancia_mas: { number:"Solo #s" },
          tolerancia_menos: { number:"Solo #s" }
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

    $('#form-add-subproducto').validate({
        rules:
        {          
          id_art_sucursal_sub_producto: { required:true}
        },
        messages: 
        {          
          id_art_sucursal_sub_producto: { required:"Buscar y Seleccionar Articulo" }
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


    $('#form_save_ventas').validate({
        rules:
        {          
          id_unidadmedida_venta: { required:true},
          factor_venta: { required:true },
          peso_estandar: { required:true, number: true }
        },
        messages: 
        {          
          id_unidadmedida_venta: { required:"Buscar y Seleccionar UM Compra" },
          factor_venta: { required:"Ingresar Factor de Compra" },
          peso_estandar: { required:"Ingresar Peso Estandar", number: "Solo #s" }
        },      

        highlight: function(element) {
            $(element).closest('.col-md-6').addClass('has-error');  
        },
        unhighlight: function(element) {
            $(element).closest('.col-md-6').removeClass('has-error');
        },
        errorElement: 'span',
        errorClass: 'help-block',
        errorPlacement: function(error, element) 
        {
            if(element.parent('.col-md-6').length) { error.insertAfter(element.parent()); }
        },
        submitHandler: function() {
            $.ajax({
                url: $('base').attr('href') + 'articuloxsucursal/save_articulo',
                type: 'POST',
                data: $('#form_save_ventas').serialize(),
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

    /*$("#id_impuesto").select2({
      placeholder: "Seleccione Impuesto",
      allowClear: true,
      width: 'resolve'
    });

    var $eventimpuesto = $("#id_impuesto");

    $eventimpuesto.on("select2:close", function (e) {  
      if($('#id_impuesto-error').length>0) {
        $('#id_impuesto-error').html("Seleccione Impuesto");
      }
      $("#id_ubicacion").html("").trigger("change"); 
    });

    $eventimpuesto.on("select2:select", function (e) { 
        if($('#id_impuesto-error').length>0) { $('#id_impuesto-error').html(""); }
        if($('#id_impuesto').parents('.form-group').attr('class')=="form-group has-error")
        {
            $(this).parents('.form-group').removeClass('has-error');
        }
    });*/

    $("#id_area").select2({
      placeholder: "Seleccione Área",
      allowClear: true,
      width: 'resolve'
    });   

    var $eventarea = $("#id_area");
     
    $eventarea.on("select2:open", function (e) { console.log("select2:open", e); });
    
    $eventarea.on("select2:close", function (e) {  
      if($('#id_area-error').length>0) {
        $('#id_area-error').html("Seleccione Grupo");
      }
      $("#id_ubicacion").html("").trigger("change"); 
    });

    $eventarea.on("select2:select", function (e) { 
      if($('#id_area-error').length>0) { $('#id_area-error').html(""); }

      $.ajax({
        url: $('base').attr('href') + 'ubicacion/combox_ubicacion',
        type: 'POST',
        data: 'id_area='+e.params.data.id,
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            if (response.code==1) {
              $("#id_ubicacion").html("").trigger("change");
              $("#id_ubicacion").html(response.data).trigger("change");
              if($('#id_ubicacion-error').parents('.col-md-6').attr('class')=="col-md-6 col-sm-6 col-xs-12 has-error")
              {
                $('#id_ubicacion-error').parents('.col-md-6').removeClass('has-error');
              }
              
              if($('#id_ubicacion-error').length>0)
              {
                $('#id_ubicacion-error').html("");    
                $('#id_ubicacion-error').parents('.form-group').removeClass('has-error');
              }
            }
        },
        complete: function() {
            //hideLoader();
        }
      });
    }); 

    $("#id_ubicacion").select2({
      placeholder: "Seleccione Ubicación",
      allowClear: true,
      width: 'resolve'
    }); 

    $("#id_grupo").select2({
      placeholder: "Seleccione Grupo",
      allowClear: true,
      width: 'resolve'
    });

    var $eventSelect = $("#id_grupo");
     
    $eventSelect.on("select2:open", function (e) { console.log("select2:open", e); });
    
    $eventSelect.on("select2:close", function (e) {  
      if($('#id_grupo-error').length>0) {
        $('#id_grupo-error').html("Seleccione Grupo");
      }
      $("#id_familia").html("").trigger("change"); 
    });
    
    $eventSelect.on("select2:select", function (e) { 
      if($('#id_grupo-error').length>0) { $('#id_grupo-error').html(""); }
      console.log(e.params.data.id);
      console.log(e.params.data.text);

      $.ajax({
        url: $('base').attr('href') + 'familia/combox_familia',
        type: 'POST',
        data: 'id_grupo='+e.params.data.id,
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            if (response.code==1) {
              $("#id_familia").html("").trigger("change");
              $("#id_familia").html(response.data).trigger("change");
              if($('#id_familia-error').parents('.col-md-6').attr('class')=="col-md-6 col-sm-6 col-xs-12 has-error")
              {
                $('#id_familia-error').parents('.col-md-6').removeClass('has-error');
              }
              
              if($('#id_familia-error').length>0)
              {
                $('#id_familia-error').html("");    
                $('#id_familia-error').parents('.form-group').removeClass('has-error');
              }
            }
        },
        complete: function() {
            //hideLoader();
        }
      });
    });
    
    $eventSelect.on("select2:unselect", function (e) { console.log("select2:Saliste"); });
     
    $eventSelect.on("change", function (e) { console.log("Seleccione"); });

    $("#id_familia").select2({
      placeholder: "Seleccione Familia",
      allowClear: true,
      width: 'resolve'
    });

    var $eventfamilia = $("#id_familia");
     
    $eventfamilia.on("select2:open", function (e) { console.log("select2:open", e); });
    $eventfamilia.on("select2:close", function (e) {  if($('#id_familia-error').length>0) { $('#id_familia-error').html("Seleccione Grupo");}  });
    $eventfamilia.on("select2:select", function (e) { if($('#id_familia-error').length>0) { $('#id_familia-error').html(""); }});
    $eventfamilia.on("select2:unselect", function (e) { console.log("select2:Saliste"); });
     
    $eventfamilia.on("change", function (e) { console.log("Seleccione"); });

      var tip_pers = "";
      $("#tipo_persona label").click(function(){
        tip_pers = $('#tipo_persn').val();
      });

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
});

$(function () {
    $( "#marca" ).autocomplete({
    serviceUrl: $('base').attr('href')+"marca/get_marca",
    minChars: 2,
    onSelect: function (suggestion) {
      //alert('You selected: ' + suggestion.value + ', ' + suggestion.data);
      $('#id_marca').val(suggestion.id_marca);
      if($('#id_marca-error').length>0)
      {
        if($('#id_marca-error').attr('class')=="help-block")
        {
          $('#id_marca-error').remove();
        }
      }
    }
  });

  $( "#unidad_medida" ).autocomplete({
    serviceUrl: $('base').attr('href')+"unidadmedida/get_unidadmedida",
    onSelect: function (suggestion) {
      //alert('You selected: ' + suggestion.value + ', ' + suggestion.data);
      $('#id_unidadmedida_base').val(suggestion.id_unidadmedida);
      if($('#id_unidadmedida_base-error').length>0)
      {
        if($('#id_unidadmedida_base-error').attr('class')=="help-block")
        {
          $('#id_unidadmedida_base-error').remove();
        }
      }
    }
  });

  $( "#unidad_medida_compra" ).autocomplete({
    serviceUrl: $('base').attr('href')+"unidadmedida/get_unidadmedida",
    onSelect: function (suggestion) {
      //alert('You selected: ' + suggestion.value + ', ' + suggestion.data);
      $('#id_unidadmedida_compra').val(suggestion.id_unidadmedida);
      if($('#id_unidadmedida_compra-error').length>0)
      {
        if($('#id_unidadmedida_compra-error').attr('class')=="help-block")
        {
          $('#id_unidadmedida_compra-error').remove();
        }
      }
    }
  });

  $( "#unidad_medida_compran" ).autocomplete({
    serviceUrl: $('base').attr('href')+"unidadmedida/get_unidadmedida",
    onSelect: function (suggestion) {
      //alert('You selected: ' + suggestion.value + ', ' + suggestion.data);
      $('#id_unidadmedida_compran').val(suggestion.id_unidadmedida);
      if($('#id_unidadmedida_compran-error').length>0)
      {
        if($('#id_unidadmedida_compran-error').attr('class')=="help-block")
        {
          $('#id_unidadmedida_compran-error').remove();
        }
      }
    }
  });

  $( "#unidad_medida_pago" ).autocomplete({
    serviceUrl: $('base').attr('href')+"unidadmedida/get_unidadmedida",
    onSelect: function (suggestion) {
      //alert('You selected: ' + suggestion.value + ', ' + suggestion.data);
      $('#id_unidadmedida_pago').val(suggestion.id_unidadmedida);
      if($('#id_unidadmedida_pago-error').length>0)
      {
        if($('#id_unidadmedida_pago-error').attr('class')=="help-block")
        {
          $('#id_unidadmedida_pago-error').remove();
        }
      }
    }
  });

  $( "#unidad_medida_pagon" ).autocomplete({
    serviceUrl: $('base').attr('href')+"unidadmedida/get_unidadmedida",
    onSelect: function (suggestion) {
      //alert('You selected: ' + suggestion.value + ', ' + suggestion.data);
      $('#id_unidadmedida_pagon').val(suggestion.id_unidadmedida);
      if($('#id_unidadmedida_pagon-error').length>0)
      {
        if($('#id_unidadmedida_pagon-error').attr('class')=="help-block")
        {
          $('#id_unidadmedida_pagon-error').remove();
        }
      }
    }
  });

  $( "#nombrecomercial" ).autocomplete({
    //appendTo: autonombrecomercial,
    params:{id_art_sucursal:$('#id_art_sucursal').val()},
    type:'POST',
    serviceUrl: $('base').attr('href')+"proveedor/get_nombrecomercial",
    onSelect: function (suggestion) {
    //alert('You selected: ' + suggestion.value + ', ' + suggestion.data);
    $('#id_persona_juridica').val(suggestion.id_proveedor);
    $('#ruc').val(suggestion.ruc);
    //$('#nombrecomercial').val(suggestion.nombre_comercial);
    $('#rsocialprov').val(suggestion.razon_social);
  }
  });

  $( "#rsocialprov" ).autocomplete({
    //appendTo: autorsocial,
    params:{id_art_sucursal:$('#id_art_sucursal').val()},
    type:'POST',
    serviceUrl: $('base').attr('href')+"proveedor/get_rsocial",
    onSelect: function (suggestion) {
    //alert('You selected: ' + suggestion.value + ', ' + suggestion.data);
    $('#id_persona_juridica').val(suggestion.id_proveedor);
    $('#ruc').val(suggestion.ruc);
    $('#nombrecomercial').val(suggestion.nombre_comercial);
    //$('#rsocialprov').val(suggestion.razon_social);
  }
  });

  $( "#ruc" ).autocomplete({
    //appendTo: autoruc,    
    params:{id_art_sucursal:$('#id_art_sucursal').val()},
    type:'POST',
    serviceUrl: $('base').attr('href')+"proveedor/get_ruc",
    onSelect: function (suggestion) {
    //alert('You selected: ' + suggestion.value + ', ' + suggestion.data);
    $('#id_persona_juridica').val(suggestion.id_proveedor);
    //$('#ruc').val(suggestion.ruc);
    $('#nombrecomercial').val(suggestion.nombre_comercial);
    $('#rsocialprov').val(suggestion.razon_social);
  }
  });

  $( "#apellidos" ).autocomplete({
    //appendTo: autoapellidos,
    params:{id_art_sucursal:$('#id_art_sucursal').val()},
    type:'POST',
    serviceUrl: $('base').attr('href')+"proveedor/get_apellidos",
    onSelect: function (suggestion) {
    //alert('You selected: ' + suggestion.value + ', ' + suggestion.data);
    $('#id_persona_natural').val(suggestion.id_proveedor);
    $('#nombres').val(suggestion.nombres);
    $('#dni').val(suggestion.dni);
    //$('#apellidos').val(suggestion.apellidos);
  }
  });

  $( "#nombres" ).autocomplete({
    //appendTo: autonombres,
    params:{id_art_sucursal:$('#id_art_sucursal').val()},
    type:'POST',
    serviceUrl: $('base').attr('href')+"proveedor/get_nombres",
    onSelect: function (suggestion) {
    //alert('You selected: ' + suggestion.value + ', ' + suggestion.data);
    $('#id_persona_natural').val(suggestion.id_proveedor);
    //$('#nombres').val(suggestion.nombres);
    $('#dni').val(suggestion.dni);
    $('#apellidos').val(suggestion.apellidos);
  }
  });

  $( "#dni" ).autocomplete({
    //appendTo: autondni,
    params:{id_art_sucursal:$('#id_art_sucursal').val()},
    type:'POST',
    serviceUrl: $('base').attr('href')+"proveedor/get_dni",
    onSelect: function (suggestion) {
    //alert('You selected: ' + suggestion.value + ', ' + suggestion.data);
    $('#id_persona_natural').val(suggestion.id_proveedor);
    $('#nombres').val(suggestion.nombres);
    //$('#dni').val(suggestion.dni);
    $('#apellidos').val(suggestion.apellidos);
  }
  });

  $( "#marcap" ).autocomplete({
    //appendTo: automp,
    params:{id_art_sucursal:$('#id_art_sucursal').val()},
    type:'POST',
    serviceUrl: $('base').attr('href')+"marca/get_marcap",
    minChars: 2,
    onSelect: function (suggestion) {
      //alert('You selected: ' + suggestion.value + ', ' + suggestion.data);
      $('#id_marca').val(suggestion.id_marca);
    }
  });

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

    $( "#unidad_medida_consumo" ).autocomplete({
    serviceUrl: $('base').attr('href')+"unidadmedida/get_unidadmedida",
    onSelect: function (suggestion) {
        //alert('You selected: ' + suggestion.value + ', ' + suggestion.data);
        $('#id_unidadmedida_consumo').val(suggestion.id_unidadmedida);
        if($('#id_unidadmedida_consumo-error').length>0)
        {
            if($('#id_unidadmedida_consumo-error').attr('class')=="help-block")
            {
                $('#id_unidadmedida_consumo-error').remove();
            }
        }
    }
    });

    $( "#descripcion_receta" ).autocomplete({
    params:{id_art_sucursal:$('#id_art_sucursal').val()},
    serviceUrl: $('base').attr('href')+"articuloxsucursal/get_articulo_receta",
    type:'POST',
    onSelect: function (suggestion) {
      
        $('label#umconsum').html(suggestion.unidad_medida_consumo);
        $('#id_art_sucursal_receta').val(suggestion.id_art_sucursal_receta);
        if($('#id_art_sucursal_receta-error').length>0)
        {
            if($('#id_art_sucursal_receta-error').attr('class')=="help-block")
            {
              $('#id_art_sucursal_receta-error').remove();
            }
        }
    }
    });

  $( "#descripcion_subprod" ).autocomplete({
    params:{id_art_sucursal:$('#id_art_sucursal').val()},
    serviceUrl: $('base').attr('href')+"articuloxsucursal/get_articulo_subprod",
    type:'POST',
    onSelect: function (suggestion) {
      //alert('You selected: ' + suggestion.value + ', ' + suggestion.data);
      $('#id_art_sucursal_sub_producto').val(suggestion.id_art_sucursal_sub_producto);
      if($('#id_art_sucursal_sub_producto-error').length>0)
      {
        if($('#id_art_sucursal_sub_producto-error').attr('class')=="help-block")
        {
          $('#id_art_sucursal_sub_producto-error').remove();
        }
      }
    }
  });

});

$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
});

$(document).on('click', '.btn_limp_art', function (e) {
  $('#id_art_sucursal').val('');
  $('#articulo').val('');
  $("select").val("").trigger("change");    
});

function btn_limp_artform()
{
  $('#descripcion').val("");
  $('#id_grupo').html("").trigger("change");
  $("#id_familia").html("").trigger("change");  
  $("#marca").val("");
  $("#id_marca").val("");
  $("#unidad_medida").val("");
  $("#id_unidadmedida_base").val("");
  $('#id_art_sucursal').val("");

  if($('#id_familia-error').parents('.col-md-6').attr('class')=="col-md-6 col-sm-6 col-xs-12 has-error")
  {
    $('#id_familia-error').parents('.col-md-6').removeClass('has-error');
  }
  
  if($('#id_familia-error').length>0)
  {
    $('#id_familia-error').html("");    
    $('#id_familia-error').parents('.form-group').removeClass('has-error');
  }

  if($('#id_grupo').parents('.col-md-6').attr('class')=="col-md-6 col-sm-6 col-xs-12 has-error")
  {
    $('#id_grupo').parents('.col-md-6').removeClass('has-error');
  }
  
  if($('#id_grupo-error').length>0)
  {
    $('#id_grupo-error').html("");
    $('#id_grupo-error').parents('.form-group').removeClass('has-error');
  }

  $('#estado label').removeClass('active');
  $('#estado input').prop('checked', false);
  
  $('#estado #estado_1').prop('checked', true);
  $('#estado #estado_1').parent('label').addClass('active');

  var validatore = $( "#form_save_articulo" ).validate();
  validatore.resetForm();
}

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');

  buscar_articulos(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {  
  var page = $(this).attr('tabindex');

  buscar_articulos(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;

  buscar_articulos(page);
});

function buscar_articulos(page)
{
    var codigo_busc = $('#codigo_busc').val();
    var descripcion_busc = $('#descripcion_busc').val();
    var inid_med_base_busc = $('#inid_med_base_busc').val();
    var grupo_busc = $('#grupo_busc').val();
    var familia_busc = $('#familia_busc').val();
    var temp = "page="+page;

    if(codigo_busc.trim().length)
    {
    temp=temp+'&codigo_busc='+codigo_busc;
    }

    if(descripcion_busc.trim().length)
    {
    temp=temp+'&descripcion_busc='+descripcion_busc;
    }

    if(inid_med_base_busc.trim().length)
    {
    temp=temp+'&inid_med_base_busc='+inid_med_base_busc;
    }

    if(grupo_busc.trim().length)
    {
    temp=temp+'&grupo_busc='+grupo_busc;
    }

    if(familia_busc.trim().length)
    {
    temp=temp+'&familia_busc='+familia_busc;
    }
    $.ajax({
      url: $('base').attr('href') + 'articuloxsucursal/buscar_articulos',
      type: 'POST',
      data: temp,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
          if (response.code==1) {
            $('#datatable-buttons tbody#bodyindex').html(response.data.rta);
            $('#paginacion_data').html(response.data.paginacion);
          }
      },
      complete: function() {
          //hideLoader();
      }
  });
}

$(document).on('click', '.edit', function (e) {
  var idarticulo = $(this).parents('tr').attr('idarticulo');
  $.ajax({
      url: $('base').attr('href') + 'articuloxsucursal/edit',
      type: 'POST',
      data: 'id_art_sucursal='+idarticulo,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
          if (response.code==1) {
            $('#articulo').val(response.data.articulo);
            $('#id_art_sucursal').val(response.data.id_art_sucursal);
            $('select').val(response.data.id_art_sucursal); // Change the value or make some change to the internal state
            $('select').trigger('change.select2'); // Notify only Select2 of changes
          }
      },
      complete: function() {
          //hideLoader();
      }
  });
});

$(document).on('click', '.delete', function (e) {
  e.preventDefault();
  var nomb = "Artículo!";
  var idarticulo = $(this).parents('tr').attr('idarticulo');
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');

  swal({
    title: 'Estas Seguro?',
    text: "De Desactivar este "+nomb,
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, estoy seguro!'
  }).then(function(isConfirm) {
    if (isConfirm) {     
      $.ajax({
        url: $('base').attr('href') + 'articuloxsucursal/delete',
        type: 'POST',
        data: 'id_art_sucursal='+idarticulo,
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            if (response.code==1) {
              var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
              buscar_articulos(page);
            }
        },
        complete: function() {
          var text = "Desactivo!";
          alerta(text, 'Este '+nomb+' se '+text+'.', 'success');
        }
      });
    }
  });    
});

$(document).on('change', '#escompras', function (e) {
  var para_compras = ($(this).is(':checked')) ? ("1"): ("0");
  var id_art_sucursal = $('#id_art_sucursal').val();
  if(id_art_sucursal>0)
  {
    $.ajax({
        url: $('base').attr('href') + 'articuloxsucursal/save_articulo',
        type: 'POST',
        data: 'id_art_sucursal='+id_art_sucursal+'&para_compras='+para_compras,
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

$(document).on('change', '#esventas', function (e) {
  var para_ventas = ($(this).is(':checked')) ? ("1"): ("0");
  var id_art_sucursal = $('#id_art_sucursal').val();
  if(id_art_sucursal>0)
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

$(document).on('click', '#tipo_persona label', function (e) {
  var padre = $(this);
  var tipo_persona = padre.find('input').val();
  
  $('#lbl_rsocialprov').parents('.form-group').show();
  if(tipo_persona == "1")
  {    
    $('#form-add-pj').removeClass('collapse');
    $('#form-add-pn').addClass('collapse');
  }
  else
  {
    $('#form-add-pj').addClass('collapse');
    $('#form-add-pn').removeClass('collapse');
  }
  limpiarproveedor();
  limp_todo('form-add-marca');
});

$(document).on('hidden.bs.modal', '#proveedor', function (e)
{
  limpiarproveedor();
});


$(document).on('click', '.add_proveedor', function (e)
{
    limpiarproveedor();
});

function limpiarproveedor()
{
    limp_todo('form-add-pj');
    limp_todo('form-add-pj');
}

$(document).on('hidden.bs.modal', '#editmarca', function (e)
{
    limp_todo('form-add-marca');
});

$(document).on('click', '.add_marcap, .btn_cancelmarca', function (e)
{
    limp_todo('form-add-marca');
});

$(document).on('click', '.add_insumos, .btn_cancel_insumos', function (e)
{
    limp_todo('form-add-insumos');
    $('#umconsum').html('');
});

$(document).on('hidden.bs.modal', '#insumos', function (e)
{
    limp_todo('form-add-insumos');
    $('#umconsum').html('');
});

$(document).on('hidden.bs.modal', '#subproducto', function (e)
{
  limp_todo('form-add-subproducto');
});

$(document).on('click', '.add_subproducto', function (e)
{
    limp_todo('form-add-subproducto');
});

$(document).on('click', '.delete_prov', function (e)
{
  e.preventDefault();

  if (confirm("Seguro que deseas eliminar este proveedor?")) 
  {
    var idprovart = $(this).parents('tr').attr('idprovart');
    if(idprovart>0)
    {
      $.ajax({
        url: $('base').attr('href') + 'articuloxsucursal/delete_proveedor_articulo',
        type: 'POST',
        data: 'id_provart='+idprovart,
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

$(document).on('click', '.edit_prov', function (e)
{
  e.preventDefault();
  var idprovart = $(this).parents('tr').attr('idprovart');
    if(idprovart>0)
    {
        $.ajax({
            url: $('base').attr('href') + 'articuloxsucursal/edit_prov',
            type: 'POST',
            data: 'id_provart='+idprovart,
            dataType: "json",
            beforeSend: function() {
                //showLoader();
            },
            success: function(response) {
                if (response.code==1) {
                    var numt = response.data.tipo_persona;
                    $('#tipo_persona input').prop('checked', false);
                    $('#tipo_persona label').removeClass('active');
                    $('#tipo_persona #tipo_persona_'+numt).prop('checked', true);
                    $('#tipo_persona #tipo_persona_'+numt).parent('label').addClass('active');
                    $('#id_provart').val(response.data.id_provart);
                    if(numt == 1)
                    {
                        $('#ruc').val(response.data.ruc);
                        $('#nombrecomercial').val(response.data.nombre_comercial);
                        $('#rsocialprov').val(response.data.razon_social);
                        $('#id_persona_juridica').val(response.data.id_persona_juridica);
                        $('#cod_pr').val(response.data.codigo);
                        $('#des_pr').val(response.data.descripcion);
                        $('#unidad_medida_compra').val(response.data.unidad_medida_compra);
                        $('#factor_compra').val(response.data.factor_compra);
                        $('#unidad_medida_pago').val(response.data.unidad_medida_pago);
                        $('#id_unidadmedida_pago').val(response.data.id_unidadmedida_pago);
                        $('#registro_sanitario').val(response.data.registro_sanitario);
                        $('#form-add-pj').removeClass('collapse');
                        $('#form-add-pn').addClass('collapse');
                    }
                    else
                    {
                        $('#form-add-pj').addClass('collapse');
                        $('#form-add-pn').removeClass('collapse');
                        $('#dni').val(response.data.dni);
                        $('#nombres').val(response.data.nombres);
                        $('#apellidos').val(response.data.apellidos);
                        $('#rsocial').val(response.data.razon_social);
                        $('#id_persona_natural').val(response.data.id_persona_natural);
                        $('#cod_pro').val(response.data.codigo);
                        $('#des_pro').val(response.data.descripcion);
                        $('#unidad_medida_compran').val(response.data.unidad_medida_compra);
                        $('#id_unidadmedida_compran').val(response.data.id_unidadmedida_compra);
                        $('#factor_compran').val(response.data.factor_compra);
                        $('#unidad_medida_pagon').val(response.data.unidad_medida_pago);
                        $('#registro_sanitarion').val(response.data.registro_sanitario);
                        $('#id_unidadmedida_pagon').val(response.data.id_unidadmedida_pago);
                    }
                }
            },
            complete: function() {
                //hideLoader();
            }
        });
    }
});


$(document).on('click', '.delete_pm', function (e)
{
  e.preventDefault();

  if (confirm("Seguro que deseas eliminar esta Marca?")) 
  {
    var idpoliticam = $(this).parents('tr').attr('idpoliticam');
    if(idpoliticam>0)
    {
      $.ajax({
        url: $('base').attr('href') + 'articuloxsucursal/delete_marca_articulo',
        type: 'POST',
        data: 'id_politica_m='+idpoliticam,
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

$(document).on('click', '.delete_receta', function (e)
{
  e.preventDefault();

  if (confirm("Seguro que deseas eliminar este Insumo?")) 
  {
    var idreceta = $(this).parents('tr').attr('idreceta');
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
                    $('#descripcion_receta').val(response.data.descripcion);
                    $('#id_art_sucursal_receta').val(response.data.id_art_sucursal_receta);
                    $('#cantidad').val(response.data.cantidad);
                    $('#id_receta').val(response.data.id_receta);
                    $('#tolerancia_mas').val(response.data.tolerancia_mas);
                    $('#tolerancia_menos').val(response.data.tolerancia_menos);
                }
            },
            complete: function() {
                //hideLoader();
            }
        });
    }
});

$(document).on('click', '.delete_subprod', function (e)
{
  e.preventDefault();

  if (confirm("Seguro que deseas eliminar este Sub Producto?")) 
  {
    var idsubproducto = $(this).parents('tr').attr('idsubproducto');
    if(idsubproducto>0)
    {
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
  }
});

$(document).on('click', '.delete_impuesto', function (e)
{
    e.preventDefault();

    var idartimpuesto = $(this).parents('tr').attr('idartimpuesto');
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
                    url: $('base').attr('href') + 'articuloxsucursal/delete_impuesto',
                    type: 'POST',
                    data: 'id_art_impuesto='+idartimpuesto,
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

$(document).on('click', '.edit_impuesto', function (e)
{
    e.preventDefault();

    var idartimpuesto = $(this).parents('tr').attr('idartimpuesto');
    if(idartimpuesto>0)
    {
        limp_todo('form-add-impuesto');
        $.ajax({
            url: $('base').attr('href') + 'articuloxsucursal/edit_impuesto',
            type: 'POST',
            data: 'id_art_impuesto='+idartimpuesto,
            dataType: "json",
            beforeSend: function() {
                //showLoader();
            },
            success: function(response) {
                if (response.code==1) {
                    $('#id_art_impuesto').val(response.data.id_art_impuesto);
                    $('#id_impuesto').val(response.data.id_impuesto);
                    $('#impuesto').val(response.data.impuesto);
                    $('#abreviatura').val(response.data.abreviatura);
                    $('#valor').val(response.data.valor);
                }
            },
            complete: function() {
                //hideLoader();
            }
        });
    }
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
                //showLoader();
            },
            success: function(response) {
                if (response.code==1) {
                    $('#id_art_impuesto_venta').val(response.data.id_art_impuesto_venta);
                    $('#id_impuesto').val(response.data.id_impuesto);
                    $('#impuesto').val(response.data.impuesto);
                    $('#abreviatura').val(response.data.abreviatura);
                    $('#valor').val(response.data.valor);
                }
            },
            complete: function() {
                //hideLoader();
            }
        });
    }
});

$(document).on('click', '#estado label', function (e) {
    var padre = $(this);
    var estado = padre.find('input').val();
    var idelementocosto = $('#id_elementocosto').val();
    var temp = 'id_elementocosto='+idelementocosto+'&estado='+estado;

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
    console.log(estado);
});

$(document).on('change', '.existpa', function (e) {
    var padre = $(this);
    var estado = ($(this).is(':checked')) ? ("1"): ("0");
    var id_art_sucursal = $('#id_art_sucursal').val();
    var id_almacen = $(this).parents('tr').attr('idalmacen');
    var id_arti_almacen = $(this).parents('tr').attr('idartialmacen');
    var temp = 'id_almacen='+id_almacen+'&id_arti_almacen='+id_arti_almacen+'&id_art_sucursal='+id_art_sucursal+'&estado='+estado;
    $.ajax({
        url: $('base').attr('href') + 'articuloxsucursal/save_arti_almacen',
        type: 'POST',
        data: temp,
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            if (response.code==1) {
                if(estado=="1")
                {
                    padre.parents('tr').find('td:last input').removeAttr("disabled");
                }
                else
                {
                    padre.parents('tr').find('td:last input').attr("disabled", true);
                    padre.parents('tr').find('td:last input').prop('checked', false);                    
                }
                padre.parents('tr').attr({'idartialmacen':response.data});
            }                    
        },
        complete: function() {
            //hideLoader();
        }
    });/**/
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

$(document).on('click', '.add_impuesto', function (e) {
    limp_todo('form-add-impuesto');
});

$(document).on('change', '#id_impuesto', function (e) {
    var abrv = $('#id_impuesto option:selected').attr('label');
    $('#abreviatura').val(abrv);
});