$(document).on('change', '.mesam', function (e)
{
  var padre = $(this);
  var idmesam = parseInt(padre.attr('id_mesam'));
  var idzonam = parseInt(padre.attr('id_zonam'));
  var id_zonam_mesam = parseInt(padre.attr('id_zonam_mesam'));
  var estado = (padre.is(':checked')) ? ("1"): ("0");
  //console.log(idperf);
  if(idmesam>0)
  {
    var temp = 'id_zonam='+idzonam+'&id_mesam='+idmesam+'&id_zonam_mesam='+id_zonam_mesam;
    $.ajax({
      url: $('base').attr('href') + 'zonam/save_zona_mesa',
      type: 'POST',
      data: temp,
      dataType: "json",
      success: function(response) {
        if (response.code == "1") {
          padre.attr({'id_zonam_mesam':response.data.id});
        }
      },
      complete: function() {
          //hideLoader();
      }
    });
  }
    
});
