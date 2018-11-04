$( document ).ready(function() {
  $.validator.addMethod("formespn",
    function(value, element) {
      if(value.trim().length)
        return /^(0?[1-9]|[12]\d|3[01])[\.\/\-](0?[1-9]|1[012])[\.\/\-]([12]\d)?(\d\d)$/.test( value );
      else
        return true;
  }, "Ingrese est Formato dd-mm-yyyy");

 	$('#form_save_puesto').validate({
	    rules: 
	    {
	    	id_areapuesto: { required:true},
			id_puesto: { required:true},
			fecha_inicio_trabajo:{formespn:true},
			es_supervisor: { required:true}
	    },
	    messages: 
	    {
			id_areapuesto: { required:"Ingresar Área" },
			id_puesto: { required:"Ingresar Puesto" },
			es_supervisor: { required:"Ingresar Cargo"}
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
				url: $('base').attr('href') + 'personal/save_puesto',
				type: 'POST',
				data: $('#form_save_puesto').serialize(),
				dataType: "json",
				beforeSend: function() {
					$.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});	
				},
				success: function(response) {
					if(response.code=="1")
					{
						var id_personal = $('#id_personal').val();
						var tipo = $('#myTab li.active').attr('tabs');
						var url = "";

			          	url = $('base').attr('href') +'personal/edit/'+id_personal+'/puesto';
			          	swal({
						  title: 'Los datos se han guardado',
						  text: "correctamente!",
						  type: 'success',
						  confirmButtonColor: '#3085d6',
						  confirmButtonText: 'Listo!'
						}).then((result) => {
							var path_url = ($(location).attr('href')).split("/"); 
						    console.log(path_url);
						    console.log(url);
						    //window.location.href = url;
							window.location.reload();
						})
			          	
      		
				        console.log(url);
					}
				},
				complete:function(){
					$.LoadingOverlay("hide");
				}
			});
	    }
   });

 	/*$('#form_save_personalacargo').validate({
	    rules: 
	    {
	      dni: { required:true},
	      nombres: {required:true},
	      apellidos: {required:true}
	    },
	    messages: 
	    {
	      dni: { required:"Ingresar" },
	      nombres: { required:"Nombres" },
	      apellidos: { required:"Apellidos" }
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
	        url: $('base').attr('href') + 'personal/save_personalcargo',
	        type: 'POST',
	        data: $('#form_save_personalacargo').serialize(),
	        dataType: "json",
	        beforeSend: function() {
	          //showLoader();
	        },
	        success: function(response) {
	          if (response.code==1) {
	            var tipo = $('#myTab li.active').attr('tabs');
	            var idp = $('#id_personal').val();

	            var url = "";

		        url = $('base').attr('href') +'personal/edit/'+idp+'/'+tipo;
	          	window.location.href = url;
	          }
	        }
	      });
	    }
  	}); */

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

	$("#fecha_ini").on("dp.change", function (e) { console.log(e.date);
   	 	$('#fecha_fin').data("DateTimePicker").minDate(e.date);
  	});  

  	$("#fecha_fin").on("dp.change", function (e) {
    	$('#fecha_ini').data("DateTimePicker").maxDate(e.date);
  	}); 
});

$(document).on('hidden.bs.modal', '#editpuesto', function (e)
{
  limp_todo('form_save_puesto');
});

$(document).on('click', '.btn_cancel', function (e)
{
    limp_todo('form_save_puesto');
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

$(document).on('click', '.add_puesto', function (e) {
	$('#div_aut').addClass('hidden');
	limp_todo('form_save_puesto');
	var idsucursal = parseInt($(this).closest('table').attr('idsucursal'));
	
	if(idsucursal>0)
	{
		var idpersonalsucursal = $('input#id_'+idsucursal).attr('idpersonalsucursal');
		$('.id_personalsucursal').val(idpersonalsucursal);
		var essupervisor = parseInt($('input#id_'+idsucursal).attr('essupervisor'));
		var essupervisor = (essupervisor>0) ? (essupervisor) : ('');
		$('#es_supervisor').val(essupervisor);
		var cbx = $('#cbx_'+idsucursal).val();
		$('#id_areapuesto').html(cbx);
		$('#tipomov').val('1');
	}
});

$(document).on('click', '.edit_puesto', function (e) {
	var idsucursal = parseInt($(this).closest('table').attr('idsucursal'));
	if(idsucursal>0)
	{
		console.log(idsucursal);
		var cbx = $('#cbx_'+idsucursal).val();
		console.log(cbx);
		var idpersonalsucursal = parseInt($('input#id_'+idsucursal).attr('idpersonalsucursal'));
		var idpersonalpuesto = parseInt($(this).closest('tr').attr('idpersonalpuesto'));
		if(idpersonalsucursal>0 && idpersonalpuesto>0)
		{
			$('#id_personalsucursal').val(idpersonalsucursal);
			$('#id_personalpuesto').val(idpersonalpuesto);
			$.ajax({
				url: $('base').attr('href') + 'personal/edit_puesto',
				type: 'POST',
				data: 'id_personalpuesto='+idpersonalpuesto,
				dataType: "json",
				beforeSend: function() {
					$.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
				},
				success: function(response) {
					if(response.code==1)
					{
						$('#id_areapuesto').html(cbx);
						$('#fecha_inicio_trabajo').val(response.data.fecha_inicio_trabajo);
						var essupervisor = parseInt($('input#id_'+idsucursal).attr('essupervisor'));
						var essupervisor = (essupervisor>0) ? (essupervisor) : ('');
						$('#es_supervisor').val(essupervisor);
						$('#id_puesto').html(response.data.puesto);
						$('#id_areapuesto').val(response.data.id_areapuesto);
						console.log($('#id_areapuesto').val());
						$('#fecha_fin_trabajo').val(response.data.fecha_fin_trabajo);
					}
				},
				complete: function() {
				  	$.LoadingOverlay("hide");
				}
			});
		}		
	}
});

$(document).on('click', '.delete_puesto', function (e) {
  e.preventDefault();

  var idpersonalpuesto = parseInt($(this).parents('tr').attr('idpersonalpuesto'));  

  if(idpersonalpuesto>0)
  {
  	var nomb = "Puesto";
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
	        url: $('base').attr('href') + 'personal/save_puesto',
	        type: 'POST',
	        data: 'id_personalpuesto='+idpersonalpuesto+'&estado=0',
	        dataType: "json",
	        beforeSend: function() {
	          $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
	        },
	        success: function(response) {
	            if (response.code==1) {
	                var id_personal = $('#id_personal').val();
					var tipo = $('#myTab li.active').attr('tabs');
					var url = "";

			        url = $('base').attr('href') +'personal/edit/'+id_personal+'/'+tipo;
		          	swal({
					  title: 'Se Elimino este puesto',
					  text: "correctamente!",
					  type: 'success',
					  confirmButtonColor: '#3085d6',
					  confirmButtonText: 'Listo!'
					}).then((result) => {
					    //window.location.href = url;
						window.location.reload();
					})
			        console.log(url);
	            }
	        },
	        complete: function() {
	        	$.LoadingOverlay("hide");
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

$(document).on('change', '#id_areapuesto', function (e)
{
  var idarea = parseInt($(this).val());
  idarea = (idarea>0) ? (idarea) : ("");
  $('#id_puesto').html('');
  if(idarea>0)
  {
    $.ajax({
      url: $('base').attr('href') + 'puesto/commbx',
      type: 'POST',
      data: 'id_areapuesto='+idarea,
      dataType: "json",
      beforeSend: function() {
        //showLoader();
      },
      success: function(response) {
		if (response.code==1) {
			$('#id_puesto').html(response.data);
		}                    
      },
      complete: function() {
          //hideLoader();
      }
    });
  }
});

$(document).on('click','.change_puesto',function(){

	$('#div_aut').removeClass('hidden');
	var idsucursal = parseInt($(this).closest('table').attr('idsucursal'));
	console.log(idsucursal);
	if(idsucursal>0)
	{
		$this = $(this);
		var idpersonalsucursal = $('input#id_'+idsucursal).attr('idpersonalsucursal');
		$('.id_personalsucursal').val(idpersonalsucursal);
		var cbx = $('#cbx_'+idsucursal).val();
		$('#id_areapuesto').html(cbx);
		$('#tipomov').val('2');
		var lastrow = $this.parents('table').find('tr.last_row');
	}
});

function tiene_fechafin(idpersonalsucursal) {
	var resp = false;
	$.ajax({
      	url: $('base').attr('href') + 'personanatural/tiene_fechafinpuesto',
      	type: 'POST',
      	data: 'id_personalsucursal='+idpersonalsucursal,
      	dataType: "json",
      	async: false,
      	beforeSend: function() {
        	//showLoader();
      	},
      	success: function(response) {
			if (response.code==1) {
				resp = response.data;
			}                    
      	},
      	complete: function() {
          	//hideLoader();
      	}
    });

    return resp;
}

$(function () {
  $("#motivo_aut").autocomplete({

    type:'POST',
    serviceUrl: $('base').attr('href')+"motivomovper/get_motivomovaut",
    params: {
  		'tipo': function(){ return $('#tipomov').val();}
  	},
    onSelect: function (suggestion) 
    {
    	$('#motivo_aut').val(suggestion.value);
    	$('#id_observacion').val(suggestion.data.id_motivomovper);
    }
  });
});

$(document).on('click','.end_puesto',function(){
	$('.fgapu').addClass('hidden');
	$('.fgpue').addClass('hidden');
	$('.ffini').addClass('hidden');
	$('.ffin').removeClass('hidden');
	$('#div_aut').removeClass('hidden');

	var idsucursal = parseInt($(this).closest('table').attr('idsucursal'));
	console.log(idsucursal);
	if(idsucursal>0)
	{
		$this = $(this);
		var idpersonalsucursal = $('input#id_'+idsucursal).attr('idpersonalsucursal');
		$('.id_personalsucursal').val(idpersonalsucursal);
		$('#tipomov').val('3');
	}
});

$(document).on('click','.lr',function(){
	var lr = $(this).parents('table').find('tr.last_row');
	var fech_ini = lr.find('td.lrowfech').text();
	console.log(fech_ini)
	$('#fecha_inicio_trabajo').val(fech_ini);
	$('#fecha_ini').data("DateTimePicker").minDate(fech_ini);
});