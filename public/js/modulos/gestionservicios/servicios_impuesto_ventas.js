$( document ).ready(function() {
    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });
    $('#id_impuesto').change();
    /*Impuestos*/
    $('#form-add-impuesto').validate({
        rules:{ 
            id_impuesto: { 
                required:true,
                remote: {
                  url: $('base').attr('href') + 'servicios/validar_impuesto',
                  type: "post",
                  data: {
                    tipo: function() { return 2; },
                    id_art_impuesto: function() { return $( "#id_art_impuesto" ).val(); },
                    id_impuesto: function() { return $( "#id_impuesto" ).val(); },
                    id_servicios: function() { return $('#id_serv_sucursal').val(); }
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
            var temp = "tipo=2&id_servicios="+$('#id_serv_sucursal').val();
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
                        window.location.reload();
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
                          window.location.reload();
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
                if (response.code == 1) {
                    var id_imp = response.data.id_impuesto;
                    $('#id_art_impuesto').val(response.data.id_art_impuesto);
                    $('#id_impuesto').val(id_imp);
                    $('#impuesto').val(response.data.impuesto);
                    $('#abreviatura').val(response.data.abreviatura);
                    var tipo_igv = response.data.id_tipo_igv;
                    $('#id_tipo_igv').val(tipo_igv);

                    if (id_imp == 3) {
                        var con_valor = response.data.con_valor;
                        $('#id_tipo_igv').closest('.form-group').removeClass('hidden');
                        if (con_valor == 1) {
                            $('#valor').closest('.form-group').removeClass('hidden');
                            $('#valor').val(response.data.valor);
                        }

                    }
                }
            },
            complete: function() {
                //hideLoader();
            }
        });
    }
});

$(document).on('click', '.add_impuesto', function (e) {
    limp_todo_('form-add-impuesto');
});

$(document).on('change', '#id_impuesto', function () {
    $('button[type="submit"]').prop('disabled', false);
    var id = $(this).val();
    if(id>0)
    {
        $('#valor').closest('.form-group').addClass('hidden');
        if (id == 3) {
            $('#id_tipo_igv').closest('.hidden').removeClass('hidden');
            $('#id_tipo_igv').prop('disabled', false);
        }
        else {
            $('#id_tipo_igv').closest('.form-group').addClass('hidden');
            $('#id_tipo_igv').prop('disabled', true);

            $.ajax({
                url: $('base').attr('href') + 'empresa/get_imp_ahora',
                type: 'POST',
                async: false,
                data: 'id_impuesto=' + id,
                dataType: "json",
                beforeSend: function () {
                    //showLoader();
                },
                success: function (response) {
                    if (response.code == 1) {
                        $('#valor').closest('.hidden').removeClass('hidden');
                        $('#valor').val(response.data);
                    }
                    else {
                        alerta('Error', 'Falta configurar este impuesto!', 'error')
                        $('button[type="submit"]').prop('disabled', true);
                    }
                },
                complete: function () {
                    //hideLoader();
                }
            });
        }
    }
});

$(document).on('change', '#id_tipo_igv', function () {
    $('button[type="submit"]').prop('disabled', false);
    var tipo_imp = $('#id_impuesto').val();
    var tiene_valor = $('#id_tipo_igv option:selected').attr('con_valor');
    console.log(tiene_valor);

    if (tiene_valor == 1) {
        $('#valor').closest('.hidden').removeClass('hidden');

        $.ajax({
            url: $('base').attr('href') + 'empresa/get_imp_ahora',
            type: 'POST',
            data: 'id_impuesto=' + tipo_imp,
            dataType: "json",
            beforeSend: function () {
                //showLoader();
            },
            success: function (response) {
                if (response.code == 1) {
                    $('#valor').val(response.data);
                }
                else {
                    alerta('Error', 'Falta configurar este impuesto!', 'error')
                    $('button[type="submit"]').prop('disabled', true);
                }
            },
            complete: function () {
                //hideLoader();
            }
        });
    }
    else {
        $('#valor').closest('.form-group').addClass('hidden');
    }
});

function limp_todo_(form, diverror)
{
  $('#'+form+' input').each(function (index, value){
    if($(this).attr('type')=="checkbox")
    {
      if($(this).parents('.form-group').attr('class')=="form-group has-error")
      {
        $(this).parents('.form-group').removeClass('has-error');
      }
      id = $(this).attr('id');
      if($('#'+id+'-error').length>0)
      {
        $('#'+id+'-error').html('');
      }
      $(this).prop('checked', false);
    }
    
    if($(this).attr('type')=="text")
    { 
      if($(this).parents('.form-group').attr('class')=="form-group has-error")
      {
        $(this).parents('.form-group').removeClass('has-error');
      }
      $(this).val('');

      id = $(this).attr('id');
      if($('#'+id+'-error').length>0)
      {
        $('#'+id+'-error').html('');
      }
    }    

    if($(this).attr('type')=="hidden"){
      $(this).val('');
    }    
  });

  $('#'+form+' select').each(function (index, value){
    if($(this).parents('.form-group').attr('class')=="form-group has-error")
    {
      $(this).parents('.form-group').removeClass('has-error');
    }

    id = $(this).attr('id');
    if($('#'+id+'-error').length>0)
    {
      $('#'+id+'-error').html('');
    }
  });

  if($('#'+diverror).length>0)
  {
    $('#'+diverror).html('');
  }

  $('#'+form+' textarea').each(function (index, value){
    $(this).val('');
  });

  var valimp = $( "form#"+form ).validate();
  valimp.resetForm();
}
/*<---->*/