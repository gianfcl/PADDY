
$(document).on('click', '#pagina_data_buscar li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');

  buscar_articulos(page);
});

$(document).on('click', '#pagina_data_buscar a.paginate_button', function (e) {  
  var page = $(this).attr('tabindex');
  buscar_articulos(page);
});

$(document).on('click', '#buscar_arti a.buscar', function (e) {  
  var page = 0;

  buscar_articulos(page);
});

function buscar_articulos(page)
{
  var codigo_busc = $('#codigo_busc').val();
  var descripcion_busc = $('#descripcion_busc').val();
  var temp = "page="+page;

  if(codigo_busc.trim().length)
  {
    temp=temp+'&codigo_busc='+codigo_busc; //console.log(codigo_busc);
  }
  if(descripcion_busc.trim().length)
  {
    temp=temp+'&descripcion_busc='+descripcion_busc; //console.log(descripcion_busc);
  }

  $.ajax({
    url: $('base').attr('href') + 'produccionsubproducto/buscar_articulos',
    type: 'POST',
    data: temp,
    dataType: "json",
    beforeSend: function() {
      //showLoader();
    },
    success: function(response) {
      if (response.code==1) {
        $('#buscar_arti tbody').html(response.data.rta);
        $('#pagina_data_buscar').html(response.data.paginacion);
      }
    },
    complete: function() {
        //hideLoader();
    }
  });      
}

$(document).on('click', '.add_articulos', function (e) {
  var page = 0;
  buscar_articulos(page);
});

$(document).on('click', '.add_arti', function (e)
{
  var padre = $(this).parents('tr');
  var id_art_sucursal = padre.attr('idartsucursal');

  var contr = $('#controller').val();  
  var clas = (contr=="produccionsubproducto") ? ("add") : ("add_produccionsubproducto");
  
  contr = contr+'/'+clas+'/'+id_art_sucursal;
  if($('#ol').size())
  {
    var ol = parseInt($('#ol').val());
    contr = (ol>0) ? (contr+'/'+ol) : (contr);    
  }
  window.location.href = $('base').attr('href') +contr;
});