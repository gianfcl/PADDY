$(document).ready(function() {
    jQuery.validator.setDefaults({
        debug: true,
        success: "valid",
        ignore: ""
    });
    $('#form_save_motivodescuento').validate({
        rules: {
            motivodescuento: {
                required: true,
                minlength: 2,
                remote: {
                    url: $('base').attr('href') + 'motivodescuento/validar_motivodescuento',
                    type: "post",
                    data: {
                        motivodescuento: function() {
                            return $("#motivodescuento").val();
                        },
                        id_motivodescuento: function() {
                            return $('#id_motivodescuento').val();
                        }
                    }
                }
            },
            abreviatura: {
                required: true
            },
            'id_tipo[]': {
                required: true
            }
        },
        messages: {
            motivodescuento: {
                required: "Motivo de Ajuste",
                minlength: "Mas de 2 Letras",
                remote: "Ya existe"
            },
            abreviatura: {
                required: "Ingresar"
            },
            'id_tipo[]': {
                required: "Seleccionar"
            }
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
            if (element.parent('.col-md-6').length) {
                error.insertAfter(element.parent());
            }
        },
        submitHandler: function() {
            $.ajax({
                url: $('base').attr('href') + 'motivodescuento/save_motivodescuento',
                type: 'POST',
                data: $('#form_save_motivodescuento').serialize(),
                dataType: "json",
                beforeSend: function() {
                    $.LoadingOverlay("show", {
                        image: "",
                        fontawesome: "fa fa-spinner fa-spin"
                    });
                },
                success: function(response) {
                    if (response.code == 1) {
                        var page = 0;
                        if ($('#paginacion_data ul.pagination li.active a').length > 0) {
                            page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
                        }
                        buscar_motivodescuentos(page);
                    } else {
                        if ($('#motivodescuento').parents('.form-group').attr('class') == "form-group") {
                            $('#motivodescuento').parents('.form-group').addClass('has-error');
                        }
                        if ($('#motivodescuento-error').length > 0) {
                            $('#motivodescuento-error').html(response.message);
                        } else {
                            $('#motivodescuento').parents('.col-md-6').append("<span id='motivodescuento-error' class='help-block'>" + response.message + "</span>");
                        }
                    }
                },
                complete: function(response) {
                    $.LoadingOverlay("hide");
                    var id_motivodescuento = parseInt($('#id_motivodescuento').val());
                    id_motivodescuento = (id_motivodescuento > 0) ? (id_motivodescuento) : ("0");
                    var text = (id_motivodescuento == "0") ? ("Creó!") : ("Editó!");
                    if (response.code == 0) {
                        text = response.message;
                    }
                    alerta(text, 'Este Motivo de Ajuste se ' + text + '.', 'success');
                    limp_todo('form_save_motivodescuento');
                    $('#editmotivodescuento').modal('hide');
                }
            });
        }
    });
});
$(document).on('click', '#datatable-buttons .limpiarfiltro', function(e) {
    var id = $(this).parents('tr').attr('id');
    $('#' + id).find('input[type=text]').val('');
});
$(document).on('click', '.add_motivodescuento', function(e) {
    $('.btn-toolbar .btn-submit span').text('Agregar');
    limp_todo('form_save_motivodescuento');
    $('#id_tipo').val('');
    $('#id_tipo').selectpicker('refresh');
});
$(document).on('click', '.btn_limpiar', function(e) {
    limp_todo('form_save_motivodescuento');
    $('#editmotivodescuento').modal('hide');
});
$(document).on('click', '#datatable_paginate li.paginate_button', function(e) {
    var page = $(this).find('a').attr('tabindex');
    buscar_motivodescuentos(page);
});
$(document).on('click', '#datatable_paginate a.paginate_button', function(e) {
    var page = $(this).attr('tabindex');
    buscar_motivodescuentos(page);
});
$(document).on('click', '#datatable-buttons .buscar', function(e) {
    buscar_motivodescuentos(0);
});
$(document).on('click', '#datatable-buttons .limpiar', function(e) {
    var id = $(this).parents('tr').attr('id');
    $('#' + id).find('input[type=text]').val('');
    $('#' + id + ' select option').prop('selected', true);
    $('#buscartipo').selectpicker('refresh');
    $('#estado_busc').selectpicker('refresh')
    buscar_motivodescuentos(0);
});

function buscar_motivodescuento(page) {
    var temp = "page=" + page;
    var motivodescuento_busc = $('#motivodescuento_busc').val();
    var abreviatura_busc = $('#abreviatura_busc').val();
    var buscartipo = $('#buscartipo').val();
    var estado = String($('#estado_busc').val());
    if (motivodescuento_busc.trim().length) {
        temp = temp + '&motivodescuento_busc=' + motivodescuento_busc;
    }
    if (abreviatura_busc.trim().length) {
        temp = temp + '&abreviatura_busc=' + abreviatura_busc;
    }
    if (buscartipo) {
        temp = temp + '&id_tipo=' + buscartipo;
    }
    if ((estado.split(",")).length > 0) {
        temp = temp + '&estado=' + estado;
    }
    $.ajax({
        url: $('base').attr('href') + 'motivodescuento/buscar_motivodescuentos',
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
                $('#datatable-buttons tbody#bodyindex').html(response.data.rta);
                $('#paginacion_data').html(response.data.paginacion);
            }
        },
        complete: function() {
            $.LoadingOverlay("hide");
        }
    });
}
$(document).on('click', '.edit', function(e) {
    $('.btn-toolbar .btn-submit span').text('Editar');
    limp_todo('form_save_motivodescuento');
    $('#id_tipo').val('');
    $('#id_tipo').selectpicker('refresh');
    var idmotivodescuento = $(this).parents('tr').attr('idmotivodescuento');
    $.ajax({
        url: $('base').attr('href') + 'motivodescuento/edit',
        type: 'POST',
        data: 'id_motivodescuento=' + idmotivodescuento,
        dataType: "json",
        beforeSend: function() {
            $.LoadingOverlay("show", {
                image: "",
                fontawesome: "fa fa-spinner fa-spin"
            });
            limp_todo('form_save_motivodescuento');
        },
        success: function(response) {
            if (response.code == 1) {
                $('#id_motivodescuento').val(response.data.id_motivodescuento);
                $('#motivodescuento').val(response.data.motivodescuento);
                $('#abreviatura').val(response.data.abreviatura);
                var tipo = response.data.id_tipo;
                if (tipo == 3) {
                    $('#id_tipo option').prop('selected', true);
                } else {
                    $('#id_tipo').val(response.data.id_tipo);
                }
                $('#id_tipo').selectpicker('refresh');
                $('#estado label').removeClass('active');
                $('#estado input').prop('checked', false);
                var num = response.data.estado;
                $('#estado #estado_' + num).prop('checked', true);
                $('#estado #estado_' + num).parent('label').addClass('active');
            }
        },
        complete: function() {
            $.LoadingOverlay("hide");
        }
    });
});
$(document).on('click', '.delete', function(e) {
    e.preventDefault();
    var idmotivodescuento = $(this).parents('tr').attr('idmotivodescuento');
    var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
    var nomb = "Motivo de Ajuste";
    swal({
        title: 'Estas Seguro?',
        text: "De Eliminar este " + nomb,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, estoy seguro!'
    }).then(function(isConfirm) {
        if (isConfirm) {
            $.ajax({
                url: $('base').attr('href') + 'motivodescuento/save_motivodescuento',
                type: 'POST',
                data: 'id_motivodescuento=' + idmotivodescuento + '&estado=0',
                dataType: "json",
                beforeSend: function() {
                    $.LoadingOverlay("show", {
                        image: "",
                        fontawesome: "fa fa-spinner fa-spin"
                    });
                },
                success: function(response) {
                    if (response.code == 1) {
                        buscar_motivodescuentos(page);
                    }
                },
                complete: function() {
                    $.LoadingOverlay("hide");
                    var text = "Elimino!";
                    alerta(text, 'Esta ' + nomb + ' se ' + text + '.', 'success');
                    limp_todo('form_save_motivodescuento');
                }
            });
        }
    });
});