$( document ).ready(function() {
	jQuery.validator.setDefaults({
    debug: true,
    success: "valid",
    ignore: ""
  });

  $('#form_reporte').validate({
    rules:
    {
			fecha_inicio: { date:true },
      fecha_fin: { date:true }
    },
    messages: 
    {
      fecha_inicio: { date:"Solo Fechas" },
      fecha_fin: { date:"Solo Fechas" }
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
        if(element.parent('.control-group').length) { error.insertAfter(element.parent()); }
    },
    submitHandler: function() {
      var f_i = $('#fecha_inicio').val();
      var f_f = $('#fecha_fin').val();
      var id_f = $('#id_formulario').val();
      f_i = (f_i.trim().length) ? (f_i) : ("_");
      f_f = (f_f.trim().length) ? (f_f) : ("_");
      id_f = (id_f.trim().length) ? (id_f) : ("_");

      if( f_i.trim().length == "_" || f_f.trim().length == "_" || id_f.trim().length == "_")
      {
        alerta('No Busco', 'Ingresar un Campo', 'success');
      }
      else
      {
        window.location.href = $('base').attr('href') +'artnoatendido/index/'+f_i+'/'+f_f+'/'+id_f;
      }
        
    }
  });

  $('#fecha_i').datetimepicker({
    viewMode: 'years',
    format: 'YYYY-MM-DD',
    locale: moment.locale("es")
  });

  $('#fecha_f').datetimepicker({
    viewMode: 'years',
    format: 'YYYY-MM-DD',
    locale: moment.locale("es"), 
    useCurrent: false //Important! See issue #1075
  });

  $("#fecha_i").on("dp.change", function (e) {
    $('#fecha_f').data("DateTimePicker").minDate(e.date);
  });

  $("#fecha_i").on("dp.show", function (e) {
    $('#fecha_f input').prop( "disabled", false );
  });
  

  $("#fecha_f").on("dp.change", function (e) {
    $('#fecha_i').data("DateTimePicker").maxDate(e.date);
  });
});

$(document).on('focusout', '#fecha_i input', function (e) {
  var fechi = $(this).val();
  if(fechi.trim().length) {}
  else { $('#fecha_f input').prop( "disabled", true );}

});