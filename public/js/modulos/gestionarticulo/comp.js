$( document ).ready(function() {
    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });
    
    /*Proveedor*/
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
            var id_provart = parseInt($('#id_provart').val());
            var orden = parseInt($('table#tb_proveedor tbody tr td.orden').length);
            var catd = orden;
            if(id_provart>0)
            {
                orden = parseInt($('td#orden_'+id_provart).html())-1;
            }
            console.log(id_provart);
            var id_art_sucursal = parseInt($('#id_art_sucursal').val());
            var temp = "id_art_sucursal="+id_art_sucursal+'&tipo=pj&id_provart='+id_provart+'&orden='+orden;

            temp = temp+'&rsocial='+$('#rsocialprov').val()+'&nombrecomercial='+$('#nombrecomercial').val();

            $.ajax({
                url: $('base').attr('href') + 'articuloxsucursal/save_proveedor_articulo',
                type: 'POST',
                data: $('#form-add-pj').serialize()+'&'+temp,
                dataType: "json",
                beforeSend: function() {
                    $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
                },
                success: function(response) {
                    if (response.code == 1) {
                        if(catd>0)
                        {   
                            var id_provart = parseInt($('#id_provart').val());
                            if(id_provart>0)
                            {
                                console.log("entro1");
                                $('table#tb_proveedor tbody tr#idprovart_'+id_provart).html(response.data.table);
                            }
                            else 
                            {
                                console.log("entro2");
                                $('table#tb_proveedor tbody').append(response.data.table);
                            }
                        }
                        else
                        {
                            $('table#tb_proveedor tbody').html(response.data.table);
                        }
                        $('#proveedor').modal('hide');
                        limp_todo('form-add-pj');
                        var id_provart = response.data.id_provart;
                        $('#id_provartm').val(id_provart);
                        $('#umcxprov').modal('show');
                        get_provartum(id_provart);
                    }                    
                },
                complete: function(response) {
                    $.LoadingOverlay("hide");
                }
            });
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
            var id_provart = parseInt($('#id_provart').val());
            var orden = parseInt($('table#tb_proveedor tbody tr td.orden').length);
            var catd = orden;
            if(id_provart>0)
            {
                orden = parseInt($('td#orden_'+id_provart).html())-1;
            }
            var id_art_sucursal = parseInt($('#id_art_sucursal').val());
            var temp = "id_art_sucursal="+id_art_sucursal+'&tipo=pn&id_provart='+id_provart+'&orden='+orden;

            temp = temp+'&apellidos='+$('#apellidos').val()+'&nombres='+$('#nombres').val();
            $.ajax({
                url: $('base').attr('href') + 'articuloxsucursal/save_proveedor_articulo',
                type: 'POST',
                data: $('#form-add-pn').serialize()+'&'+temp,
                dataType: "json",
                beforeSend: function() {
                    $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
                },
                success: function(response) {
                    if (response.code==1) {
                        if(catd>0)
                        {
                            var id_provart = parseInt($('#id_provart').val());
                            if(id_provart>0)
                            {
                                $('table#tb_proveedor tbody tr#idprovart_'+id_provart).html(response.data.table);
                            }
                            else 
                            {
                                $('table#tb_proveedor tbody').append(response.data.table);
                            }
                        }
                        else
                        {
                            $('table#tb_proveedor tbody').html(response.data.table);
                        }
                        $('#proveedor').modal('hide');
                        limp_todo('form-add-pn');
                        var id_provart = response.data.id_provart;
                        $('#umcxprov').modal('show');
                        $('#id_provartm').val(id_provart);
                        get_provartum(id_provart);                        
                    }
                },
                complete: function(response) {
                    $.LoadingOverlay("hide");
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
                    $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
                },
                success: function(response) {
                    if (response.code==1) {
                      var tipo = $('#myTab li.active').attr('tabs');
                      window.location.href = $('base').attr('href') +'articuloxsucursal/edit/'+response.data.id+'/'+tipo;
                    }                    
                },
                complete: function() {
                    $.LoadingOverlay("hide");
                }
            });/**/
        }
    });
    /*<---->*/

    /*Marca Politica*/
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
                    $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
                },
                success: function(response) {
                    if (response.code==1) {
                      var tipo = $('#myTab li.active').attr('tabs');
                      var id_art_sucursal = $('#id_art_sucursal').val();
                      window.location.href = $('base').attr('href') +'articuloxsucursal/edit/'+id_art_sucursal+'/'+tipo;
                    }                    
                },
                complete: function() {
                    $.LoadingOverlay("hide");
                }
            });/**/
        }
    });
    /*<---->*/

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
                    $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
                },
                success: function(response) {
                    if (response.code==1) {
                      var tipo = $('#myTab li.active').attr('tabs');
                      var id_art_sucursal = $('#id_art_sucursal').val();
                      window.location.href = $('base').attr('href') +'articuloxsucursal/edit/'+id_art_sucursal+'/'+tipo;
                    }                    
                },
                complete: function() {
                    $.LoadingOverlay("hide");
                }
            });/**/
        }
    });
    

    /*Unidad Medida Compra*/
    $('#form_add_umc').validate({
        
        submitHandler: function() {
            var valid = todo_llenado();
            if(!valid)
            {
                $.ajax({
                    url: $('base').attr('href') + 'articuloxsucursal/save_umprovart',
                    type: 'POST',
                    data: $('#form_add_umc').serialize(),
                    dataType: "json",
                    beforeSend: function() {
                        $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
                    },
                    success: function(response) {
                        if (response.code==1) {
                            swal('Se guardaron','los datos satisfactoriamente','success');
                            var id_provart = $('#id_provartm').val();
                            get_provartum(id_provart);
                            $('#umcxprov').modal('hide');
                        }                    
                    },
                    complete: function() {
                        $.LoadingOverlay("hide");
                    }
                });
            }
            else
            {
                switch(parseInt(valid))
                {
                    case 1:
                        swal('No puede haber','campos sin rellenar','error');
                    break
                    case 2:
                        swal('No puede haber','factor con valor 0!!','error');
                    break;
                    case 3:
                        swal('Debe seleccionar al menos','un campo por defecto!!','error');
                    break;
                }
                
            }
        }
    });

    /*<---->*/


});

$(function () {
    /*Proveedor*/
    $( "#ruc" ).autocomplete({ 
        params:{id_art_sucursal:$('#id_art_sucursal').val()},
        type:'POST',
        serviceUrl: $('base').attr('href')+"proveedor/get_ruc",
        onSelect: function (suggestion) {

            $('#id_persona_juridica').val(suggestion.id_proveedor);
            $('#nombrecomercial').val(suggestion.nombre_comercial);
            $('#rsocialprov').val(suggestion.razon_social);
        }
    });

    $( "#dni" ).autocomplete({
        params:{id_art_sucursal:$('#id_art_sucursal').val()},
        type:'POST',
        serviceUrl: $('base').attr('href')+"proveedor/get_dni",
        onSelect: function (suggestion) {

            $('#id_persona_natural').val(suggestion.id_proveedor);
            $('#nombres').val(suggestion.nombres);
            $('#dni').val(suggestion.dni);
            $('#apellidos').val(suggestion.apellidos);
            $('#nombre_comercialnat').val(suggestion.nombre_comercial);
            $('#ruc_nat').val(suggestion.ruc);
        }
    });

    $( "#unidad_medida_compran" ).autocomplete({
        serviceUrl: $('base').attr('href')+"unidadmedida/get_unidadmedida",
        onSelect: function (suggestion) {
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
        params:{id_art_sucursal:$('#id_art_sucursal').val()},
        type:'POST',
        serviceUrl: $('base').attr('href')+"proveedor/get_nombrecomercial",
        onSelect: function (suggestion) {
            $('#id_persona_juridica').val(suggestion.id_proveedor);
            $('#ruc').val(suggestion.ruc);
            $('#rsocialprov').val(suggestion.razon_social);
        }
    });

    $( "#rsocialprov" ).autocomplete({
        params:{id_art_sucursal:$('#id_art_sucursal').val()},
        type:'POST',
        serviceUrl: $('base').attr('href')+"proveedor/get_rsocial",
        onSelect: function (suggestion) {
            $('#id_persona_juridica').val(suggestion.id_proveedor);
            $('#ruc').val(suggestion.ruc);
            $('#nombrecomercial').val(suggestion.nombre_comercial);
        }
    });

    $( "#apellidos" ).autocomplete({
        params:{id_art_sucursal:$('#id_art_sucursal').val()},
        type:'POST',
        serviceUrl: $('base').attr('href')+"proveedor/get_apellidos",
        onSelect: function (suggestion) {
            $('#id_persona_natural').val(suggestion.id_proveedor);
            $('#nombres').val(suggestion.nombres);
            $('#dni').val(suggestion.dni);
            $('#apellidos').val(suggestion.apellidos);
            $('#nombre_comercialnat').val(suggestion.nombre_comercial);
            $('#ruc_nat').val(suggestion.ruc);
        }
    });

    $( "#nombres" ).autocomplete({
        params:{id_art_sucursal:$('#id_art_sucursal').val()},
        type:'POST',
        serviceUrl: $('base').attr('href')+"proveedor/get_nombres",
        onSelect: function (suggestion) {
            $('#id_persona_natural').val(suggestion.id_proveedor);
            $('#dni').val(suggestion.dni);
            $('#apellidos').val(suggestion.apellidos);
            $('#nombre_comercialnat').val(suggestion.nombre_comercial);
            $('#ruc_nat').val(suggestion.ruc);
        }
    });

    $( "#marcap" ).autocomplete({
        params:{id_art_sucursal:$('#id_art_sucursal').val()},
        type:'POST',
        serviceUrl: $('base').attr('href')+"marca/get_marcap",
        minChars: 2,
        onSelect: function (suggestion) {
            $('#id_marca').val(suggestion.id_marca);
        }
    });

    $( "#nombre_comercialnat" ).autocomplete({
        params:{id_art_sucursal:$('#id_art_sucursal').val()},
        type:'POST',
        serviceUrl: $('base').attr('href')+"proveedor/get_ncomercialnat",
        onSelect: function (suggestion) {
            $('#id_persona_natural').val(suggestion.id_proveedor);
            $('#nombres').val(suggestion.nombres);
            $('#dni').val(suggestion.dni);
            $('#nombre_comercialnat').val(suggestion.nombre_comercial);
            $('#ruc_nat').val(suggestion.ruc);
            $('#apellidos').val(suggestion.apellidos);
        }
    });

    $("#ruc_nat").autocomplete({
        params: { id_art_sucursal: $('#id_art_sucursal').val() },
        type: 'POST',
        serviceUrl: $('base').attr('href') + "proveedor/get_rucnat",
        onSelect: function (suggestion) {
            $('#id_persona_natural').val(suggestion.id_proveedor);
            $('#nombres').val(suggestion.nombres);
            $('#dni').val(suggestion.dni);
            $('#apellidos').val(suggestion.apellidos);
            $('#nombre_comercialnat').val(suggestion.nombre_comercial);
            $('#ruc_nat').val(suggestion.ruc);

        }
    });
    /*<----->*/

    /*Marca Politica*/
    $( "#marca" ).autocomplete({
        serviceUrl: $('base').attr('href')+"marca/get_marca",
        minChars: 2,
        onSelect: function (suggestion) {
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
    /*<---->*/
});

/*Proveedor*/
$(document).on('change', '#escompras', function (e) {
    var para_compras = ($(this).is(':checked')) ? ("1"): ("0");
    var id_art_sucursal = $('#id_art_sucursal').val();
    if(para_compras==1)
    {
        $('#div_para_compras').removeClass('collapse');
    }
    else
    {
        $('#div_para_compras').addClass('collapse');
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
});

$(document).on('hidden.bs.modal', '#proveedor', function (e)
{
  limpiarproveedor();
});


$(document).on('click', '.add_proveedor', function (e)
{
    limpiarproveedor();
    $('#id_provart').val(0)
});

function limpiarproveedor()
{
    limp_todo('form-add-pj');
    limp_todo('form-add-pj');
}

$(document).on('click', '.delete_prov', function (e)
{
    var padre = $(this);
    var idsucursal = padre.parents('tr').attr('idsucursal');
    var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
    var nomb = "Proveedor";
    var idprovart = $(this).parents('tr').attr('idprovart');
    
    if(idprovart>0)
    {
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
                    url: $('base').attr('href') + 'articuloxsucursal/delete_proveedor_articulo',
                    type: 'POST',
                    data: 'id_provart='+idprovart,
                    dataType: "json",
                    beforeSend: function() {
                        $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
                    },
                    success: function(response) {
                        if (response.code==1) {
                            padre.parents('tr').remove();
                            var cantpro = parseInt($('table#tb_proveedor tbody tr td.orden').length);
                            if(cantpro>0){
                                $('table#tb_proveedor tbody tr td.orden').each(function (index, value){
                                    $(this).html(index+1);
                                });
                            }
                            else {
                              $('table#tb_proveedor tbody').html("<tr><td colspan='11'><h2 class='text-center text-success'>No se hay registro</h2></td></tr>");
                            }
                        }
                    },
                    complete: function() {
                        $.LoadingOverlay("hide");
                    }
                });
            }
        });
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
                $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
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
                        $('#id_unidadmedida_compra').val(response.data.id_unidadmedida_compra);
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
                $.LoadingOverlay("hide");
            }
        });
    }
});
/*<--->*/

/*Marcas*/
$(document).on('hidden.bs.modal', '#editmarca', function (e)
{
    limp_todo('form-add-marca');
});

$(document).on('click', '.add_marcap, .btn_cancelmarca', function (e)
{
    limp_todo('form-add-marca');
});

$(document).on('click', '.delete_pm', function (e)
{
    e.preventDefault();
    var idpoliticam = parseInt($(this).parents('tr').attr('idpoliticam'));
    idpoliticam = (idpoliticam>0) ? (idpoliticam) : (0);
    if(idpoliticam>0)
    {
        var nomb = "Politica de Marca";
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
                    url: $('base').attr('href') + 'articuloxsucursal/delete_marca_articulo',
                    type: 'POST',
                    data: 'id_politica_m='+idpoliticam,
                    dataType: "json",
                    beforeSend: function() {
                        $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
                    },
                    success: function(response) {
                        if (response.code==1) {
                          var tipo = $('#myTab li.active').attr('tabs');
                          var id_art_sucursal = $('#id_art_sucursal').val();
                          window.location.href = $('base').attr('href') +'articuloxsucursal/edit/'+id_art_sucursal+'/'+tipo;
                        }
                    },
                    complete: function() {
                        $.LoadingOverlay("hide");
                    }
                });
            }
        });
    }
});

$(document).on('click', 'table#polimar tbody tr td a.pri', function (e)
{
    var pa = $(this);
    var padre = pa.closest('tr');
    var idpoliticam = parseInt(padre.attr('idpoliticam'));
    var id_art_sucursal = $('#id_art_sucursal').val(); 
    var papi = "";
    var rec = 0;
    var vapr = $(this).attr('vapr');
    vapr = (vapr==1) ? (0) : (1);

    if(idpoliticam>0)
    {
        var pinta = "";
        $.ajax({
            url: $('base').attr('href') + 'articuloxsucursal/politicamprincipal',
            type: 'POST',
            data: 'id_politica_m='+idpoliticam+'&id_art_sucursal='+id_art_sucursal+'&principal='+vapr,
            dataType: "json",
            beforeSend: function() {
                $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
            },
            success: function(response) {
                if (response.code==1) {
                    $('table#polimar tbody tr td a.pri i').removeClass('fa-check-square-o');
                    $('table#polimar tbody tr td a.pri i').removeClass('fa-square-o');
                    $('table#polimar tbody tr td a.pri i').each(function (index, value){
                        papi = $(this);
                        papi.removeClass('fa-check-square-o');
                        rec = parseInt(papi.closest('tr').attr('idpoliticam'));
                        if(rec==idpoliticam && vapr==1)
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
                $.LoadingOverlay("hide");
            }
        });
    }

});
/*<---->*/

/*Impuestos*/
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
                        $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
                    },
                    success: function(response) {
                        if (response.code==1) {
                          var tipo = $('#myTab li.active').attr('tabs');
                          var id_art_sucursal = $('#id_art_sucursal').val();
                          window.location.href = $('base').attr('href') +'articuloxsucursal/edit/'+id_art_sucursal+'/'+tipo;
                        }
                    },
                    complete: function() {
                        $.LoadingOverlay("hide");
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
                $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
            },
            success: function(response) {
                if (response.code==1) {
                    var id_imp = response.data.id_impuesto;
                    $('#id_art_impuesto').val(response.data.id_art_impuesto);
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

$(document).on('click', '.add_impuesto', function (e) {
    limp_todo('form-add-impuesto');
});

$(document).on('change', '#id_impuesto', function (e) {

    $('#valor').val('');
    $('#valor').closest('.form-group').addClass('hidden');
});
/*<---->*/

/*Validar Al Salir del Formulario*/
function validar_tabs(tipo)
{
    var escompras = ($('#escompras').is(':checked')) ? ("1"): ("0");
    var valor = true;
    var cantpro = parseInt($('table#tb_proveedor tbody tr td.orden').length);

    if(escompras== "1")
    {
        var valor = false;

        if(cantpro >1)
        {
            var valor = true;
            salidajax(tipo);
        }
    }
    else
    {
        salidajax(tipo);
    }
    return (valor) ? ('') : ('Ingresar un Proveedor');
}

function salidajax(tipo)
{
    var id_art_sucursal = parseInt($('#id_art_sucursal').val()); //console.log(id_art_sucursal);
    if(id_art_sucursal>0)
    {
        var escompras = ($('#escompras').is(':checked')) ? ("1"): ("0");
        if(escompras==1)
        {
            var cantpro = parseInt($('table#tb_proveedor tbody tr td.orden').length);
            if(cantpro == 0)
            {
                escompras = 0;
            }
        }

        $.ajax({
            url: $('base').attr('href') + 'articuloxsucursal/save_articulo',
            type: 'POST',
            data: 'id_art_sucursal='+id_art_sucursal+'&para_compras='+escompras,
            dataType: "json",
            beforeSend: function() {
                $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
            },
            success: function(response) {
                if (response.code==1) {
                    window.location.href = $('base').attr('href') +'articuloxsucursal/edit/'+response.data.id+'/'+tipo;
                }                    
            },
            complete: function() {
                //hideLoader();
            }
        });
    }
}

function salidaformulario(validar, tipo)
{
    swal({
        title: 'Esta Seguro de Salir?',
        text: "No olvide "+validar,
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

$(document).on('change','#id_impuesto',function(){
    $('button[type="submit"]').prop('disabled',false);
    var id = $(this).val();
    $('#id_tipo_igv').val('');
    $('#valor').closest('.form-group').addClass('hidden');
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
                //showLoader();
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
                //hideLoader();
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
                //showLoader();
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
                //hideLoader();
            }
        });
    }
    else
    {
        $('#valor').closest('.form-group').addClass('hidden');
    }
});

$(document).on('click','.edit_umcxprov',function () {
   var id_provart = $(this).parents('tr').attr('idprovart');
   $('#id_provartm').val(id_provart);
   console.log(id_provart);
   if(id_provart)
   {
        get_provartum(id_provart);
   }
});

function actualizar_aut() {
    $( ".unidad_medida_compra" ).autocomplete({
        serviceUrl: $('base').attr('href')+"unidadmedida/get_unidadmedida",
        params: {
            w_not : function ()
            {
                return unidad_medidasusadas();
            }
        },
        onSearchStart: function (query) {
            window.esto = $(this);
        },
        onSelect: function (suggestion) {
            esto.parents('tr').find('.id_um').val(suggestion.id_unidadmedida);

            if($('#id_unidadmedida_compra-error').length>0)
            {
                if($('#id_unidadmedida_compra-error').attr('class')=="help-block")
                {
                  $('#id_unidadmedida_compra-error').remove();
                }
            }
        }
    });
}

$(document).on('click','.delete_provum',function(){
    var id_provum = $(this).parents('tr').attr('id_provartum');
    var id_provart = $('#id_provartm').val();
    if(id_provum)
    {
        cambiarestado (id_provum,"0");
        get_provartum(id_provart);
    }
    else
    {
        $(this).parents('tr').remove();
    }
});


$(document).on('click','.active_provum',function(){
    var id_provum = $(this).parents('tr').attr('id_provartum');
    if(id_provum)
    {
        cambiarestado (id_provum,"1");
    }
});

function cambiarestado (id, estado)
{
    if(id)
    {
        var hacer = (estado ==1) ? "Activar": "Eliminar";
        swal({
            title: '¿Esta Seguro?',
            text: "de "+hacer+" este Elemento",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, estoy seguro!'
        }).then(function(isConfirm) {
            if (isConfirm) {     
                $.ajax({
                    url: $('base').attr('href') + 'articuloxsucursal/cambiarestado_provum',
                    type: 'POST',
                    data: 'id_provart_unidadmedida='+id+'&estado='+estado,
                    dataType: "json",
                    beforeSend: function() {
                        $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
                    },
                    success: function(response) {
                        if (response.code==1) {
                            var hizo = (estado ==1) ? "Activado": "Eliminado";
                            swal('Completado','Este elemento se ha '+hizo+' con éxito','success');
                            var id_provart = $('#id_provartm').val();
                            get_provartum(id_provart);
                        }                    
                    },
                    complete: function() {
                        $.LoadingOverlay("hide");
                    }
                });
            }
        });  
        
    }
}

function get_provartum(id_provart)
{
    $.ajax({
        url: $('base').attr('href') + 'articuloxsucursal/get_unidadmedidacompraxprov',
        type: 'POST',
        data: 'id_provart='+id_provart,
        dataType: "json",
        beforeSend: function() {
            $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
        },
        success: function(response) {
            if (response.code==1) {
                $('#bodyindex').html(response.data);
                actualizar_aut();
            }                    
        },
        complete: function() {
            $.LoadingOverlay("hide");
        }
    });
}

$(document).on('click','.add_ump',function(){
    var c = 1;
    $('.def').remove();
    $('tbody#bodyindex tr.gen_prum').each(function( index, value ) {
        c++;
    });

    var txt =   "<tr class='gen_prum'>"+
                    "<td>"+
                      "<input type='text' class='unidad_medida_compra form-control'/>"+
                      "<input type='hidden' class='id_um' name='id_unidadmedida[g_"+c+"]'>"+
                      "<input type='hidden' class='g' name='id_provart_unidadmedida[g_"+c+"]'/>"+
                    "</td>"+
                    "<td>"+
                      "<input type='text' name='factorcompra[g_"+c+"]' class='factor_compra form-control'/>"+
                    "</td>"+
                    "<td>"+
                      "<input type='hidden' class='por_defecto' name='pordefecto[g_"+c+"]' >"+
                      "<a href='javascript:void(0);' class='change_default'><center><i class='fa fa-square-o fa-2x'></i></a></center>"+
                    "</td>"+
                    "<td><center><a href='javascript:void(0);' class='btn btn-danger delete_provum btn-xs'><i class='fa fa-trash-o'></i></a></center></td>";
                "</tr>";

    $('#bodyindex').append(txt);
    actualizar_aut();
});

$(document).on('click','.change_default',function(){
    $('i.fa-check-square-o').removeClass('fa-check-square-o').addClass('fa-square-o');
    $(this).find('i').removeClass('fa-square-o').addClass('fa-check-square-o');
    $('.por_defecto').val(0);
    $(this).parents('td').find('.por_defecto').val(1);
});
/*<---->*/

function todo_llenado() 
{
    var ret = false;
    var no_default = false;
    $('tbody#bodyindex tr input').each(function( index, value ) {

        if(ret==false && $(this).val()==""){
            if($(this).hasClass('g') || $(this).hasClass('por_defecto')){}
            else
            {
                ret = 1;
                return ret;
            }
        }
        else
        {
            if($(this).hasClass('factor_compra') && $(this).val()<=0)
            {
                ret = 2;
                return ret;
            }
            else
            {
                if(no_default==false && $(this).hasClass('por_defecto') && $(this).val()==1)
                {
                    no_default=true;
                }
            }
        }
    });

    ret = (no_default==false) ? 3 : ret;
    return ret;
}

function unidad_medidasusadas() 
{   
    var i = new Array();
    $('tbody#bodyindex tr input.id_um').each(function( index, value ) {
        if($(this).val())
            i.push($(this).val());
    });

    return (i.length>0) ? i.join() : null;
}

$(document).on('click','.c',function () {
    var icn =  $(this).find('i');
    var est = (icn.hasClass("fa-square-o")) ? 1 : 2;
    (icn.hasClass("fa-square-o")) ? icn.removeClass('fa-square-o').addClass("fa-check-square-o") : icn.removeClass('fa-check-square-o').addClass("fa-square-o");
    var art_sucu = $('#id_art_sucursal').val();
    var param = 'id_art_sucursal='+art_sucu+'&compras_ingresokardex='+est;
    $.ajax({
        url: $('base').attr('href') + 'articuloxsucursal/set_compraafectakardex',
        type: 'POST',
        data: param,
        dataType: "json",
        beforeSend: function() {
            $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
        },
        success: function(response) {
            if (response.code==1) {}
            else
            {
                swal('error','hubo un error al actualizar los datos','error');
            } 
        },
        complete: function() {
            $.LoadingOverlay("hide");
        }
    });
});