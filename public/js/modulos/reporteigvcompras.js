$( document ).ready(function() {
  var path_url = ($(location).attr('href')).split("/"); 
  console.log(path_url);
  jQuery.validator.setDefaults({
    debug: true,
    success: "valid",
    ignore: ""
  });
  if(!path_url[5])
  {
    $('#filtro').modal('show');
  }
  
  $('#form_busc_igvxdocu').validate({
    rules:
    {
      fecha_inicio:{ date: true },
      fecha_fin:{ date: true }
    },
    messages: 
    {
      fecha_inicio:{ date: "Fecha Invalida" },
      fecha_fin:{ date: "Fecha Invalida" }
    },      

    highlight: function(element) {
      $(element).closest('.control-group').addClass('has-error');       
    },
    unhighlight: function(element) {
      $(element).closest('.control-group').removeClass('has-error');
    },
    errorElement: 'span',
    errorClass: 'help-block',
    errorPlacement: function(error, element) 
    {
      if(element.parent('.control-group').length) 
      { 
        error.insertAfter(element); 
      }
    },
    submitHandler: function() {
      buscar();     
    }
  });

  var d = new Date();
  var month = d.getMonth();

  $('#datetimepicker6').datetimepicker({
    format: 'DD-MM-YYYY',
    locale: moment.locale("es")
  });
  console.log(primerdia_mes(month));
  $('#datetimepicker6').data("DateTimePicker").date(primerdia_mes(month));

  $('#datetimepicker7').datetimepicker({
    format: 'DD-MM-YYYY',
    locale: moment.locale("es"), 
    useCurrent: false //Important! See issue #1075
  });

  $('#datetimepicker7').data("DateTimePicker").date(ultimodia_mes(month));

  $("#datetimepicker6").on("dp.change", function (e) {
    $('#datetimepicker7').data("DateTimePicker").minDate(e.date);
  });

  $("#datetimepicker7").on("dp.change", function (e) {
    $('#datetimepicker6').data("DateTimePicker").maxDate(e.date);
  });

});

$(document).on('click', '.buscar', function (e) {
  buscar(1);
});

$(document).on('click', '.buscar_det', function (e) {
  buscar(2);
});

function buscar(tipo_busc)
{
  var id_tip = $('#id_tipodocumento').val();
  var fech_i = $('#fecha_inicio').val();
  var fech_f = $('#fecha_fin').val();

  var url = $('#linkmodulo').val();

  id_tip = (id_tip.trim().length) ? (id_tip) : ("-");
  fech_i = (fech_i.trim().length) ? (fech_i) : ("-");
  fech_f = (fech_f.trim().length) ? (fech_f) : ("-");

  if(id_tip == "-" && fech_i == "-" && fech_f == "-")
  {
    alerta('No Busco', 'Ingrsar Algún Dato', 'error');
  }
  else
  {
    window.location.href = url+'/buscar/'+id_tip+'/'+fech_i+'/'+fech_f+'/'+tipo_busc;
  }
}