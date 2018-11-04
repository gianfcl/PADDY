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
            
            var id_servicios = parseInt($('#id_servicios').val());
            var temp = "id_servicios="+id_servicios+'&tipo=pj&id_provart='+id_provart+'&orden='+orden;

            temp = temp+'&rsocial='+$('#rsocialprov').val()+'&nombrecomercial='+$('#nombrecomercial').val();

            $.ajax({
                url: $('base').attr('href') + 'servicios/save_prov_elmcosto',
                type: 'POST',
                data: $('#form-add-pj').serialize()+'&'+temp,
                dataType: "json",
                beforeSend: function() {
                },
                success: function(response) {
                    if (response.code == 1) {
                        if(catd>0)
                        {
                            if(id_provart>0)
                            {
                                $('table#tb_proveedor tbody tr#idprovart_'+id_provart).html(response.data);
                            }
                            else 
                            {
                                $('table#tb_proveedor tbody').append(response.data);
                            }
                        }
                        else
                        {
                            $('table#tb_proveedor tbody').html(response.data);
                        }
                    }                    
                },
                complete: function(response) {
                    if (response.responseJSON.code == "1") {
                        $('#proveedor').modal('hide');
                        limp_todo('form-add-pn');
                    }
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
            var id_servicios = parseInt($('#id_servicios').val());
            var temp = "id_servicios="+id_servicios+'&tipo=pn&id_provart='+id_provart+'&orden='+orden;

            temp = temp+'&apellidos='+$('#apellidos').val()+'&nombres='+$('#nombres').val();
            $.ajax({
                url: $('base').attr('href') + 'servicios/save_prov_elmcosto',
                type: 'POST',
                data: $('#form-add-pn').serialize()+'&'+temp,
                dataType: "json",
                beforeSend: function() {
                    //showLoader();
                },
                success: function(response) {
                    if (response.code==1) {
                        if(catd>0)
                        {
                            if(id_provart>0)
                            {
                                $('table#tb_proveedor tbody tr#idprovart_'+id_provart).html(response.data);
                            }
                            else 
                            {
                                $('table#tb_proveedor tbody').append(response.data);
                            }
                        }
                        else
                        {
                            $('table#tb_proveedor tbody').html(response.data);
                        }                        
                    }
                },
                complete: function(response) {
                    if (response.responseJSON.code == "1") {
                        $('#proveedor').modal('hide');
                        limp_todo('form-add-pn');
                    }
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
                url: $('base').attr('href') + 'servicios/save_servicios',
                type: 'POST',
                data: $('#form_save_compras').serialize(),
                dataType: "json",
                beforeSend: function() {
                    //showLoader();
                },
                success: function(response) {
                    if (response.code==1) {
                      var tipo = $('#myTab li.active').attr('tabs');
                      window.location.href = $('base').attr('href') +'servicios/edit/'+response.data.id+'/'+tipo;
                    }                    
                },
                complete: function() {
                    //hideLoader();
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
                  url: $('base').attr('href') + 'servicios/validar_impuesto',
                  type: "post",
                  data: {
                    tipo: function() { return ($( "#id_art_impuesto" ).length>0)?('compra'):('venta'); },
                    id_art_impuesto: function() { return ($( "#id_art_impuesto" ).length>0)?($( "#id_art_impuesto" ).val()):($( "#id_art_impuesto_venta" ).val()); },
                    id_impuesto: function() { return $( "#id_impuesto" ).val(); },
                    id_servicios: function() { return $('#id_servicios').val(); }
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
            var temp = "id_servicios="+$('#id_servicios').val();
            $.ajax({
                url: $('base').attr('href') + 'servicios/save_impuesto',
                type: 'POST',
                data: $('#form-add-impuesto').serialize()+'&'+temp,
                dataType: "json",
                beforeSend: function() {
                    //showLoader();
                },
                success: function(response) {
                    if (response.code==1) {
                      var tipo = $('#myTab li.active').attr('tabs');
                      var id_servicios = $('#id_servicios').val();
                      window.location.href = $('base').attr('href') +'servicios/editar/'+id_servicios+'/'+tipo;
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
    /*Proveedor*/
    $( "#ruc" ).autocomplete({ 
        params:{id_servicios:$('#id_servicios').val()},
        type:'POST',
        serviceUrl: $('base').attr('href')+"proveedor/get_ruc",
        onSelect: function (suggestion) {

            $('#id_persona_juridica').val(suggestion.id_proveedor);
            $('#nombrecomercial').val(suggestion.nombre_comercial);
            $('#rsocialprov').val(suggestion.razon_social);
        }
    });

    $( "#dni" ).autocomplete({
        params:{id_servicios:$('#id_servicios').val()},
        type:'POST',
        serviceUrl: $('base').attr('href')+"proveedor/get_dni",
        onSelect: function (suggestion) {

            $('#id_persona_natural').val(suggestion.id_proveedor);
            $('#nombres').val(suggestion.nombres);
            $('#apellidos').val(suggestion.apellidos);
        }
    });

    $( "#unidad_medida_compra" ).autocomplete({
        serviceUrl: $('base').attr('href')+"unidadmedida/get_unidadmedida",
        onSelect: function (suggestion) {
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
        params:{id_servicios:$('#id_servicios').val()},
        type:'POST',
        serviceUrl: $('base').attr('href')+"proveedor/get_nombrecomercial",
        onSelect: function (suggestion) {
            $('#id_persona_juridica').val(suggestion.id_proveedor);
            $('#ruc').val(suggestion.ruc);
            $('#rsocialprov').val(suggestion.razon_social);
        }
    });

    $( "#rsocialprov" ).autocomplete({
        params:{id_servicios:$('#id_servicios').val()},
        type:'POST',
        serviceUrl: $('base').attr('href')+"proveedor/get_rsocial",
        onSelect: function (suggestion) {
            $('#id_persona_juridica').val(suggestion.id_proveedor);
            $('#ruc').val(suggestion.ruc);
            $('#nombrecomercial').val(suggestion.nombre_comercial);
        }
    });

    $( "#apellidos" ).autocomplete({
        params:{id_servicios:$('#id_servicios').val()},
        type:'POST',
        serviceUrl: $('base').attr('href')+"proveedor/get_apellidos",
        onSelect: function (suggestion) {
            $('#id_persona_natural').val(suggestion.id_proveedor);
            $('#nombres').val(suggestion.nombres);
            $('#dni').val(suggestion.dni);
        }
    });

    $( "#nombres" ).autocomplete({
        params:{id_servicios:$('#id_servicios').val()},
        type:'POST',
        serviceUrl: $('base').attr('href')+"proveedor/get_nombres",
        onSelect: function (suggestion) {
            $('#id_persona_natural').val(suggestion.id_proveedor);
            $('#dni').val(suggestion.dni);
            $('#apellidos').val(suggestion.apellidos);
        }
    });

    $( "#marcap" ).autocomplete({
        params:{id_servicios:$('#id_servicios').val()},
        type:'POST',
        serviceUrl: $('base').attr('href')+"marca/get_marcap",
        minChars: 2,
        onSelect: function (suggestion) {
            $('#id_marca').val(suggestion.id_marca);
        }
    });
    /*<----->*/
});


/*Proveedor*/
$(document).on('change', '#escompras', function (e) {
    var para_compras = ($(this).is(':checked')) ? ("1"): ("0");
    var id_servicios = $('#id_servicios').val();
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
    var idsucursal = padre.parents('tr').attr('idprovart');
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
                    url: $('base').attr('href') + 'servicios/delete_prov_elmcosto',
                    type: 'POST',
                    data: 'id_provart='+idprovart,
                    dataType: "json",
                    beforeSend: function() {
                        //showLoader();
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
                        //hideLoader();
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
            url: $('base').attr('href') + 'servicios/edit_prov_elmcosto',
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
                //hideLoader();
            }
        });
    }
});
/*<--->*/

/*Impuestos*/
$(document).on('click', '.delete_impuesto', function (e)
{
    e.preventDefault();

    var idartimpuesto = $(this).parents('tr').attr('idartimpuesto');
    if(idartimpuesto>0)
    {
        swal({
            title: 'Estado Seguro?',
            text: "Eliminar este Impuesto",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, estoy seguro!'
        }).then(function(isConfirm) {
            if (isConfirm) {     
                $.ajax({
                    url: $('base').attr('href') + 'servicios/delete_impuesto',
                    type: 'POST',
                    data: 'id_art_impuesto='+idartimpuesto,
                    dataType: "json",
                    beforeSend: function() {
                        //showLoader();
                    },
                    success: function(response) {
                        if (response.code==1) {
                          var tipo = $('#myTab li.active').attr('tabs');
                          var id_servicios = $('#id_servicios').val();
                          window.location.href = $('base').attr('href') +'servicios/editar/'+id_servicios+'/'+tipo;
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
            url: $('base').attr('href') + 'servicios/edit_impuesto',
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

$(document).on('click', '.add_impuesto', function (e) {
    limp_todo('form-add-impuesto');
});

$(document).on('change', '#id_impuesto', function (e) {
    var abrv = $('#id_impuesto option:selected').attr('label');
    $('#abreviatura').val(abrv);
});
/*<---->*/