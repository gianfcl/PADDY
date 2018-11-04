$(document).on('click', '.cursorpoint', function (e) {
  var id = parseInt($(this).attr('id'));
  var tipo = $(this).parents('ul').attr('tipo');

  if(id>0 && tipo.trim().length)
  { 
    $.ajax({
      url: $('base').attr('href') + tipo+'/busqueda_'+tipo,
      type: 'POST',
      data: 'id='+id,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
          if (response.code==1) {
            //alert('ul#id_'+tipo)
            $('ul#id_'+tipo).html(response.data);
          }
      },
      complete: function() {
          //hideLoader();
      }
    });
  }
});