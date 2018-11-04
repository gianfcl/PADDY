$(document).on('click', '.clickevent', function (e) {
	var tos = $(this);
	var es = parseInt(tos.attr('estado'));
	es = es > 0 ? es : 0;
	var op = tos.find('h2').attr('op');
	var url = 'ordendeproduccionop';
	var text = 'Crear y Liberar OP';
	switch(es)
	{
		case 8:
		case 9:
		case 10:
		break;

		case 11:
		url = 'produccionop';
		text = 'Producciones Terminadas';
		break;

		default:
		break;
	}
	url = $('base').attr('href') +url+'/ver_documento/'+op;
	swal({
    title: 'Estas Seguro?',
    text: "Ir a  "+text,
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, estoy seguro!'
  }).then(function(isConfirm) {
    if (isConfirm) {     
      //window.location.href = $('base').attr('href') +url+'/ver_documento/'+op;
      window.open(url,'_blank');
    }
  });
	
  
});