$(document).ready(function() {
    ConfigFiltros();
    $('#texto_tipodocumento').val("Factura");
    $('#buscarclientes').modal('show');
    $('#id_moneda').change();
    mon_base = $('select#id_moneda option[es_base=1]');
    simbolo_base = mon_base.attr('sim');
    id_monedabase = mon_base.attr('value');
    $('#id_moneda_base').val(id_monedabase);
    jQuery.validator.setDefaults({
        debug: true,
        success: "valid",
        ignore: ""
    });

    $('#form_save_facturacion').validate({
        rules: {
            fecha_emision: {required: true},
            exist_pedido: {required: true},
            id_formapago: {required: true},
            id_persona: {required: true},
            id_moneda: {required: true}
        },
        messages: {
            fecha_emision: {required: "Fecha"},
            exist_pedido: {required: ""},
            id_formapago: {required: ""},
            id_persona: {required: ""},
            id_moneda: {required: ""}
        },
        highlight: function(element) {
            $(element).closest('.form-group').addClass('has-error');
        },
        unhighlight: function(element) {
            $(element).closest('.form-group').removeClass('has-error');
        },
        errorElement: 'span',
        errorClass: 'help-block',
        errorPlacement: function(error, element) {
            error.insertAfter(element.parent());
        },
        submitHandler: function() {
            var i = valid_exist_pedido();
            if (i == 1) {
                var fc = $('#factor_moneda').val();
                console.log(fc);
                if (isNaN(parseFloat(fc))) {
                    alerta('Tipo de Cambio', 'No configurado para la fecha actual!!', 'error');
                } 
                else {
                    var temp = '';
                    var idfo = parseInt($('#id_formapago').val());
                    if (idfo == 2) {
                        var va = $(document).data('peri_odo');
                        if (va.length) {
                            temp = "&" + $(document).data('peri_odo');
                        }
                    }

                    $.ajax({
                        url: $('base').attr('href') + 'facturacion/save_facturacion',
                        type: 'POST',
                        data: $('#form_save_facturacion').serialize() + temp,
                        success: function(response) {
                            if (response.code == 1) {
                                var url = $('base').attr('href');
                                var link = url + 'facturacion/ver_factura/' + response.data.fact;
                                window.location.href = link;
                            }
                        },
                    });
                }
            } else {
                var text = '';
                if (i > 0) {
                    text = 'Verificar Artículos';
                }
                alerta('No Puede Guardar!', text, 'error');
            }
        }
    });
    $('#fecha_busc').datetimepicker({
        format: 'DD-MM-YYYY',
        locale: moment.locale('es')
    });
});

$(document).on('keypress', '.bfh-number', function(e) {
    if (e.which != 46 && (e.which < 47 || e.which > 59)) {
        return false;
    }
});

$(document).on('focusout', '.bfh-number', function(e) {
    var padre = $(this);
    var cantidad = parseFloat(padre.val());
    var stock = parseFloat(padre.parents('tr').find('td.stock input').val());
    if (validnum(cantidad)) {
        if (stock >= cantidad) {
            $(this).removeClass('erroinput');
            var pesou = padre.parents('tr').find('td.pesou input').val();
            var pesot = pesou * cantidad;
            padre.parents('tr').find('td.pesot span').html(pesot);
            padre.parents('tr').find('td.pesot input').val(pesot);
            var costou = parseFloat(padre.parents('tr').find('td.costo_u input.costo_unitario').val());
            costou = (costou > 0) ? (costou) : (0);
            var factov = parseFloat(padre.parents('tr').find('td.costo_u input.factor_venta').val());
            factov = (factov > 0) ? (factov) : (0);
            var costov = parseFloat(costou * factov * cantidad);
            costov = (costov > 0) ? (costov.toFixed(2)) : ('0.00');
            padre.parents('tr').find('td.costo_t span.pull-right').html(costov);
            pu(padre);
        } else {
            $(this).addClass('erroinput');
            alerta("Error!", 'Verificar el Stock.', 'error');
        }
    } else {
        $(this).addClass('erroinput');
    }
});

function validnum(exp) {
    var valor = 0;
    if (exp <= 0) {
        if (exp == 0) {
            valor = 1;
        }
    } else {
        if ($.isNumeric(exp)) {
            valor = 1;
        }
    }
    return parseInt(valor);
}

$(document).on('click', 'table#buscar_arti .limpiarfiltro', function(e) {
    $('table#buscar_arti tbody tr#filtro_articulos input[type=text]').val('');
    buscar_articulos(0);
});

$(document).on('click', 'table#buscar_arti tbody td.almi select.alm', function(e) {
    var tis = $(this);
    var idalma = parseInt(tis.val());
    var padre = tis.closest('tr');
    var idarts = parseInt(padre.attr('idartsucursal'));
    var stoki = (idalma > 0 && idarts > 0) ? (parseFloat(padre.find('td.stock input.stoki_' + idarts + '_' + idalma).val())) : (0);
    stoki = (stoki > 0) ? (stoki.toFixed(2)) : ('');
    padre.find('td.stock span').html(stoki);
});

$(document).on('click', '.add_arti', function(e) {
    var padre = $(this).parents('tr');
    var id = parseInt(padre.attr('idartsucursal'));
    var max = parseInt($('#limitdocu').val());
    var can = parseInt($('table#lista_general tbody tr.ordenes td.orden').length);
    if (max > can) {
        if ((max - 1) == can) {
            $('table#lista_general thead tr th a.add_articulos').addClass('hide');
            $('#buscarart').modal('hide');
        }
        if (id > 0) {
            var temp = 'idartsu=' + id;
            var idalm = parseInt(padre.find('td.almi input').val());
            var canti = parseFloat(padre.find('td.canntid input').val());
            if (idalm > 0) {
                if ($('table#lista_general tbody tr#padre_' + id).length) {
                    alerta('No!', 'Ya esta agregado', 'error');
                } else {
                    temp = temp + '&idalm=' + idalm;
                    var ky = parseInt($('#lista_general tbody tr.ordenes td.orden').length);
                    var stoki = parseFloat(padre.find('td.stock span').html());
                    if (canti > 0) {
                        if (canti <= stoki) {
                            temp = temp + '&canti=' + canti;
                            var pasa = true;
                            var tiene_igv = null;
                            var fecha_ = $('#fecha_busc').val();

                            $.ajax({
                                url: $('base').attr('href') + 'ingresoxcompra/impxregimen',
                                type: 'POST',
                                async: false,
                                data: 'fecha='+fecha_,
                                dataType: "json",
                                beforeSend: function() {
                                    $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
                                },
                                success: function(response) {
                                    if (response.code==1) 
                                    {
                                        var resp = response.data;
                                        if(resp=="no tiene"){
                                            alerta('Error','No hay un Régimen Configurado en la fecha seleccionada!!','error');
                                            pasa = false;
                                            return 0;
                                        }
                                        else {
                                            if(resp==0){tiene_igv = 0;}
                                            else {
                                                tiene_igv = (parseInt($('#docu_tieneigv').val())>0) ? $('#docu_tieneigv').val() : 0;
                                                if(tiene_igv) {
                                                    $.ajax({
                                                        url: $('base').attr('href') + 'facturacion/validar_igvxarti',
                                                        type: 'POST',
                                                        async: false,
                                                        data: 'id_art='+id+'&fecha_='+fecha_,
                                                        dataType: "json",
                                                        beforeSend: function() {
                                                            $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
                                                        },
                                                        success: function(response) {
                                                            if (response.code==1) {
                                                                var boo = response.data;
                                                                pasa = boo;
                                                                if(!boo)
                                                                    alerta('Error','No hay IGV configurado en el articulo en la fecha seleccionada!!','error');
                                                                    return 0;
                                                            }
                                                        },
                                                        complete: function() {
                                                            $.LoadingOverlay("hide");
                                                        }
                                                    });
                                                }
                                            }
                                        }
                                    }
                                },
                                complete: function() {
                                  $.LoadingOverlay("hide");
                                }
                            });

                            if(pasa===true)
                            {
                                var factor_moneda = $('#factor_moneda').val();
                                temp +=  "&tiene_igv="+tiene_igv+'&fecha='+fecha_+'&factor_moneda='+factor_moneda;                                ;
                                $.ajax({
                                    url: $('base').attr('href') + 'facturacion/add_arti_alm',
                                    type: 'POST',
                                    data: temp,
                                    dataType: "json",
                                    beforeSend: function() {
                                        $.LoadingOverlay("show", {
                                            image: "",
                                            fontawesome: "fa fa-spinner fa-spin"
                                        });
                                    },
                                    success: function(response) {
                                        if (response.code == 1) {
                                            if ($('table#lista_general tbody tr#padre_' + id).length) {
                                                alerta('No!', 'Ya esta agregado', 'error');
                                            } else {
                                                if (ky > 0) {
                                                    $('table#lista_general tbody').append(response.data.ge);
                                                    $('table#lista_costos tbody').append(response.data.igv);
                                                    $('table#lista_logistica tbody').append(response.data.log);
                                                    $('table#lista_margen tbody').append(response.data.cos)
                                                } else {
                                                    $('table#lista_general tbody').html(response.data.ge);
                                                    $('table#lista_costos tbody').html(response.data.igv);
                                                    $('table#lista_logistica tbody').html(response.data.log);
                                                    $('table#lista_margen tbody').html(response.data.cos)
                                                }
                                                $('#exist_pedido').val('si');
                                                remover_arti(id);
                                                sumarval();
                                            }
                                        }
                                    },
                                    complete: function() {
                                        $.LoadingOverlay("hide");
                                    }
                                });
                            }
                        } else {
                            alerta('No puedo Agregar!', 'Cantidad excede Stock', 'error');
                        }
                    } else {
                        alerta('No puedo Agregar!', 'Cantidad Incorrecta', 'error');
                    }
                }
            } else {
                alerta('No puedo Agregar!', 'Seleccionar Almacén', 'error');
            }
        }
    } else {
        $('table#lista_general thead tr th a.add_articulos').addClass('hide');
        $('#buscarart').modal('hide');
    }
});
$(document).on('click', '.delete_ped', function(e) {
    var tipo =$(this).parents('tr').attr('tipo');
    if(tipo=="arti")
    {
        var id = parseInt($(this).parents('tr').attr('idartisucu'));
    }
    else
    {
        var id = parseInt($(this).parents('tr').attr('idservsucu'));
    }
    if (id > 0) {
        swal({
            title: '¿Estas Seguro?',
            text: "De Eliminar este Artículo",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, estoy seguro!'
        }).then(function(isConfirm) {
            if (isConfirm) {
                remover_lista(id,tipo);
                sumarval();
                valid_exist_pedido();
            }
        });
    }
});

function remover_lista(id,tipo) {
    console.log("entro");
    console.log("entro");
    if(tipo=="arti")
    {
        if ($('tr[idartisucu=' + id + ']').length) {
            $('tr[idartisucu=' + id + ']').remove();
            var num = parseInt($('#lista_general tbody tr td.orden').length);
            if (num > 0) {
                actualizar_tables();
            }
        }
        var max = parseInt($('#limitdocu').val());
        var can = parseInt($('table#lista_general tbody tr.ordenes td.orden').length);
        if (max > can) {
            $('table#lista_general thead tr th a.add_articulos').removeClass('hide');
            if (can == 0) {
                $('#id_formapago').val('');
                $('table#lista_general tbody').html("<tr><td colspan='16'><h2 class='text-center text-success'>No hay registro</h2></td></tr>");
            }
        } else {
            $('table#lista_general thead tr th a.add_articulos').addClass('hide');
        }
    }
    else
    {
        if ($('tr[idservsucu=' + id + ']').length) {
            $('tr[idservsucu=' + id + ']').remove();
            var num = parseInt($('#lista_general tbody tr td.orden').length);
            if (num > 0) {
                actualizar_tables();
            }
        }
    }
    
}

function remover_arti(id_art_sucursal) {
    if ($('#buscar_arti tr#' + id_art_sucursal).length) {
        $('#buscar_arti tr#' + id_art_sucursal).remove();
        var num = parseInt($('#buscar_arti tbody tr td.orden').length);
        if (num > 0) {
            actualizar_tables();
        } else {
            var page = 0;
            buscar_articulos(page);
            num = parseInt($('#buscar_arti tbody tr td.orden').length);
            if (num > 0) {} else {
                $('#buscarart').modal('hide');
            }
        }
    }
}

function sumarval() {
    var num = parseInt($('#lista_general tbody tr.ordenes td.orden').length);

    if (num > 0) {
        var tipo_igv = pretotal = sum = opGrav = opExo = opInafect = igv = 0;
        var tipo = '';
        var simbolo = $('select#id_moneda option:selected').attr('sim');
        //Tabla #lista_general
        $('#lista_general tbody tr td.sumar').each(function(index, value) {
            var padre = $(this).parents('tr');
            tipo = $(this).find('span.pull-right').attr('class').replace("pull-right ", "");
            sum = parseFloat($(this).find('span.pull-right input').val());
            tipo_igv = padre.attr('tipo_igv');
            var tipo_producto = padre.attr('tipo');
            var id = null;
            if (tipo_producto=="arti") {
                id = padre.attr('idartisucu');
                var trcosto = $('#lista_costos tr[idartisucu='+id+']');
            }
            else{
                id = padre.attr('idservsucu');
                var trcosto = $('#lista_costos tr[idservsucu='+id+']');
            }
            
            var cantidad = padre.find('td.cantidad input').val();
            igv += parseFloat(trcosto.find('.impuesto_unitario').val())*cantidad;
            switch (tipo_igv) {
                case '1':
                        opExo += parseFloat(trcosto.find('.costo_unitario').val())*cantidad; 
                    break;
                case '2':
                        opGrav += parseFloat(trcosto.find('.costo_unitario').val())*cantidad;
                    break;
                case '3':
                        opInafect += parseFloat(trcosto.find('.costo_unitario').val())*cantidad;
                    break;
            }

            switch (tipo) {
                case 'pvett':
                    pretotal = pretotal + sum;
                    break;
            }
        });

        if ($('tr.totales').length) {
            $('.tot').remove();
            $('tr.totales').remove();
        }

        pretotal = (pretotal > 0) ? (pretotal.toFixed(2)) : ("0.00");
        opGrav = (opGrav > 0) ? (opGrav.toFixed(2)) : ("0.00");
        opInafect = (opInafect > 0) ? (opInafect.toFixed(2)) : ("0.00");
        opExo = (opExo > 0) ? (opExo.toFixed(2)) : ("0.00");
        igv = (igv > 0) ? (igv.toFixed(2)) : ("0.00");

        var tr = "<tr class='tot'>"+
                    "<td colspan='6' class='text-right'><b>OP Exoneradas</b></td>"+
                    "<td align='right'>"+
                        "<i class='pull-left sim'></i>"+
                        "<span><b>"+opExo+"</b></span>"+
                        "<input name='op_exoneradas_moneda' type='hidden' value='" + opExo + "'>"+
                    "</td>"+
                    "<td colspan='2'></td>"+
                "</tr>"+
                "<tr class='tot'>"+
                    "<td colspan='6' class='text-right'><b>OP Inacfectas</b></td>"+
                    "<td align='right'>"+
                        "<i class='pull-left sim'></i>"+
                        "<span><b>"+opInafect+"</b></span>"+
                        "<input name='op_inafectas_moneda' type='hidden' value='" + opInafect + "'>"+
                    "</td>"+
                    "<td colspan='2'></td>"+
                "</tr>"+
                "<tr class='tot'>"+
                    "<td colspan='6' class='text-right'><b>OP Gravadas</b></td>"+
                    "<td align='right'>"+
                        "<i class='pull-left sim'></i>"+
                        "<span><b>"+opGrav+"</b></span>"+
                        "<input name='op_gravadas_moneda' type='hidden' value='" + opGrav + "'>"+
                    "</td>"+
                    "<td colspan='2'></td>"+
                "</tr>";

        tr += "<tr class='tot'>" + 
                    "<td colspan='6' class='text-right'><b>IGV</b></td>"+
                    "<td align='right'>" + 
                        "<i class='pull-left sim'></i>" + 
                        "<span><b id='imptotalt'>" + igv + "</b></span>" + 
                        "<input type='hidden' value='" + igv + "' name='impuesto_total_moneda'>" + 
                    "</td>" + 
                    "<td colspan='2'></td>" + 
                "</tr>";

        tr += "<tr class='totales'>" + 
                    "<td colspan='6' class='text-right'><b>Importe Total</b></td>" + 
                    "<td align='right'>" + 
                        "<i class='pull-left sim'></i>" + 
                        "<span><b id='vvtotal'>" + pretotal + "</b></span>" + 
                        "<input type='hidden' value='" + pretotal + "' name='precio_venta_total_moneda'>" + 
                    "</td>" + 
                    
                "</tr>";

        $('#lista_general tbody').append(tr);
        //Fin Tabla #lista_general

        //Tabla #lista_costos//
        var ct = igvt = ctb = igvtb = 0;

        $('#lista_costos tbody tr td.sumar').each(function(index, value) {
            tipo = $(this).find('span.pull-right').attr('class').replace("pull-right ",'');
            sum = parseFloat($(this).find('span.pull-right').html());
            switch(tipo)
            {
                case 'vvt':
                    ct += sum;
                break;
                case 'imp_t':
                    igvt += sum;
                break;
                case 'vvtb':
                    ctb += sum;
                break;
                case 'imp_tb':
                    igvtb += sum;
                break;
            }
        });
        if($('.vvtb').length)
        {   
            if($('.gth').length){}
            else{
                var th = "<th class='gth'>Valor Venta<br>Unitario Base</th><th class='gth'>IGV<br>Unitario Base</th><th class='gth'>Valor Venta<br>Total Base</th><th class='gth'>IGV<br>Total Base</th>";
                $('#lista_costos thead tr').append(th);
            }
            
            tr = "<tr class='totales'>" + 
                    "<td colspan='6' class='text-right'><b>TOTAL</b></td>" + 
                    "<td align='right'>" + 
                        "<i class='pull-left simb'></i>" + 
                        "<span><b>" + ct + "</b></span>" + 
                    "</td>" + 
                    "<td align='right'>" + 
                        "<i class='pull-left simb'></i>" + 
                        "<span><b>" + igvt + "</b></span>" + 
                    "</td>" + 
                    "<td colspan='2'></td>"+
                    "<td align='right'>" + 
                        "<i class='pull-left simb'></i>" + 
                        "<span><b>" + ctb + "</b></span>" + 
                    "</td>" + 
                    "<td align='right'>" + 
                        "<i class='pull-left simb'></i>" + 
                        "<span><b>" + igvtb + "</b></span>" + 
                    "</td>" + 
                "</tr>";
        }
        else
        {
            tr = "<tr class='totales'>" + 
                    "<td colspan='6' class='text-right'><b>TOTAL</b></td>" + 
                    "<td align='right'>" + 
                        "<i class='pull-left sim'></i>" + 
                        "<span><b>" + ct + "</b></span>" + 
                    "</td>" + 
                    "<td align='right'>" + 
                        "<i class='pull-left sim'></i>" + 
                        "<span><b>" + igvt + "</b></span>" + 
                    "</td>" + 
                "</tr>";
        }
        
        $('#lista_costos tbody').append(tr);
        //Fin Tabla #lista_costos

        //Tabla #lista_margen
        var ct = margen = 0;

        $('#lista_margen tbody tr.ordenes td.sumar').each(function(index, value) {
            console.log(index);
            console.log(value);
            tipo = $(this).attr('class').replace(" sumar",'');
            console.log(tipo);
            switch(tipo)
            {
                case 'costo_t':
                    sum = parseFloat($(this).find('input.ct').val());
                    ct += sum;
                break;
                case 'margen_t':
                    sum = parseFloat($(this).find('input.mt').val());
                    console.log(sum);
                    margen += sum;
                break;
            }
        });

        tr = "<tr class='totales'>" + 
                "<td colspan='6' class='text-right'><b>TOTAL</b></td>" + 
                "<td align='right'>" + 
                    "<i class='pull-left simb'></i>" + 
                    "<span><b>" + ct.toFixed(2) + "</b></span>" + 
                    "<input type='hidden' name='costo_total' value='"+ct+"'>"+
                "</td>" +
                "<td></td>"+ 
                "<td align='right'>" + 
                    "<i class='pull-left simb'></i>" + 
                    "<span><b>" + margen.toFixed(2) + "</b></span>" +
                    "<input type='hidden' name='margen_total' value='"+margen+"'>"+
                "</td>" + 
            "</tr>";

        $('#lista_margen tbody').append(tr);
        //Fin Tabla #lista_margen
        $('.sim').html(simbolo);
        $('.simb').html(simbolo_base);
        
        valid_exist_pedido();
    }
    else
    {
        limpiarbandeja();
    }
}


function limpiarbandeja()
{
    $('#lista_general #bodyindex').html('<tr><td colspan="8"><h2 class="text-center text-success">No agregó artículos</h2></td></tr>');
    $('#lista_costos #bodyindex').html('');
    $('.gth').remove();
    $('#lista_logistica #bodyindex').html('');
    $('#lista_margen #bodyindex').html('');
}

function valid_exist_pedido() {
    var i = 0;
    var cantidad = 0;
    var prec = 0;
    var va = 0;
    var padre = "";
    var papi = "";
    var no = 0;
    $('.bfh-number').each(function(index, value) {
        padre = $(this);
        cantidad = padre.val();
        if (cantidad > 0) {
            $(this).removeClass('erroinput');
        } else {
            $(this).addClass('erroinput');
            i++;
        }
        papi = padre.parents('tr');
        prec = parseFloat(papi.find('td.pventau input.pu').val());
        if (prec > 0) {
            papi.find('td.pventau input.pu').removeClass('erroinput');
        } else {
            papi.find('td.pventau input.pu').addClass('erroinput');
            i++;
        }
    });
    var num = parseInt($('#lista_general tbody tr.ordenes td.orden').length);
    if (num > 0 && i == 0) {
        va = 1;
    } else {
        if (i > 0) {
            va = 2;
        }
    }
    if (va == 1) {
        $('#exist_pedido').val('si');
        $('#exist_pedido').parents('.form-group').removeClass('has-error');
    } else {
        $('#exist_pedido').val('');
        $('#exist_pedido').parents('.form-group').addClass('has-error');
    }
    return va;
}
$(document).on('click', '.limpiarform', function(e) {
    lip_busqueda('form_busc_kardex');
});
$(document).on('click', '.add_proveedor', function(e) {
    var page = 0;
    $(this).attr({
        'operacion': ''
    });
    buscarclientejud(page);
});

$(document).on('click', '#buscar_provee .limpiarfiltro', function(e) {
    var id = $(this).parents('tr').attr('id');
    $('#' + id).find('input[type=text]').val('');
    var page = 0;
    buscarclientejud(page);
});
$(document).on('click', '#paginacion_provee li.paginate_button', function(e) {
    var page = $(this).find('a').attr('tabindex');
    buscarclientejud(page);
});
$(document).on('click', '#paginacion_provee a.paginate_button', function(e) {
    var page = $(this).attr('tabindex');
    buscarclientejud(page);
});
$(document).on('click', '#buscar_provee a.buscarcliente', function(e) {
    var page = 0;
    buscarclientejud(page);
});

$(document).on('click', '.agre_cliente', function(e) {
    var padre = $(this).parents('tr');
    var tipope = padre.attr('tipope');
    if(tipope==1)
    {
        var idcliente = parseFloat(padre.find('td.orden input.id_cliente').val());
        var dniruc = parseFloat(padre.find('td.orden input.dni_ruc').val());
        var id_pers = parseFloat(padre.find('td.orden input.id_pers').val());
        var rz = padre.find('td.orden input.razons').val();
    }
    else
    {
        console.log("entro");
        var idcliente = parseFloat(padre.find('td.orden input.id_cliente').val());
        var dniruc = parseFloat(padre.find('td.orden input.dni_ruc').val());
        var id_pers = parseFloat(padre.find('td.orden input.id_pers').val());
        var rz = padre.find('td.orden input.nombre_comercial').val();
    }
    
    $('#id_persona').val(id_pers);
    $('#texto_cliente2').val(rz);
    $('#texto_dni_ruc').val(dniruc);
    $('#buscarclientes').modal('hide');
    $('#id_cliente_llegada').val(idcliente);
});

function buscarclientejud(page) {
    if(PersonJudFiltro==true)
    {
        var nombres_com = encodeURIComponent($('input.nombres_com').val());
        var razon_soc = encodeURIComponent($('input.razon_soc').val());
        var ruc_dni = encodeURIComponent($('input.ruc_dni').val());
        var direc_fiscal = encodeURIComponent($('input.direc_fiscal').val());

        var temp = "page=" + page;
        if (nombres_com.trim().length) {
            temp = temp + '&nombres_com=' + nombres_com;
        }
        if (razon_soc.trim().length) {
            temp = temp + '&razon_social=' + razon_soc;
        }
        if (ruc_dni.trim().length) {
            temp = temp + '&ruc_dni=' + ruc_dni;
        }
        if (direc_fiscal.trim().length) {
            temp = temp + '&direc_fiscal=' + direc_fiscal;
        }
        var tip = $('#tipo_persona').val();
        $.ajax({
            url: $('base').attr('href') + 'facturacion/get_clientejud',
            type: 'POST',
            data: temp + '&tipo_persona=' + tip,
            dataType: "json",
            beforeSend: function() {
                $.LoadingOverlay("show", {
                    image: "",
                    fontawesome: "fa fa-spinner fa-spin"
                });
            },
            success: function(response) {
                if (response.code == 1) {
                    $('#buscar_provee tbody').html(response.data.rta);
                    $('#paginacion_datap').html(response.data.paginacion);
                }
            },
            complete: function() {
                $.LoadingOverlay("hide");
            }
        });
    }
}

$(document).on('click', '.add_articulos', function(e) {
    var idmon = $('#id_moneda').val();
    var fech = $('#fecha_busc').val();
    if (idmon > 0 && fech.trim().length>0) {
        var page = 0;
        abrirModalVentas();
    } else {
        if(!idmon)
        {
            swal('Debe seleccionar', 'una moneda primero', 'error');
            $('#id_moneda').parents('.form-group').addClass('has-error');
        }
        else
        {
            console.log(fech);
            swal('Debe seleccionar', 'una fecha primero', 'error');
            $('#fecha_busc').parents('.form-group').addClass('has-error');
        }        
    }
});

$(document).on('click', '#paginacion_datap li.paginate_button', function(e) {
    var page = $(this).find('a').attr('tabindex');
    buscarclientejud(page);
});

$(document).on('click', '#paginacion_datap a.paginate_button', function(e) {
    var page = $(this).attr('tabindex');
    buscarclientejud(page);
});

$(document).on('click', '#pagina_data_buscar li.paginate_button', function(e) {
    var page = $(this).find('a').attr('tabindex');
    buscar_articulos(page);
});
$(document).on('click', '#pagina_data_buscar a.paginate_button', function(e) {
    var page = $(this).attr('tabindex');
    buscar_articulos(page);
});
$(document).on('click', 'table#buscar_arti a.buscar', function(e) {
    var page = 0;
    buscar_articulos(page);
});

function buscar_articulos(page) {
    var codigo_busc = $('#codigo_busc').val();
    var descripcion_busc = $('#descripcion_busc').val();
    var temp = "page=" + page;
    if (codigo_busc.trim().length) {
        temp = temp + '&codigo_busc=' + codigo_busc;
    }
    if (descripcion_busc.trim().length) {
        temp = temp + '&descripcion_busc=' + descripcion_busc;
    }
    var ids = get_joinids('lista_general','idartisucu','arti');
    $.ajax({
        url: $('base').attr('href') + 'articuloxsucursal/buscar_art_venta',
        type: 'POST',
        data: temp + '&ids=' + ids,
        dataType: "json",
        beforeSend: function() {
            $.LoadingOverlay("show", {
                image: "",
                fontawesome: "fa fa-spinner fa-spin"
            });
            $('#cargando').removeClass('collapse');
        },
        success: function(response) {
            if (response.code == 1) {
                $('#buscar_arti tbody').html(response.data.rta);
                $('#pagina_data_buscar').html(response.data.paginacion);
            }
        },
        complete: function() {
            $.LoadingOverlay("hide");
            $('#cargando').addClass('collapse');
        }
    });
}

function pu(tii) {
    var thi = tii;
    var padre = thi.parents('tr');
    var preunit = parseFloat(padre.find('td.preunit input.pu').val());
    var igv = parseFloat(padre.find('td.preunit input.igv').val());
    var canti = parseFloat(padre.find('td.cantidad input').val());
    var preciotot = "0.00";
    var vvu = "0.00";
    var imp_un = "0.00";
    var vvt = "0.00";
    var imp_to = "0.00";
    if (validnum(canti) && validnum(preunit)) {
        preciotot = preunit * canti;
        vvu = preunit / igv;
        imp_un = preunit - vvu;
        vvt = vvu * canti;
        imp_to = imp_un * canti;
        preunit = (preunit > 0) ? (preunit.toFixed(2)) : (preunit);
        preciotot = (preciotot > 0) ? (preciotot.toFixed(2)) : (preciotot);
        vvu = (vvu > 0) ? (vvu.toFixed(2)) : (vvu);
        imp_un = (imp_un > 0) ? (imp_un.toFixed(2)) : (imp_un);
        vvt = (vvt > 0) ? (vvt.toFixed(2)) : (vvt);
        imp_to = (imp_to > 0) ? (imp_to.toFixed(2)) : (imp_to);
    }
    padre.find('td.pretotal span.pvett b').html(preciotot);
    padre.find('td.vventau span.vvu b').html(vvu);
    padre.find('td.impunit span.imp_un b').html(imp_un);
    padre.find('td.vventat span.vvt b').html(vvt);
    padre.find('td.imptotal span.imp_t b').html(imp_to);
}
$(document).on('focusout', '.pu', function(e) {
    pu($(this));
});

function get_joinids(div,id,tipo) {
    var ids = new Array();
    var i = 0;
    $('#' + div + ' tbody tr.ordenes[tipo='+tipo+']').each(function(index, value) {
        ids[i] = $(this).attr(id);
        i++;
    });
    return ids.join(',');
}
//--
$(document).on('change', '#id_moneda', function() {
    var id = $(this).val();
    $('#factor_moneda').val('');
    $('.sim').html('');
    limpiarbandeja();
    if (parseInt(id) > 0) {
        var sim = $(this).find('option:selected').attr('sim');
        $('.sim').html(sim);
        var es_base = $(this).find('option:selected').attr('es_base');
        if (parseInt(es_base) == 1) {
            $('#factor_moneda').val(1);
        } else {
            var fch = $('#fecha_busc').val();
            $('#factor_moneda').val(get_fc(id, fch))
        }
    }
});

function get_fc(id_moneda, fecha) {
    var fc = null;
    var param = 'id_moneda=' + id_moneda + '&fecha=' + fecha;
    $.ajax({
        url: $('base').attr('href') + 'facturacion/tipocambioxmoneda',
        type: 'POST',
        data: param,
        dataType: "json",
        async: false,
        beforeSend: function() {
            $.LoadingOverlay("show", {
                image: "",
                fontawesome: "fa fa-spinner fa-spin"
            });
        },
        success: function(response) {
            if (response.code == 1) {
                fc = response.data;
                fc = parseFloat(fc);
            }
        },
        complete: function() {
            $.LoadingOverlay("hide");
        }
    });
    return fc;
}

function buscarclientenat(page) {
    if(PersonNatFiltro==true || PersonNatRUCFiltro==true)
    {
        var dni = $('#dninat_busc').val();
        var nombre = $('#nombrenat_busc').val();
        var apellido = $('#apenat_busc').val();
        var ruc = $('#ruc_busc').val();
        var nombre_comercial = $('#nomconat_busc').val();
        var pnatfiltro = PersonNatFiltro ? 1 : 0;
        var pnatrucfiltro = PersonNatRUCFiltro ? 1 : 0;
        var param = 'page='+page+'&personanat='+pnatfiltro+'&personanatruc='+pnatrucfiltro;
        if(dni.trim().length>0)
            param+='&busc_dni='+dni;
        if(nombre.trim().length>0)
            param+='&nombres_busc='+nombre;
        if(apellido.trim().length>0)
            param+='&apellido='+apellido;
        if(nombre_comercial.trim().length>0)
            param+='&nombre_comercial='+nombre_comercial;
        if(ruc.trim().length>0)
            param+='&ruc='+ruc;

        $.ajax({
            url: $('base').attr('href') + 'facturacion/get_clientenat',
            type: 'POST',
            data: param,
            dataType: "json",
            beforeSend: function() {
                $.LoadingOverlay("show", {
                    image: "",
                    fontawesome: "fa fa-spinner fa-spin"
                });
            },
            success: function(response) {
                if (response.code == 1) {
                    $('#buscar_proveenat tbody').html(response.data.rta);
                    $('#tab_content2_ #paginacion_datap2').html(response.data.paginacion);
                }
            },
            complete: function() {
                $.LoadingOverlay("hide");
            }
        });

    }
}

$(document).on('click', '.buscarservicio', function() {
    buscar_servicios(0);
});

$(document).on('click', '#myTab_arts [tabs=tab-l-servicios]', function() {
    buscar_servicios(0);
});

$(document).on('click', '#myTab [tabs=tab-l-asist]', function() {
    buscarclientenat(0);
});

function buscar_servicios(page) {
    var idmon = $('#id_moneda').val();
    var w_not = get_joinids('lista_general','idservsucu','serv');
    var param = 'page=' + page+'&id_moneda='+idmon+'&w_not='+w_not;
    
    $.ajax({
        url: $('base').attr('href') + 'servicios/get_all_servicioventa',
        type: 'POST',
        data: param,
        dataType: "json",
        beforeSend: function() {
            $.LoadingOverlay("show", {
                image: "",
                fontawesome: "fa fa-spinner fa-spin"
            });
        },
        success: function(response) {
            if (response.code == 1) {
                $('#tbody_servicios').html(response.data.rta);
                $('#paginacion_dataservicios').html(response.data.paginacion);
            }
        },
        complete: function() {
            $.LoadingOverlay("hide");
        }
    });
}
$(document).on('click', '.add_servicio', function() {
    var papi = $(this).parents('tr');
    var idserv = papi.attr('idservsucu');
    var exist = $('#lista_general tr.ordenes').length;
    if (idserv > 0) {
        var cant = papi.find('.cantidad').val();
        var idmon = $('#id_moneda').val();
        if (cant > 0) {
            var param = 'id=' + idserv + '&cant=' + cant + '&id_moneda=' + idmon;
            var pasa = true;
            var tiene_igv = (parseInt($('#docu_tieneigv').val())>0) ? $('#docu_tieneigv').val() : 0;
            var fecha_ = $('#fecha_busc').val();
            if(tiene_igv)
            {
                $.ajax({
                    url: $('base').attr('href') + 'ingresoxcompra/impxregimen',
                    type: 'POST',
                    async: false,
                    data: 'fecha='+fecha_,
                    dataType: "json",
                    beforeSend: function() {
                        $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
                    },
                    success: function(response) {
                        if (response.code==1) {
                            var resp = response.data;
                            if(resp=="no tiene"){
                                alerta('Error','No hay un Régimen Configurado en la fecha seleccionada!!','error');
                                pasa = false;
                            }
                            else{
                                if(resp==0){tiene_igv = 0;}
                                else{

                                    $.ajax({
                                        url: $('base').attr('href') + 'facturacion/validar_igvxserv',
                                        type: 'POST',
                                        async: false,
                                        data: 'id_serv='+idserv+'&fecha_='+fecha_,
                                        dataType: "json",
                                        beforeSend: function() {
                                            $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
                                        },
                                        success: function(response) {
                                            if (response.code==1) {
                                                var boo = response.data;
                                                pasa = boo;
                                                if(!boo)
                                                    alerta('Error','No hay IGV configurado en el articulo en la fecha seleccionada!!','error');
                                                    return 0;
                                            }
                                        },
                                        complete: function() {
                                            $.LoadingOverlay("hide");
                                        }
                                    });
                                }
                            }
                        }
                    },
                    complete: function() {
                      $.LoadingOverlay("hide");
                    }
                });
            }

            if(pasa===true)
            {
                var factor_moneda = $('#factor_moneda').val();
                $.ajax({
                    url: $('base').attr('href') + 'facturacion/add_servicio_venta',
                    type: 'POST',
                    data: param  +  "&tiene_igv="+tiene_igv+'&fecha='+fecha_+'&factor_moneda='+factor_moneda,
                    dataType: "json",
                    beforeSend: function() {
                        $.LoadingOverlay("show", {
                            image: "",
                            fontawesome: "fa fa-spinner fa-spin"
                        });
                    },
                    success: function(response) {
                        if (response.code == 1) {
                            if (exist > 0) {
                                $('table#lista_general tbody').append(response.data.ge);
                                $('table#lista_costos tbody').append(response.data.igv);
                                $('table#lista_logistica tbody').append(response.data.log)
                                $('table#lista_margen tbody').append(response.data.cos)
                            } else {
                                $('table#lista_general tbody').html(response.data.ge);
                                $('table#lista_costos tbody').html(response.data.igv);
                                $('table#lista_logistica tbody').html(response.data.log);
                                $('table#lista_margen tbody').html(response.data.cos);
                            }
                            sumarval();
                            actualizar_tables();
                            buscar_servicios(0);
                        }
                    },
                    complete: function() {
                        $.LoadingOverlay("hide");
                    }
                });
            }

        } else {
            swal('Cantidad', 'no válida.', 'error');
        }
    }
});

function abrirModalVentas() {
    $('#buscarart').modal('show');
    var tabAct = $('#myTab_arts li.active').attr('tabs');
    if(tabAct=="tab-general"){
        buscar_articulos(0);
    }else{
        buscar_servicios(0);
    }
}

function num_orden(table) {
    var i = 0;
    var num = parseInt($('#' + table + ' tbody tr.ordenes td.orden').length);
    if (num > 0) {
        $('#' + table + ' tbody tr.ordenes td.orden').each(function(index, value) {
            i++;
            $(this).html(i);
        });
    }
}

function actualizar_tables()
{
    num_orden('lista_general');
    num_orden('lista_costos');
    num_orden('lista_logistica');
}

function ConfigFiltros()
{
    var tipopextipodocu = ($('#tipopexdocu').val()).split(',');
    var tabPJ = $('li[tabs=tab-general]');
    var tabPN = $('li[tabs=tab-l-asist]');
    var busco = false;
    PersonJudFiltro = (tipopextipodocu.indexOf("1")>-1) ? true : false;
    PersonNatFiltro = (tipopextipodocu.indexOf("2")>-1) ? true : false;
    PersonNatRUCFiltro = (tipopextipodocu.indexOf("3")>-1) ? true : false;
    
    if(PersonNatRUCFiltro==false && PersonNatFiltro==false && PersonJudFiltro==false)
    {
        swal('Configurar al menos un tipo','de persona para este documento','error');
        $('.add_articulos').remove();
    }
    else
    {
        if(PersonJudFiltro==false)
        {
            tabPJ.remove();
            $('#tab_content1_').remove();
            tabPN.addClass('active');
            $('#tab_content2_').addClass('active');
        }
        else
        {
            busco = true;
            buscarclientejud(0);
        }
        
        if(PersonNatFiltro==false && PersonNatRUCFiltro==false)
        {
            $('#tab_content2_').remove();
            tabPN.remove();
        }
        else if(busco==false)
        {
            buscarclientenat(0);
        }
    }
}

$(document).on('click','.buscarprovnat',function(){
    buscarclientenat(0);
});

$(document).on('click','.limpiarfiltronat',function(){
    $('#buscar_proveenat #filtroproveenat input').val('');
    buscarclientenat(0);
});