$( document ).ready(function() {

  $(".select2_multiple").select2({
    maximumSelectionLength: 4,
    placeholder: "Maximo 4",
    allowClear: true
  });

  $('#form_save_usuarioconfig').validate({
    rules:
    {
      id_usuario: { required:true }
    },
    messages: 
    {
      id_usuario: { required:"Ingresar" }
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
      var i = 0;
      var t = 0;
      var selec = 0;
      $('#form_save_usuarioconfig .cbx_sucu').each(function (index, value){
        select = parseInt($(this).val());
        i = (select>0) ? (i) : (i+1);
        t++;
      });

      if(t==i) 
      {
        alerta('Error','Seleccionar un Perfil','error');
      }
      else
      {
        save_user('config');
      }        
    }
  });

  $('#form_save_usuariosist').validate({
    rules:
    {
      usuario: { 
        required:true,
        remote: {
          url: $('base').attr('href') + 'superusuarios/validar_usuario',
          type: "post",
          data: {
            usuario: function() { return $( "#usuario" ).val(); },
            id_usuario: function() { return $('#id_usuario').val(); },
            id_empresa: function() { return $('#id_empresa').val(); }
          }
        }
      },
      password: { required:true },
      id_perfil: { required:true },
      id_sucursal: { required:true },
      id_personal: { required:true },
      dni: { required:true },
      nombres: { required:true },
      apellidos: { required:true }
    },
    messages: 
    {
      usuario: { required:"Ingresar", remote: "Ya Existe" },
      password: { required:"Ingresar" },
      id_perfil: { required:"Seleccionar" },
      id_sucursal: { required:"Seleccionar" },
      id_personal: { required:"Buscar y Seleccionar" },
      dni: { required:"Ingresar" },
      nombres: { required:"Ingresar" },
      apellidos: { required:"Ingresar" }
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
      save_user('sist');
    }
  });
  
  $('#form_save_usuarioclie').validate({
    rules:
    {
      usuario: { 
        required:true,
        remote: {
          url: $('base').attr('href') + 'usuarios/validar_usuario',
          type: "post",
          data: {
            usuario: function() { return $( "#usuario2" ).val(); },
            id_usuario: function() { return $('#id_usuario2').val(); }
          }
        }
      },
      password: { required:true },
      id_perfil: { required:true },
      id_sucursal: { required:true },
      id_personal: { required:true },
      id_cliente: { required:true },
      ruc: { required:true },
      nombrecomercial: { required:true },
      rsocial: { required:true },
      dni: { required:true },
      nombres: { required:true },
      apellidos: { required:true }
    },
    messages: 
    {
      usuario: { required:"Ingresar", remote: "Ya Existe" },
      password: { required:"Ingresar" },
      id_perfil: { required:"Seleccionar" },
      id_sucursal: { required:"Seleccionar" },
      id_personal: { required:"Buscar y Seleccionar" },
      id_cliente: { required:"Buscar y Seleccionar" },
      ruc: { required:"Ingresar"},
      nombrecomercial: { required:"Ingresar" },
      rsocial: { required:"Ingresar" },
      dni: { required:"Ingresar" },
      nombres: { required:"Ingresar" },
      apellidos: { required:"Ingresar" }
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
      save_user('clie');
    }
  });
});

function save_user(formu)
{
  var tipuser = (formu=="clie") ? (2) : (1);
  var temp = '&tipuser='+tipuser;
  if(tipuser==1)
  {
    temp = temp+"&id_sucursales="+$('.select2_multiple').select2("val");
  }

  var ur_l = (formu=="config") ? ("save_sucursales") : ("save_usuarios");

  $.ajax({
    url: $('base').attr('href') + 'superusuarios/'+ur_l,
    type: 'POST',
    data: $('#form_save_usuario'+formu).serialize()+temp,
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
        var id_usuario = 0;
        buscar_usuarios(page);
        switch(formu)
        {
          case 'clie':
            id_usuario = parseInt($('#id_usuario2').val());
            limpclie();
          break;
          case 'sist':
            id_usuario = parseInt($('#id_usuario').val());
            limpsist();
          break;
          case 'config':
            id_usuario = parseInt($('#iduser').val());
            formu = "sist";
            $('#rtasucursal').html('');
            $('#iduser').val('');
          break;
          default:
          break;
        }
        limp_todo('form_save_usuario'+formu,'');
        $('#editusuario'+formu).modal('hide');
        
        id_usuario = (id_usuario>0) ? (id_usuario) : ("0");
        var text = (id_usuario=="0") ? ("Guardo!") : ("Edito!");
        alerta(text, 'Este Usuario se '+text+'.', 'success');
      }
      else
      {
        if(formu=="clie")
        {
          limpclie();
        }
        else
        {
          limpsist();
        }
      }
    },
    complete: function() {
      //hideLoader();
    }
  });      
}

$(function () {

  $( "#ruc" ).autocomplete({
    params: { 'tipo_usuario': function() { return "2"; }},
    //appendTo: autondni,
    type:'POST',
    serviceUrl: $('base').attr('href')+"superusuarios/get_ruc",
    onSelect: function (suggestion) 
    {
      $('#id_persona_juridica').val(suggestion.id_persona_juridica);
      $('#nombrecomercial').val(suggestion.nombre_comercial);
      $('#rsocial').val(suggestion.razon_social);
      $('#ruc').val(suggestion.ruc);
      $('#id_sucursal_cliente').html(suggestion.cbx_sucur);
      $('#id_cliente').val(suggestion.id_cliente);
      $('#id_sucursal_cliente').html(suggestion.cbx_sucur);
      $('#id_contacto').html(suggestion.cbx_cont);
    }
  });

  $( "#dni" ).autocomplete({
    params: { 'tipo_usuario': function() { return "1"; }, 
              'id_empresa': function() { return $('#id_empresa').val() }
            },
    type:'POST',
    serviceUrl: $('base').attr('href')+"superusuarios/get_dni",
    onSelect: function (suggestion) 
    {
      $('#id_persona').val(suggestion.id_persona);
      $('#apellidos').val(suggestion.apellidos);
      $('#nombres').val(suggestion.nombres);
      $('#id_personal').val(suggestion.id_personal);
      $('#dni').val(suggestion.dni);
    }
  });

  $( "#apellidos" ).autocomplete({
    params: { 'tipo': function() { return "1"; }, 
              'id_empresa': function() { return $('#id_empresa').val()}
            },
    type:'POST',
    serviceUrl: $('base').attr('href')+"superusuarios/get_nomb",
    onSelect: function (suggestion) 
    {
      $('#id_persona').val(suggestion.id_persona);
      $('#apellidos').val(suggestion.apellidos);
      $('#nombres').val(suggestion.nombres);
      $('#id_personal').val(suggestion.id_personal);
      $('#dni').val(suggestion.dni);
    }
  });

  $( "#nombres" ).autocomplete({
    params: { 'tipo': function() { return "2"; }, 
              'id_empresa': function() { return $('#id_empresa').val()}
            },
    type:'POST',
    serviceUrl: $('base').attr('href')+"superusuarios/get_nomb",
    onSelect: function (suggestion) 
    {
      $('#id_persona').val(suggestion.id_persona);
      $('#apellidos').val(suggestion.apellidos);
      $('#nombres').val(suggestion.nombres);
      $('#id_personal').val(suggestion.id_personal);
      $('#dni').val(suggestion.dni);    
      //limpiarpersona();
    }
  });

  $( "#dni2" ).autocomplete({
    params: { 'tipo_usuario': function() { return "2"; }},
    //appendTo: autondni,
    type:'POST',
    serviceUrl: $('base').attr('href')+"superusuarios/get_dni",
    onSelect: function (suggestion) 
    {
      $('#id_persona2').val(suggestion.id_persona);
      $('#apellidos2').val(suggestion.apellidos);
      $('#nombres2').val(suggestion.nombres);
      $('#dni2').val(suggestion.dni);

      $('#id_sucursal_cliente').html(suggestion.cbx_sucur);
      $('#id_cliente').val(suggestion.id_cliente);
      $('#id_sucursal_cliente').html(suggestion.cbx_sucur);
      $('#id_contacto').html(suggestion.cbx_cont);
    }
  });

});


$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {
  var page = $(this).find('a').attr('tabindex');
  buscar_usuarios(page);
});

$(document).on('hidden.bs.modal', '#editusuariosist', function (e)
{
  limpsist();
  $('#ocultaedit').removeClass('collapse');
  $('#ocultaedit :select').prop( "disabled", false );
  $('#configuracion-tabs').closest('li').addClass('hidden');
});

$(document).on('hidden.bs.modal', '#editusuarioclie', function (e)
{
  limpclie();
});
/*
$('#editusuariosist').on('hidden.bs.modal', function (e) {
  limpsist();
  $('#ocultaedit').removeClass('collapse');
})

$('#editusuarioclie').on('hidden.bs.modal', function (e)
{
  limpclie();
});
*/
$(document).on('click', '.add_usuclie', function (e)
{
  limpclie();
  $('#ocultaedit select').prop( "disabled", false );
});

$(document).on('click', '.add_ususist', function (e)
{
  limpsist();
  $('#ocultaedit').removeClass('collapse');
  $('#configuracion-tabs').closest('li').addClass('hidden');
  $("a#usuario-tabs").click();
  $('#ocultaedit select').prop( "disabled", false );
});


$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_usuarios(page);
});

$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
});

$(document).on('click', '.btn_limpiar', function (e) {
  limpclie();
  limpsist();
});

function limpsist()
{
  var form_save_usuario = $( "#form_save_usuariosist" ).validate();
  form_save_usuario.resetForm();

  $('#form_save_usuariosist').find('input[type=text]').val('');
  $('#form_save_usuariosist').find('input[type=hidden]').val('');

  $('#estado label').removeClass('active');
  $('#estado input').prop('checked', false);

  $('#estado #estado_1').prop('checked', true);
  $('#estado #estado_1').parent('label').addClass('active');

  $('#tipo_persona label').removeClass('active');
  $('#tipo_persona input').prop('checked', false);

  $('#tipo_persona #tipo_persona_1').prop('checked', true);
  $('#tipo_persona #tipo_persona_1').parent('label').addClass('active');

  if($('#id_perfil').parents('.form-group').attr('class')=="form-group has-error")
  {
    $('#id_perfil').parents('.form-group').removeClass('has-error');
  }/**/

  $('#id_sucursal').html('').trigger("change");
  $('#id_empresa').val('');
}

function limpclie()
{
  var form_save_usuario = $( "#editusuarioclie" ).validate();
  form_save_usuario.resetForm();

  $('#editusuarioclie').find('input[type=text]').val('');
  $('#editusuarioclie').find('input[type=hidden]').val('');

  $('#estado2 label').removeClass('active');
  $('#estado2 input').prop('checked', false);

  $('#estado2 #estado_21').prop('checked', true);
  $('#estado2 #estado_21').parent('label').addClass('active');

  $('#tipo_persona label').removeClass('active');
  $('#tipo_persona input').prop('checked', false);

  $('#tipo_persona #tipo_persona_1').prop('checked', true);
  $('#tipo_persona #tipo_persona_1').parent('label').addClass('active');

  if($('#id_perfil2').parents('.form-group').attr('class')=="form-group has-error")
  {
    $('#id_perfil2').parents('.form-group').removeClass('has-error');
  }

  $('#ocultaedit').removeClass('collapse');

  limpiarcliente();
  $('#id_sucursal2').val($('#add_usuario').attr('idsucu'));

  cargarpn();
  limpiarpj(); 

  $('#div_pj').removeClass('collapse');
  $('#div_pn').addClass('collapse');/**/
}

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_usuarios(page);
});

function buscar_usuarios(page)
{
  //var usuario_busc = $('#usuario_busc').val();

  var temp = "page="+page;
  /*if(usuario_busc.length)
  {
    temp=temp+'&usuario_busc='+usuario_busc;
  }*/

  $.ajax({
      url: $('base').attr('href') + 'superusuarios/buscar_usuarios',
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

$(document).on('click', '.edit_sist', function (e) {
  var idusuario = $(this).parents('tr').attr('idusuario');
  $('#configuracion-tabs').closest('li').removeClass('hidden');

  $.ajax({
    url: $('base').attr('href') + 'superusuarios/edit',
    type: 'POST',
    data: 'id_usuario='+idusuario,
    dataType: "json",
    beforeSend: function() {
      //showLoader();
    },
    success: function(response) {
      if (response.code==1) {
        $('#id_usuario').val(response.data.id_usuario);
        $('#id_usu_sucursal').val(response.data.id_usu_sucursal);
        $('#usuario').val(response.data.usuario);
        $('#password').val(response.data.password);
        $('#id_empresa').val(response.data.id_empresa);
        $('#id_sucursal').html(response.data.cbx_sucu).trigger("change");
        $('#id_perfil').html(response.data.cbx_rol);
        $('#id_perfil').val(response.data.id_perfil);

        $('#id_sucursal').val($('#add_usuario').attr('idsucu'));         

        $('#estado label').removeClass('active');
        $('#estado input').prop('checked', false);

        var num = response.data.estado;
        $('#estado #estado_'+num).prop('checked', true);
        $('#estado #estado_'+num).parent('label').addClass('active');
        $('#ocultaedit').addClass('collapse');
        $('#ocultaedit select').prop( "disabled", true );

        $('#dni').val(response.data.ruc_dni);
        $('#nombres').val(response.data.nombres);
        $('#apellidos').val(response.data.apellidos);
        $('#id_persona').val(response.data.pers);

        $('#id_personal').val(response.data.id_personal);
        $('#id_sucursal').val(response.data.id_sucursal);
        $('#rtasucursal').html(response.data.tr_sucur);
        $('#iduser').val(response.data.id_usuario);
        $('#lbluser').html(response.data.usuario);
        limp_todo('form_save_usuariosist','');
      }
    },
    complete: function() {

    }
  });

});

$(document).on('click', '.edit_clie', function (e) {
  var idusuario = $(this).parents('tr').attr('idusuario');
  
  $('#ocultaedit select').removeAttr( "disabled" );
  $.ajax({
    url: $('base').attr('href') + 'superusuarios/edit',
    type: 'POST',
    data: 'id_usuario='+idusuario,
    dataType: "json",
    beforeSend: function() {
        //showLoader();
    },
    success: function(response) {
      if (response.code==1) {
        $('#id_usuario2').val(response.data.id_usuario);
        $('#id_usu_sucursal2').val(response.data.id_usu_sucursal);
        $('#usuario2').val(response.data.usuario);
        $('#password2').val(response.data.password);
        $('#id_perfil2').val(response.data.id_perfil);
        $('#id_sucursal2').val($('#add_usuario').attr('idsucu'));         

        $('#estado2 label').removeClass('active');
        $('#estado2 input').prop('checked', false);

        var num = response.data.estado;
        $('#estado2 #estado_2'+num).prop('checked', true);
        $('#estado2 #estado_2'+num).parent('label').addClass('active');
        
        limpiarpn();
        $('#div_pj').removeClass('collapse');
        $('#div_pn').addClass('collapse');
        $('#id_sucursal_cliente').html(response.data.cbx_sucur);
        $('#id_cliente').val(response.data.id_cliente);

        $('#id_contacto').html(response.data.cbx_cont);

        var numt = response.data.tipo_persona;
        $('#tipo_persona input').prop('checked', false);
        $('#tipo_persona label').removeClass('active');
        $('#tipo_persona #tipo_persona_'+numt).prop('checked', true);
        $('#tipo_persona #tipo_persona_'+numt).parent('label').addClass('active');

        $('#tipo_persona').removeClass('collapse');
        if(numt == "1")
        {
          $('#div_pj').removeClass('collapse');
          $('#div_pn').addClass('collapse');
          $('#ruc').val(response.data.ruc_dni);
          $('#nombrecomercial').val(response.data.nomb);
          $('#rsocial').val(response.data.razon_social);
          $('#id_persona_juridica').val(response.data.pers);
          cargarpn();
        } 
        else
        {
          $('#div_pj').addClass('collapse');
          $('#div_pn').removeClass('collapse');
          $('#dni2').val(response.data.ruc_dni);
          $('#nombres2').val(response.data.nomb);
          $('#apellidos2').val(response.data.razon_social);
          $('#id_persona').val(response.data.pers);
          cargarpj();
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

  var idusuario = $(this).parents('tr').attr('idusuario');
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var usuario_busc = $('#usuario_busc').val();
  var temp = "page="+page;
  if(usuario_busc.trim().length)
  {
    temp=temp+'&usuario_busc='+usuario_busc;
  }
  var nomb = "Usuario";

  swal({
    title: 'Estas Seguro?',
    text: "De Eliminar este "+nomb+'!',
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, estoy seguro!'
  }).then(function(isConfirm) {
    if (isConfirm) {      
      $.ajax({
          url: $('base').attr('href') + 'superusuarios/delete',
          type: 'POST',
          data: 'id_usuario='+idusuario+'&estado=0',
          dataType: "json",
          beforeSend: function() {
              //showLoader();
          },
          success: function(response) {
              if (response.code==1) {
                buscar_usuarios(temp);
                var text = "Eliminio!"
                alerta(text, 'Este '+nomb+' se '+text+'.', 'success');
              }
          },
          complete: function() {
              //hideLoader();
          }
      });
    }
  });    
});

$(document).on('change', '#tipo_usuario', function (e) {
  var escliente = ($(this).is(':checked')) ? ("2"): ("1");
  $('#tipo_persona').removeClass('collapse');
  $('#id_cliente').val('');
  limpiarpj();
  cargarpn();
  $('#div_pj').removeClass('collapse');
  $('#div_pn').addClass('collapse');
  $('#id_cliente').val('');
});

function limpiarcliente()
{  
  if($('#tipo_usuario').parents('.form-group').attr('class')=="form-group text-center has-error")
  {
    $('#tipo_usuario').parents('.form-group').removeClass('has-error');
    $('#id_cliente-error').html('');
  }
}

$(document).on('click', '#tipo_persona label', function (e) {
  var padre = $(this);
  var tipo_usuario = parseInt(padre.find('input').val());
  var txt = (tipo_usuario==1) ? ("pj") : ("pn");

  $('#div_pj').addClass('collapse');
  $('#div_pn').addClass('collapse');
  
  limpiarcontacto();
  if(tipo_usuario==1)
  {
    limpiarpj();
    cargarpn();
  }
  else
  {
    limpiarpn();
    cargarpj();
  }
  $('#div_'+txt).removeClass('collapse');
});


function cargarpj()
{
  $('#div_pj').find('input[type=text]').val('pj');
  $('#div_pj').find('input[type=hidden]').val('');
}

function cargarpn()
{
  $('#div_pn').find('input[type=text]').val('pn');
  $('#div_pn').find('input[type=hidden]').val('');
}

function limpiarpj()
{
  $('#div_pj').find('input[type=text]').val('');
  $('#div_pj').find('input[type=hidden]').val('');
}

function limpiarcontacto()
{
  $('#divcliente').find('select').html('<option> Seleccionar </option>');
}

function limpiarpn()
{
  $('#div_pn').find('input[type=text]').val('');
  $('#div_pn').find('input[type=hidden]').val('');
}

$(document).on('change', '#id_sucursal_cliente', function (e) {
  var id_sucursal_cliente = $(this).val();
  if(id_sucursal_cliente.trim().length>0)
  {
    $.ajax({
        url: $('base').attr('href') + 'usuarios/cbx_cont_cliente',
        type: 'POST',
        data: 'id_sucursal_cliente='+id_sucursal_cliente,
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            if (response.code==1) {
               $('#id_contacto').html(response.data);
            } else {

            }/**/
        },
        complete: function() {
            //hideLoader();
        }
    });
  }
});

$(document).on('change', '#id_empresa', function (e)
{
  var id_empresa = parseInt($(this).val());

  if(id_empresa>0)
  {
    $.ajax({
      url: $('base').attr('href') + 'sucursal/cbx_sucu',
      type: 'POST',
      data: 'id_empresa='+id_empresa,
      dataType: "json",
      success: function(response) {
        if (response.code == "1") {
          $('#id_sucursal').html(response.data.cbx_sucu).trigger("change");
          $('#id_perfil').html(response.data.cbx_perf);
          
          var acme = $('#usuario').val();
          $('#usuario').val(acme);
          $("#usuario").focus();
        }
      },
      complete: function() {
          //hideLoader();
      }
    });
  }
  else
  {
    $('#id_sucursal').html('').trigger("change");
    $('#id_perfil').html('');
  }    
});