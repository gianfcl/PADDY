$(".adddocuma").on('ifChanged', function(e) {
    $(e.target).trigger('change');
});

$(document).on('change', '.adddocuma', function (e) {
  var tis = $(this);
  var temp = 'estado=0';
  if(tis.is(":checked"))  {
    temp = 'estado=1';
  }
  
  var idtipodocma = tis.parents('tr').attr('idtipodocma');
  var idtipper = tis.attr('idtipper');
  var idreg = tis.attr('idreg');
  var idmenu = $('#idmenu').val();
  temp = temp+'&id_tipodocumentomaestro='+idtipodocma+'&id_tipopersona='+idtipper+'&id_regimen='+idreg+'&id_menu='+idmenu;

  $.ajax({
    url: $('base').attr('href') + 'tipodocumentomaestro/save_tipodocuregimen',
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
  var idtipodocma = tis.parents('tr').attr('idtipodocma');
  var idform = tis.attr('idform');
  var idmenu = $('#idmenu').val();

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