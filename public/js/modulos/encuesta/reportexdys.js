$( document ).ready(function() {
  $(function () {

    
    
    $("#datetimepicker2").on("dp.change", function (e) {
      $('#datetimepicker1').data("DateTimePicker").maxDate(e.date);
    });

    $('#datetimepicker1').datetimepicker({
      locale: moment.locale('es'),
      useCurrent: false,
      format: 'DD-MM-YYYY hh:mm a',
      sideBySide: true,
      //date: moment().subtract(1,"week")
    });
  });
  
  $('#datetimepicker2').datetimepicker({
    locale: moment.locale('es'),
    useCurrent: false,
    format: 'DD-MM-YYYY hh:mm a',
    sideBySide: true,
    //date: moment()
  });
  
  $("#datetimepicker1").on("dp.change", function (e) {
    $('#datetimepicker2').data("DateTimePicker").minDate(e.date);
  });

});



$(document).on('click','.buscar', function(){
  $('div.x_content div').removeClass('hidden');
  var id_eplantilla = $('#id_eplantilla').val();
  var fecha_i = $('#t_1').val();
  var fecha_h = $('#t_2').val();
  var user_d = $('#list_users').val();
  var param = "id_eplantilla="+id_eplantilla;

  if(fecha_i.trim())
  {
    param= param + "&fecha_i="+fecha_i;
  }

  if(fecha_h.trim())
  {
    param= param + "&fecha_h="+fecha_h;
  }

  if(user_d)
  {
    param= param + "&user_d="+user_d;
  }

  $.ajax({
    url: $('base').attr('href')+'reportexdys/filtrargrafico',
    type:'POST',
    data:param,
    dataType:'json',
    beforeSend: function() {
      $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
    },
    success: function(response)
    {
      $('div.x_content div.rp').html("");
      if(response.code == 1)
      {
        $.each(response.data.id_pregunta, function(i, item) {
          var id= item.toString();
          if(response.data.g.hasOwnProperty('rta') && response.data.g.rta.hasOwnProperty(item))
          {
            
            $('div.x_content #script_'+id).html(response.data.g.rta[item]);
          }
          else
          {
            if(response.data.g.hasOwnProperty('table_c') && response.data.g.table_c.hasOwnProperty(item))
            {
              $('div.x_content #id_pe_'+id).html(response.data.g.table_c[item]);
            }
            else
            {
              console.log('entro');
              $('div.x_content #id_pe_'+id).html("").addClass('hidden');
            }
          }
        });
      }
      else
      {
        alerta(':-(','No se encontrados datos','info');
      }
    },
    complete: function() {
      $.LoadingOverlay("hide"); 
      $('#filtrop').modal('hide');
      $('#bandeja_filtro').modal('hide');
      limpiar_filtro();
    }
  });
});

function limpiar_filtro()
{
  $('#list_users').val('');
  $('#t_2').val('');
  $('#t_1').val('');
  $('#datetimepicker2').data("DateTimePicker").minDate(false);
  $('#datetimepicker1').data("DateTimePicker").maxDate(false);
  //$('#datetimepicker1').data("DateTimePicker").date(moment().subtract(1,'week'));
  //$('#datetimepicker2').data("DateTimePicker").date(moment());
  $('#list_users').selectpicker('refresh');
}

$(document).on('click','.limpiarfiltro',function(){
  limpiar_filtro();
  $('#filtrop').modal('hide');
  //$('.buscar').trigger('click');
});

$(document).on('click','.filtrop',function(){
  limpiar_filtro();
});

$(document).on('click','.1d',function(){
  $('#datetimepicker1').data("DateTimePicker").date(moment().subtract(1,'day'));
  $('#datetimepicker2').data("DateTimePicker").date(moment());
  $('.buscar').trigger('click');
  $('#bandeja_filtro').modal('hide');
});

$(document).on('click','.1s',function(){
  $('#datetimepicker1').data("DateTimePicker").date(moment().subtract(1,'week'));
  $('#datetimepicker2').data("DateTimePicker").date(moment());
  $('.buscar').trigger('click');
  $('#bandeja_filtro').modal('hide');
});

$(document).on('click','.2s',function(){
  $('#datetimepicker1').data("DateTimePicker").date(moment().subtract(2,'week'));
  $('#datetimepicker2').data("DateTimePicker").date(moment());
  $('.buscar').trigger('click');
  $('#bandeja_filtro').modal('hide');
});

$('#filtrop').on('show.bs.modal', function (e) {
  $(this).css('z-index',"99999999");
})


$('#bandeja_filtro').on('hidden.bs.modal', function (e) {
  $('body.nav-md').css('padding-right','0px');
})

$('#bandeja_filtro').on('shown.bs.modal', function (e) {
  $('body.nav-md').css('padding-right','0px');
})