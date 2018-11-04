$( document ).ready(function() {

	$.validator.addMethod("fechaestric", function(value, element) {
		var exp = value; //console.log(value);
		if(exp.trim().length)
			return /^(0?[1-9]|[12]\d|3[01])[\.\/\-](0?[1-9]|1[012])[\.\/\-]([12]\d)?(\d\d)\s(0[0-9]|1[0-2]):[0-5][0-9]\s(AM|am|PM|pm)$/.test(value);
		else
			return false;
		}, "Ingrese una fecha válida.");

	jQuery.validator.setDefaults({
		debug: true,
		success: "valid",
		ignore: ""
	});

	$('#form_save_reserva').validate({
		rules:
		{
			id_canalrecepcion : { required : true },
			cant_adultos : { required : true },
			id_tipoevento : { required : true },
			id_sucursal : { required : true},
			name_cliente_aut : { required : true },   
			fecha_de_reserva : { fechaestric : true },
		},
		messages: 
		{
			id_canalrecepcion : { required : "Seleccione un canal de recepcion" },
			cant_adultos : { required : "" },
			id_tipoevento : { required : "Seleccione el tipo de evento" },
			id_sucursal : { required : "Seleccione una sucursal"},
			name_cliente_aut : { required : "" }
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
				error.insertAfter(element.parent()); 
		},
		submitHandler: function() {
			$.ajax({
				url: $('base').attr('href') + 'reserva/save_reserva',
				type: 'POST',
				data: $('#form_save_reserva').serialize(),
				dataType: "json",
				beforeSend: function() {
					//showLoader();
				},
				success: function(response) {
											
				},
				complete: function() {
					var id_reserva = parseInt($('#id_reserva').val());
					id_reserva = (id_reserva>0) ? (id_reserva) : ("0");
					var text = (id_reserva==0) ? ("Guardo!") : ("Edito!");
					swal({
						title : text,
						text: 'Esta reserva se '+text+'.',
						type: 'success',
						confirmButtonText: 'Listo!',
					}).then(function () {
  					redireccionar();
  				});
				}
			});
		}
	});

	// funcionalidad JS del boton mostrar observacion del campo infoWeb en tabla reserva   

function limpiar_modal_coment(){
  $('#id_info_web').val('');
  $('#coment_ptosegui').val('');
}

	$(document).on('click','.add_comenta', function(e){
  limpiar_modal_coment();
  var indice_t = $(this).parents('tr').prop('id');
  var indice_n = indice_t.substring(9,indice_t.length);
  $('#id_info_web').val(indice_n);
  console.log(indice_n);
  var coment = $(this).parents('td').find('input[type="hidden"]').val();
  if(coment){
  $('#coment_ptosegui').val(coment);
   }
});
	
	$("#div_fecha_de_reserva").on("dp.change", function (e) { 
		//alert("entra al evento");
		if (parseInt($('#anulador').val()) > 0 && $('#anulador').val().length) {}
		else{
			var id_reserva = parseInt($('input[name="id_reserva"]').val());
			//alert("entra al else");
			var param = "";
			var id_sucursal_delareserva = $('#sucursal_pedido').val();
			var sucursal_combo_seleccionado = $('#id_sucursal').val();
			//alert(sucursal_combo_seleccionado);

			var id_sucursal = sucursal_combo_seleccionado;
			param = param + "id_sucursal="+id_sucursal;

			if (sucursal_combo_seleccionado == id_sucursal_delareserva && id_reserva>0) {
				id_zonam=$('#input_zona_prefe').val();
				param = param + "&id_zonam="+id_zonam;
				var fecha = $('#fecha_de_reserva').val();
			}
			else{
				var fecha = moment(e.date).isoWeekday();
			}
			param = param + "&fecha="+fecha;  
			//alert(id_sucursal); 
			//alert(fecha);  
			$.ajax({
				url: $('base').attr('href') + 'reserva/get_chekzonas',
				type: 'POST',
				data: param,
				dataType: "json",
				beforeSend: function() {
					//showLoader();
				},
				success: function(response) {
					if (response.code==1) {
						$('#zona_prefe').html(response.data);
					}
				},
				complete: function() {
				}
			});
		}
		$('#anulador').val('');  
	});

	var id_tipoevento = $('#id_tipoevento').val();
	if(id_tipoevento==0){}
	else{
		$('#xdd').removeClass('hidden');
	}

	$('#div_fecha_de_reserva').datetimepicker({
			sideBySide: true,
			useCurrent: false,
			format: 'DD-MM-YYYY HH:mm A',
			locale: moment.locale("es"),
			//minDate: moment()
	});

	$(function() {
		$('input[name="daterange"]').daterangepicker({
			singleDatePicker: true,
			showDropdowns: true,
			locale : moment.locale('es'),
			format: 'DD-MM-YYYY',
		});
	});
	
	$(function () {
		$('#hora_reserva_busc').datetimepicker({
			format: 'LT'
		});
	});

	$(function () {
		$('#hora_recepcion_busc').datetimepicker({
			format: 'LT'
		});
	});
});

 

$(document).on('change', '#id_sucursal', function (e){
	var id_reserva = parseInt($('input[name="id_reserva"]').val());
	var id_sucursal_delpedido = $('#sucursal_pedido').val();
	var sucursal_combo_seleccionado = $('#id_sucursal').val(); 
	var paramcanal = "";
	var paramserv_g = "";
	if (sucursal_combo_seleccionado == id_sucursal_delpedido && id_reserva>0) {
		$('#checklist_serviciosol').html('');
		$('#zona_prefe').html('');
		$('#fecha_de_reserva').val($('#fecha_de_reserva').attr('value'));
		var fecha = $('#fecha_de_reserva').val();
		$('#div_fecha_de_reserva').trigger('dp.change');
		
		paramcanal = paramcanal + "&id_sucursal="+sucursal_combo_seleccionado;
		paramcanal = paramcanal + "&id_canalrecepcion="+$('#canal_recepcion_db').val();
	}
	else{
		$('#fecha_de_reserva').val('');
		$('#zona_prefe').html('');
		$('#checklist_serviciosol').html('');
		$('#id_tipoevento').html('');
		$('#id_canalrecepcion').val('');
		
		paramcanal = paramcanal + "&id_sucursal="+sucursal_combo_seleccionado;
		paramserv_g = paramserv_g + "&id_sucursal="+sucursal_combo_seleccionado; 
	}

	
	$.ajax({
		url: $('base').attr('href') + 'canalrecepcion/combox_canalrecepcion',
		type: 'POST',
		data: paramcanal,
		dataType: "json",
		beforeSend: function() {
			//showLoader();
		},
		success: function(response) {
			if (response.code==1) {
				$('#id_canalrecepcion').html('');
				$('#id_canalrecepcion').html(response.data);
			}
		},
		complete: function() {
			}
	});

	$.ajax({
		url: $('base').attr('href') + 'serviciosol/checkbox_serv_generales',
		type: 'POST',
		data: paramserv_g,
		dataType: "json",
		beforeSend: function() {
			//showLoader();
		},
		success: function(response) {
			if (response.code==1) {
				$('#id_canalrecepcion').html('');
				$('#id_canalrecepcion').html(response.data);
			}
		},
		complete: function() {
		}
	});

	var param = "";
	param = param + "id_sucursal="+sucursal_combo_seleccionado;
	if (sucursal_combo_seleccionado == id_sucursal_delpedido && id_reserva > 0) {
		id_tipoevento_select = $('#tipoevento_reserva').val();
		param = param +"&id_tipoevento="+id_tipoevento_select;
	}

	$.ajax({
		url: $('base').attr('href') + 'tipoevento/cbox_tipoevento',
		type: 'POST',
		data: param,
		dataType: "json",
		beforeSend: function() {
			//showLoader();
		},
		success: function(response) {
			if (response.code==1) {
				$('#id_tipoevento').html(response.data);
				$('#id_tipoevento').trigger('change');
			}
		},
		complete: function() {
		}
	});
}); 



$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
	var id = $(this).parents('tr').attr('id');
	$('#'+id).find('input[type=text]').val('');
	$('#'+id).find('input[type=hidden]').val('');
	$('#id_tipoevento_bus').val('');
	$('#id_estado_busc').val('');
	buscar_reservas(0);
});

function redireccionar (){
	var url = $('base').attr('href') +'reserva';
	$(location).attr('href',url);
}

$(document).on('click', '.cancelar_reserva', function (e) {
	swal({
		title: '¿Estas Seguro?',
		text: "¡Todos los datos se perderán!",
		
		type: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: 'Sí, salir!'
	}).then(function(isConfirm) {
		if (isConfirm) {     
			redireccionar();  
		}
	});
});

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {  
	var page = $(this).find('a').attr('tabindex');
	buscar_reservas(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
	var page = $(this).attr('tabindex');
	buscar_reservas(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
	var page = 0;
	buscar_reservas(page);
});

function buscar_reservas(page)
{ 
	var cliente_busc_id = $('#cliente_busc_id').val();
	var cantper_busc = $('#cantper_busc').val();
	var receptor_busc_id = $('#receptor_busc_id').val();
	var id_tipoevento_bus = $('#id_tipoevento_bus').val();
	var id_estado_busc = $('#id_estado_busc').val();
	var fecha_reserva_busc2 = $('input[name="daterange"]').val();
	var hora_reserva_busc = $('#hora_reserva_busc').val();
	var hora_recepcion_busc = $('#hora_recepcion_busc').val();
	var fecha_recepcion_busc = $('#fecha_recepcion_busc').val();
	var comboxsucursal_busc = $('#comboxsucursal').val();

	var temp = "page="+page;

	if(parseInt(comboxsucursal_busc)>0)
	{
		temp=temp+'&comboxsucursal_busc='+comboxsucursal_busc;
	}
	if(parseInt(id_estado_busc)>0)
	{
		temp=temp+'&id_estado_busc='+id_estado_busc;
	}
	if(parseInt(cliente_busc_id)>0)
	{
		temp=temp+'&cliente_busc_id='+cliente_busc_id;
	}
	if(parseInt(cantper_busc)>0)
	{
		temp=temp+'&cantper_busc='+cantper_busc;
	}
	if(parseInt(receptor_busc_id)>0)
	{
		temp=temp+'&receptor_busc_id='+receptor_busc_id;
	}
	if(parseInt(id_tipoevento_bus)>0)
	{
		temp=temp+'&id_tipoevento_bus='+id_tipoevento_bus;
	}
	if(fecha_reserva_busc2.trim().length>0)
	{
		temp=temp+'&fecha_reserva_busc2='+fecha_reserva_busc2;
	}
	if(hora_reserva_busc.trim().length>0)
	{
		temp=temp+'&hora_reserva_busc='+hora_reserva_busc;
	}
	if(hora_recepcion_busc.trim().length>0)
	{
		temp=temp+'&hora_recepcion_busc='+hora_recepcion_busc;
	}
	if(fecha_recepcion_busc.trim().length>0)
	{
		temp=temp+'&fecha_recepcion_busc='+fecha_recepcion_busc;
	}
	
	$.ajax({
		url: $('base').attr('href') + 'reserva/buscar_reservas',
		type: 'POST',
		data: temp,
		dataType: "json",
		beforeSend: function() {
				//showLoader();
		},
		success: function(response) {
				if (response.code==1) {
					$('#datatable-buttons tbody#bodyindex').html(response.data.rta);
					$('#paginacion_data').html(response.data.paginacion);
				}
		},
		complete: function() {
				
		}
	});
}

$(document).on('click', '.delete', function (e) {
	e.preventDefault();
	var idreserva = $(this).parents('tr').attr('idreserva');
	var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
	var nomb = "reserva";
	swal({
		title: 'Estas Seguro?',
		text: "De Anular esta "+nomb,
		type: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: 'Sí, estoy seguro!'
	}).then(function(isConfirm) {
		if (isConfirm) {     
			$.ajax({
				url: $('base').attr('href') + 'reserva/anular_reserva',
				type: 'POST',
				data: 'id_reserva='+idreserva+'&estado=3',
				dataType: "json",
				beforeSend: function() {
						//showLoader();
				},
				success: function(response) {
						if (response.code==1) {
							buscar_reservas(0);
						}
				},
				complete: function() {
					var text = "Elimino!";
					alerta(text, 'Esta '+nomb+' se '+text+'.', 'success');
					
				}
			});
		}
	});   
});

$(document).on('change', '#id_tipoevento', function (e) {
	var id_reserva = parseInt($('input[name="id_reserva"]').val());
	//alert('entro');
	//alert(parseInt($('#id_tipoevento').val()));
	var id_tipoevento1 = (parseInt($('#id_tipoevento').val())>0) ? parseInt($('#id_tipoevento').val()) : "";
	if(id_tipoevento1>0){
		
		$('#xdd').removeClass('hidden');
		var id_tipoevento = (parseInt($('#id_tipoevento').val())>0) ? parseInt($('#id_tipoevento').val()) : "";
		
	 // alert(typeof(id_tipoevento));

		id_tipoevento = (typeof(id_tipoevento) == "number" && id_tipoevento>0) ? (id_tipoevento) : (0);
		$('#checklist_serviciosol').html('');

		var temp ="";
		temp = temp +"id_tipoevento="+id_tipoevento;
		var sucursal_combo_seleccionado = $('#id_sucursal').val();
		var id_sucursal_delpedido = $('#sucursal_pedido').val();
				
		if (sucursal_combo_seleccionado == id_sucursal_delpedido && id_reserva>0) {
			var i = 0;
			var ids = new Array();
			var obs = new Array();
			$('div#db_s input[type=hidden]').each(function(index,value){
				//alert($(this).attr('class').substring(8,$(this).attr('class').length));
				obs[i] = $(this).val();
				ids[i] = parseInt($(this).attr('class').substring(8,$(this).attr('class').length));
				i++;
			})

			//ids = ids.join(',');
			ids=jQuery.makeArray(ids);
			ids=JSON.stringify(ids);
			obs=jQuery.makeArray(obs);
			obs=JSON.stringify(obs); 
			//console.log(ids);
			
			if(id_reserva>0){
			temp = temp + "&id_serviciosol="+ids+"&observaciones="+obs+"&opesp=1";
			}
		}

		if(id_tipoevento>0)
		{
			$.ajax({
				url: $('base').attr('href') + 'reserva/checks_serviciosol ',
				type: 'POST',
				data: temp,
				dataType: "json",
				beforeSend: function() {
						//showLoader();
				},
				success: function(response) {
					if (response.code==1) {
						$('#checklist_serviciosol').html(response.data.checkbox_servsoli);
						$('#checklist_serviciosol').append(response.data.div_servsoli);
					}
				},
				complete: function() {
					//hideLoader();
				}
			});
		}
	}
	else{
		
		$('#checklist_serviciosol').html('');
		$('#xdd').addClass('hidden');
	}  
});


$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {  
	var page = $(this).find('a').attr('tabindex');
	buscar_serviciosols(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
	var page = $(this).attr('tabindex');
	buscar_serviciosols(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
	var page = 0;
	buscar_serviciosols(page);
});

function buscar_serviciosols(page)
{
	var ids = new Array();
	var i = 0;
	var sucursal_combo_seleccionado = $('#id_sucursal').val();

	$('div#checklist_serviciosol input[type=checkbox]').each(function(index,value){
		//alert($(this).attr('id').substring(5,$(this).attr('id').length));
		ids[i] = $(this).attr('id').substring(5,$(this).attr('id').length);
		i++;
	})

	ids = ids.join(',');

	var serviciosol_busc = $('#serviciosol_busc').val();
	var temp = "page="+page+'&estado1=1&mostrar=1&id_sucursal='+sucursal_combo_seleccionado;

	if(serviciosol_busc.trim().length)
	{
		temp=temp+'&serviciosol_busc='+serviciosol_busc;
	}
	if(ids.trim().length)
	{
		temp= temp+'&ids_servsol='+ids;
	}  
	
	$.ajax({
			url: $('base').attr('href') + 'serviciosol/buscar_serviciosols',
			type: 'POST',
			data: temp,
			dataType: "json",
			beforeSend: function() {
					//showLoader();
			},
			success: function(response) {
					if (response.code==1) {
						$('#datatable-buttons tbody#bodyindex').html(response.data.rta);
						$('#paginacion_data').html(response.data.paginacion);
					}
			},
			complete: function() {
					//hideLoader();
			}
	});
}

$(document).on('click', '.add_serv', function (e) {

	buscar_serviciosols(0);

});


$(document).on('click', '#datatable-buttons .buscarservsol', function (e) {
	var page = 0;
	buscar_serviciosols(page);
});

$(document).on('click', 'a.addservicios', function (e) {

		$('#agregar_serv').modal('hide');
		$('#checklist_serviciosol').append("<div class='col-md-12 col-sm-12 col-xs-12' ><div class='col-md-9 col-sm-9 col-xs-9 text-center agregado_hijo'>    <input type='checkbox' class='pull-left text-center' name='serviciosol["+$(this).parents('tr').attr('idserviciosol')+"]' id='serv_"+$(this).parents('tr').attr('idserviciosol')+"' checked />"+$(this).parents('tr').find('td.sv').html()+"<input type='hidden' value='' name='Obsxserviciosol["+$(this).parents('tr').attr('idserviciosol')+"]' id='Obsxserviciosol_"+$(this).parents('tr').attr('idserviciosol')+"'></div><div class='col-md-3 col-sm-3 col-xs-3'><a class='btn btn-warning obs_servicosol btn-xs pull-right' data-toggle='modal' data-target='#agregar_obsserv'><i class='fa fa-file-text-o'></i></a></div></div>");
});

$(document).on('click', 'div.agregado_hijo', function (e) {
	$(this).parent().remove();
});

$(function () {
	$("#nombre_cliente").autocomplete({

		type:'POST',
		serviceUrl: $('base').attr('href')+"reserva/get_all_info_cliente",
		
		dataType : 'JSON',

		onSelect: function (suggestion)
		{
			
			$('#nombre_cliente').val('');

			switch(suggestion.data.tipo_persona){
				case 1:
					$('div.cont_autocompletar').html('');
					$('div.cont_autocompletar').html("<br><div class='clearfix div1guia'><label class='control-label col-md-4 col-sm-4 col-xs-12'>Razón Social: </label><div class='col-md-7 col-sm-7 col-xs-12'><input type='text' name='razon_social' value='"+suggestion.data.razon_social+"' class='form-control' disabled></div><a class='btn btn-warning btn-xs' id='edit_cliente'><i class='fa fa-eye '></i></a></div>").append("<div class='clearfix div2guia'><label class='control-label col-md-4 col-sm-4 col-xs-12'>Nombre comercial: </label><div class='col-md-7 col-sm-7 col-xs-12'><input type='text' name='nombre_comercial' value='"+suggestion.value+"' class='form-control' disabled></div></div>");
						var id_cliente = suggestion.data.id_cliente;
						var tipo_persona = suggestion.data.tipo_persona;

				 	$.ajax({
			      url: $('base').attr('href') + 'reserva/get_contacto',
			      type: 'POST',
			      data: 'id_cliente='+id_cliente+'&tipo_persona='+tipo_persona,
			      dataType: "json",
			      beforeSend: function() {
			        //showLoader();
			      },
			      success: function(response) {
			        if (response.code==1) {
								$('div.cont_autocompletar').append(response.data);
			        }
			      },
			      complete: function() {
			      }
			    });

				break;

				case 2:
					
					$('div.cont_autocompletar').html('');
					$('div.cont_autocompletar').html("<br><div class='clearfix div1guia'><label class='control-label col-md-4 col-sm-4 col-xs-12'>Nombre: </label><div class='col-md-7 col-sm-7 col-xs-12'><input type='text' name='nombre_natural' value='"+suggestion.value+"' class='form-control' disabled></div><a class='btn btn-warning btn-xs' id='edit_cliente'><i class='fa fa-eye '></i></a></div>").append("<div class='clearfix div2guia'><label class='control-label col-md-4 col-sm-4 col-xs-12'>Teléfono: </label><div class='col-md-7 col-sm-7 col-xs-12'><input type='text' name='telefono_natural' value='"+suggestion.data.telefono+"' class='form-control' disabled></div></div>").append("<div class='clearfix div3guia'><label class='control-label col-md-4 col-sm-4 col-xs-12'>Email: </label><div class='col-md-7 col-sm-7 col-xs-12'><input type='text' name='email_natural' value='"+suggestion.data.email+"' class='form-control' disabled></div></div>");

				break;
			}
			$('#name_cliente_aut').val(suggestion.data.id_cliente);
			$('#tipo_cliente_aut').val(suggestion.data.tipo_persona);
		}
	});
});

$(document).on('click', '.obs_servicosol', function (e) {
	var id_serviciosol = $(this).closest('.col-md-12').find('input[type=checkbox]').attr('id') 

	id_serviciosol = (id_serviciosol.substring(5,id_serviciosol.length));
	var serviciosol = $(this).closest('.col-md-12').find('span').text();

	//alert(id_serviciosol);
	//alert(serviciosol);
	var obs_guardada = $(this).closest('.col-md-12').find('input[type=hidden]').val();
	$('#obs_serv').val(obs_guardada);
	
	$('#id_serviciosol_modal').val(parseInt(id_serviciosol));
	$('#txt_serv').text(" - "+serviciosol);
});

$(document).on('click', '.obs_servicosol_g', function (e) {
	var id_serviciosol_g = $(this).closest('.col-md-12').find('input[type=checkbox]').attr('id') 

	id_serviciosol_g = (id_serviciosol_g.substring(7,id_serviciosol_g.length));
	
	//alert(id_serviciosol_g);
	var obs_g_guardada = $(this).closest('.col-md-12').find('input[type=hidden]').val();
	$('#obs_serv_g').val(obs_g_guardada);
	
	$('#id_serviciosol_g_modal').val(parseInt(id_serviciosol_g));
});

$(document).on('click', '.add_obsserv_textarea', function (e) {
	var Obs_modal = $('#obs_serv').val();
	var id_serviciosol = $('#id_serviciosol_modal').val();
		
	if (Obs_modal.length>0) {
				$('input#serv_'+id_serviciosol).closest('.col-md-12').find('a.obs_servicosol').removeClass('btn-warning').addClass('btn-success');
				$('input#serv_'+id_serviciosol).closest('.col-md-9').find('input#Obsxserviciosol_'+id_serviciosol).val(Obs_modal);  

				$('#id_serviciosol_modal').val('');
				$('#obs_serv').val('');

				$('#agregar_obsserv').modal('hide');
	}
	else{

		$('input#serv_'+id_serviciosol).closest('.col-md-12').find('a.obs_servicosol').removeClass('btn-success').addClass('btn-warning');
		$('input#serv_'+id_serviciosol).closest('.col-md-9').find('input#Obsxserviciosol_'+id_serviciosol).val(Obs_modal);  

		$('#id_serviciosol_modal').val('');
		$('#obs_serv').val('');
		$('#agregar_obsserv').modal('hide');
	}
	
});

$(document).on('click', '.add_obsserv_textarea_g', function (e) {
	var Obs_modal = $('#obs_serv_g').val();
	var id_serviciosol_g = $('#id_serviciosol_g_modal').val();
		
	if ((Obs_modal.trim()).length>0) {
				$('input#serv_g_'+id_serviciosol_g).closest('.col-md-12').find('a.obs_servicosol_g').removeClass('btn-warning').addClass('btn-success');
				$('input#serv_g_'+id_serviciosol_g).closest('.col-md-9').find('input#Obsxserviciosol_g_'+id_serviciosol_g).val(Obs_modal);  

				$('#id_serviciosol_g_modal').val('');
				$('#obs_serv_g').val('');
				$('#agregar_obsserv_g').modal('hide');
	}
	else{

		$('input#serv_g_'+id_serviciosol_g).closest('.col-md-12').find('a.obs_servicosol_g').removeClass('btn-success').addClass('btn-warning');
		$('input#serv_g_'+id_serviciosol_g).closest('.col-md-9').find('input#Obsxserviciosol_g_'+id_serviciosol_g).val(Obs_modal);  

		$('#id_serviciosol_g_modal').val('');
		$('#obs_serv_g').val('');
		$('#agregar_obsserv_g').modal('hide');
	}
	
});


$(document).on('click', 'div#checklist_serviciosol input[type=checkbox]', function (e) {

	if($(this).is(':checked')){
		
		$(this).parent().parent().find('a.obs_servicosol').removeClass('hidden');
	}
	
	else{

		$(this).parent().parent().find('a.obs_servicosol').addClass('hidden');
	}
});

$(document).on('click', 'div#checklist_serviciosol_g input[type=checkbox]', function (e) {

	if($(this).is(':checked')){
		
		$(this).parent().parent().find('a.obs_servicosol_g').removeClass('hidden');
	}
	
	else{

		$(this).parent().parent().find('a.obs_servicosol_g').addClass('hidden');
	}
});

$(document).on('click', '#edit_cliente', function (e) {
	var tipo_persona = parseInt($('#tipo_cliente_aut').val());
	var id_cliente = parseInt($('#name_cliente_aut').val());
	if (tipo_persona == 1) {
		window.open($('base').attr('href')+"clientes/edit_juri/"+id_cliente, '_blank');
	}
	else{
		window.open($('base').attr('href')+"clientes/edit_nat/"+id_cliente, '_blank');
	}
});

$(document).on('click', '#edit_cliente2', function (e) {
	var tipo_persona = parseInt($('#tipo_c_solicitante_aut').val());
	var id_cliente = parseInt($('#name_c_solicitante_aut').val());
	if (tipo_persona == 1) {
		window.open($('base').attr('href')+"clientes/edit_juri/"+id_cliente, '_blank');
	}
	else{
		window.open($('base').attr('href')+"clientes/edit_nat/"+id_cliente, '_blank');
	}
});

$(function () {
	$("#cliente_busc").autocomplete({

		type:'POST',
		serviceUrl: $('base').attr('href')+"reserva/get_all_info_cliente",
		dataType : 'JSON',

		onSelect: function (suggestion)
		{
			
			$('#cliente_busc_id').val(suggestion.data.id_cliente);

			switch(suggestion.data.tipo_persona){
				case 1:
					$('#cliente_busc').val(suggestion.data.razon_social);
				break;

				case 2:
					$('#cliente_busc').val(suggestion.value);
				break;
			}
		}
	});
});

$(document).on('click', 'input.zonapref', function (e) {
	
	if($(this).is(':checked')){
		var cant_ninos = (isNaN(parseInt($('#cant_ninos').val()))) ? 0 : parseInt($('#cant_ninos').val());
		var cant_adultos = (isNaN(parseInt($('#cant_adultos').val()))) ? 0 : parseInt($('#cant_adultos').val());
		var aforo = parseInt($(this).closest('.col-md-12').find('span').text());
		if(cant_ninos+cant_adultos===0){
			alerta('Error!!', 'Ingrese cantidad de personas', 'error');
			$(this).prop('checked',false);
		}
		else{
			if((cant_ninos+cant_adultos)>aforo){
				alerta('Error!!', 'Se sobrepasó el aforo.', 'error');
				$(this).prop('checked',false);
			}
		}  
	}
});

$(document).on('click', 'input.zonapref', function (e) {
	
	if($(this).is(':checked')){
		var cant_ninos = (isNaN(parseInt($('#cant_ninos').val()))) ? 0 : parseInt($('#cant_ninos').val());
		var cant_adultos = (isNaN(parseInt($('#cant_adultos').val()))) ? 0 : parseInt($('#cant_adultos').val());
		var aforo = parseInt($(this).closest('.col-md-12').find('span').text());
		if(cant_ninos+cant_adultos===0){
			alerta('Error!!', 'Ingrese cantidad de personas', 'error');
			$(this).prop('checked',false);
		}
		else{
			if((cant_ninos+cant_adultos)>aforo){
				alerta('Error!!', 'Se sobrepasó el aforo.', 'error');
				$(this).prop('checked',false);
			}
		}  
	}
});

$(document).on('click', 'a.add_mesa', function (e) {
	var id_zonam = $(this).closest('.col-md-12').find('input[type=radio]').val();
	$('#id_zonam_add_m').val(id_zonam); 
	var param = "id_zonam="+id_zonam ;
	var i = new Array();
	if($('div.mesas_escogidas_modal_'+id_zonam).length){
		$('div.mesas_escogidas_modal_'+id_zonam+' input').each(function(index,value){
			i[index]=$(this).val();
		});

		if(i.length>0){
			i=jQuery.makeArray(i);
			i=JSON.stringify(i);
			param = param + "&mesas_select="+i;
		}
	}    

	$.ajax({
			url: $('base').attr('href') + 'zonam/get_check_mesam',
			type: 'POST',
			data: param,
			dataType: "json",
			beforeSend: function() {
					//showLoader();
			},
			success: function(response) {
					if (response.code==1) {
						$('#mesaconfigxzonam').html(response.data);
					}
			},
			complete: function() {
					
			}
	});
});

$(document).on('click', '.savemesas_escogidas', function (e) {
	//alert();
	var i=0;
	var id_zonam = $('#id_zonam_add_m').val();
	var div = '<div class="mesas_escogidas_modal_'+id_zonam+'">';
	$('div#mesaconfigxzonam input.custom-control-input').each(function(index,value){
		if($(this).is(':checked')){
			var id_mesam = $(this).val();
			div += "<input type='hidden' value='"+id_mesam+"' name='mesa_escogida("+id_zonam+")["+i+"]'>";
			i++;
		}
	})
	div += "</div>";
	 
	$('div#zona_prefe input#zonapreferida_'+id_zonam).after(div);
	$('#agregar_mesa').modal('hide');
	$('#mesaconfigxzonam').html('');
});

$(function () {
	$("#nombre_solicitante").autocomplete({

		type:'POST',
		serviceUrl: $('base').attr('href')+"reserva/get_all_info_cliente",
		dataType : 'JSON',

		onSelect: function (suggestion)
		{
			
			$('#nombre_solicitante').val('');

			switch(suggestion.data.tipo_persona){
				case 1:
					$('div.cont_autocompletar_2').html('');
					$('div.cont_autocompletar_2').html("<br><div class='clearfix div1guia_c'><label class='control-label col-md-4 col-sm-4 col-xs-12'>Razón Social: </label><div class='col-md-7 col-sm-7 col-xs-12'><input type='text' name='razon_social' value='"+suggestion.data.razon_social+"' class='form-control' disabled></div><a class='btn btn-warning btn-xs' id='edit_cliente2'><i class='fa fa-eye '></i></a></div>").append("<div class='clearfix div2guia_c'><label class='control-label col-md-4 col-sm-4 col-xs-12'>Nombre comercial: </label><div class='col-md-7 col-sm-7 col-xs-12'><input type='text' name='nombre_comercial' value='"+suggestion.value+"' class='form-control' disabled></div></div>").append("<div class='clearfix div3guia_c'><label class='control-label col-md-4 col-sm-4 col-xs-12'>Contacto: </label><div class='col-md-7 col-sm-7 col-xs-12'><input type='text' name='contacto' value='' class='form-control' disabled></div></div>").append("<div class='clearfix div4guia_c'><label class='control-label col-md-4 col-sm-4 col-xs-12'>Telefono: </label><div class='col-md-7 col-sm-7 col-xs-12'><input type='text' name='telefono_comercial' value='"+suggestion.data.telefono+"' class='form-control' disabled></div></div>").append("<div class='clearfix div5guia_c'><label class='control-label col-md-4 col-sm-4 col-xs-12'>Email: </label><div class='col-md-7 col-sm-7 col-xs-12'><input type='text' name='email_comercial' value='"+suggestion.data.email+"' class='form-control' disabled></div></div>");

				break;

				case 2:
					
					$('div.cont_autocompletar_2').html('');
					$('div.cont_autocompletar_2').html("<br><div class='clearfix div1guia_c'><label class='control-label col-md-4 col-sm-4 col-xs-12'>Nombre: </label><div class='col-md-7 col-sm-7 col-xs-12'><input type='text' name='nombre_natural' value='"+suggestion.value+"' class='form-control' disabled></div><a class='btn btn-warning btn-xs' id='edit_cliente2'><i class='fa fa-eye '></i></a></div>").append("<div class='clearfix div2guia_c'><label class='control-label col-md-4 col-sm-4 col-xs-12'>Teléfono: </label><div class='col-md-7 col-sm-7 col-xs-12'><input type='text' name='telefono_natural' value='"+suggestion.data.telefono+"' class='form-control' disabled></div></div>").append("<div class='clearfix div3guia_c'><label class='control-label col-md-4 col-sm-4 col-xs-12'>Email: </label><div class='col-md-7 col-sm-7 col-xs-12'><input type='text' name='email_natural' value='"+suggestion.data.email+"' class='form-control' disabled></div></div>");

				break;
			}
			$('#name_c_solicitante_aut').val(suggestion.data.id_cliente);
			$('#tipo_c_solicitante_aut').val(suggestion.data.tipo_persona);
		}
	});
});

$(function () {
	$("#name_recep_busc").autocomplete({

		type:'POST',
		serviceUrl: $('base').attr('href')+"reserva/get_persona",
		dataType : 'JSON',

		onSelect: function (suggestion)
		{
			 $('#id_recep').val(suggestion.id_personal);
			 var name = suggestion.nombres;
			 var ape = suggestion.apellidos;
			 var nombre_corto = name.substring(0,1)+(ape.substring(0,ape.indexOf(" "))).toLowerCase();
			 $('#name_recep_busc').val(nombre_corto);
		}    
	});
});

$(document).on('click', '#name_recep_busc', function (e) {
	$(this).val('');
});

$(function () {
	$("#receptor_busc").autocomplete({

		type:'POST',
		serviceUrl: $('base').attr('href')+"reserva/get_persona",
		dataType : 'JSON',

		onSelect: function (suggestion)
		{
			 $('#receptor_busc_id').val(suggestion.id_personal);
			 var name = suggestion.nombres;
			 var ape = suggestion.apellidos;
			 var nombre_corto = name.substring(0,1)+(ape.substring(0,ape.indexOf(" "))).toLowerCase();
			 $('#receptor_busc').val(nombre_corto);
		}    
	});
});

 
$(document).on('change', '#comboxsucursal', function (e){
	buscar_reservas(0);
});

$(document).on('change', '#id_select_contacto', function (e){
	var id_persona = (parseInt($(this).val())>0) ? parseInt($(this).val()) : null;
	if(id_persona > 0){
		$.ajax({
			url: $('base').attr('href') + 'reserva/get_form_contacto_emp',
			type: 'POST',
			data: 'id_persona='+id_persona,
			dataType: "json",
			beforeSend: function() {
					//showLoader();
			},
			success: function(response) {
					if (response.code==1) {
						$('#div_form_contacto').remove();
						$('div.cont_autocompletar').append(response.data);
					}
			},
			complete: function() {
					
			}
	});
	}
}); 

$(document).on('click' ,"#adela div button.cbadelanto" , function(){
	$("#agregar_anticipo").modal("show");

	var mone_efe = $('#mone_efe').val();
	console.log(mone_efe);
	if (mone_efe>0) {
	$.ajax({
		url: $('base').attr('href') + 'reserva/get_cuent_efe',
		type: 'POST',
		data: 'id_moneda='+mone_efe,
		dataType: "json",
		beforeSend: function() {
			$.LoadingOverlay("show", {image : "", fontawesome : "fa fa-spinner fa-spin"});
		},
		success: function(response) {
			if (response.code==1) {
				$('#cuent_efe').html(response.data);
			}
		},
		complete: function() {
			$.LoadingOverlay("hide");
		}
	});
	}

	$('#datetimepicker_1').datetimepicker({
			sideBySide: true,
			useCurrent: false,
			format: 'DD-MM-YYYY HH:mm A',
			locale: moment.locale("es"),
			//minDate: moment()
	});
});


$(document).on('change' ,"select#mone_efe" , function(){
	var m_ef = $(this).val();
	$.ajax({
		url: $('base').attr('href') + 'reserva/get_cuent_efe',
		type: 'POST',
		data: 'id_moneda='+m_ef,
		dataType: "json",
		beforeSend: function() {
			$.LoadingOverlay("show", {image : "", fontawesome : "fa fa-spinner fa-spin"});
		},
		success: function(response) {
			if (response.code==1) {
				$('#cuent_efe').html(response.data);
			}
		},
		complete: function() {
			$.LoadingOverlay("hide");
		}
	});
});


$(document).on('change' ,"select#banco_cu" , function(){
var banco_cu = $(this).val();
var m_cu = $('#mone_decu').val();

var temp = "&id_moneda="+m_cu+"&id_provbanco="+banco_cu;
console.log(temp);
if (banco_cu && m_cu) {
	$.ajax({
		url: $('base').attr('href') + 'reserva/cbx_cuent_banc',
		type: 'POST',
		data: temp,
		dataType: "json",
		beforeSend: function() {
			$.LoadingOverlay("show", {image : "", fontawesome : "fa fa-spinner fa-spin"});
		},
		success: function(response) {
			if (response.code==1) {
				$('#cuenta_cu').html(response.data);
			}
		},
		complete: function() {
			$.LoadingOverlay("hide");
		}
	});
}
});

$(document).on('change' ,"select#mone_decu" , function(){
var mm_cu = $(this).val();
var bancoo_cu = $('#banco_cu').val();

var temp = "&id_moneda="+mm_cu+"&id_provbanco="+bancoo_cu;
console.log(temp);
if (bancoo_cu && mm_cu) {
	$.ajax({
		url: $('base').attr('href') + 'reserva/cbx_cuent_banc',
		type: 'POST',
		data: temp,
		dataType: "json",
		beforeSend: function() {
			$.LoadingOverlay("show", {image : "", fontawesome : "fa fa-spinner fa-spin"});
		},
		success: function(response) {
			if (response.code==1) {
				$('#cuenta_cu').html(response.data);
			}
		},
		complete: function() {
			$.LoadingOverlay("hide");
		}
	});
}
});

$(document).on('change' ,"select#tarj_pos" , function(){
var tarjj_pos = $(this).val();
var mm_pos = $('#mone_pos').val();

var temp = "&id_moneda="+mm_pos+"&id_tarjeta="+tarjj_pos;
console.log(temp);
if (tarjj_pos && mm_pos) {
	$.ajax({
		url: $('base').attr('href') + 'reserva/cbx_cuent_banc_pos',
		type: 'POST',
		data: temp,
		dataType: "json",
		beforeSend: function() {
			$.LoadingOverlay("show", {image : "", fontawesome : "fa fa-spinner fa-spin"});
		},
		success: function(response) {
			if (response.code==1) {
				$('#cuenta_pos').html(response.data);
			}
		},
		complete: function() {
			$.LoadingOverlay("hide");
		}
	});
}
});

$(document).on('change' ,"select#mone_pos" , function(){
var m_pos = $(this).val();
var tarj_pos = $('#tarj_pos').val();

var temp = "&id_moneda="+m_pos+"&id_tarjeta="+tarj_pos;
console.log(temp);
if (m_pos && tarj_pos) {
	$.ajax({
		url: $('base').attr('href') + 'reserva/cbx_cuent_banc_pos',
		type: 'POST',
		data: temp,
		dataType: "json",
		beforeSend: function() {
			$.LoadingOverlay("show", {image : "", fontawesome : "fa fa-spinner fa-spin"});
		},
		success: function(response) {
			if (response.code==1) {
				$('#cuenta_pos').html(response.data);
			}
		},
		complete: function() {
			$.LoadingOverlay("hide");
		}
	});
}
});

$(document).on('click','.guardar_efe',function(){
var fecha_anticipo = $("#fecha_anticipo").val();
var mone_efe = $("#mone_efe").val();
var cuent_efe = $("#cuent_efe").val();
var monto_efe = parseInt($("#monto_efe").val());
var obser_efe = $("#obser_efe").val();
var numreser = $("#numreser").val();
var temp = "&fecha_anticipo="+fecha_anticipo;

if (parseInt(mone_efe)) {
	temp=temp+"&id_moneda="+mone_efe;
}
if (parseInt(cuent_efe)) {
	temp=temp+"&id_cuenta="+cuent_efe;
}
if (parseInt(monto_efe)) {
	temp=temp+"&monto_total="+monto_efe;
}
if (obser_efe.trim().length) {
	temp=temp+"&observacion="+obser_efe;
}
temp = temp+"&doc_reserva="+numreser;
console.log(temp);
if (monto_efe && cuent_efe && monto_efe) {
	$.ajax({
		url: $('base').attr('href') + 'reserva/save_anticipo_efe',
		type: 'POST',
		data:temp,
		dataType: "json",
		beforeSend: function(){
			$.LoadingOverlay("show", {image : "", fontawesome : "fa fa-spinner fa-spin"});
		},
		success: function(response){
			if (response.code==1) {
				alerta('Listo!', 'Se realizo el anticipo', 'success');
			}else{
				alerta('Error!', 'Debe generar una reserva', 'error');
			}
		},
		complete: function(){
			$.LoadingOverlay("hide");
		}
	});
}
});

$(document).on('click','.guardar_cu',function(){
alerta("cu");
});

$(document).on('click','.guardar_pos',function(){
alerta("pos");
});