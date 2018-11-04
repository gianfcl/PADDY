$( document ).ready(function() {

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

    $.validator.addMethod("fechaestric", function(value, element) {
        var exp = value; console.log(value);
        if($.trim(exp).length>0)
        {
          return /^(0?[1-9]|[12]\d|3[01])[\.\/\-](0?[1-9]|1[012])[\.\/\-]([12]\d)?(\d\d)\s(0[0-9]|1[0-2]):[0-5][0-9]\s(AM|am|PM|pm)$/.test(value);
          //return true;
        }
        else
        {
          return false;
        }
    }, "");

    var id_tipoevento = $('#id_tipoevento').val();
    if(id_tipoevento==0){}
    else{
    $('#xdd').removeClass('hidden');
    }

    $("#fecha_de_reserva").on("dp.change", function (e) { 

    if (parseInt($('#input_zona_prefe').val()) > 0 && $('#input_zona_prefe').val().length) {}
    else{

    //$('#fecha_de_reserva').data("DateTimePicker").minDate(e.date);  
    var fecha = moment(e.date).isoWeekday();
    //alert(fecha);  
      $.ajax({
        url: $('base').attr('href') + 'reserva/get_chekzonas',
        type: 'POST',
        data: 'fecha='+fecha,
        dataType: "json",
        beforeSend: function() {
          //showLoader();
        },
        success: function(response) {
          if (response.code==1) {
            $('#zona_prefe').html(response.data);
          }
        },
        complete: function() {
        }
      });
    }
    $('#input_zona_prefe').val(0);  
  }); 

  $('#fecha_de_reserva').datetimepicker({
      sideBySide: true,
      useCurrent: false,
      format: 'DD-MM-YYYY HH:mm A',
      locale: moment.locale("es"),
      //minDate: moment()
    });
});

$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
  buscar_reservas(0);
});

$(document).on('click', '.guardar_reserva', function (e)
{
    $.ajax({
      url: $('base').attr('href') + 'reserva/save_reserva',
      type: 'POST',
      data: $('#form_save_reserva').serialize(),
      dataType: "json",

      beforeSend: function() {
        //showLoader();
      },
      success: function(response) {
                    
      },
      complete: function() {
                
      redireccionar();    
      }
    });
   
});

function redireccionar (){
  var url = $('base').attr('href') +'reserva';
  $(location).attr('href',url);
}

$(document).on('click', '.cancelar_reserva', function (e) {
  swal({
    title: '¿Estas Seguro?',
    text: "¡Todos los datos se perderán!",
    
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, salir!'
  }).then(function(isConfirm) {
    if (isConfirm) {     
      redireccionar();  
    }
  });
});

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  buscar_reservas(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_reservas(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_reservas(page);
});

function buscar_reservas(page)
{
  var um_busc = $('#um_busc').val();
  var temp = "page="+page;
  if(um_busc.trim().length)
  {
    temp=temp+'&um_busc='+um_busc;
  }
  $.ajax({
      url: $('base').attr('href') + 'reserva/buscar_reservas',
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
          
      }
  });
}

$(document).on('click', '.delete', function (e) {
  e.preventDefault();
  var idreserva = $(this).parents('tr').attr('idreserva');
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var nomb = "reserva";
  swal({
    title: 'Estas Seguro?',
    text: "De Anular esta "+nomb,
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, estoy seguro!'
  }).then(function(isConfirm) {
    if (isConfirm) {     
      $.ajax({
        url: $('base').attr('href') + 'reserva/anular_reserva',
        type: 'POST',
        data: 'id_reserva='+idreserva+'&estado=3',
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            if (response.code==1) {
              buscar_reservas(0);
            }
        },
        complete: function() {
          var text = "Elimino!";
          alerta(text, 'Esta '+nomb+' se '+text+'.', 'success');
          
        }
      });
    }
  });   
});

$(document).on('change', '#id_tipoevento', function (e) {
  //alert('entro');
  var id_tipoevento1 = (parseInt($(this).val())>0) ? parseInt($(this).val()) : "";
  if(id_tipoevento1>0){
    
    $('#xdd').removeClass('hidden');
    var id_tipoevento = (parseInt($(this).val())>0) ? parseInt($(this).val()) : "";
    //alert(id_tipoevento);
   // alert(typeof(id_tipoevento));

    id_tipoevento = (typeof(id_tipoevento) == "number" && id_tipoevento>0) ? (id_tipoevento) : (0);
    
    $('#checklist_serviciosol').html('');

    if(id_tipoevento>0)
    {
      $.ajax({
        url: $('base').attr('href') + 'reserva/checks_serviciosol ',
        type: 'POST',
        data: 'id_tipoevento='+id_tipoevento,
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
          if (response.code==1) {
            $('#checklist_serviciosol').html(response.data.checkbox_servsoli);
          }
        },
        complete: function() {
          //hideLoader();
        }
      });
    }
  }
  else{
    
    $('#checklist_serviciosol').html('');
    $('#xdd').addClass('hidden');
  }  
});


$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  buscar_serviciosols(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_serviciosols(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_serviciosols(page);
});

function buscar_serviciosols(page)
{
  var ids = new Array();
  var i = 0;
  
  $('div#checklist_serviciosol input[type=checkbox]').each(function(index,value){
    //alert($(this).attr('id').substring(5,$(this).attr('id').length));
    ids[i] = $(this).attr('id').substring(5,$(this).attr('id').length);
    i++;
  })

  ids = ids.join(',');

  var serviciosol_busc = $('#serviciosol_busc').val();
  var temp = "page="+page+'&estado1=1&mostrar=1';
  if(serviciosol_busc.trim().length)
  {
    temp=temp+'&serviciosol_busc='+serviciosol_busc;
  }
  if(ids.trim().length)
  {
    temp= temp+'&ids_servsol='+ids;
  }  

  $.ajax({
      url: $('base').attr('href') + 'serviciosol/buscar_serviciosols',
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

$(document).on('click', '.add_serv', function (e) {

  buscar_serviciosols(0);

});


$(document).on('click', '#datatable-buttons .buscarservsol', function (e) {
  var page = 0;
  buscar_serviciosols(page);
});

$(document).on('click', 'a.addservicios', function (e) {

    $('#agregar_serv').modal('hide');
    $('#checklist_serviciosol').append("<div class='col-md-12 col-sm-12 col-xs-12' ><div class='col-md-9 col-sm-9 col-xs-9 text-center agregado_hijo'>    <input type='checkbox' class='pull-left text-center' name='serviciosol["+$(this).parents('tr').attr('idserviciosol')+"]' id='serv_"+$(this).parents('tr').attr('idserviciosol')+"' checked />"+$(this).parents('tr').find('td.sv').html()+"<input type='hidden' value='' name='Obsxserviciosol["+$(this).parents('tr').attr('idserviciosol')+"]' id='Obsxserviciosol_"+$(this).parents('tr').attr('idserviciosol')+"'></div><div class='col-md-3 col-sm-3 col-xs-3'><a class='btn btn-warning obs_servicosol btn-xs pull-right' data-toggle='modal' data-target='#agregar_obsserv'><i class='fa fa-file-text-o'></i></a></div></div>");
});

$(document).on('click', 'div.agregado_hijo', function (e) {
  $(this).parent().remove();
});

$(function () {
  $("#nombre_cliente").autocomplete({

    type:'POST',
    serviceUrl: $('base').attr('href')+"clientes/get_all_info_cliente",

    onSelect: function (suggestion) 
    {
      $('#name_cliente_aut').val(suggestion.id_cliente);
      $('#nombre_cliente').val(suggestion.value);
      
      if($('#name_cliente_aut-error').size())
      {
        $('#name_cliente_aut-error').remove();
      }
    }
  });
});

$(document).on('click', '.obs_servicosol', function (e) {
  var id_serviciosol = $(this).closest('.col-md-12').find('input[type=checkbox]').attr('id') 

  id_serviciosol = (id_serviciosol.substring(5,id_serviciosol.length));
  var serviciosol = $(this).closest('.col-md-12').find('span').text();

  //alert(id_serviciosol);
  //alert(serviciosol);
  var obs_guardada = $(this).closest('.col-md-12').find('input[type=hidden]').val();
  $('#obs_serv').val(obs_guardada);
  
  $('#id_serviciosol_modal').val(parseInt(id_serviciosol));
  $('#txt_serv').text(" - "+serviciosol);
});

$(document).on('click', '.add_obsserv_textarea', function (e) {
  var Obs_modal = $('#obs_serv').val();
  var id_serviciosol = $('#id_serviciosol_modal').val();
    
  if (Obs_modal.length>0) {
        $('input#serv_'+id_serviciosol).closest('.col-md-12').find('a.obs_servicosol').removeClass('btn-warning').addClass('btn-success');
        $('input#serv_'+id_serviciosol).closest('.col-md-9').find('input#Obsxserviciosol_'+id_serviciosol).val(Obs_modal);  

        $('#id_serviciosol_modal').val('');
        $('#obs_serv').val('');

        $('#agregar_obsserv').modal('hide');
  }
  else{

    $('input#serv_'+id_serviciosol).closest('.col-md-12').find('a.obs_servicosol').removeClass('btn-success').addClass('btn-warning');
    $('input#serv_'+id_serviciosol).closest('.col-md-9').find('input#Obsxserviciosol_'+id_serviciosol).val(Obs_modal);  

    $('#id_serviciosol_modal').val('');
    $('#obs_serv').val('');
    $('#agregar_obsserv').modal('hide');
  }
  
});


$(document).on('click', 'div#checklist_serviciosol input[type=checkbox]', function (e) {

  if($(this).is(':checked')){
    
    $(this).parent().parent().find('a.obs_servicosol').removeClass('hidden');
  }
  
  else{

    $(this).parent().parent().find('a.obs_servicosol').addClass('hidden');
  
  }

});
