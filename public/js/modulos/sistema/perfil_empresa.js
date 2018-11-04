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
            data: $('#form_save_rol').serialize()+'&id_empresa='+$('#id_empresa').val(),
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
          });/**/
        }
    });
});


$(document).on('click', '.hijomenu', function (e) {
  var idperfil = parseInt($('#id_perfil').val());
  var idmenu = parseInt($(this).attr('idmenu'));
  var estado = ($(this).is(':checked')) ? ("1") : ("0");
  var temp = 'id_perfil='+idperfil+'&id_menu='+idmenu+'&estado='+estado;
  //alert(idperfil); console.log(idmenu);
  if(idperfil>0 && idmenu>0)
  {
    $.ajax({
      url: $('base').attr('href') + 'roles/save_rol_perfil_menu',
      type: 'POST',
      data: temp,
      dataType: "json",
      beforeSend: function() {
        //showLoader();
      },
      success: function(response) {
        if (response.code==1) {
          /*$('.divmenu').matchHeight({
            byRow: true,
            property: 'height',
            //target: null,
            remove: false
          });*/
        }
      },
      complete: function() {
          //hideLoader();
      }
    });
  }
    
});

/*Validar Al Salir del Formulario*/
$(document).on('click', '#myTab li.tab a, .breadcrumb li a', function (e) {
    var url = $(this).attr('url');
    window.location.href = url;       
});
/*<---->*/