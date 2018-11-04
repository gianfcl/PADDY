$(".addigv").on('ifChanged', function(e) {
    $(e.target).trigger('change');
});

$(document).on('change', '.addigv', function (e) {
  var tis = $(this);
  var temp = 'estado=0';
  if(tis.is(":checked"))  {
    temp = 'estado=1';
  }
  var idtipodocma = tis.parents('tr').attr('idtipodocma');
  var idmenu = parseInt(tis.parents('table').attr('idmenu'));

  idmenu = idmenu > 0 ? idmenu : 0;
  if(idmenu >0)
    temp = temp+'&id_menu='+idmenu;

  temp = temp+'&id_tipodocumentomaestro='+idtipodocma;

  $.ajax({
    url: $('base').attr('href') + 'tipodocumentomaestro/save_igvs',
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

$(".addtipopersona").on('ifChanged', function(e) {
    $(e.target).trigger('change');
});

$(document).on('change', '.addtipopersona', function (e) {
  var tis = $(this);
  var temp = 'estado=0';
  if(tis.is(":checked"))  {
    temp = 'estado=1';
  }
  var idtipodocma = tis.parents('tr').attr('idtipodocma');
  var idtipper = tis.attr('idtipper');

  temp = temp+'&id_tipodocumentomaestro='+idtipodocma+'&id_tipopersona='+idtipper;

  var idmenu = parseInt(tis.parents('table').attr('idmenu'));

  idmenu = idmenu > 0 ? idmenu : 0;
  if(idmenu >0)
    temp = temp+'&id_menu='+idmenu;

  $.ajax({
    url: $('base').attr('href') + 'tipodocumentomaestro/save_tipopersonacli',
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