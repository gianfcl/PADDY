$( document ).ready(function() {

  $('#fecha_nacimiento').daterangepicker({
    singleDatePicker: true,
    format: 'DD-MM-YYYY',
    calender_style: "picker_4"
  }, function(start, end, label) {
    console.log(start.toISOString(), end.toISOString(), label);
  });

  //$('#hora_salida').datetimepicker({format: 'LT'});
  //$('#hora_ingreso').datetimepicker({format: 'LT'});
  
});

$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
  $('#'+id+' select').val('');
  buscar_personal(0);
});

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  buscar_personal(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_personal(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_personal(page);
});

function buscar_personal(page)
{
  var nombre_busc = $('#nombre_busc').val();
  var nomb_corto_busc = $('#nomb_corto_busc').val();
  var dni_busc = $('#dni_busc').val();
  var area = $('#id_areapuesto').val();
  var pues = parseInt($('#id_puesto').val());
  var dni_busc = $('#dni_busc').val();
  var fecha_nacimiento = $('#fecha_nacimiento').val();
  var url_modulo = $('#url_modulo').val();
  var es_ope = $('#operario_busc').val();
  var estado_busc = $('#estado_busc').val();
  //var hora_salida = $('#hora_salidas').val();
  var sexo_busc = $('#sexo_busc').val();
  var temp = "page="+page+'&url_modulo='+url_modulo;


  if(nomb_corto_busc.trim().length)
  {
    temp=temp+'&nomb_corto_busc='+nomb_corto_busc;
  }
  if(nombre_busc.trim().length)
  {
    temp=temp+'&nombre_busc='+nombre_busc;
  }
  if(dni_busc.trim().length)
  {
    temp=temp+'&dni_busc='+dni_busc;
  }
  if(fecha_nacimiento.trim().length)
  {
    temp=temp+'&fecha_nacimiento='+fecha_nacimiento;
  }
    
  if(estado_busc.trim().length)
  {
    temp=temp+'&estado_busc='+estado_busc;
  }

  if(sexo_busc.trim().length)
  {
    temp=temp+'&sexo_busc='+sexo_busc;
  }

  if(area.trim().length)
  {
    temp=temp+'&id_areapuesto='+area;
  }
  if(parseInt(es_ope)>0)
  {
    temp=temp+'&es_operario='+es_ope;
  }

  if(pues>0)
  {
    temp=temp+'&id_puesto='+pues;
  }

  $.ajax({
    url: $('base').attr('href') + 'personal/buscar_personal',
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
  var idpersonal = $(this).parents('tr').attr('idpersonal');
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var nomb = "Personal";
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
        url: $('base').attr('href') + 'personal/delete',
        type: 'POST',
        data: 'id_personal='+idpersonal,
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            if (response.code==1) {              
              buscar_personal(page);
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

$(document).on('change', '#id_areapuesto', function (e)
{
  var idarea = parseInt($(this).val());
  idarea = (idarea>0) ? (idarea) : ("");
  $('#id_puesto').html('');
  if(idarea>0)
  {
    $.ajax({
      url: $('base').attr('href') + 'puesto/commbx',
      type: 'POST',
      data: 'id_areapuesto='+idarea,
      dataType: "json",
      beforeSend: function() {
        //showLoader();
      },
      success: function(response) {
    if (response.code==1) {
      $('#id_puesto').html(response.data);
    }                    
      },
      complete: function() {
          //hideLoader();
      }
    });
  }
});