$(document).on('change', '.perfrect', function (e)
{
  var padre = $(this);
  var idperf = parseInt(padre.attr('idperfil'));
  var idrecper = parseInt(padre.attr('idrecetaperfil'));
  var estado = (padre.is(':checked')) ? ("1"): ("0");
  //console.log(idperf);
  if(idperf>0)
  {
    var temp = 'id_receta_perfil='+idrecper+'&id_perfil='+idperf+'&estado='+estado;
    $.ajax({
      url: $('base').attr('href') + 'filtrodereceta/save_perfrect',
      type: 'POST',
      data: temp,
      dataType: "json",
      success: function(response) {
        if (response.code == "1") {
          padre.attr({'idrecetaperfil':response.data.id});
        }
      },
      complete: function() {
          //hideLoader();
      }
    });
  }
    
});
