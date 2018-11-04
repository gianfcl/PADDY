$( document ).ready(function() {

  $(function () {
    $('#datetimepicker1').datetimepicker({
      format:'DD-MM-YYYY hh a',
			useCurrent: false,
			sideBySide: true,
			locale: moment.locale("es")
    });
  });

  $(function () {
    $('#datetimepicker2').datetimepicker({
      format: 'DD-MM-YYYY hh a',
      useCurrent: false,
			sideBySide: true,
			locale: moment.locale("es")
    });
  });

  $("#datetimepicker1").on("dp.change", function (e) {
    $('#datetimepicker2').data("DateTimePicker").minDate(e.date);
  });

  $("#datetimepicker2").on("dp.change", function (e) {
    $('#datetimepicker1').data("DateTimePicker").maxDate(e.date);
  });
});

$(document).on('click','.filtrar',function(){
  var fecha_i = $('#fecha_ini').val();
  var fecha_h = $('#fecha_hasta').val();
  var userq = $('#list_users').val();
  var id_pregunta = $('#id_pregunta').val();
  var param = "id_pregunta="+id_pregunta;
  if(fecha_i.trim().length>0)
  {
    param = param + "&fecha_i="+fecha_i;
  }
  if(fecha_h.trim().length>0)
  {
    param = param + "&fecha_h="+fecha_h;
  }

  if(userq)
  {
    param = param + "&user="+userq;
  }

  $.ajax({
    url: $('base').attr('href') + 'egrafica/filtrar_graf',
    type: 'POST',
    data: param,
    dataType: 'JSON',
    beforeSend: function() {
      $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
    },
    success: function(response) {
      if (response.code>0) 
			{
				if(response.code==1)
				{
					$('div#cont_script').html(response.data);
				}
				else
				{
					$('div#content_graf').html(response.data);
				}
      }
      else
      {
        alerta('Error!','No hay datos disponibles, configure otros filtros','error')
      }
    },
    complete: function() {
      $.LoadingOverlay("hide"); 
    }
  });    
});

function limpiar_filtro()
{
  $('#list_users').val('');
  $('#fecha_hasta').val('');
  $('#fecha_ini').val('');

  $('#list_users').selectpicker('refresh');
}

$(document).on('click','.limpiarfiltro',function(){
  limpiar_filtro();
  $('.filtrar').trigger('click');
});