$(document).on('change', '#id_sucursal', function (e)
{
	var padre = $(this);
	var id_su = parseInt(padre.val());
	id_su = (id_su>0) ? (id_su) : ("");
	var url = $('#linkmodulo').val()+'/buscar';
	if(id_su>0)
	{
		url = url+'/'+id_su;
	}
	window.location.href = url;
});

$(document).on('change', '#id_areapuesto', function (e)
{
	var padre = $(this);
	var id_su = parseInt($('#id_sucursal').val());
	id_su = (id_su>0) ? (id_su) : ("");

	var idarea = parseInt(padre.val());
	idarea = (idarea>0) ? (idarea) : ("");

	var url = $('#linkmodulo').val()+'/buscar';
	if(id_su>0)
	{
		url = url+'/'+id_su;
		if(idarea>0)
		{
			url = url+'/'+idarea;
		}
	}
	window.location.href = url;
});

$(document).on('change', '#id_puesto', function (e)
{
	var padre = $(this);
	var id_su = parseInt($('#id_sucursal').val());
	id_su = (id_su>0) ? (id_su) : ("");

	var idarea = parseInt($('#id_areapuesto').val());
	idarea = (idarea>0) ? (idarea) : ("");

	var idpuesto = parseInt(padre.val());
	idpuesto = (idpuesto>0) ? (idpuesto) : ("");

	var url = $('#linkmodulo').val()+'/buscar';
	if(id_su>0)
	{
		url = url+'/'+id_su;
		if(idarea>0)
		{
			url = url+'/'+idarea;
		}
		if(idpuesto>0)
		{
			url = url+'/'+idpuesto;
		}
	}
	window.location.href = url; 
});