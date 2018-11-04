$(document).ready(function() {
  $('#filtro').modal('show');
});
  
$(document).on('click', '.buscar', function () {
  var id_grupo = $('#grupos_busc').val();
  var id_familia = $('#familia_busc').val();
  var id_subfamilia = $('#subfamilia_busc').val();

  var param = '';
  if(id_grupo)
  {
    param += '&grupo_busc='+id_grupo;
  }
  if(id_familia)
  {
    param += '&familia_busc='+id_familia;
  }
  if(id_subfamilia)
  {
    param += '&subfamilia_busc='+id_subfamilia;
  }
  console.log( $('base').attr('href') + 'cantidaprodpadrexinsumo/buscar');
  $.ajax({
    url: $('base').attr('href') + 'cantidadprodpadrexinsumo/buscar',
    type: 'POST',
    data: param,
    dataType: "json",
    beforeSend: function() {
      $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
    },
    success: function(response) {
      if (response.code==1) {
        $('#bodyindex').html(response.data);
        $('#filtro').modal('hide');
      }
      else
      {
        alerta('Error!', 'Hubo un error interno!!', 'error');
      }
    },
    complete: function() {
      $.LoadingOverlay("hide");
    }
  });
});

$(document).on('change','#grupos_busc',function(){
  var active_tab = $('.tabs_pan ul li.active').attr('tabs');
  console.log(active_tab);
  if(active_tab !== 'grupo')
  {
    var ids = $(this).val();
    console.log(ids);

    $.ajax({
      url: $('base').attr('href') + 'comprasxarticulo/buscar_famxgrupos',
      type: 'POST',
      data: 'id_grupo='+ids,
      dataType: "json",
      beforeSend: function() {
        $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
      },
      success: function(response) {
        if (response.code==1) 
        {
          console.log(response.data);
          $('#familia_busc').html(response.data);
          $('#subfamilia_busc').html('');
          $('#familia_busc').selectpicker('refresh');
          $('#subfamilia_busc').selectpicker('refresh');
        }
      },
      complete: function() {
        $.LoadingOverlay("hide");
      }
    });
  }
});

$(document).on('change','#familia_busc',function(){
  var active_tab = $('.tabs_pan ul li.active').attr('tabs');
  console.log(active_tab);
  if(active_tab !== 'familia' && active_tab !== 'grupo')
  {
    var ids = $(this).val();
    console.log(ids);

    $.ajax({
      url: $('base').attr('href') + 'comprasxarticulo/buscar_subfamxfam',
      type: 'POST',
      data: 'id_familia='+ids,
      dataType: "json",
      beforeSend: function() {
        $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
      },
      success: function(response) {
        if (response.code==1) 
        {
          $('#subfamilia_busc').html(response.data);
          $('#subfamilia_busc').selectpicker('refresh');
        }
      },
      complete: function() {
        $.LoadingOverlay("hide");
      }
    });
  }
});

$(document).on('click','.limpiar',function(){

});