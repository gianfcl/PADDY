$( document ).ready(function() {

    jQuery.validator.setDefaults({
        debug: true,
        success: "valid",
        ignore: ""
    });

    $('#form_save_estadop').validate({
        rules:
            {
                estatus:
                    {
                        required: true
                    }
            },
        messages:
            {
                estatus:
                    {
                        required : ""
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
        errorPlacement: function(error, element)
        {
            if(element.parent('.col-md-6').length)
            {
                error.insertAfter(element.parent());
            }
        },
        submitHandler: function() {
            $.ajax({
                url: $('base').attr('href') + 'listadopendientes/rewrite_eadpuntos_segui',
                type: 'POST',
                data: $('#form_save_estadop').serialize(),
                dataType: "json",
                beforeSend: function() {
                    //showLoader();
                },
                success: function(response) {
                    if (response.code==1) {

                    }
                },
                complete: function() {
                    var text = "Editó!";
                    swal({
                        title : text,
                        text: 'Este pendiente se '+text+'.',
                        type: 'success',
                        confirmButtonText: 'Listo!',
                    }).then(function () {
                        $('#edit_p').modal('hide');
                        $('#estado').html('');
                        cargar_k();
                    });
                }
            });/**/
        }
    });
});


$(document).on('click', '.edit', function (e) {
    var id_pendiente = $(this).parents('tr').attr('id_pto_s');
    $.ajax({
        url: $('base').attr('href') + 'listadopendientes/edit',
        type: 'POST',
        data: 'id_eadacta_puntoseguimiento='+id_pendiente,
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            if (response.code>=1) {
                var r = response.data;
                $('#id_eadacta_puntoseguimiento').val(id_pendiente);
                $('#estado').html(r.c2);
            }
        },
        complete: function() {
            //hideLoader();
        }
    });
});

function cargar_k()
{
    $.ajax({
        url: $('base').attr('href') + 'tablerok/cargar_k',
        type: 'POST',
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            if (response.code>=1) {
                $('#content').html(response.data);
            }
        },
        complete: function() {
        }
    });
}

$(document).on('change','.selectxmiembro',function(){
    var id_miembro = $(this).val();
    var id_eadequipo = $(this).attr('id_team');
    $.ajax({
        url: $('base').attr('href') + 'tablerok/obtener_kanbanxequipo_miembro',
        data: 'id_eadequipo_config='+id_miembro+'&id_eadequipo='+id_eadequipo,
        type: 'POST',
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            if (response.code>=1) {
                $('#tbody_'+id_eadequipo).html(response.data);
            }
        },
        complete: function() {
        }
    });
});

$(document).on('click','.limpiarselect',function(){

    var t = $(this);
    t.parents('.form-group').find('select').val('');
    var id_eadequipo = $(this).parents('.form-group').find('select').attr('id_team');

    $.ajax({
        url: $('base').attr('href') + 'tablerok/obtener_kanbanxequipo_miembro',
        data: 'id_eadequipo='+id_eadequipo,
        type: 'POST',
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            if (response.code>=1) {
                $('#tbody_'+id_eadequipo).html(response.data);
            }
        },
        complete: function() {
        }
    });
});
$('#buscarequip').on('show.bs.modal', function (e) {
    $('#filtro').modal('hide');
});

$('#buscarequip').on('hidden.bs.modal', function (e) {
    $('#filtro').modal('show');
});