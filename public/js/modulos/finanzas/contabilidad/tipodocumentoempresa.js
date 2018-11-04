$(".flat").on('ifChecked', function(e) {
    $(e.target).trigger('change');
});

$(document).on('change', '.flat', function (e) {
  var tis = $(this);
  var temp = 'estado=0';
  if(tis.is(":checked"))  {
    temp = 'estado=1';
  }
  
  var idtipodoc = tis.parents('tr').attr('idtipodoc');
  var idtipper = tis.attr('idtipper');
  var idreg = tis.attr('idreg');

  temp = temp+'&id_tipodocumento='+idtipodoc+'&id_tipopersona='+idtipper+'&id_regimen='+idreg;

  $.ajax({
    url: $('base').attr('href') + 'tipodocumento/save_tipodocuregimen',
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