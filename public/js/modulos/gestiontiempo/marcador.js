$( document ).ready(function() {
  jQuery.validator.setDefaults({
    debug: true,
    success: "valid",
    ignore: ""
  });

  $.validator.addMethod("formespn",
    function(value, element) {
      if(value.trim().length)
        return /^(0?[1-9]|[12]\d|3[01])[\.\/\-](0?[1-9]|1[012])[\.\/\-]([12]\d)?(\d\d)$/.test( value );
      else
        return false;
  }, "Ingrese est Formato dd-mm-yyyy");

  $.validator.addMethod("horaestri", function(value, element) {
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

  $('#form_save_marcacion').validate({
    rules: 
    {
      id_personal: { required:true},
      fecha:{formespn:true} 
    },
    messages: 
    {
      id_personal: { required:"Seleccione" }
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
      if(element.parent('.col-md-4').length) { error.insertAfter(element.parent()); }
      else {}
    },
    submitHandler: function() {
      $.ajax({
        url: $('base').attr('href') + 'marcador/buscar_marcador',
        type: 'POST',
        data: $('#form_save_marcacion').serialize(),
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
          var html = "";
          if (response.code==1) {
            html = response.data;
          }
          $('#cont_marca').html(html);
        },
        complete: function() {          
        }
      });/**/
    }
  });

  $('#form_save_marcacion_2').validate({
    rules: 
    {
      id_personal: { required:true},
      fecha:{formespn:true} 
    },
    messages: 
    {
      id_personal: { required:"Seleccione" }
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
      if(element.parent('.col-md-4').length) { error.insertAfter(element.parent()); }
      else {}
    },
    submitHandler: function() {
      $.ajax({
        url: $('base').attr('href') + 'marcador/buscar_marcador',
        type: 'POST',
        data: $('#form_save_marcacion_2').serialize(),
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
          var html = "";
          if (response.code==1) {
            html = response.data;
          }
          $('#cont_marca').html(html);
        },
        complete: function() {          
        }
      });/**/
    }
  });
  
  $('#form_marcador').validate({
    rules: 
    {
      id_personalhorariomarca: { required:true},
      fecha:{horaestri:true} 
    },
    messages: 
    {
      id_personalhorariomarca: { required:"Seleccione" }
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
      if(element.parent('.col-md-4').length) { error.insertAfter(element.parent()); }
      else {}
    },
    submitHandler: function() {
      $.ajax({
        url: $('base').attr('href') + 'marcador/save_marcador',
        type: 'POST',
        data: $('#form_marcador').serialize(),
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
          var html = "";
          if (response.code==1) {
            var id = parseInt(response.data);
            if(id>0)
            {
              var ti = $('#tipo_ma').val();
              var ho = $('#horario').val();
              $('#'+id+'_'+ti).attr(ho);
              $('#'+id+'_'+ti).html(ho);
              $('#'+id+'_'+ti).closest('div.top_tiles').find('input.obs').val($('#observacion').val());
            }              
          }
          $('#editmarcador').modal('hide');
          limp_todo('form_marcador');
        },
        complete: function() {
          var text = 'Guardo Ok!';
          alerta(text, 'Este Horario se Guardo!.', 'success');     
        }
      });/**/
    }
  });


  $('#fecha_mos').datetimepicker({
    viewMode: 'years',
    format: 'DD-MM-YYYY',
    locale: moment.locale("es")
  });

  $('#fecha_mos2').datetimepicker({
    viewMode: 'years',
    format: 'DD-MM-YYYY',
    locale: moment.locale("es")
  });

  $('#hora_labor').datetimepicker({
    sideBySide: true,
    format: 'DD-MM-YYYY HH:mm A',
    locale: moment.locale("es")
  });

});

$(document).on('click', '.editmar', function (e)
{
  var padre = $(this).closest('.animated');
  var ids = padre.attr('ids');
  var tip = padre.attr('tip');
  var obs = $(this).closest('div.top_tiles').find('input.obs').val();
  $('#id_ma').val(ids);
  $('#tipo_ma').val(tip);

  var hora = $(this).attr('valor'); console.log(hora);
    
  if(hora=="-")
  {
    $('#hora_labor').data("DateTimePicker").options({maxDate: moment()});
    var hora = padre.find('div.tile-stats p').html();
    //alert(hora);
  }
  $('#observacion').val(obs);
  $('#horario').val(hora);
});

$(document).on('click', '.btn_limpiar', function (e)
{
    limp_todo('form_marcador');
});

$(document).on('hidden.bs.modal', '#editmarcador', function (e)
{
  limp_todo('form_marcador');
});

$(document).on('change', '#id_areapuesto', function (e) {
  
  var idcc = parseInt($(this).val());
  $('#id_puesto').html("<option value=''>Seleccionar</option>");
  $('#id_personal').html("<option value=''>Seleccionar</option>");

  if(idcc>0)
  {
    $.ajax({
    url: $('base').attr('href') + 'puesto/cbox_puesto',
    type: 'POST',
    data: 'id_areapuesto='+idcc,
    dataType: "json",
    beforeSend: function() {
    },
    success: function(response) {
      if (response.code==1) {
        $('#id_puesto').html(response.data);
      }
    },
    complete: function() {
    }
  });
  }
});

$(document).on('change', '#id_puesto', function (e) {
  
  var idcc = parseInt($(this).val());
  $('#id_personal').html("<option value=''>Seleccionar</option>");

  if(idcc>0)
  {
    $.ajax({
    url: $('base').attr('href') + 'personal/cbx_perscargo',
    type: 'POST',
    data: 'id_puesto='+idcc,
    dataType: "json",
    beforeSend: function() {
    },
    success: function(response) {
      if (response.code==1) {
        $('#id_personal').html(response.data);
      }
    },
    complete: function() {
    }
  });
  }
});

$(document).on('click', '.limpiarform', function (e) {
  $('#id_areapuesto').val('');
  $('#id_puesto').html('');
  $('#id_personal').html('');
  $('div#fecha_mos input').val('');
  $('div#cont_marca').html("<h2 class='text-center text-success'>Buscar</h2>")
});

$(function () {
  $("#name_autocomplete").autocomplete({

    type:'POST',
    serviceUrl: $('base').attr('href')+"personal/get_persacargo_autocomp",
    dataType : 'JSON',
    onSelect: function (suggestion)
    {
      $('#name_autocomplete').parent().find('input[name="id_personal"]').val(suggestion.data.id_personal);
    }
  });
}); 