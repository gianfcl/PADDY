$( document ).ready(function() {

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

    $('#form_save_eadroles').validate({
        rules:
        {
          ead_rol:
          {
            required:true,
            minlength: 2,
            remote: {
              url: $('base').attr('href') + 'eadroles/validar',
              type: "post",
              data: {
                ead_rol: function() { return $( "#ead_rol" ).val(); },
                id_ead_rol: function() { return $('#id_ead_rol').val(); }
              }
            }
          }       
        },
        messages: 
        {
          ead_rol:
          {
            required:"Ingresar rol",
            minlength: "Más de 2 Letras",
            remote: "Ya Existe"
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
                url: $('base').attr('href') + 'eadroles/save_ead_rol',
                type: 'POST',
                data: $('#form_save_eadroles').serialize(),
                dataType: "json",
                beforeSend: function() {
                    //showLoader();
                },
                success: function(response) {
                    if (response.code==1) {
                      var page = 0;
                      if($('#paginacion_data ul.pagination li.active a').length>0)
                      {
                        page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
                      }                   

                      $('#editeadroles').modal('hide');

                      buscar_ead_rols(page);
                    }
                    else
                    {
                      limpiarform();
                    }
                },
                complete: function() {
                  var id_ead_rol = parseInt($('#id_ead_rol').val());
                  id_ead_rol = (id_ead_rol>0) ? (id_ead_rol) : ("0");
                  var text = (id_ead_rol=="0") ? ("Guardo!.") : (" Edito!.");
                  alerta(text, 'Se '+text, 'success');
                  limpiarform();
                }
            });/**/
        }
    });
});

$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
  buscar_ead_rols(0);
});

$(document).on('click', '.add_eadroles', function (e)
{
    limpiarform();
});

$(document).on('click', '.btn_limpiar', function (e) {
  limpiarform();
  $('#editeadroles').modal('hide');
});

function limpiarform()
{
  $('#id_ead_rol').val('0');
  $('#ead_rol').val('');
  $('#estado label').removeClass('active');
  $('#estado input').prop('checked', false);
  $('#estado #estado_1').prop('checked', true);
  $('input[name=es_unico]').prop('checked', false);
  $('#estado #estado_1').parent('label').addClass('active');

  if($('#eadroles').parents('.form-group').attr('class')=="form-group has-error")
  {
    $('#eadroles').parents('.form-group').removeClass('has-error');
  }

  if($('#eadroles-error').length>0)
  {
    $('#eadroles-error').html('');
  }
  var validatore = $( "#form_save_eadroles" ).validate();
  validatore.resetForm();
}

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  buscar_ead_rols(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_ead_rols(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_ead_rols(page);
});

function buscar_ead_rols(page)
{
  var rol_busc = $('#rol_busc').val();
  var temp = "page="+page;
  if(rol_busc.trim().length)
  {
    temp=temp+'&rol_busc='+rol_busc;
  }
  $.ajax({
      url: $('base').attr('href') + 'eadroles/buscar_ead_rols',
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
  limpiarform();
  var id_ead_rol = $(this).parents('tr').attr('id_ead_rol');
  $.ajax({
      url: $('base').attr('href') + 'eadroles/edit',
      type: 'POST',
      data: 'id_ead_rol='+id_ead_rol,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
          if (response.code==1) {
            $('#id_ead_rol').val(response.data.id_ead_rol);
            $('#ead_rol').val(response.data.ead_rol);

            $('#estado label').removeClass('active');
            $('#estado input').prop('checked', false);
            if(parseInt(response.data.es_unico)>0){
              $('input[name=es_unico]').prop('checked',true);
            }

            var num = response.data.estado;
            $('#estado #estado_'+num).prop('checked', true);
            $('#estado #estado_'+num).parent('label').addClass('active');

            if($('#eadroles').parents('.col-md-8').attr('class')=="col-md-8 col-sm-8 col-xs-12")
            {
              $('#eadroles').parents('.col-md-8').removeClass('has-error');
            }

            if($('#eadroles-error').length>0)
            {
              $('#eadroles-error').html('');
            }
          }
      },
      complete: function() {
          //hideLoader();
      }
  });
});

$(document).on('click', '.delete', function (e) {
  e.preventDefault();
  var id_ead_rol = $(this).parents('tr').attr('id_ead_rol');
  var nomb = "rol";
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
        url: $('base').attr('href') + 'eadroles/save_ead_rol',
        type: 'POST',
        data: 'id_ead_rol='+id_ead_rol+'&estado=0',
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            if (response.code==1) {
              buscar_ead_rols(0);
            }
        },
        complete: function() {
          var text = "Elimino!";
          alerta(text, 'Este '+nomb+' se '+text+'.', 'success');
          limpiarform();
        }
      });
    }
  });   
});