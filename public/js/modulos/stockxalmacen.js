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
  else
  {
    alerta('seleccionar','Escoja un Almacén','error');
  }    
});

$(document).on('change', '.id_zona', function (e) {
  var idzona = parseInt($(this).val());
  idzona = (idzona>0) ? (idzona) : (0);
  
  $('.id_area').html('');
  if(idzona>0)
  {
    $.ajax({
      url: $('base').attr('href') + 'area/cbox_area',
      type: 'POST',
      data: 'id_zona='+idzona,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
        if (response.code==1) { console.log(response.data)
          $('select.id_area').html(response.data);
        }
      },
      complete: function() {
        //hideLoader();
      }
    });
  }
});

$(document).on('change', '.id_area', function (e) {
  var idarea = parseInt($(this).val());
  idarea = (idarea>0) ? (idarea) : (0);

  
  $('.id_ubicacion').html('');
  if(idarea>0)
  {
    $.ajax({
      url: $('base').attr('href') + 'ubicacion/cbox_ubi',
      type: 'POST',
      data: 'id_area='+idarea,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
        if (response.code==1) {
          $('.id_ubicacion').html(response.data);
        }
      },
      complete: function() {
        //hideLoader();
      }
    });
  }
});
