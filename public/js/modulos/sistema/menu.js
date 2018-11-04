$('.divmenu').matchHeight({
  byRow: true,
  property: 'height',
  /*target: null,*/
  remove: false
});

$(document).on('change', '.hijomenu', function (e) {  
  var idmenu = parseInt($(this).attr('idmenu'));

  var estado = ($(this).is(':checked')) ? ("1") : ("0");
  var idmenuempresa = $(this).attr('idmenuempresa');
  var idempresa = $('#id_empresa').val();

  if(idmenu>0)
  {
    var temp = 'id_menuempresa='+idmenuempresa+'&id_empresa='+idempresa+'&id_menu='+idmenu+'&estado='+estado;

    $.ajax({
      url: $('base').attr('href') + 'allempresa/save_menuempresa',
      type: 'POST',
      data: temp,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
          if (response.code==1) {

          }                    
      },
      complete: function() {
          //hideLoader();
      }
    });
  }

    
});

/*Validar Al Salir del Formulario*/
$(document).on('click', '#myTab li.tab a, .breadcrumb li a', function (e) {
    var url = $(this).attr('url');
    window.location.href = url;       
});
/*<---->*/