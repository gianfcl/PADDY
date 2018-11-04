$( document ).ready(function() {

  $('#buscarinv').modal('show');

});

$(document).on('click', '.buscar', function (e)
{
  var url = $('#linkmodulo').val();
  var idalmacen = parseInt($('#id_almacen').val());
  
  if(idalmacen>0)
  {
    url = url+'/buscar/'+idalmacen;
    var idzona = parseInt($('#id_zona').val());
    idzona = (idzona>0) ? (idzona) : ('-');

    var idarea = parseInt($('#id_area').val());
    idarea = (idarea>0) ? (idarea) : ('-');

    var idubi = parseInt($('#id_ubicacion').val());
    idubi = (idubi>0) ? (idubi) : ('-');

    var nega = ($('#tg_1').is(':checked')) ? 1 : 0;
    nega = (nega>0) ? nega : "-";

    url = url+'/'+idzona+'/'+idarea+'/'+idubi+'/'+nega;
    window.location.href = url;
  }
    
});


$(document).on('change','select#s',function(){  
   var t= $(this).val();   
   $.ajax({
      url: $('base').attr('href') + 'stockxempresa/buscar_stocksede',
      type: 'POST',
      data: 'id_tipo='+t,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
        $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});

      },
      success: function(response) {
        if (response.code==1) {          
          $('#tabla_x').html(response.data);
        }else{
          alerta('No ha seleccionado una opción');
        }                
      },
      complete: function() {
        $.LoadingOverlay("hide");
        $('#buscarinv').modal("hide");
      }
    });
});

$(document).on('click', 'a#regresar', function (e) {  
  $('#buscarinv').modal("show");
});