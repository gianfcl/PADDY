$( document ).ready(function() {
  jQuery.validator.setDefaults({
    debug: true,
    success: "valid",
    ignore: ""
  });
  var dateToday = new Date(); 

  $('#form_save_pedido').validate({
    rules:
      {
        usuario: { required:true},
        fecha_entrega:{ required:true, date: true },
        exist_pedido:{ required:true }
      },
      messages: 
      {
        usuario: { required:"Ingrese USUARIO" },
        fecha_entrega:{ required: "Ingresar Fecha", date: "Formato Error" },
        exist_pedido:{ required: "" }    
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
        var tipo = ($('#estado').val() == 1) ? ("Guardar") : ("Enviar");
        var nomb = "Pedido";   
        swal({
          title: 'Estas Seguro?',
          text: "De "+tipo+" este "+nomb+'!',
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, estoy seguro!',
          allowOutsideClick: false
        }).then(function(isConfirm) {
          if (isConfirm) {      
            $.ajax({
              url: $('base').attr('href') + 'pedido/save_pedido',
              type: 'POST',
              data: $('#form_save_pedido').serialize(),
              dataType: "json",
              beforeSend: function() {
                $.LoadingOverlay("show", {image : "", fontawesome : "fa fa-spinner fa-spin"});
              },
              success: function(response) {
                if (response.code==1) {
                  var estado = ($('#estado').val());
                  var idformulario = $('#id_formulario').val();
                  var url = $('base').attr('href') +'pedido';
                  var uro = url;
                  var title = "Pedido N°"+response.data+" ";
                  var num = parseInt(response.data);
                  switch(estado) {
                    case '0':            
                      break;
                    case '1':
                      url = url+'/edit/'+idformulario+'/'+num;
                      title = title+"Guardado OK!";
                      break;
                    case '2':
                      url = url+'/edit_envio/'+num;
                      title = title+"Envido OK!";
                      break;
                    default:
                      break;
                  }

                  swal({
                    title: title,
                    text: "¿Que desea hacer?",
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Ver Pedido!',
                    cancelButtonText: 'Ir al Inicio',
                    confirmButtonClass: 'btn btn-success',
                    cancelButtonClass: 'btn btn-danger',
                    buttonsStyling: false
                  }).then(function(isConfirm) {
                    if (isConfirm === true) {
                      window.location.href = url;
                    } else if (isConfirm === false) {
                      window.location.href = uro;
                    } else {
                      // Esc, close button or outside click
                      // isConfirm is undefined
                    }
                  })                      
                }
                else
                {
                  alerta('Fecha Entrega ERROR!',response.message,'error');
                }             
              },
              complete: function() {
                $.LoadingOverlay("hide");
              }
            });
          }
        });

            
      }
  });

  $('#form_save_envio').validate({
    rules:
      {
        usuario: { required:true},
        fecha_entrega:{ date: true },
        exist_pedido:{ required: true }
      },
      messages: 
      {
        usuario: { required:"Ingrese USUARIO" },
        fecha_entrega:{ date: "Formato Error" },
        exist_pedido:{ required: "" }
      },      

      highlight: function(element) {
        $(element).closest('.form-group').addClass('has-error');   
        if($(element).attr('id')=="exist_pedido") 
        {
          alerta('Verificar!', 'Las Cantidades', 'error');
        }  
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
        var nomb = "Pedido";
        var tipo = (estado==1) ? ("Guardar"):("Enviar");

        swal({
          title: 'Deseas Editar y Enviar?',
          text: "De Enviar este "+nomb+'!',
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, estoy seguro!'
        }).then(function(isConfirm) {
          if (isConfirm) {      
            $.ajax({
              url: $('base').attr('href') + 'pedido/save_pedido_envio',
              type: 'POST',
              data: $('#form_save_envio').serialize(),
              dataType: "json",
              beforeSend: function() {
                $.LoadingOverlay("show", {image : "", fontawesome : "fa fa-spinner fa-spin"});
              },
              success: function(response) {
                if (response.code==1) {
                  var url = url = $('base').attr('href') +'pedido';
                  url = url+'/edit_envio/'+response.data;                  
                  window.location.href = url;    
                }              
              },
              complete: function() {
                $.LoadingOverlay("hide");
              }
            });
          }
        });
      }
  });

  $('#datetimepicker6').datetimepicker({
    format: 'YYYY-MM-DD',
    locale: moment.locale("es"),
    minDate: moment()
  });

  $('#fecha_entrega').daterangepicker({
    singleDatePicker: true,
    format: 'DD-MM-YYYY',
    minDate: dateToday,
    calender_style: "picker_4"
  }, function(start, end, label) {
    console.log(start.toISOString(), end.toISOString(), label);
  });

  $('#fecha_ingreso_busc').daterangepicker({
    singleDatePicker: true,
    format: 'DD-MM-YYYY',
    calender_style: "picker_4"
  }, function(start, end, label) {
    console.log(start.toISOString(), end.toISOString(), label);
  });
  
  var div = '';
  if($('#lista_articulos').length)
	  div = 'lista_articulos';
  if($('#datatable-buttons').length)
	  div = 'datatable-buttons';
  if(div.length)
  {
	  
	 $('table#'+div+' a.editcomentope').editable({
		container: 'body',
		title: 'Editar Comentario',
		display: function(value) {
		  var css = (value.trim().length) ? (' text-danger') : ('');
		  $(this).html("<i class='fa fa-commenting fa-2x"+css+"'></i>");
		} 
	});
  }

  $('a.mostrarcomentope').click(function() {
    $(this).popover({
        placement: 'left'
    }).popover('show');
  });

});

$(document).on('keypress', '#fecha_entregas', function (e) {
  return false;
});

$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
  $('#'+id).find('select').val('');
});

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  buscar_pedidos(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_pedidos(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_pedidos(page);
});

$(document).on('change', '#para_hoy', function (e) {
  var page = 0;
  buscar_pedidos(page);
});

function buscar_pedidos(page)
{
  var codigo_busc = $('#codigo_busc').val();
  var formulario_busc = $('#formulario_busc').val();
  var nombre_busc = $('#nombre_busc').val();
  var fecha_entrega_busc = $('#fecha_entrega').val();
  var fecha_ingreso_busc = $('#fecha_ingreso_busc').val();
  var estado_busc = $('#estado_busc').val();
  var temp = "page="+page;

  if($('#para_hoy').is(':checked'))
  {
    temp=temp+'&para_hoy=1';
  }

  if(codigo_busc.trim().length)
  {
    temp=temp+'&codigo_busc='+codigo_busc;
  }
  if(formulario_busc.trim().length)
  {
    temp=temp+'&formulario_busc='+formulario_busc;
  }
  if(nombre_busc.trim().length)
  {
    temp=temp+'&nombre_busc='+nombre_busc;
  }
  if(fecha_entrega_busc.trim().length)
  {
    temp=temp+'&fecha_entrega_busc='+fecha_entrega_busc;
  }
  if(fecha_ingreso_busc.trim().length)
  {
    temp=temp+'&fecha_ingreso_busc='+fecha_ingreso_busc;
  }
  if(estado_busc.trim().length)
  {
    temp=temp+'&estado_busc='+estado_busc;
  }
  $.ajax({
    url: $('base').attr('href') + 'pedido/buscar_pedidos',
    type: 'POST',
    data: temp,
    dataType: "json",
    beforeSend: function() {
      $.LoadingOverlay("show", {image : "", fontawesome : "fa fa-spinner fa-spin"});
    },
    success: function(response) {
      if (response.code==1) {
        $('#datatable-buttons tbody#bodyindex').html(response.data.rta);
        $('#paginacion_data').html(response.data.paginacion);
        $('#fecha_entrega').daterangepicker({
          singleDatePicker: true,
          format: 'DD-MM-YYYY',
          calender_style: "picker_4"
        }, function(start, end, label) {
          console.log(start.toISOString(), end.toISOString(), label);
        });

        $('#fecha_ingreso_busc').daterangepicker({
          singleDatePicker: true,
          format: 'DD-MM-YYYY',
          calender_style: "picker_4"
        }, function(start, end, label) {
          console.log(start.toISOString(), end.toISOString(), label);
        });
      }
    },
    complete: function() {
      $.LoadingOverlay("hide"); 
    }
  });
}

$(document).on('click', '.delete', function (e) {
  e.preventDefault();
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var idpedido = $(this).parents('tr').attr('idpedido');
  var idformulario = $(this).parents('tr').attr('idformulario');
  var temp = "id_pedido="+idpedido+'&estado=0';
  var nomb = "Pedido";

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
        url: $('base').attr('href') + 'pedido/save_pedido',
        type: 'POST',
        data: temp,
        dataType: "json",
        beforeSend: function() {
          //showLoader();
        },
        success: function(response) {
          if (response.code==1) {
            buscar_pedidos(page);
          }
        },
        complete: function() {          
          var text = "Elimino";
          alerta(text+" OK!", 'Este '+nomb+' se '+text+'.', 'success');
        }
      });
    }
  });    
});

$(document).on('keypress', '.bfh-number, .cant_edit_envio', function (e) {
  if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
    return false;
  }
});

$(document).on('focusout', '.bfh-number', function (e) {
  var num = 0;
  var i = 0;
  $('.bfh-number').each(function (index, value){
    num = parseInt($(this).val());
    if(num>0) { i++; }
  });

  if(i==0)
  {
    $('#exist_pedido').val('');
    $('#exist_pedido').parents('.form-group').addClass('has-error');
  }
  else
  {
    $('#exist_pedido').val('si');
    $('#exist_pedido').parents('.form-group').removeClass('has-error');
  }
});

$(document).on('click', '.btn_cancelpedido', function (e) {
  e.preventDefault();
  $('#estado').val('0');
  var nomb = "Pedido";

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
      $('#form_save_pedido').submit();
    }
  }); 
});

$(document).on('click', '.guardar', function (e) {
  e.preventDefault();
  var estado = $(this).attr('estado');
  var tipo = (estado==1)?("Guardo"):("Envio");
  $('#estado').val(estado);

  var nutot = 0;
  var no = 0;
  $('.bfh-number').each(function (index, value){
    padre = $(this);
    cantidad = parseInt(padre.val());
    nutot++;
    if(cantidad == 0 || padre.val().trim().length==0) {no++;}
  });
  console.log('total->'+nutot+' no->'+no);
  if(nutot == no)
  {
    $('#exist_pedido').val('');
    $('#exist_pedido').parents('.form-group').addClass('has-error');
    alerta('No '+tipo+'!', 'Ingresar Cantidades', 'error');
  }
  else
  {
    $('#exist_pedido').val('si');
    $('#exist_pedido').parents('.form-group').removeClass('has-error');
    var fecha_entrega = $('#fecha_entregas').val();
    if(fecha_entrega.trim().length==10)
    {
      $('#form_save_pedido').submit();
    }
    else
    {
      $('#fecha_entregas').focus();
      alerta('No '+tipo+'!', 'Verificar Fecha de Entrada', 'error');
    }
  }     
});

function save_pedido()
{
  $.ajax({
    url: $('base').attr('href') + 'pedido/save_pedido',
    type: 'POST',
    data: $('#form_save_pedido').serialize(),
    dataType: "json",
    beforeSend: function() {
      $.LoadingOverlay("show", {image : "", fontawesome : "fa fa-spinner fa-spin"});
    },
    success: function(response) {
      if (response.code==1) {
        var estado = ($('#estado').val());
        var idformulario = $('#id_formulario').val();
        var url = url = $('base').attr('href') +'pedido';
        switch(estado) {
          case '0':            
            break;
          case '1':
            url = url+'/edit/'+idformulario+'/'+response.data;            
            break;
          case '2':
            url = url+'/edit_envio/'+response.data;
            break;
          default:
            break;
        }
        //console.log(url); console.log(estado);
        window.location.href = url;    
      }              
    },
    complete: function() {
      $.LoadingOverlay("hide");
    }
  });
}

$(document).on('focusout', '.cant_edit_envio', function (e) {
    var padre = $(this);
    var cantidad = parseInt(padre.val());
    var cantidadaten = parseInt(padre.parents('tr').find('td.cantidadaten span').html());
    console.log("canta->"+cantidad+' cantidadaten->'+cantidadaten);

    var num = 0;
    var i = 0;
    $('.cant_edit_envio').each(function (index, value){
      num = parseInt($(this).val());
      if(num>0) { i++; }
    });

    valid_exist_pedido(i);

    if(cantidad >= cantidadaten)
    {
      $(this).removeClass('erroinput'); console.log("Ok");
      $('#exist_pedido').val('si');
      $('#exist_pedido').parents('.form-group').removeClass('has-error');
    }
    else
    {
      $(this).addClass('erroinput');
      $('#exist_pedido').val('');
      $('#exist_pedido').parents('.form-group').addClass('has-error');  console.log("error");
    }

});

function valid_exist_pedido(i)
{
  var va = parseInt(i);
  if(va==0)
  {
    $('#exist_pedido').val('');
    $('#exist_pedido').parents('.form-group').addClass('has-error'); console.log(0);
  }
  else
  {      
    $('#exist_pedido').val('si');
    $('#exist_pedido').parents('.form-group').removeClass('has-error'); console.log(1);
  }
}
$(document).on('click', '.editcomentope', function (e) {
  var id = parseInt($(this).parents('tr').attr('id'));
  id = id>0 ? id : '';
  $('#idauxliar').val(id);
});

$(document).on('click', 'form.editableform button.editable-submit', function (e) {
  var comen = $('form.editableform div.editable-input textarea').val();
  var id = parseInt($('#idauxliar').val());
  if(id>0)
  {
    $('tr#'+id+' td.comentarios input').val(comen);
  }
  $('#idauxliar').val('');
});

$(document).on('click', 'form.editableform button.editable-cancel', function (e) {
  $('#idauxliar').val('');
});
