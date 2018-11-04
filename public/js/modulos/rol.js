$( document ).ready(function() {

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

    $('#form_save_rol').validate({
        rules:
        {
          nombre:
          {
            required:true,
            minlength: 2,
            remote: {
              url: $('base').attr('href') + 'roles/validar',
              type: "post",
              data: {
                id_perfil: function() { return $( "#id_perfil" ).val(); },
                nombre: function() { return $('#nombre').val(); },
                id_empresa: function() { return $('#id_empresa').val(); }
              }
            }
          }       
        },
        messages: 
        {
          nombre:
          {
            required:"Ingresar Rol",
            minlength: "Más de 2 Letras",
            remote:"Ya existe"
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
                url: $('base').attr('href') + 'roles/save_rol',
                type: 'POST',
                data: $('#form_save_rol').serialize(),
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
                      var id_perfil = parseInt($('#id_perfil').val());
                      limpiarform();
                      $('#editrol').modal('hide');
                      buscar_roles(page);
                      id_perfil = (id_perfil>0) ? (id_perfil) : ("0");
                      var text = (id_perfil=="0") ? ("Guardo!") : ("Edito!");
                      alerta(text, 'Este Perfil se '+text+'.', 'success');
                    }
                    else
                    {
                      if($('#nombre').parents('.col-md-6').attr('class')=="col-md-6 col-sm-6 col-xs-12")
                      {
                        $('#nombre').parents('.col-md-6').addClass('has-error');
                      }
                      
                      if($('#nombre-error').length>0)
                      {
                        $('#nombre-error').html(response.message);
                      }
                      else
                      {
                        $('#nombre').parents('.col-md-6').append("<span id='nombre-error' class='help-block'>"+response.message+"</span>");
                      }
                    }
                },
                complete: function() {
                    //hideLoader();
                }
            });/**/
        }
    });
});

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {
  var page = $(this).find('a').attr('tabindex');
  buscar_roles(page);
});

$(document).on('hidden.bs.modal', '#editrol', function (e)
{
  limpiarform();
});

$(document).on('click', '.add_rol', function (e)
{
    limpiarform();
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_roles(page);
});

$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
});

$(document).on('click', '.btn_limpiar', function (e) {
  limpiarform();
});

function limpiarform()
{
  $('#id_perfil').val('0');
  $('#nombre').val('');
  $('#estado label').removeClass('active');
  $('#estado input').prop('checked', false);
  
  $('#estado #estado_1').prop('checked', true);
  $('#estado #estado_1').parent('label').addClass('active');

  var form_save_rol = $( "#form_save_rol" ).validate();
  form_save_rol.resetForm();

  if($('#nombre').parents('.form-group').attr('class')=="form-group has-error")
  {
    $('#nombre').parents('.form-group').removeClass('has-error');
  }
}

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_roles(page);
});

function buscar_roles(page)
{
  var rol_busc = $('#rol_busc').val();
  var temp = "page="+page;
  if(rol_busc.trim().length)
  {
    temp=temp+'&rol_busc='+rol_busc;
  }
  $.ajax({
      url: $('base').attr('href') + 'roles/buscar_roles',
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
  var idperfil = $(this).parents('tr').attr('idperfil');
  $.ajax({
      url: $('base').attr('href') + 'roles/edit_rol',
      type: 'POST',
      data: 'id_perfil='+idperfil,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
          if (response.code==1) {
            $('#id_perfil').val(response.data.id_perfil);
            $('#nombre').val(response.data.nombre);

            $('#estado label').removeClass('active');
            $('#estado input').prop('checked', false);

            var num = response.data.estado;
            $('#estado #estado_'+num).prop('checked', true);
            $('#estado #estado_'+num).parent('label').addClass('active');

            if($('#nombre').parents('.col-md-8').attr('class')=="col-md-8 col-sm-8 col-xs-12")
            {
              $('#nombre').parents('.col-md-8').removeClass('has-error');
            }

            if($('#nombre-error').length>0)
            {
              $('#nombre-error').html('');
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
  var idperfil = $(this).parents('tr').attr('idperfil');
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var rol_busc = $('#rol_busc').val();
  var temp = "page="+page;
  if(rol_busc.trim().length)
  {
    temp=temp+'&rol_busc='+rol_busc;
  }
  var nomb = "Campo!";

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
        url: $('base').attr('href') + 'roles/save_rol',
        type: 'POST',
        data: 'id_perfil='+idperfil+'&estado=0',
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            if (response.code==1) {
              buscar_roles(temp);
            }
        },
        complete: function() {          
          var text = "Elimino!";
          alerta(text, 'Este Perfil se '+text+'.', 'success');
        }
      });
    }
  });   
});

$('.divmenu').matchHeight({
  byRow: true,
  property: 'height',
  /*target: null,*/
  remove: false
});

$(document).on('change', '.hijomenu', function (e) {  
  var id = $(this).parents('.col-md-4').attr('id');

  var padre = $('#'+id).attr('idpadre');
  var cant = $('#'+id).attr('cant'); 
  var estado = ($(this).is(':checked')) ? ("1") : ("0"); console.log(estado);
  var hijo = $(this).attr('idmenu');
  var id_perfil = $('#id_perfil').val();

  var ini = 0;
  $( ".submenu_"+padre ).each(function( index ) {
    ini = ($(this).is(':checked')) ? (ini+1): (ini);
  });
  console.log('exite-cant->'+cant+'total-check->'+ini);
  var valor = (ini==cant) ? (true) : (false);
  $('#padremenu_'+padre).prop('checked', valor);
  var idperfil = $('#id_perfil').val();

  var temp = 'id_perfil='+id_perfil+'&id_menu='+hijo+'&estado='+estado;

  $.ajax({
    url: $('base').attr('href') + 'roles/save_rol_perfil',
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

$(document).on('change', '.padremenu', function (e) {
  var id = $(this).parents('.col-md-4').attr('id');

  var padre = $('#'+id).attr('idpadre');
  var cant = $('#'+id).attr('cant');
  var id_perfil = $('#id_perfil').val();
  var estado = ($(this).is(':checked')) ? ("1") : ("0");

  var ini = 0;
  var valor = ($(this).is(':checked')) ? (true): (false);
  $( ".submenu_"+padre ).each(function( index ) {
    $(this).prop('checked', valor);
  });
  var temp = 'id_perfil='+id_perfil+'&id_padre='+padre+'&estado='+estado;

  $.ajax({
    url: $('base').attr('href') + 'roles/save_rol_perfil_padre',
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

$(document).on('click', '.ver_rol', function (e) {
  var idperfil = $(this).parents('tr').attr('idperfil');
  if(idperfil>0)
  {
    $.ajax({
      url: $('base').attr('href') + 'roles/ver_rol',
      type: 'POST',
      data: 'id_perfil='+idperfil,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
          if (response.code==1) {
            $('#verroles .modal-body').append(response.data);
            $('.divmenu').matchHeight({
              byRow: true,
              property: 'height',
              /*target: null,*/
              remove: false
            });
          }
      },
      complete: function() {
          //hideLoader();
      }
    });
  }
    
});