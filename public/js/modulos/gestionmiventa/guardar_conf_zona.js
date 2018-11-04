$(document).on('change', '.mesam', function (e)
{
  var padre = $(this);
  var idmesam = padre.attr('id');
  var idpisom = parseInt(padre.attr('idpisom')); //alert(idpisom)

  idmesam = parseInt(idmesam.replace("mesam_", ""));
  var idzonam = parseInt($('#id_zonam').val());
  var estado = (padre.is(':checked')) ? ("1"): ("0");

  if(idmesam>0 && idpisom>0 && idzonam)
  {
    var temp = 'id_zonam='+idzonam+'&id_mesam='+idmesam+'&id_pisom='+idpisom+'&estado='+estado;
    $.ajax({
      url: $('base').attr('href') + 'zonam/save_zona_mesa',
      type: 'POST',
      data: temp,
      dataType: "json",
      success: function(response) {
        if (response.code == "1") {

        }
        else if (response.code == "3") {
          $('#mesam_'+idmesam).prop('checked', false);
          $('#mesam_'+idmesam).prop('disabled', true);
          alerta("Error", 'Ya Selecciono esta mesa.', 'error');
        }
        else {
          alerta("Error", 'No se pudo Guardar.', 'error');
        }
      },
      complete: function() {
          //hideLoader();
      }
    });
  }
    
});
