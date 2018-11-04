$( document ).ready(function() {

  
});

$(document).on('click','.eplant_', function(){
  var id_eplantilla = $(this).attr('id_plantilla');

  $.ajax({
    url: $('base').attr('href')+'egrafica/get_solo_db_preguntas',
    type:'POST',
    data:'id_eplantilla='+id_eplantilla,
    dataType:'json',
    success: function(response){
      if(response.code == 1)
      {
        $('#content_mod').html(response.data); 
      }
    }
  });
});
    