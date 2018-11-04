$(document).on('click', '#myTab li.tab a, .breadcrumb li a', function (e) {
    var padre = $(this);
    var va = padre.parents('li').attr('tabs');
    var actual = $('#myTab li.active a').parents('li').attr('tabs');

    var validar = validar_tabs(va);
    if(validar!='')
    {
        salidaformulario(validar, va);
    }        
});

$(document).on('click', '#miTab li.tab a', function (e) {
    var padre = $(this);
    var va = 'ventas/'+padre.parents('li').attr('tabs');
    var validar = validar_tabs(va); //console.log(va); console.log(actual); console.log(validar); return false;
    
	if(validar!='')
	{
        va = 'ventas/'+va;
		salidaformulario(validar, va);
	}
});