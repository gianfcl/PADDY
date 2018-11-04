$(document).on('click', '.buscar', function (e)
{
  var url = $('#linkmodulo').val();
  var idalmacen = parseInt($('#id_almacen').val());
  var idtipo = $('ul#myTab li.active a').attr('id'); console.log(idtipo);
  idtipo = idtipo.replace("-tab","");

  if(idalmacen>0)
  {
    url = url+'/buscar/'+idalmacen+'/'+idtipo;
    switch(idtipo)
    {
      case 'zona':
        var idzona = parseInt($('#id_zona').val());
        idzona = (idzona>0) ? (idzona) : ('-');

        var idarea = parseInt($('#id_area').val());
        idarea = (idarea>0) ? (idarea) : ('-');

        var idubi = parseInt($('#id_ubicacion').val());
        idubi = (idubi>0) ? (idubi) : ('-');

        url = url+'/'+idzona+'/'+idarea+'/'+idubi;
      break;

      case 'grupo':
        var idgrupo = parseInt($('#id_grupo').val());
        idgrupo = (idgrupo>0) ? (idgrupo) : ('-');

        var idfamilia = parseInt($('#id_familia').val());
        idfamilia = (idfamilia>0) ? (idfamilia) : ('-');

        var idusub = parseInt($('#id_subfamilia').val());
        idusub = (idusub>0) ? (idusub) : ('-');

        url = url+'/'+idgrupo+'/'+idfamilia+'/'+idusub;
      break;

      default:
      break;
    }
    //alerta(url);
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

$(document).on('change', '.id_grupo', function (e) {
  var idgrupo = parseInt($(this).val());
  idgrupo = (idgrupo>0) ? (idgrupo) : (0);
  
  $('.id_familia').html('');
  $('.id_subfamilia').html('');
  if(idgrupo>0)
  {
    $.ajax({
      url: $('base').attr('href') + 'familia/cbox_familia',
      type: 'POST',
      data: 'id_grupo='+idgrupo,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
        if (response.code==1) { console.log(response.data)
          $('select.id_familia').html(response.data);
        }
      },
      complete: function() {
        //hideLoader();
      }
    });
  }
});

$(document).on('change', '.id_familia', function (e) {
  var idfamilia = parseInt($(this).val());
  idfamilia = (idfamilia>0) ? (idfamilia) : (0);

  
  $('.id_subfamilia').html('');
  if(idfamilia>0)
  {
    $.ajax({
      url: $('base').attr('href') + 'subfamilia/cbox_subfamilia',
      type: 'POST',
      data: 'id_subfamilia='+idfamilia,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
        if (response.code==1) {
          $('.id_subfamilia').html(response.data);
        }
      },
      complete: function() {
        //hideLoader();
      }
    });
  }
});