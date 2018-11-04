$( document ).ready(function() {

  jQuery.validator.setDefaults({
    debug: true,
    success: "valid",
    ignore: ""
  });

  $('#form_save_sucursal').validate({
    rules:
    {
      id_empresa: {required:true },
      nombre_sede: {required:true, minlength: 2 },
      referencia: {required:true, minlength: 2 },
      direccion: {required:true, minlength: 2 },    
      id_departamento: {required:true },
      id_provincia: {required:true },
      id_distrito: {required:true }
    },
    messages: 
    {
      id_empresa: {required:"Empresa" },
      nombre_sede: {required:"Nombre Sede", minlength: "Más de 2 Letras" },
      referencia: {required:"Referencia", minlength: "Más de 2 Letras" },
      direccion: {required:"Dirección", minlength: "Más de 2 Letras" },
      id_departamento: {required:"Departamento" },
      id_provincia: {required:"Provincia" },
      id_distrito: {required:"Distrito" }
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
        url: $('base').attr('href') + 'sucursal/save_sucursal',
        type: 'POST',
        data: $('#form_save_sucursal').serialize(),
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

            buscar_sucursals(page);
            limp_todo('form_save_sucursal','')
          }
          else
          {
            if($('#sucursal').parents('.form-group').attr('class')=="form-group")
            {
              $('#sucursal').parents('.form-group').addClass('has-error');
            }
            
            if($('#sucursal-error').length>0)
            {
              $('#sucursal-error').html(response.message);
            }
            else
            {
              $('#sucursal').parents('.col-md-6').append("<span id='sucursal-error' class='help-block'>"+response.message+"</span>");
            }
          }
        },
        complete: function(response) {
          var id_sucursal = parseInt($('#id_sucursal').val());
          id_sucursal = (id_sucursal>0) ? (id_sucursal) : ("0");
          var text = (id_sucursal=="0") ? ("Guardo!") : ("Edito!");
          if(response.code == 0)
          {
            text = response.message;
          }
          alerta(text, 'Esta Sucursal se '+text+'.', 'success');
          limpform('form_save_sucursal');
          $('#editsucursal').modal('hide');
        }
      });
    }
  });
});

$(document).on('click', 'input.estado', function (e) {
  var thi = $(this);
  var estado = (thi.is(':checked')) ? ("1"): ("0"); console.log(estado);
  thi.val(estado);
  estado = parseInt(estado);

  var valor = (estado==1) ? (false) : (true);
  var padre = thi.parents('tr');
  padre.find('td.serie input').prop( "disabled", valor );
});

$(document).on('click', 'a.btnsave', function (e) {
  //var temp = $('#form_save_sucu_config').serialize();
  $.ajax({
    url: $('base').attr('href') + 'sucursal/save_config_sucu',
    type: 'POST',
    data: $('#form_save_sucu_config').serialize()+'&id_sucursal='+$('#id_sucursal').val(),
    dataType: "json",
    beforeSend: function() {

    },
    success: function(response) {
      if (response.code==1) {
        $('#editsucursal').modal('hide');
      }
    },
    complete: function(response) {

    }
  });
});

$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
});

$(document).on('click', '.add_sucursal', function (e)
{
  limpform('form_save_sucursal');
  $('#rtadocumentos').html('');
  $('#ocultaedit').removeClass('collapse');
  $('#configuracion-tabs').closest('li').addClass('hidden');
  $("a#usuario-tabs").click();
  $('#namesucu').html('');
});

$(document).on('click', '.btn_limpiar', function (e) {
  limpform('form_save_sucursal');
  $('#editsucursal').modal('hide');
  $('#namesucu').html('');
});

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {
  var page = $(this).find('a').attr('tabindex');
  buscar_sucursals(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_sucursals(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_sucursals(page);
});

function buscar_sucursals(page)
{
  var um_busc = $('#um_busc').val();
  var temp = "page="+page;
  if(um_busc.trim().length)
  {
    temp=temp+'&um_busc='+um_busc;
  }
  $.ajax({
    url: $('base').attr('href') + 'allsucursal/buscar_sucursales',
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

$(document).on('change', '#id_departamento', function (e)
{
  var id_departamento = $(this).val();

  $.ajax({
    url: $('base').attr('href') + 'ubigeo/combox_prov',
    type: 'POST',
    data: 'id_departamento='+id_departamento,
    dataType: "json",
    success: function(response) {
      if (response.code == "1") {
        $('#id_provincia').html(response.data);
        $('#id_distrito').html("<option value=''>DISTRITO</option>");
      }
    },
    complete: function() {
        //hideLoader();
    }
  });
});


$(document).on('change', '#id_provincia', function (e)
{
  var id_provincia = $(this).val();

  $.ajax({
    url: $('base').attr('href') + 'ubigeo/combox_dist',
    type: 'POST',
    data: 'id_provincia='+id_provincia,
    dataType: "json",
    success: function(response) {
      if (response.code == "1") {
        $('#id_distrito').html(response.data);
      }
    },
    complete: function() {
      //hideLoader();
    }
  });
});

$(document).on('click', '.edit', function (e) {
  var idsucursal = $(this).parents('tr').attr('idsucursal');
  $('#configuracion-tabs').closest('li').removeClass('hidden');
  $.ajax({
    url: $('base').attr('href') + 'sucursal/edit',
    type: 'POST',
    data: 'id_sucursal='+idsucursal,
    dataType: "json",
    beforeSend: function() {
      limpform('form_save_sucursal');
    },
    success: function(response) {
      if (response.code==1) {
        $('#id_empresa').val(response.data.id_empresa);
        $('#id_sucursal').val(response.data.id_sucursal);
        $('#nombre_sede').val(response.data.nombre_sede);
        $('#referencia').val(response.data.referencia);
        $('#direccion').val(response.data.direccion);
        $('#id_departamento').val(response.data.id_departamento);
        $('#id_provincia').html(response.data.provincia);
        $('#id_distrito').html(response.data.distrito);

        $('#estado label').removeClass('active');
        $('#estado input').prop('checked', false);

        var num = response.data.estado;
        $('#estado #estado_'+num).prop('checked', true);
        $('#estado #estado_'+num).parent('label').addClass('active');

        $('#rtadocumentos').html(response.data.htmconf);
        $('#namesucu').html(response.data.nombre_sede);
      }
    },
    complete: function() {
      //hideLoader();
    }
  });
});

$(document).on('click', '.delete', function (e) {
  e.preventDefault();
  var idsucursal = $(this).parents('tr').attr('idsucursal');
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var nomb = "Sucursal";

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
        url: $('base').attr('href') + 'sucursal/save_sucursal',
        type: 'POST',
        data: 'id_sucursal='+idsucursal+'&estado=0',
        dataType: "json",
        beforeSend: function() {
          //showLoader();
        },
        success: function(response) {
          if (response.code==1) {              
            buscar_sucursales(page);
          }
        },
        complete: function() {
          var text = "Elimino!";
          alerta(text, 'Esta '+nomb+' se '+text+'.', 'success');
          limpform('form_save_sucursal');
        }
      });
    }
  });    
});

$(document).on('focusout', '.seri', function (e) {
  var ceros = $(this).val(); console.log(ceros);
  ceros = addzeros(ceros); console.log(ceros)
  var padre = $(this).parents('tr');

  padre.find('td.serie b.cerotes').html('#'+ceros);
  padre.find('td.serie input.ceros').val(ceros);
});

function addzeros(s) {
  var str = "000";
  var cant = 3-s.length;
  return (cant==0) ? ("") : (str.substring(0, cant));
}