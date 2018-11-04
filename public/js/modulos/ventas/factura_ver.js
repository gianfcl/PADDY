$(document).ready(function() {
    $('#fechat_busc').daterangepicker({
        singleDatePicker: true,
        format: 'DD-MM-YYYY',
        calender_style: "picker_4"
    }, function(start, end, label) {
        console.log(start.toISOString(), end.toISOString(), label);
    });
    $('#fechacre_busc').daterangepicker({
        singleDatePicker: true,
        format: 'DD-MM-YYYY',
        calender_style: "picker_4"
    }, function(start, end, label) {
        console.log(start.toISOString(), end.toISOString(), label);
    });
});
$(document).on('click', '#datatable-buttons .limpiarfiltro', function(e) {
    var id = $(this).parents('tr').attr('id');
    $('#' + id).find('input[type=text]').val('');
});
$(document).on('click', '#datatable_paginate li.paginate_button', function(e) {
    var page = $(this).find('a').attr('tabindex');
    buscar_facturas(page);
});
$(document).on('click', '#datatable_paginate a.paginate_button', function(e) {
    var page = $(this).attr('tabindex');
    buscar_facturas(page);
});
$(document).on('click', '#datatable-buttons .buscar', function(e) {
    var page = 0;
    buscar_facturas(page);
});

function buscar_facturas(page) {
    var codigo_busc = $('#codigo_busc').val();
    var serie_busc = $('#serie_busc').val();
    var numero_busc = $('#numero_busc').val();
    var fechat_busc = $('#fechat_busc').val();
    var ruc_dni = $('#ruc_dni').val();
    var nombres_com = $('#nombres_com').val();
    var usuario_busc = $('#usuario_busc').val(); /*usuario*/
    var precio_venta_total = $('#precio_venta_total').val();
    var texto_tipodocumento = $('#texto_tipodocumento').val();
    var estadocob_busc = $('#estadocob_busc').val();
    var guia_busc = $('#guia_busc').val();
    //var registro_busc = $('#registro_busc').val();
    var fechacre_busc = $('#fechacre_busc').val();
    //var estado_busc = $('#estado_busc').val();
    var temp = "page=" + page;
    if (codigo_busc.trim().length) {
        temp = temp + '&codigo_busc=' + codigo_busc;
    }
    if (numero_busc.trim().length) {
        temp = temp + '&numero_busc=' + numero_busc;
    }
    if (serie_busc.trim().length) {
        temp = temp + '&serie_busc=' + serie_busc;
    }
    if (fechat_busc.trim().length) {
        temp = temp + '&fechat_busc=' + fechat_busc;
    }
    if (ruc_dni.trim().length) {
        temp = temp + '&ruc_dni=' + ruc_dni;
    }
    if (nombres_com.trim().length) {
        temp = temp + '&nombres_com=' + nombres_com;
    }
    if (usuario_busc.trim().length) {
        temp = temp + '&usuario_busc=' + usuario_busc;
    }
    if (precio_venta_total.trim().length) {
        temp = temp + '&precio_venta_total=' + precio_venta_total;
    }
    if (texto_tipodocumento.trim().length) {
        temp = temp + '&texto_tipodocumento=' + texto_tipodocumento;
    }
    if (parseInt(estadocob_busc)) {
        temp = temp + '&estadocob_busc=' + estadocob_busc;
    }
    if (guia_busc.trim().length) {
        temp = temp + '&guia_busc=' + guia_busc;
    }
    // if (registro_busc.trim().length) {
    //     temp = temp + '&registro_busc=' + registro_busc;
    // }
    if (fechacre_busc.trim().length) {
        temp = temp + '&fechacre_busc=' + fechacre_busc;
    }
    $.ajax({
        url: $('base').attr('href') + 'facturacion/buscar_facturacion',
        type: 'POST',
        data: temp,
        dataType: "json",
        beforeSend: function() {
            showLoader();
        },
        success: function(response) {
            if (response.code == 1) {
                $('#datatable-buttons tbody#bodyindex').html(response.data.rta);
                $('#paginacion_data').html(response.data.paginacion);
                // $('#fechat_busc').daterangepicker({
                //     singleDatePicker: true,
                //     format: 'DD-MM-YYYY',
                //     calender_style: "picker_4"
                // }, function(start, end, label) {
                //     console.log(start.toISOString(), end.toISOString(), label);
                // });
            }
        },
        complete: function() {}
    });
}