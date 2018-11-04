$(document).on('change', '#es_operario', function (e)
{
  var es = ($(this).is(":checked")) ? 2 : 1;
  var idp = parseInt($('#id_personal').val());
  idp = (idp > 0) ? idp : 0;

  if(idp>0)
  {
    $.ajax({
      url: $('base').attr('href') + 'personanatural/save_operario',
      type: 'POST',
      data: 'id_personal='+idp+'&es_operario='+es,
      dataType: "json",
      success: function(response) {
        if (response.code == "1") {
        	
        }
      },
      complete: function() {
         //hideLoader();
      }
    });
  }
});