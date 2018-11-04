$( document ).ready(function() {

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

    $('#form_add_integrantes').validate({
        rules:
        {
          integrantes_autocomplete:
          {
            required:true/*,
            remote: {
              url: $('base').attr('href') + 'eadequipo/validar_personaxequipo',
              type: "post",
              data: {
                id_member_group_owner: function() { return $( "#id_member_group_owner" ).val(); },
                member_type: function(){ return parseInt($('input[name="member_type"]:checked').val());},
                id_eadequipo: function() { return $("#id_eadequipo_modal").val(); }
              }
            }*/
          },
          id_eadequipo_roles:
          {
            required:true,
            remote: {
              url: $('base').attr('href') + 'eadequipo/validar_miembroxequipo',
              type: "post",
              data: {
                id_eadequipo_modal: function() { return $( "#id_eadequipo_modal" ).val(); },
                id_eadequipo_roles: function() { return $('#id_eadequipo_roles').val(); },
                id_eadequipo_config: function() { return $( "#id_eadequipo_config" ).val(); },
              }
            }
          }
        },
        messages: 
        {
          integrantes_autocomplete:
          {
            required:"Ingresar Nombre"/*,
            remote: "Este miembro ya existe"*/
          },
          id_eadequipo_roles:
          {
            required:"Seleccione Rol", remote: "Este rol ya existe"
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
          error.insertAfter(element.parent()); 
        },
        submitHandler: function() {
            $.ajax({
                url: $('base').attr('href') + 'eadequipo/save_miembro',
                type: 'POST',
                data: $('#form_add_integrantes').serialize(),
                dataType: "json",
                beforeSend: function() {
                    $('.btn-submit').button('loading');
                },
                success: function(response) {
                  if (response.code==1) {
                    var page = 0;
                    if($('#paginacion_data ul.pagination li.active a').length>0)
                    {
                      page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
                    }                   
                    $('#add_miembros').modal('hide');
                    $('.btn-submit').button('reset');
                  }
                },
                complete: function() {
                  var id_eadequipo_config = parseInt($('#id_eadequipo_config').val());
                  id_eadequipo_config = (id_eadequipo_config>0) ? (id_eadequipo_config) : ("0");
                  var text = (id_eadequipo_config=="0") ? ("Agregó!") : ("Edito!");
                  swal({
                    title : text,
                    text: 'Este miembro se '+text+'.',
                    type: 'success',
                    confirmButtonText: 'Listo!',
                  }).then(function () {
                    location.reload();
                  });
                }
            });
        }
    });
});

function limpiarform()
{
  $('div#tipo_miembro input').each(function(index,value){
    $(this).prop('disabled',false);
    $(this).parent('label').removeClass('disabled');
    $(this).parent('label').removeClass('active');
  });
  $('#id_eadequipo_modal').val('');
  $('#id_eadequipo_config').val('');
  $('#user_type_1').prop('checked',true);
  $('#user_type_1').parent('label').addClass('active');
  $('#integrantes_autocomplete').val('');
  $('#id_ead_rol').html('');
  $('#id_member_group_owner').val('');
  $('#integrantes_autocomplete').prop('disabled',false);
  
  $('div#miembrosxequipo_div input').each(function(index,value){
    $(this).prop('checked', false);
    $(this).parent('label').removeClass('active');
  });

  $('#miembrosxequipo_estado_1').prop('checked',true);
  $('#miembrosxequipo_estado_1').parent().addClass('active');

  ///
  $('#reemplazo_autocomplete').val('');
  $('#id_persona_r').val('');
  $('#id_member_group_owner_r').val('');
  $('#tipo_reemplazo input[type="radio"]').prop('checked',false);
  $('#tipo_reemplazo label').removeClass('active');

  $('#tipo_reemplazo #user2_type_1').prop('checked',true)
  $('#tipo_reemplazo #user2_type_1').parent().addClass('active');
  $('#div_reemplazo').addClass('hidden');
  $('#id_eadequipo_config_reemplazo').val('');
}

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  buscar_eadequipos(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_eadequipos(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_eadequipos(page);
});

$(document).on('click', '.edit', function (e) {
  limpiarform();
  var ideadequipo = $('#id_eadequipo').val();
  var id_eadequipo_config = $(this).parents('tr').attr('id_eadequipo_config');
  $('#id_eadequipo_modal').val(ideadequipo);

  var param = 'id_eadequipo='+ideadequipo+'&id_eadequipo_config='+id_eadequipo_config;
  $.ajax({
      url: $('base').attr('href') + 'eadequipo/edit_member',
      type: 'POST',
      data: param,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
          if (response.code==1) {
            $('#id_eadequipo').val(response.data.id_eadequipo);
            $('#id_persona').val(response.data.rta.id_persona);
            $('#id_eadequipo_roles').html(response.data.rta2);
            var id_eadequipo_config = (response.data.rta) ? response.data.rta.id_eadequipo_config : null;
            if(id_eadequipo_config){
              
              $('div#tipo_miembro input').each(function(index,value){
                $(this).prop('checked', false);
                $(this).prop('disabled',true);
                $(this).parent('label').addClass('disabled');
                $(this).parent('label').removeClass('active');
              });

              $('#integrantes_autocomplete').prop('disabled',true);

              $('#integrantes_autocomplete').val(response.data.rta.nombre);
              $('#id_eadequipo_config').val(response.data.rta.id_eadequipo_config);
              var num = response.data.rta.tipo_miembro;
              $('#user_type_'+num).prop('checked', true);
              $('#user_type_'+num).parent('label').addClass('active');

              $('#id_member_group_owner').val(response.data.rta.owner_group_id);

              $('div#miembrosxequipo_div input').prop('checked', false);
              $('div#miembrosxequipo_div input').parent('label').removeClass('active');

              var estado = parseInt(response.data.rta.estado);
              estado = (estado>0) ? estado : 0;
              $('#miembrosxequipo_estado_'+estado).prop('checked',true);
              $('#miembrosxequipo_estado_'+estado).parent('label').addClass('active');
              $('#div_reemplazo').removeClass('hidden');
              var id_reemplazo = response.data.rta3.id_eadequipo_config_reemplazo;
              if(id_reemplazo)
              {
                $('#id_eadequipo_config_reemplazo').val(id_reemplazo);
                var num2 = response.data.rta3.tipo_reemplazo;
                $('#tipo_reemplazo input[type="radio"]').prop('checked',false);
                $('#tipo_reemplazo input[type="radio"]').parent().removeClass('active');

                $('#user2_type_'+num2).prop('checked', true);
                $('#user2_type_'+num2).parent('label').addClass('active');
                $('#reemplazo_autocomplete').val(response.data.rta3.nombre);
                $('#id_persona_r').val(response.data.rta3.id_persona);
                $('#id_member_group_owner_r').val(response.data.rta3.owner_group_id_r);
              }
            }
          }
      },
      complete: function() {
          //hideLoader();
      }
  });
});

$(document).on('click', '.del_member', function (e) {
  e.preventDefault();
  var id_eadequipo_config = $(this).parents('tr').attr('id_eadequipo_config');
     
  var nomb = "miembro";
  var param = 'id_eadequipo_config='+id_eadequipo_config;

  swal({
    title: 'Estas Seguro?',
    text: "De Eliminar a este "+nomb,
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, estoy seguro!'
  }).then(function(isConfirm) {
    if (isConfirm) {     
      $.ajax({
        url: $('base').attr('href') + 'eadequipo/delete_member',
        type: 'POST',
        data: param,
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            if (response.code==1) {
            }
        },
        complete: function() {
          var text = "Elimino!";
          swal({
            title : text,
            text: 'Este miembro se '+text+'.',
            type: 'success',
            confirmButtonText: 'Listo!',
          }).then(function () {
            location.reload();
          });
        }
      });
    }
  });   
});

$(function () {
  $("#integrantes_autocomplete").autocomplete({

    type:'POST',
    serviceUrl: $('base').attr('href')+"eadequipo/get_persnat",
    dataType : 'JSON',
    noCache:true,
    params : { 
      id_eadequipo: function(){ return parseInt($('input#id_eadequipo_modal').val());}
    },

    onSelect: function (suggestion)
    {
      $('#id_persona').val(suggestion.id_persona);      
    }    
  });
});

$(function () {
  $("#reemplazo_autocomplete").autocomplete({

    type:'POST',
    serviceUrl: $('base').attr('href')+"eadequipo/get_persnat",
    dataType : 'JSON',
    params : { 
      id_eadequipo: function(){ return parseInt($('input#id_eadequipo_modal').val());}
    },
    onSelect: function (suggestion)
    {
      $('#id_persona_r').val(suggestion.id_persona);
    }    
  });
});

$(document).on('click', '.add_miembros', function (e) {
  limpiarform();
  id_eadequipo = $('#id_eadequipo').val();
  $('#id_eadequipo_modal').val('id_eadequipo');
  $.ajax({
      url: $('base').attr('href') + 'eadequipo/edit_member',
      type: 'POST',
      data: 'id_eadequipo='+id_eadequipo,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
          if (response.code==1) {
            $('#id_eadequipo_modal').val(response.data.id_eadequipo);
            $('#id_eadequipo_roles').html(response.data.rta2);
          }
      },
      complete: function() {
          //hideLoader();
      }
  });
});

$(document).on('click', '.btn_limpiar', function (e) {
  limpiarform();
  $('#add_miembros').modal('hide');
});