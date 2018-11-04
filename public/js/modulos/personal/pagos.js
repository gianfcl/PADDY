$( document ).ready(function() {
  $.validator.addMethod("formespn",
    function(value, element) {
      if(value.trim().length)
        return /^(0?[1-9]|[12]\d|3[01])[\.\/\-](0?[1-9]|1[012])[\.\/\-]([12]\d)?(\d\d)$/.test( value );
      else
        return false;
  }, "Corregir");

 	$('#form_save_sueldo').validate({
	    rules: 
	    {
			sueldo: { required:true},
			fecha_inicio_trabajo:{formespn:true},
			fecha_fin_trabajo:{formespn:true}
	    },
	    messages: 
	    {
			sueldo: { required:"Ingresar Sueldo" }
	    },
	    highlight: function(element) {
	        $(element).closest('.form-group').addClass('has-error');       
	    },
	    unhighlight: function(element) {
	        $(element).closest('.form-group').removeClass('has-error');
	    },
	    errorElement: 'span',
	    errorClass: 'help-block',
	    errorPlacement: function(error, element) 
	    {
	      if(element.parent('.col-md-6').length) { error.insertAfter(element.parent()); }
	      else {}
	    },
	    submitHandler: function() {
			$.ajax({
				url: $('base').attr('href') + 'personal/save_sueldo',
				type: 'POST',
				data: $('#form_save_sueldo').serialize(),
				dataType: "json",
				beforeSend: function() {
					
				},
				success: function(response) {
					if(response.code=="1")
					{
						var id_personal = $('#id_personal').val();
						var tipo = $('#myTab li.active').attr('tabs');
						var contr = $('#url_modulo').val();
				        var url = $('base').attr('href') +contr+'/edit/'+id_personal+'/'+tipo;        
				        //console.log(url);
				        window.location.href = url;
					}
				}
			});
	    }
   });

	$('#fecha_ini').datetimepicker({
		viewMode: 'years',
		format: 'DD-MM-YYYY',
		locale: moment.locale("es"),
		maxDate: moment().add(30, 'days') 
	});

	$('#fecha_fin').datetimepicker({
		viewMode: 'years',
		format: 'DD-MM-YYYY',
		locale: moment.locale("es") 
	});
});

$(function () {
  
});

$(document).on('hidden.bs.modal', '#editsueldo', function (e)
{
  limp_todo('form_save_sueldo');
});

$(document).on('click', '.btn_cancel', function (e)
{
    limp_todo('form_save_sueldo');
});


$(document).on('change', '.idpersonalsucursal', function (e) {
	var padre = $(this);

	var estado = (padre.is(':checked')) ? ("1"): ("0");
	estado = parseInt(estado);
	var idpersonalsucursal = padre.attr('idpersonalsucursal');
	var idsucursal = padre.attr('idsucursal');
	var idpersonal = $('#id_personal').val();

	var temp = 'id_personal='+idpersonal+'&id_sucursal='+idsucursal+'&id_personalsucursal='+idpersonalsucursal+'&estado='+estado;
	$.ajax({
		url: $('base').attr('href') + 'personal/save_prnl_sucu',
		type: 'POST',
		data: temp,
		dataType: "json",
		beforeSend: function() {
		 	//showLoader();
		},
		success: function(response) {
			if (response.code==1) {
				if(estado>0)
				{
					$('#sucup_'+idsucursal).removeClass('collapse');
					if($('#sucupe_'+idsucursal).length) {
						if($('#sucup_'+idsucursal+' tr td.orden').length) {
							$('#sucupe_'+idsucursal).removeClass('collapse');
						} else {
							$('#sucupe_'+idsucursal).addClass('collapse');
						}						
					}					
				}
				else
				{
					$('#sucup_'+idsucursal).addClass('collapse');
					if($('#sucupe_'+idsucursal).length) {
						$('#sucupe_'+idsucursal).addClass('collapse');
					}					
				}
				padre.attr({'idpersonalsucursal':response.data.id});
			}                    
		},
		complete: function() {
		  	//hideLoader();
		}
	});/**/
});

$(document).on('click', '.add_sueldo', function (e) {
	limp_todo('form_save_sueldo');
	var idsucursal = parseInt($(this).closest('table').attr('idsucursal'));
	
	if(idsucursal>0)
	{
		var idpersonalsucursal = $('input#id_'+idsucursal).attr('idpersonalsucursal');
		$('#id_personalsucursal').val(idpersonalsucursal); console.log(idpersonalsucursal);
	}
});

$(document).on('click', '.edit_sueldo', function (e) {
	var idsucursal = parseInt($(this).closest('table').attr('idsucursal'));
	if(idsucursal>0)
	{
		var idpersonalsucursal = parseInt($('input#id_'+idsucursal).attr('idpersonalsucursal'));
		var idpersonalsueldo = parseInt($(this).closest('tr').attr('idpersonalsueldo'));
		if(idpersonalsucursal>0 && idpersonalsueldo>0)
		{
			$('#id_personalsucursal').val(idpersonalsucursal);
			$('#id_personalsueldo').val(idpersonalsueldo);
			$.ajax({
				url: $('base').attr('href') + 'personal/edit_sueldo',
				type: 'POST',
				data: 'id_personalsueldo='+idpersonalsueldo,
				dataType: "json",
				beforeSend: function() {
					
				},
				success: function(response) {
					if(response.code=="1")
					{
						$('#id_personalsueldo').html(response.data.id_personalsueldo);
						$('#sueldo').val(response.data.sueldo);
						$('#fecha_inicio_trabajo').val(response.data.fecha_inicio_trabajo);
						$('#fecha_fin_trabajo').val(response.data.fecha_fin_trabajo);
					}
				}
			});
		}		
	}
});

$(document).on('click', '.delete_sueldo', function (e) {
  e.preventDefault();

  var idpersonalsueldo = parseInt($(this).parents('tr').attr('idpersonalsueldo'));  

  if(idpersonalsueldo>0)
  {
  	var nomb = "sueldo";
	  swal({
	    title: 'Estas Seguro?',
	    text: "De Eliminar este "+nomb,
	    type: 'warning',
	    showCancelButton: true,
	    confirmButtonColor: '#3085d6',
	    cancelButtonColor: '#d33',
	    confirmButtonText: 'Sí, estoy seguro!'
	  }).then(function(isConfirm) {
	    if (isConfirm) {     
	      $.ajax({
	        url: $('base').attr('href') + 'personal/save_sueldo',
	        type: 'POST',
	        data: 'id_personalsueldo='+idpersonalsueldo+'&estado=0',
	        dataType: "json",
	        beforeSend: function() {
	            //showLoader();
	        },
	        success: function(response) {
	            if (response.code==1) {
	                var id_personal = $('#id_personal').val();
					var tipo = $('#myTab li.active').attr('tabs');
					var contr = $('#url_modulo').val();
					var url = $('base').attr('href') +contr+'/edit/'+id_personal+'/'+tipo;        
					//console.log(url);
					window.location.href = url;
	            }
	        },
	        complete: function() {
	          var text = "Elimino!";
	          alerta(text, 'Esta '+nomb+' se '+text+'.', 'success');
	        }
	      });
	    }
	  }); 
  }
	    
});


/*Validar Al Salir del Formulario*/
$(document).on('click', '#myTab li.tab a, .breadcrumb li a', function (e) {
    var url = $(this).attr('url');
    window.location.href = url;       
});
/*<---->*/