$(function() {
  $('#tg_1').change(function() {
    if(!this.checked)
    {
      var id_pers=parseInt($('#pers_data').attr('id_persona'));
      var id_inventfisico=parseInt($('#pers_data').attr('id_inventfisico'));
      var data ='id_persona='+id_pers+'&id_inventfisico='+id_inventfisico+'&estado=0';

      $.ajax({
        url: $('base').attr('href') + 'personanatural/save_inventfisico',
        type: 'POST',
        data: data,
        dataType: "json",
        beforeSend: function() 
        {

        },
        success: function(response) 
        {
          if (response.code==1) 
          {

          }
        },
        complete: function() 
        {

        }
      });
    }
  })
});
