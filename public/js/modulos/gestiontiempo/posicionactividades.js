$(document).on('click', '.activid', function (e) {
  var estado = ($(this).is(':checked')) ? ("1") : ("0");
  var idpues = parseInt($('#id_posicion').val());
  var idacti = parseInt($(this).attr('idactividad'));

  if(idpues>0 && idacti>0)
  {
    var temp = 'id_posicion='+idpues+'&id_actividad='+idacti+'&estado='+estado;
    $.ajax({
      url: $('base').attr('href') + 'posicion/save_posicionacividad',
      type: 'POST',
      data: temp,
      dataType: "json",
      beforeSend: function() {
        //showLoader();
      },
      success: function(response) {
        if (response.code==1) {
          
        }
      },
      complete: function() {
        //hideLoader();
      }
    });
  }
    
});