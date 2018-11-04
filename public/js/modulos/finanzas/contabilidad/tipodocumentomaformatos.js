$(".flat").on('ifChecked', function(e) {
    $(e.target).trigger('change');
});

$(document).on('change', '.flat', function (e) {
  var tis = $(this);
  var temp = 'estado=0';
  if(tis.is(":checked"))  {
    temp = 'estado=1';
  }
  
  var idtipodocma = tis.parents('tr').attr('idtipodocma');
  var idform = tis.attr('idform');
  var idmenu = $('#id_menu').val();

  temp = temp+'&id_tipodocumentomaestro='+idtipodocma+'&id_tipodocuformato='+idform+'&id_menu='+idmenu;

  $.ajax({
    url: $('base').attr('href') + 'tipodocumentomaestro/save_tipodocumaformato',
    type: 'POST',
    data: temp,
    dataType: "json",
    beforeSend: function() {
      $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
    },
    success: function(response) {
      if(response.code==1)
      {
        
      }
    },
    complete: function(response) {
      $.LoadingOverlay("hide");
    }
  });
});