$(document).on('change', '#id_almacen', function (e)
{
  var padre = $(this);
  var id_al = parseInt(padre.val());
  var url = $('#linkmodulo').val();
  if(id_al>0)
  {
    window.location.href = url+'/buscar/'+id_al;
  }
  else
  {
    alerta('No Busco', 'Tiene que seleccionar', 'error'); 
  }
    
});
