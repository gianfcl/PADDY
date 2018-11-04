$(document).on('click', '.cursorpoint', function (e) {
  var id = parseInt($(this).attr('id'));
  var tipo = $(this).parents('ul').attr('tipo');
  var url = (tipo=="pedidom") ? ('/crear_') : ("/busqueda_");

  if(id>0 && tipo.trim().length)
  { 
    $.ajax({
      url: $('base').attr('href') + tipo+url+tipo,
      type: 'POST',
      data: 'id='+id,
      dataType: "json",
      beforeSend: function() {
        //showLoader();
      },
      success: function(response) {
        if (response.code==1) {
          if(tipo=="pedidom")
          {
            window.location.href = $('base').attr('href') +'pedidom/editar/'+response.data.id+'/detalle';
          } else {
            $('ul#id_'+tipo).html(response.data);
          }
        }
      },
      complete: function() {
        //hideLoader();
      }
    });
  }
});