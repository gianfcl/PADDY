$( document ).ready(function() {

  	$('.fecha_venc').datetimepicker({
		viewMode: 'years',
		format: 'DD-MM-YYYY',
		locale: moment.locale("es")
	});
});

$(document).on('focusout', '.fecha_experacion', function (e) {
	var padre = $(this);
	var txtf = padre.val();
	var papi = padre.closest('tr').find('td.suestado select.estado');
	var estado = parseInt(papi.val());
	estado = (estado>0) ? (estado) : (1);
	if(txtf.trim().length && estado==2)
	{
		$(this).removeClass('erroinput');
		papi.removeClass('erroinput');
	} else {
		$(this).addClass('erroinput');
		papi.addClass('erroinput');
	}
});

$(document).on('change', 'select.estado', function (e) {
    var padre = $(this);
    var id = parseInt(padre.val());
    id = (id>0) ? (id) : (0);
    var papi = padre.closest('tr');
    var ven = parseInt(papi.attr('vence'));
    ven = (ven>0) ? (ven) : (1);
    var fech = "";
    var txtf = "";
    console.log('id->'+id+' ven->'+ven);
    papi = padre.closest('tr');
    if(id>0)
    {
    	padre.removeClass('erroinput');    	
    	if(id==2)
    	{    		
			if(ven==2)
	    	{
	    		fech = papi.find('td.fecha input.fecha_experacion');
	    		fech.prop( "disabled", false );
	    		txtf = fech.val();
	    		if(txtf.trim().length)
	    		{
	    			fech.removeClass('erroinput');
	    		}
	    		else
	    		{
	    			fech.addClass('erroinput');
	    		}
	    	}
    	}
    	else
    	{
    		if(id==3)
			{
				console.log('aqui');
				if(ven==2)
		    	{ 
		    		fech = papi.find('td.fecha input.fecha_experacion');
		    		fech.val('');
		    		fech.prop( "disabled", true );
		    		fech.removeClass('erroinput');
		    	}
			}    		
    	}	    	  	
    }
    else
    {
    	padre.addClass('erroinput');
    	if(ven==2)
    	{
    		fech = papi.find('td.fecha input.fecha_experacion');
    		fech.val('');
    		fech.prop( "disabled", true );
    		fech.removeClass('erroinput');
    	}
    }
    
});


$(document).on('click', 'button.guardar', function (e) {
    var idsucursal = parseInt($(this).attr('idsucursal'));
    idsucursal = (idsucursal>0) ? (idsucursal) : (0);
    if(idsucursal>0)
    {
    	var estado = 0;
    	var fecha = "";
    	var padre = "";
    	var ven = 1;
    	var papi = "";
    	var i = 0;
    	$('#form_save_req_'+idsucursal+' select').each(function (index, value){
    		padre = $(this);
    		estado = parseInt(padre.val());
    		ven = parseInt(padre.closest('tr').attr('vence'));
    		papi = padre.closest('tr');
    		if(estado>0)
    		{
    			padre.removeClass('erroinput');
    			if(estado==2)
    			{
    				if(ven==2)
    				{
						fech = papi.find('td.fecha input.fecha_experacion');
						fech.prop( "disabled", false );
						fecha = fech.val()
						if(fecha.trim().length) { 
							fech.removeClass('erroinput');
							padre.removeClass('erroinput');
						} else {
							fech.addClass('erroinput');
							padre.addClass('erroinput');
							i++;
						}
    				} else {
    					padre.removeClass('erroinput');
    				}
    			} else {
    				if(estado==3) {
    					if(ven==2) {
	    					fech = papi.find('td.fecha input.fecha_experacion');
							padre.removeClass('erroinput');
		    				fech.prop( "disabled", true );
	    				}
    				}	    					    				
    			}
    		} else {
    			padre.addClass('erroinput');
    			if(ven==2)
		    	{
		    		fech = papi.find('td.fecha input.fecha_experacion');
		    		fech.val('');
		    		fech.prop( "disabled", true );
		    		fech.removeClass('erroinput');
		    	}
    			i++;
    		}
    	});

    	if(i>0)
    	{
    		alerta('Error!','Verificar Antes de Guardar','error');
    	}
    	else
    	{
    		$.ajax({
			    url: $('base').attr('href') + 'personal/save_requisitos',
			    type: 'POST',
			    data: $('#form_save_req_'+idsucursal).serialize(),
			    dataType: "json",
			    beforeSend: function() {
			        //showLoader();
			    },
			    success: function(response) {
			      if (response.code==1) {
			      	var id=$('#id_personal').val();
			        var tipo = $('#myTab li.active').attr('tabs');
			        var url = $('base').attr('href') +'personal/edit/'+id+'/'+tipo;        
			        window.location.href = url;       
			      }
			    },
			    complete: function() {			      
			    }
			});
    	}
    }
});

$(document).on('click', 'button.guardargeneral', function (e) {
	var idpes = parseInt($('#id_personal').val());

	idpes = (idpes>0) ? (idpes) : (0);
	if(idpes>0)
	{
		var estado = 0;
    	var fecha = "";
    	var padre = "";
    	var ven = 1;
    	var papi = "";
    	var i = 0;
    	$('#form_save_req_gene select').each(function (index, value){
    		padre = $(this);
    		estado = parseInt(padre.val());
    		ven = parseInt(padre.closest('tr').attr('vence'));
    		papi = padre.closest('tr');
    		if(estado>0)
    		{
    			padre.removeClass('erroinput');
    			if(estado==2)
    			{
    				if(ven==2)
    				{
						fech = papi.find('td.fecha input.fecha_experacion');
						fech.prop( "disabled", false );
						fecha = fech.val()
						if(fecha.trim().length) { 
							fech.removeClass('erroinput');
							padre.removeClass('erroinput');
						} else {
							fech.addClass('erroinput');
							padre.addClass('erroinput');
							i++;
						}
    				} else {
    					padre.removeClass('erroinput');
    				}
    			} else {
    				if(estado==3) {
    					if(ven==2) {
	    					fech = papi.find('td.fecha input.fecha_experacion');
							padre.removeClass('erroinput');
		    				fech.prop( "disabled", true );
	    				}
    				}	    					    				
    			}
    		} else {
    			padre.addClass('erroinput');
    			if(ven==2)
		    	{
		    		fech = papi.find('td.fecha input.fecha_experacion');
		    		fech.val('');
		    		fech.prop( "disabled", true );
		    		fech.removeClass('erroinput');
		    	}
    			i++;
    		}
    	});

    	if(i>0)
    	{
    		alerta('Error!','Verificar Antes de Guardar','error');
    	}
    	else
    	{
    		$.ajax({
			    url: $('base').attr('href') + 'personal/save_requisitosgeneral',
			    type: 'POST',
			    data: $('#form_save_req_gene').serialize(),
			    dataType: "json",
			    beforeSend: function() {
			        //showLoader();
			    },
			    success: function(response) {
			      if (response.code==1) {
			      	var id=$('#id_personal').val();
			        var tipo = $('#myTab li.active').attr('tabs');
			        var url = $('base').attr('href') +'personal/edit/'+id+'/'+tipo;        
			        window.location.href = url;       
			      }
			    },
			    complete: function() {			      
			    }
			});
    	}
	}
});

/*Validar Al Salir del Formulario*/
$(document).on('click', '#myTab li.tab a, .breadcrumb li a', function (e) {
    var url = $(this).attr('url');
    window.location.href = url;       
});
/*<---->*/