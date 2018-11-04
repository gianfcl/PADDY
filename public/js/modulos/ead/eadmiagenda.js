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
    }
    else
    {
      return false;
    }
  }, "");

  $('#form_save_eadmiagenda').validate({
    rules:
    {
      fecha_inicio:
      {
        required:true,
        //fechaestric: true
      },       
      fecha_fin:
      {
        required:true,
        //fechaestric:true
      }
    },
    messages: 
    {
      fecha_inicio:
      {
        required:"Dato Obligatorio",
        //fechaestric:"Fecha Inválida"
      },
      fecha_fin:
      {
        required:"Dato Obligatorio",
        //fechaestric:"Fecha Inválida"
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
      if(element.parent('.col-md-4').length) 
      {
        error.insertAfter(element.parent()); 
      }
    },
    submitHandler: function() {
      $.ajax({
        url: $('base').attr('href') + 'eadmiagenda/save_eadmiagenda',
        type: 'POST',
        data: $('#form_save_eadmiagenda').serialize(),
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

            $('#editeadmiagenda').modal('hide');

            buscar_eadmiagendas(page);
          }
          else
          {
            limpiarform();
          }
        },
        complete: function() {
          var id_eadmiagenda = parseInt($('#id_eadmiagenda').val());
          id_eadmiagenda = (id_eadmiagenda>0) ? (id_eadmiagenda) : ("0");
          var text = (id_eadmiagenda=="0") ? ("Guardo!") : ("Edito!");
          alerta(text, 'Este evento se '+text+'.', 'success');
          limpiarform();
        }
      });/**/
    }
  });

  $(function () {
    $('#fecha_inicio').datetimepicker({
      format:'DD-MM-YYYY hh:mm a',
      minDate: moment(),
      locale: moment.locale('es'),
      sideBySide: true
    });
  });

  $('#fecha_fin').datetimepicker({
    format:'DD-MM-YYYY hh:mm a',
    locale: moment.locale('es'),
    sideBySide: true
  });

  $(function() {
    $('#colop1').colorpicker({
      format: "hex",
    });
  });
});

$('#fecha_inicio').on('dp.change', function(e){
  $('#fecha_fin').val('');
  $('#fecha_fin').data("DateTimePicker").minDate(e.date);  
  if($(this).val().trim().length)
  {
    $('#fecha_fin').removeAttr('disabled');
  }
  else
  {
    $('#fecha_fin').prop('disabled',true);
  }
});

$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
  $('#filtrarxfecha').prop('checked',false);
  buscar_eadmiagendas(0);
});

$(document).on('click', '.add_eadmiagenda', function (e)
{
  limpiarform();
});

$(document).on('click', '.btn_limpiar', function (e) {
  limpiarform();
  $('#editeadmiagenda').modal('hide');
});

function limpiarform()
{
  $('#id_eadmiagenda').val('0');
  $('#fecha_fin').val('');
  $('#fecha_inicio').val('');
  $('#descripcion').val('');
  $('#estado label').removeClass('active');
  $('#estado input').prop('checked', false);
  $('#color').val('');
  $('span.input-group-addon').find('i').css("background-color", "#000000" );

  $('#estado #estado_1').prop('checked', true);
  $('#estado #estado_1').parent('label').addClass('active');

  if($('#eadmiagenda').parents('.form-group').attr('class')=="form-group has-error")
  {
    $('#eadmiagenda').parents('.form-group').removeClass('has-error');
  }

  if($('#eadmiagenda-error').length>0)
  {
    $('#eadmiagenda-error').html('');
  }
}

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  buscar_eadmiagendas(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_eadmiagendas(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_eadmiagendas(page);
});

function buscar_eadmiagendas(page)
{
  var descripcion = $('#descripcion_busc').val();
  var temp = "page="+page;
  if(descripcion.trim().length)
  {
    temp=temp+'&descripcion='+descripcion;
  }
  if($('#filtrarxfecha').is(':checked'))
  {
    temp = temp +'&mostrar_t=true';
  }
  $.ajax({
    url: $('base').attr('href') + 'eadmiagenda/buscar_eadmiagendas',
    type: 'POST',
    data: temp,
    dataType: "json",
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
  var ideadmiagenda = $(this).parents('tr').attr('ideadmiagenda');
  $.ajax({
    url: $('base').attr('href') + 'eadmiagenda/edit',
    type: 'POST',
    data: 'id_eadmiagenda='+ideadmiagenda,
    dataType: "json",
    beforeSend: function() {
        //showLoader();
    },
    success: function(response) {
      if (response.code==1) {
        $('#id_eadmiagenda').val(response.data.id_eadmiagenda);
        $('#fecha_fin').val(response.data.fecha_fin);
        $('#fecha_inicio').val(response.data.fecha_inicio);
        $('#descripcion').val(response.data.descripcion);
        $('#color').val(response.data.color);
        $('span.input-group-addon').find('i').css("background-color", response.data.color);

        $('#estado label').removeClass('active');
        $('#estado input').prop('checked', false);

        var num = response.data.estado;
        $('#estado #estado_'+num).prop('checked', true);
        $('#estado #estado_'+num).parent('label').addClass('active');

        if($('#eadmiagenda').parents('.col-md-8').attr('class')=="col-md-8 col-sm-8 col-xs-12")
        {
          $('#eadmiagenda').parents('.col-md-8').removeClass('has-error');
        }

        if($('#eadmiagenda-error').length>0)
        {
          $('#eadmiagenda-error').html('');
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
  var ideadmiagenda = $(this).parents('tr').attr('ideadmiagenda');
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var descripcion = $('#descripcion').val();
  var temp = "page="+page;
  if(descripcion.trim().length)
  {
    temp=temp+'&descripcion='+descripcion;
  }
  var nomb = "evento";
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
        url: $('base').attr('href') + 'eadmiagenda/save_eadmiagenda',
        type: 'POST',
        data: 'id_eadmiagenda='+ideadmiagenda+'&estado=0',
        dataType: "json",
        success: function(response) {
          if (response.code==1) {
            buscar_eadmiagendas(temp);
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

$(document).on('change','#filtrarxfecha',function(){
  buscar_eadmiagendas(0);
});