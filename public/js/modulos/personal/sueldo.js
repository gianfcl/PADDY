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
					
				},
				success: function(response) {
					if(response.code=="1")
					{
						var id_personal = $('#id_personal').val();
						var tipo = $('#myTab li.active').attr('tabs');
				        var url = $('base').attr('href') +'personal/edit/'+id_personal+'/'+tipo;        
				        //console.log(url);
				        window.location.href = url;
					}
				}
			});
	    }
   });

 	$('#form_save_personalacargo').validate({
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
	            window.location.href = $('base').attr('href') +'personal/edit/'+idp+'/'+tipo;
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
  $( "#dni" ).autocomplete({
    params: { 
      'id_personalsucursal': function() { return $('#id_penlsucursal').val(); },
      'va': function() { return 'dni';}
    },
    type:'POST',
    serviceUrl: $('base').attr('href')+"personal/get_infopersonalacargo",
    onSelect: function (suggestion) 
    {
      var padre = $('#form_save_personalacargo');
      padre.find('.id_personal').val(suggestion.id_personal);
      $('#apellidos').val(suggestion.apellidos);
      $('#nombres').val(suggestion.nombres);
    }
  });

  $( "#nombres" ).autocomplete({
      params: {
        'id_personalsucursal': function() { return $('#id_penlsucursal').val(); },
        'va': function() { return 'nombres';}
    },
      //appendTo: autondni,
      type:'POST',
      serviceUrl: $('base').attr('href')+"personal/get_infopersonalacargo",
      onSelect: function (suggestion) 
      {
        var padre = $('#form_save_personalacargo');
        padre.find('.id_personal').val(suggestion.id_personal);
        $('#apellidos').val(suggestion.apellidos);
        $('#nombres').val(suggestion.nombres);
        $('#dni').val(suggestion.dni);
      }
  });/**/

  $( "#apellidos" ).autocomplete({
      params: {
        'id_personalsucursal': function() { return $('#id_penlsucursal').val(); },
        'va': function() { return 'apellidos';}
    },
      //appendTo: autondni,
      type:'POST',
      serviceUrl: $('base').attr('href')+"personal/get_infopersonalacargo",
      onSelect: function (suggestion) 
      {
        var padre = $('#form_save_personalacargo');
        padre.find('.id_personal').val(suggestion.id_personal);
        $('#apellidos').val(suggestion.apellidos);
        $('#nombres').val(suggestion.nombres);
        $('#dni').val(suggestion.dni);
      }
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
	}
});

$(document).on('click', '.edit_puesto', function (e) {
	var idsucursal = parseInt($(this).closest('table').attr('idsucursal'));
	if(idsucursal>0)
	{
		var cbx = $('#cbx_'+idsucursal).val();
		$('#id_areapuesto').html(cbx);
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
					
				},
				success: function(response) {
					if(response.code=="1")
					{
						$('#fecha_inicio_trabajo').val(response.data.fecha_inicio_trabajo);
						var essupervisor = parseInt($('input#id_'+idsucursal).attr('essupervisor'));
						var essupervisor = (essupervisor>0) ? (essupervisor) : ('');
						$('#es_supervisor').val(essupervisor);
						$('#id_puesto').html(response.data.puesto);
						$('#id_areapuesto').val(response.data.id_areapuesto);
						$('#fecha_fin_trabajo').val(response.data.fecha_fin_trabajo);
					}
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
	            //showLoader();
	        },
	        success: function(response) {
	            if (response.code==1) {
	                var id_personal = $('#id_personal').val();
					var tipo = $('#myTab li.active').attr('tabs');
					var url = $('base').attr('href') +'personal/edit/'+id_personal+'/'+tipo;        
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

$(document).on('change', 'input:checkbox[name=es_supervisor1]', function (e) {
  var padre = $(this);

  var estado = (padre.is(':checked')) ? ("2"): ("1");
  estado = parseInt(estado);
  var idpersonalsucursal = padre.attr('idpersonalsucursal');

  var temp = 'id_personalsucursal='+idpersonalsucursal+'&es_supervisor='+estado;
  $.ajax({
    url: $('base').attr('href') + 'personal/save_essupervisor',
    type: 'POST',
    data: temp,
    dataType: "json",
    beforeSend: function() {
      //showLoader();
    },
    success: function(response) {
      if (response.code==1) {
        if(estado==2)
        {
          $('#tbsuper_'+idpersonalsucursal).removeClass('collapse');
          padre.closest('legend').find('a').removeClass('hide');
        }
        else
        {
          $('#tbsuper_'+idpersonalsucursal).addClass('collapse');
          padre.closest('legend').find('a').addClass('hide');
        }
        padre.attr({'idpersonalsucursal':response.data.id});
      }                    
    },
    complete: function() {
      //hideLoader();
    }
  });/**/
});

$(document).on('click', '.add_personalacargo', function (e)
{
  limp_todo('form_save_personalacargo');
  var idsucursal = parseInt($(this).closest('table').attr('idsucursal'));
  
  var idpersonalsucursal = $('input#id_'+idsucursal).attr('idpersonalsucursal');
  console.log(id_personalsucursal);
  $('#id_penlsucursal').val(idpersonalsucursal);
});

$(document).on('click', '.delete_personalacargo', function (e)
{
  e.preventDefault();
  var idpersonalacargo = parseInt($(this).parents('tr').attr('idpersonalacargo'));
  if(idpersonalacargo>0)
  {
    swal({
      title: 'Estas Seguro?',
      text: "De Eliminar este Personal",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, estoy seguro!'
    }).then(function(isConfirm) {
      if (isConfirm) {     
        $.ajax({
          url: $('base').attr('href') + 'personal/delete_personalacargo',
          type: 'POST',
          data: 'id_personalacargo='+idpersonalacargo,
          dataType: "json",
          beforeSend: function() {
              //showLoader();
          },
          success: function(response) {
              if (response.code==1) {
                var tipo = $('#myTab li.active').attr('tabs');
                var idp = $('#id_personal').val();
                window.location.href = $('base').attr('href') +'personal/edit/'+idp+'/'+tipo;
              }
          },
          complete: function() {
              //hideLoader();
          }
        });
      }
    });
  }
});

$(document).on('click', '.btn_cancelpersonalacargo', function (e)
{
  limp_todo('form_save_personalacargo');
});

$(document).on('hidden.bs.modal', '#editpersonalacargo', function (e)
{
  limp_todo('form_save_personalacargo');
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