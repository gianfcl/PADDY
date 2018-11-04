$( document ).ready(function() {

  $('#filtro').modal('show');
  $('#frecuencia_busc option').each(function(index,value,){
    if($(this).val()>0)
    {
      $(this).prop('selected',true);
    }
  });
});

$(document).on('change','#grupos_busc',function(){
  var id = $(this).val();

  if(id>0)
  {
    
    $.ajax({
      url: $('base').attr('href') + 'familia/cbx_familia',
      type: 'POST',
      data: 'id_grupo='+id,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
          if (response.code==1) {
            $("#subfamilia_busc").html('');
            $("#familia_busc").html(response.data);
          }
      },
      complete: function() {
          //hideLoader();
      }
    });
  }
});

$(document).on('change','#familia_busc',function(){
  var id = $(this).val();
   $("#subfamilia_busc").html('');
  if(id>0)
  {
    $.ajax({
      url: $('base').attr('href') + 'subfamilia/cbox_subfamilia',
      type: 'POST',
      data: 'id_familia='+id,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
        if (response.code==1) {
          $("#subfamilia_busc").html(response.data);
        }
      },
      complete: function() {
          //hideLoader();
      }
    });
  }
});

$(document).on('click','.buscar',function(){
  $('#lista_articulos_info').html("");
  if($('#almacen_busc').val())
  {
    var id_almacen = $('#almacen_busc').val();
    data ="id_almacen="+id_almacen;

    var id_grupo = $('#grupos_busc').val();
    var id_familia = $('#familia_busc').val();
    var id_subfamilia = $('#subfamilia_busc').val();
    var id_zona = $('#zona_busc').val();
    var id_area = $('#area_busc').val();
    var id_ubicacion = $('#ubicacion_busc').val();
    var id_frecuencia = $('#frecuencia_busc').val();
    var null_values = $('#null_values').is(':checked')
    if(null_values==true)
    {
      data = data + "&null_values="+null_values;
    }
    if(id_frecuencia)
    {
      data = data + "&id_frecuencia="+id_frecuencia;
    }
    if(parseInt(id_subfamilia)>0)
    {
       data = data + "&id_subfamilia="+id_subfamilia;
    }
    if(parseInt(id_familia)>0)
    {
       data = data + "&id_familia="+id_familia;
    }
    if(parseInt(id_grupo)>0)
    {
       data = data + "&id_grupo="+id_grupo;
    }
    if(parseInt(id_zona)>0)
    {
       data = data + "&id_zona="+id_zona;
    }
    if(parseInt(id_area)>0)
    {
       data = data + "&id_area="+id_area;
    }
    if(parseInt(id_ubicacion)>0)
    {
       data = data + "&id_ubicacion="+id_ubicacion;
    }

    $.ajax({
      url: $('base').attr('href') + 'ultimafechainv/buscar_registros',
      type: 'POST',
      data: data,
      dataType: "json",
      beforeSend: function() {
        $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
      },
      success: function(response) {
        if (response.code==1) 
        {
          $('#table table tbody').html(response.data.data);
          $('#lista_articulos_info').html(response.data.n +" Registros Encontrados");
          $('#filtro').modal('hide');
        }
        else
        {
          alerta('No se encontraron datos! ','Revise sus filtros.','info');
        }
      },
      complete: function() {
        $.LoadingOverlay("hide");
      }
    });
  }
  else
  {
    alerta('Error!','Seleccione Almacen','error');
  }
});

$(document).on('click','.limpiar',function(){
  $('#almacen_busc').val('');
  $('#grupos_busc').val('');
  $('#familia_busc').html('');
  $('#subfamilia_busc').html('');
  $('#zona_busc').val('');
  $('#area_busc').html('');
  $('#ubicacion_busc').html('');
});

$(document).on('change','#zona_busc',function(){
  var id_zona = $(this).val();
  $('#ubicacion_busc').html('');
  if(id_zona)
  {
    $.ajax({
      url: $('base').attr('href') + 'evoxajusteunid/cbx_area',
      type: 'POST',
      data: 'id_zona='+id_zona,
      dataType: "json",
      beforeSend: function() {
        //showLoader();
      },
      success: function(response) {
        if (response.code==1) 
        {
          $('#area_busc').html(response.data);
        }
      },
      complete: function() {

      }
    }); 
  }
});

$(document).on('change','#area_busc',function(){
  var id_area = $(this).val();
  $('#ubicacion_busc').html('');
  if(id_area)
  {
    $.ajax({
      url: $('base').attr('href') + 'evoxajusteunid/cbx_ubi',
      type: 'POST',
      data: 'id_area='+id_area,
      dataType: "json",
      beforeSend: function() {

      },
      success: function(response) {
        if (response.code==1) 
        {
          $('#ubicacion_busc').html(response.data);
        }
      },
      complete: function() {

      }
    }); 
  }
});