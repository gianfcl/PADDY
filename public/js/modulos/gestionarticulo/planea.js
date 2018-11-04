$(document).on('focusout', '.stock', function (e) {
  var idartsu = parseInt($('#id_art_sucursal').val());
  var padre = $(this);
  var idalm = parseInt(padre.parents('tr').attr('idalmacen'));
  var colum = padre.attr('name');
  var valor = padre.val();

  if(idartsu>0 && idalm>0 && colum.trim().length)
  {
    var temp = "id_art_sucursal="+idartsu+'&id_almacen='+idalm+'&colum='+colum+'&valor='+valor;
    $.ajax({
      url: $('base').attr('href') + 'articuloxsucursal/save_planea',
      type: 'POST',
      data: temp,
      dataType: "json",
      beforeSend: function() {

      },
      success: function(response) {
        if (response.code==1) 
        {
          
        }
      },
      complete: function(response) {

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