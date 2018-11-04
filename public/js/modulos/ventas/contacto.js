$(document).on('click', '#cont_celu', function (e) {
  add_op('celuu','cel');          
});

$(document).on('click', '#cont_tele', function (e) {
  add_op('tele','tel');                 
});

function add_op(div,tip)
{
  var ord = ($("#div_"+div+" .form-group").length>0) ? ($("#div_"+div+" .form-group:last").attr('orden')) : (0);
  ord = parseInt(ord)+1;
  var i = 0;
  var tipo = 'add_operador'+tip;
  var txt = (tip=='cel') ? ('Celular') : ('Teléfono');
  $( "#div_"+div+" .form-group select" ).each(function( index ) {
    i = ($(this).val() == "") ? (i+1) : (i);
  });

  $( "#div_"+div+" .form-group input" ).each(function( index ) {
    i = ($(this).val() == "") ? (i+1) : (i);
  });
  if(i == 0)
  {
    add_operador('tipo='+tipo+'&orden='+ord, 'div_'+div);
  }
  else
  {
    alerta('Completar!','Tiene que Completar el # de '+txt,'error');
  }
}