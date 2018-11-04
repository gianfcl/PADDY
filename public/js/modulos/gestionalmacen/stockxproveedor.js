$(document).ready(function()
{
  $("#buscarstxpro").modal("show");

});

$(document).on('click', '.buscar', function (e)
{
  var url = $('#linkmodulo').val();
  var idalmacen = parseInt($('#id_almacen').val());
  var idproveedor = parseInt($('#id_proveedor').val());

  alert("hola");

  if(idalmacen>0 && idproveedor>0)
  {
    url = url+'/buscar/'+idproveedor+'/'+idalmacen;
    window.location.href = url;
  }
  else
  {
    alerta('seleccionar','Escoja Valores','error');
  }    
});

$(function () 
{
  $( "#proveedor" ).autocomplete({
    type:'POST',
    serviceUrl: $('base').attr('href')+"proveedor/buscar_proveeart",
    onSelect: function (suggestion) {
      $('#id_proveedor').val(suggestion.id_proveedor);
    }
  });
});
