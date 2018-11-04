$( document ).ready(function() {

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

    $('#form_save_formulario').validate({
        rules:
        {
          formulario:
          {
            required:true,
            minlength: 2
          },
          titulo: {required:true},
          usuario: {required:true},
          fecha: {required:true},
          exis_cliente: {required:true}
        },
        messages: 
        {
          formulario:
          {
            required:"Ingresar Nombre",
            minlength: "Más de 2 Letras"
          },
          titulo:{ required:"Ingresar Título" },
          usuario:{ required:"Ingrsar Etiqueta" },
          fecha:{ required:"Ingrsar Etiqueta" },
          exis_cliente: {required:"Ingresar Clientes"}
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
            else if(element.parent('.col-md-9').length) { error.insertAfter(element.parent()); }
            else {}
        },
        submitHandler: function() {
            $.ajax({
                url: $('base').attr('href') + 'formulario/save_formulario',
                type: 'POST',
                data: $('#form_save_formulario').serialize(),
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

                      var id_formulario = parseInt($('#id_formulario').val());
                      limpiarform();
                      $('#editformulario').modal('hide');

                      buscar_formularios(page);
                      id_formulario = (id_formulario>0) ? (id_formulario) : ("0"); console.log(id_formulario);
                      var text = (id_formulario=="0") ? ("Guardo!") : ("Edito!");
                      alerta(text, 'Esta Marca se '+text+'.', 'success');
                    }
                    else
                    {
                      if($('#formulario').parents('.col-md-6').attr('class')=="col-md-6 col-sm-6 col-xs-12")
                      {
                        $('#formulario').parents('.col-md-6').addClass('has-error');
                      }
                      
                      if($('#formulario-error').length>0)
                      {
                        $('#formulario-error').html(response.message);
                      }
                      else
                      {
                        $('#formulario').parents('.col-md-6').append("<span id='formulario-error' class='help-block'>"+response.message+"</span>");
                      }
                    }
                },
                complete: function() {
                    //hideLoader();
                }
            });/**/
        }
    });

    $('#form_save_clientej').validate({
        rules: 
        {
          id_cliente: { required:true },
          id_sucursal_cliente: {required:true}
        },
        messages: 
        {
          id_cliente:{ required:"Seleccionar" },
          id_sucursal_cliente:{ required:"Seleccionar" }
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
            else if(element.parent('.col-md-9').length) { error.insertAfter(element.parent()); }
            else {}
        },
        submitHandler: function() {
          cargar_cliente_sucu($('#form_save_clientej').serialize());
          $('#editcliente').modal('hide');
          limpform('form_save_clientej');
        }
    });

    $('#form_save_clienten').validate({
        rules: 
        {
          id_cliente: { required:true },
          id_sucursal_cliente: {required:true}
        },
        messages: 
        {
          id_cliente:{ required:"Seleccionar" },
          id_sucursal_cliente:{ required:"Seleccionar" }
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
            else if(element.parent('.col-md-9').length) { error.insertAfter(element.parent()); }
            else {}
        },
        submitHandler: function() {
          cargar_cliente_sucu($('#form_save_clienten').serialize());
          $('#editcliente').modal('hide');
          limpform('form_save_clienten');
        }
    });

});

$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
  buscar_formularios(0);
});

$(document).on('hidden.bs.modal', '#editformulario', function (e)
{
  limpiarform();
});

$(document).on('click', '.add_formulario', function (e)
{
    limpiarform();
    cargar_cliente_sucu("id_sucursal_cliente=0");
});

$(document).on('click', '.btn_limpiar', function (e) {
  limpiarform();
  $('#editformulario').modal('hide');
});

function limpiarform()
{
  
  $('#id_formulario').val('0');  
  $('#estado label').removeClass('active');
  $('#estado input').prop('checked', false);
  
  $('#estado #estado_1').prop('checked', true);
  $('#estado #estado_1').parent('label').addClass('active');
  var id = "";
  limpform('form_save_formulario');  
}

function limpform(form)
{
  $('#'+form+' input').each(function (index, value){
    if($(this).attr('type')=="text")
    {
      if($(this).parents('.form-group').attr('class')=="form-group has-error")
      {
        $(this).parents('.form-group').removeClass('has-error');
      }
      $(this).val('');
    }

    id = $(this).attr('id');
    if($('#'+id+'-error').length>0)
    {
      $('#'+id+'-error').html('');
    }
  });
  var validatore = $( '#'+form ).validate();
  validatore.resetForm();
}
$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  buscar_formularios(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_formularios(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_formularios(page);
});

function buscar_formularios(page)
{
  var um_busc = $('#um_busc').val();
  var um_busc2 = $('#um_busc2').val();
  var temp = "page="+page;
  if(um_busc.trim().length)
  {
    temp=temp+'&um_busc='+um_busc;
  }
  if(um_busc2.trim().length)
  {
    temp=temp+'&um_busc2='+um_busc2;
  }
  $.ajax({
      url: $('base').attr('href') + 'formulario/buscar_formularios',
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
  var idformulario = $(this).parents('tr').attr('idformulario');
  $.ajax({
      url: $('base').attr('href') + 'formulario/edit',
      type: 'POST',
      data: 'id_formulario='+idformulario,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
          if (response.code==1) {
            limpiarform();
            $('#id_formulario').val(response.data.id_formulario);
            $('#formulario').val(response.data.formulario);
            $('#titulo').val(response.data.titulo);
            $('#usuario').val(response.data.usuario);
            $('#fecha').val(response.data.fecha);
            $('#estado label').removeClass('active');
            $('#estado input').prop('checked', false);
            $('#rtacliente').html(response.data.tr);
            $('#exis_cliente').val(response.data.exis_cliente);
            var num = response.data.estado;
            $('#estado #estado_'+num).prop('checked', true);
            $('#estado #estado_'+num).parent('label').addClass('active');

            if($('#formulario').parents('.col-md-8').attr('class')=="col-md-8 col-sm-8 col-xs-12")
            {
              $('#formulario').parents('.col-md-8').removeClass('has-error');
            }

            if($('#formulario-error').length>0)
            {
              $('#formulario-error').html('');
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
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var um_busc = $('#um_busc').val();
  var temp = "page="+page;
  var idformulario = $(this).parents('tr').attr('idformulario');
  var nomb = "Formulario!";

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
          url: $('base').attr('href') + 'formulario/save_formulario',
          type: 'POST',
          data: 'id_formulario='+idformulario+'&estado=0',
          dataType: "json",
          beforeSend: function() {
              //showLoader();
          },
          success: function(response) {
              if (response.code==1) {                
                if(um_busc.trim().length)
                {
                  temp=temp+'&um_busc='+um_busc;
                }
                var text = "Elimino";
                alerta(text+" OK!", 'Este '+nomb+' se '+text+'.', 'success');
                buscar_formularios(temp);
              }
          },
          complete: function() {
              //hideLoader();
          }
      });
    }
  });    
});

function cargar_cliente_sucu(temp)
{
  if((temp.trim().length)>0)
  {
    var ord = $('#tb_cliente tbody#rtacliente tr input.id_sucursal').length;
    ord = ord+1;
    temp = temp+'&tipo_persona='+$("#tipo_persona input[type='radio']:checked").val()+'&orden='+ord;

    $.ajax({
      url: $('base').attr('href') + 'formulario/cargar_cliente_sucu',
      type: 'POST',
      data: temp,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
          if (response.code==1) {
            if(response.data.add == "1")
            {
              $('#rtacliente').html(response.data.tr);
            }
            else
            {
              $('#rtacliente').append(response.data.tr);
            }                   
            
            $('#exis_cliente').val(response.data.exis_cliente);                                
          }
      },
      complete: function() {
          //hideLoader();
      }
    });/**/
  }
}

$(document).on('click', '#tipo_persona label', function (e) {
  var padre = $(this);
  var tipo_usuario = padre.find('input').val();

  if(tipo_usuario == "1")
  {    
    $('#form_save_clientej').removeClass('collapse');
    $('#form_save_clienten').addClass('collapse');
    limpform('form_save_clientej');
  }
  else
  {
    $('#form_save_clientej').addClass('collapse');
    $('#form_save_clienten').removeClass('collapse');
    limpform('form_save_clienten');
  }
});

$(document).on('hidden.bs.modal', '#editcliente', function (e)
{
  limpiarformcliente();
});

$(document).on('click', '#cont_cliente', function (e)
{
    limpiarformcliente()
});

$(document).on('click', '.btn_limpiarcliente', function (e) {
  limpiarformcliente()
  $('#editcliente').modal('hide');
});

function limpiarformcliente()
{
  
  $('#tipo_persona label').removeClass('active');
  $('#tipo_persona input').prop('checked', false);
  
  $('#tipo_persona #tipo_persona_1').prop('checked', true);
  $('#tipo_persona #tipo_persona_1').parent('label').addClass('active');

  limpform('form_save_clientej');
  limpform('form_save_clienten');
  $('#form_save_clientej').removeClass('collapse');
  $('#form_save_clienten').addClass('collapse');
}


$(function () {

  $( "#ruc" ).autocomplete({
    params: { 'exis_cliente': function() { return $('#exis_cliente').val(); }},
    //appendTo: autondni,
    type:'POST',
    serviceUrl: $('base').attr('href')+"formulario/get_ruc",
    onSelect: function (suggestion) 
    {
      $('#nombrecomercial').val(suggestion.nombre_comercial);
      $('#rsocial').val(suggestion.razon_social);
      $('#ruc').val(suggestion.ruc);
      $('#id_sucursal_clientej').html(suggestion.cbx_sucur);
      $('#id_clientej').val(suggestion.id_cliente);
      $('#exis_cliente').val(suggestion.exis_cliente);
    }
  });

  $( "#dni" ).autocomplete({
    params: { 'exis_cliente': function() { return $('#exis_cliente').val(); }},
    //appendTo: autondni,
    type:'POST',
    serviceUrl: $('base').attr('href')+"formulario/get_dni",
    onSelect: function (suggestion) 
    {
      $('#apellidos').val(suggestion.apellidos);
      $('#nombres').val(suggestion.nombres);
      $('#dni').val(suggestion.dni);
      $('#id_sucursal_clienten').html(suggestion.cbx_sucur);
      $('#id_clienten').val(suggestion.id_cliente);
      $('#exis_cliente').val(suggestion.exis_cliente);
    }
  });

});

$(document).on('click', '.delete_cliente', function (e) {
  e.preventDefault();

  if (confirm("Seguro que deseas eliminar esta Sucursal?")) 
  {
    var idsucursal = $(this).parents('tr').attr('idsucursal');
    var ultimo = $('#tb_cliente tr:last').find('.id_sucursal').val();
    var exis_cliente = $('#exis_cliente').val();
    $(this).parents('tr').remove();
    var cant = exis_cliente.trim().length;
    if(cant)
    {
      exis_cliente = delete_joinids('tb_cliente');
    }
    
    $('#exis_cliente').val(exis_cliente);

    $('#tb_cliente tbody#rtacliente tr td.orden').each(function (index, value){
      $(this).html(index+1);
    });
  }    
});

$(document).on('change', '.addclma', function (e) {
  var div = 'div_maestros';
  var ids = get_joinids(div);
  edit_form('&colum_maestros='+ids);
});

$(document).on('change', '.addclxs', function (e) {
  var div = 'div_xsucursal';
  var ids = get_joinids(div);
  edit_form('&colum_xsucursal='+ids);
});

function get_joinids(div)
{
  var ids =  new Array();
  var i = 0;
  $('#'+div+' input[type=checkbox]:checked').each(function (index, value){
    ids[i] = $(this).val();
    i++;
  });
  return ids.join(',');
}

function edit_form(param)
{
  var temp = "id_formulario="+$('#id_formulario').val()+param;
  if((temp.trim().length)>0)
  {
    $.ajax({
      url: $('base').attr('href') + 'formulario/save_formulario',
      type: 'POST',
      data: temp,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
        if (response.code==1) {
        }
      }
    });
  }    
}

$(document).on('click', '.add_camp', function (e) {
  var tipo = $(this).attr('tipo');
  var lbl = "Etiqueta Cabecera";
  if(tipo=="etiq_pie_pagina")
  {
    var lbl = "Etiqueta Pie Página";
  }
  $('#form_save_etiqueta label').html(lbl);
  $('#etiqueta').attr({'placeholder':lbl});
  $('#tipo').val(tipo);
});

function delete_joinids(div)
{
  var ids =  new Array();
  var i = 0;
  var info = '';
  $('#'+div+' tbody tr.ordenes').each(function (index, value){
    ids[i] = $(this).attr('idsucursal');
    i++;     
  });
  return ids.join(',');
}