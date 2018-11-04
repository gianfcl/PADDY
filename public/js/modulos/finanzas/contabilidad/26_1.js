$(".adddocuma").on('ifChanged', function(e) {
    $(e.target).trigger('change');
});

$(document).on('change', '.adddocuma', function (e) {
  var tis = $(this);
  var temp = 'estado=0';
  if(tis.is(":checked"))  {
    temp = 'estado=1';
  }
  
  var idtipodocumento = tis.parents('tr').attr('idtipodocumento');
  var idtipper = tis.attr('idtipper');
  var idreg = tis.attr('idreg');
  var idmenu = $('#idmenu').val();
  temp = temp+'&id_tipodocumento='+idtipodocumento+'&id_tipopersona='+idtipper+'&id_regimen='+idreg+'&id_menu='+idmenu;

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

$(".addformato").on('ifChanged', function(e) {
    $(e.target).trigger('change');
});

$(document).on('change', '.addformato', function (e) {
  var tis = $(this);
  var temp = 'estado=0';
  if(tis.is(":checked"))  {
    temp = 'estado=1';
  }
  var idtipodocumento = tis.parents('tr').attr('idtipodocumento');
  var idform = tis.attr('idform');
  var idmenu = $('#idmenu').val();

  temp = temp+'&id_tipodocumento='+idtipodocumento+'&id_tipodocuformato='+idform+'&id_menu='+idmenu;

  $.ajax({
    url: $('base').attr('href') + 'tipodocumento/save_tipodocumaformato',
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