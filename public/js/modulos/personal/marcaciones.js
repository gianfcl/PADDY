$( document ).ready(function() {
	jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

	$.validator.addMethod("horaestri", function(value, element) {
        var exp = value; console.log(value);
        if($.trim(exp).length>0)
        {
          return /^(0?[1-9]|[12]\d|3[01])[\.\/\-](0?[1-9]|1[012])[\.\/\-]([12]\d)?(\d\d)\s(0[0-9]|1[0-2]):[0-5][0-9]\s(AM|am|PM|pm)$/.test(value);
          //return true;
        }
        else
        {
          return false;
        }
    }, "");

    $.validator.addMethod("horaes", function(value, element) {
        var exp = value;
        if($.trim(exp).length>0)
        {
          return /^(0?[1-9]|[12]\d|3[01])[\.\/\-](0?[1-9]|1[012])[\.\/\-]([12]\d)?(\d\d)\s(0[0-9]|1[0-2]):[0-5][0-9]\s(AM|am|PM|pm)$/.test(value);
        }
        else
        {
          return true;
        }
    }, "");

    $('#formhorarioreal').validate({
    rules: 
    {
      personalhorariomarca: { required:true}
    },
    messages: 
    {
      personalhorariomarca: { required:"Ingresar" }
    },
    highlight: function(element) { //console.log(element.type);
      //console.log($(element).parent('div').attr('class'));
      if(element.tagName=="SELECT")
      {
        $(element).closest('.col-md-4').addClass('has-error');
      }
      else {
        if(element.type=="text")
        {
          $(element).closest('.col-md-5').addClass('has-error');
        }
        else
        {
          $(element).closest('.form-group').addClass('has-error');
        }
      }
    },
    unhighlight: function(element) {
      //console.log($(element).parent('div').attr('class'));

      if($(element).parent('div').attr('class')=="col-md-4 col-sm-4 col-xs-12 has-error")
      {
        $(element).closest('.col-md-4').removeClass('has-error');
      }
      else
      {
       if($(element).attr('type')=="radio")
        {
          $(element).closest('.form-group').removeClass('has-error');
        }
        else
        {
          $(element).closest('.col-md-5').removeClass('has-error');
        }               
      }       
    },
    errorElement: 'span',
    errorClass: 'help-block',
    errorPlacement: function(error, element) 
    {
      if(element.parent('.col-md-3').length) { error.insertAfter(element); }
      else if(element.closest('.col-md-6').length) { error.insertAfter(element.closest('.col-md-6')); }
      else {}
    },
    submitHandler: function() {
      var idprnal = $('#id_personal').val();
      var sema = $('#semana').val();
      var fci = $('#fecha_inicio').val();
      var fcf = $('#fecha_fin').val();
      var temp = "id_personal="+idprnal+'&semana='+sema+'&fecha_inicio='+fci+'&fecha_fin='+fcf;
    $.ajax({
      url: $('base').attr('href') + 'personal/save_marcacionreal',
      type: 'POST',
      data: $('#formhorarioreal').serialize()+'&'+temp,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
      if (response.code==1) {
          var tipo = $('#myTab li.active').attr('tabs');
          var idp = $('#id_personal').val();
          var strtot = $('#strtot').val();
          var contr = $('#url_modulo').val();
          if(strtot.trim().length)
          {
            tipo = tipo+'/'+strtot;
          }
          window.location.href = $('base').attr('href') +contr+'/edit/'+idp+'/'+tipo;
        }
      },
      complete: function() {
          //hideLoader();
      }
    });
    }
  });

  $('#formhorario').validate({
    rules: 
    {
  		id_posicion: { required:true},
  		id_iniciotrabajo: {required:true},
  		hora_iniciotrabajo: {required:true},
  		id_fintrabajo: {required:true},
  		hora_fintrabajo:{required:true},
    },
    messages: 
    {
    	id_posicion: { required:"Ingresar" },
    	id_iniciotrabajo: { required:"" },
    	hora_iniciotrabajo: { required:"" },
      id_fintrabajo: { required:"" },
      hora_fintrabajo: { required:"" }
    },
    highlight: function(element) { //console.log(element.type);
    	//console.log($(element).parent('div').attr('class'));
      if(element.tagName=="SELECT")
      {
        $(element).closest('.col-md-4').addClass('has-error');
      }
      else {
        if(element.type=="text")
        {
          $(element).closest('.col-md-5').addClass('has-error');
        }
        else
        {
          $(element).closest('.form-group').addClass('has-error');
        }
      }
    },
    unhighlight: function(element) {
    	//console.log($(element).parent('div').attr('class'));

    	if($(element).parent('div').attr('class')=="col-md-4 col-sm-4 col-xs-12 has-error")
    	{
    		$(element).closest('.col-md-4').removeClass('has-error');
    	}
    	else
    	{
			 if($(element).attr('type')=="radio")
        {
          $(element).closest('.form-group').removeClass('has-error');
        }
        else
        {
          $(element).closest('.col-md-5').removeClass('has-error');
        }    		    		
    	}       
    },
    errorElement: 'span',
    errorClass: 'help-block',
    errorPlacement: function(error, element) 
    {
      if(element.parent('.col-md-3').length) { error.insertAfter(element); }
      else if(element.closest('.col-md-6').length) { error.insertAfter(element.closest('.col-md-6')); }
      else {}
    },
    submitHandler: function() {
    	var idprnal = $('#id_personal').val();
    	var sema = $('#semana').val();
    	var fci = $('#fecha_inicio').val();
    	var fcf = $('#fecha_fin').val();
    	var temp = "id_personal="+idprnal+'&semana='+sema+'&fecha_inicio='+fci+'&fecha_fin='+fcf;
		$.ajax({
			url: $('base').attr('href') + 'personal/save_marcacion',
			type: 'POST',
			data: $('#formhorario').serialize()+'&'+temp,
			dataType: "json",
			beforeSend: function() {
			    //showLoader();
			},
			success: function(response) {
			if (response.code==1) {
					var tipo = $('#myTab li.active').attr('tabs');
					var idp = $('#id_personal').val();
          var strtot = $('#strtot').val();
          var contr = $('#url_modulo').val();
          if(strtot.trim().length)
          {
            tipo = tipo+'/'+strtot;
          }
					window.location.href = $('base').attr('href') +contr+'/edit/'+idp+'/'+tipo;
        }
			},
			complete: function() {
			    //hideLoader();
			}
		});
    }
  });
  
  $('#hora_init').datetimepicker({
    sideBySide: true,
    useCurrent: false,
    format: 'DD-MM-YYYY HH:mm A',
    locale: moment.locale("es")
  });

  $('#hora_fint').datetimepicker({
    sideBySide: true,
    useCurrent: false,
    format: 'DD-MM-YYYY HH:mm A',
    locale: moment.locale("es")
  });

  $("#hora_init").on("dp.change", function (e) { console.log(e.date);
    $('#hora_fint').data("DateTimePicker").minDate(e.date);    
  });  

  $("#hora_fintrabajo").on("dp.change", function (e) {
    $('#hora_init').data("DateTimePicker").maxDate(e.date);
  });


  $('#hora_initrea').datetimepicker({
    sideBySide: true,
    useCurrent: false,
    format: 'DD-MM-YYYY HH:mm A',
    locale: moment.locale("es")
  });

  $('#hora_fintrea').datetimepicker({
    sideBySide: true,
    useCurrent: false,
    format: 'DD-MM-YYYY HH:mm A',
    locale: moment.locale("es")
  });

  $("#hora_initrea").on("dp.change", function (e) { console.log(e.date);
    $('#hora_fintrea').data("DateTimePicker").minDate(e.date);    
  });  

  $("#hora_fintrabajo_real").on("dp.change", function (e) {
    $('#hora_initrea').data("DateTimePicker").maxDate(e.date);
  });

  $("#hora_inirea").on("dp.change", function (e) {
    $('#hora_finrea').data("DateTimePicker").minDate(e.date);
  });
});

$(document).on('change', 'input:radio[name=id_dialibre]', function (e)
{
	var id = parseInt($(this).val());
	if(id==1)
	{
		$('#div_dialibre :input').prop( "disabled", false );
	}
	else
	{
		$('#div_dialibre :input').prop( "disabled", true );
	}
});

function addays(date) {
  var result = new Date(date); console.log(date);
  result.setDate(result.getDate()-1); console.log(result);
  return result;
}

function converdate(date){
  var date = new Date(date);
  return (date.getDate() + 1) + '-' + date.getMonth() + '-' +  date.getFullYear();
}

$(document).on('click', '.add_maracion', function (e)
{
	var padre = $(this);
	var numerodia = padre.closest('.col-md-12').find('table').attr('numerodia');
	var strtotime = padre.closest('.col-md-12').find('table').attr('strtotime');
  var nombdia = padre.closest('.col-md-12').find('table').attr('nombdia');
  var fe1 = padre.closest('.col-md-12').find('table').attr('fe1');
  var fe2 = padre.closest('.col-md-12').find('table').attr('fe2');
  var def = padre.closest('.col-md-12').find('table').attr('def');
  var defd = padre.closest('.col-md-12').find('table').attr('defd');
  var defm = padre.closest('.col-md-12').find('table').attr('defm');
  var defy = padre.closest('.col-md-12').find('table').attr('defy');
  $('#myModalLabel b').html(nombdia);
  //console.log(fe1+' -- '+fe2);
  var padre = padre.closest('.cont_horarios');
  var id_personalsucursal = parseInt(padre.find('input.id_personalsucursal').val());
  var hora_init = defd+"-"+defm+"-"+defy+' 12:00 AM';
  //console.log(moment(defy+"-"+defm+"-"+defd+' 00:00:00'));
  $('#hora_iniciotrabajo').val(hora_init);
  $('#hora_init').data("DateTimePicker").options({minDate: fe1, maxDate: fe2});
  $('#hora_fint').data("DateTimePicker").options({minDate: fe1, maxDate: fe2});
  
  $('#hora_fint').data("DateTimePicker").viewDate(hora_init);
  //$("#hora_init").data('datetimepicker').setLocalDate(new Date(defy, defm, defd, 00, 00));
  if(id_personalsucursal>0)
  {
  	var id_personalsemanamarca = padre.find('input.id_personalsemanamarca').val(); //console.log(id_personalsemanamarca);
  	$('#id_personalsucursalr').val(id_personalsucursal);
  	$('#id_personalsemanamarcar').val(id_personalsemanamarca);
  	$('#numerodiar').val(numerodia);
  	$('#formhorario .strtotime').val(strtotime);

  	var semana = $('#semana').val();
    var anio = $('#anio').val();
    $('#formhorario .semana').val(semana);
    $('#formhorario .anio').val(anio);

    var fechi = $('#fecha_inicio').val();
    var fechf = $('#fecha_fin').val();

    $('#formhorario .fecha_inicio').val(fechi);
    $('#formhorario .fecha_fin').val(fechf);
  }    
});

$(document).on('click', '.editmarcacion', function (e)
{ 
  var padre = $(this);
  var padre = padre.closest('tr');
  var idphm = parseInt(padre.attr('idpersonalhorariomarca'));
  var idph = parseInt(padre.attr('idpsnlh'));
  var semana = $('#semana').val();
  var anio = $('#anio').val();
  var fechi = $('#fecha_inicio').val();
  var fechf = $('#fecha_fin').val();
  var numerodia = padre.closest('table').attr('numerodia');
  var nombdia = padre.closest('table').attr('nombdia');
  console.log('marca');
  $('#myModalLabel b').html(nombdia);

  $('#formhorario .semana').val(semana);
  $('#formhorario .anio').val(anio);
  $('#numerodiar').val(numerodia);
  $('#formhorario .fecha_inicio').val(fechi);
  $('#formhorario .fecha_fin').val(fechf);

    if(idphm>0)
    {
      $.ajax({
            url: $('base').attr('href') + 'personal/edit_marcacion',
            type: 'POST',
            data: 'id_personalhorariomarca='+idphm,
            dataType: "json",
            beforeSend: function() {
                //showLoader();
            },
            success: function(response) {
                if (response.code==1) {
                   $('#id_personalsucursalr').val(response.data.id_personalsucursal);
                   $('#id_personalsemanamarcar').val(response.data.id_personalsemanamarca);
                   $('#id_personalhorariomarcar').val(response.data.id_personalhorariomarca);
                   $('#observacion').val(response.data.observacion);
                   var dialibre = parseInt(response.data.id_dialibre);
                   $('input:radio[name=id_dialibre]').prop('checked', false);
                   $('#rad_'+dialibre).prop('checked', true);
                   if(dialibre==2)
                   {
                    $('#div_dialibre input').prop('disabled', true);
                    $('#div_dialibre select').prop('disabled', true);
                   } else {
                    $('#div_dialibre input').prop('disabled', false);
                    $('#div_dialibre select').prop('disabled', false);
                   }
                   $('#id_posicion').html(response.data.cbx);
                   $('#id_iniciotrabajo').val(response.data.id_iniciotrabajo);
                   $('#hora_iniciotrabajo').val(response.data.hora_iniciotrabajo_real);
                   $('#id_fintrabajo').val(response.data.id_fintrabajo);
                   $('#hora_fintrabajo').val(response.data.hora_fintrabajo_real);

                   $('#formhorario .strtotime').val(response.data.strtotime);

                }
            },
            complete: function() {
                //hideLoader();
            }
        });
    }    
});

$(document).on('click', '.editmarcaionreal', function (e)
{ 
  var padre = $(this);
  var padre = padre.closest('tr');
  var idphm = parseInt(padre.attr('idpersonalhorariomarca'));
  var idph = parseInt(padre.attr('idpsnlh'));
  var semana = $('#semana').val();
  var anio = $('#anio').val();
  var fechi = $('#fecha_inicio').val();
  var fechf = $('#fecha_fin').val();
  var numerodia = padre.closest('table').attr('numerodia');
  
  var nombdia = padre.closest('table').attr('nombdia');

  $('#myModalLabel b').html(nombdia);

  $('#formhorarioreal .semana').val(semana);
  $('#formhorarioreal .anio').val(anio);
  $('#numerodia').val(numerodia);
  $('#formhorarioreal .fecha_inicio').val(fechi);
  $('#formhorarioreal .fecha_fin').val(fechf);

  if(idphm>0)
  {
  	$.ajax({
          url: $('base').attr('href') + 'personal/edit_marcacion',
          type: 'POST',
          data: 'id_personalhorariomarca='+idphm+'&id_personalhorario='+idph,
          dataType: "json",
          beforeSend: function() {
              //showLoader();
          },
          success: function(response) {
              if (response.code==1) {
                 $('#formhorarioreal .id_personalsucursal').val(response.data.id_personalsucursal);
                 $('#formhorarioreal .id_personalsemanamarca').val(response.data.id_personalsemanamarca);
                 $('#formhorarioreal .id_personalhorariomarca').val(response.data.id_personalhorariomarca);
                 $('#formhorarioreal .id_dialibre').val(response.data.id_dialibre);
                 $('#observacionn').val(response.data.observacion);

                 $('#iniciotrabajoreal').html(response.data.iniciotrabajo);
                 $('#hora_iniciotrabajo_real').val(response.data.hora_iniciotrabajo_real);
                 $('#fintrabajoreal').html(response.data.fintrabajo);
                 $('#hora_fintrabajo_real').val(response.data.hora_fintrabajo_real);
                 
                 $('#formhorarioreal .strtotime').val(response.data.strtotime);

              }
          },
          complete: function() {
              //hideLoader();
          }
      });
  }    
});

$(document).on('click', '.delete_marcacion', function (e)
{
  e.preventDefault();
  var idpersonalmarcacion = parseInt($(this).parents('tr').attr('idpersonalhorariomarca'));
  if(idpersonalmarcacion>0)
  {
    swal({
      title: 'Estas Seguro?',
      text: "De Eliminar este Horario",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, estoy seguro!'
    }).then(function(isConfirm) {
      if (isConfirm) {     
        $.ajax({
          url: $('base').attr('href') + 'personal/delete_marcacion',
          type: 'POST',
          data: 'idpersonalhorariomarca='+idpersonalmarcacion,
          dataType: "json",
          beforeSend: function() {
              //showLoader();
          },
          success: function(response) {
              if (response.code==1) {
                var tipo = $('#myTab li.active').attr('tabs');
                var idp = $('#id_personal').val();
                var strtot = $('#strtot').val();
                var contr = $('#url_modulo').val();
                if(strtot.trim().length)
                {
                  tipo = tipo+'/'+strtot;
                }
                window.location.href = $('base').attr('href') +contr+'/edit/'+idp+'/'+tipo;
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


$(document).on('click', '.btn_cancelhorario', function (e)
{
    limpiarhorario('formhorario');
});

$(document).on('hidden.bs.modal', '#edithorario', function (e)
{
  limpiarhorario('formhorario');
});

function limpiarhorario(form)
{
	$('form#'+form).find('input[type=text]').val('');
	$('form#'+form).find('input[type=hidden]').val('0');
	var validcont = $('#'+form).validate();
	validcont.resetForm();

	$('#'+form+' input').each(function (index, value){
		if($(this).attr('type')=="text")
	    {
	      if($(this).parents('.form-group').attr('class')=="form-group has-error")
	      {
	        $(this).parents('.form-group').removeClass('has-error');
	      }

	      if($(this).parents('.col-md-3').attr('class')=="col-md-3 col-sm-3 col-xs-12 has-error")
	      {
	        $(this).parents('.col-md-3').removeClass('has-error');
	      }

	      $(this).val('');

	      id = $(this).attr('id');
	      if($('#'+id+'-error').length>0)
	      {
	        $('#'+id+'-error').html('');
	      }
	    }

	    $('#'+form+' select').each(function (index, value){
		    if($(this).parents('.form-group').attr('class')=="form-group has-error")
		    {
		      $(this).parents('.form-group').removeClass('has-error');
		    }

		    if($(this).parents('.col-md-3').attr('class')=="col-md-3 col-sm-3 col-xs-12 has-error")
		    {
		       $(this).parents('.col-md-3').removeClass('has-error');
		    }
		    $(this).val('');

		    id = $(this).attr('id');
		    if($('#'+id+'-error').length>0)
		    {
		      $('#'+id+'-error').html('');
		    }
		});

	    if($(this).attr('type')=="hidden"){
	      	$(this).val('');
	    }
	});
}

$(document).on('change', '#id_areaposicion', function (e)
{
  var idarea = parseInt($(this).val());
  idarea = (idarea>0) ? (idarea) : ("");
  $('#id_posicion').html('');
  if(idarea>0)
  {
    $.ajax({
      url: $('base').attr('href') + 'posicion/combox_posicion',
      type: 'POST',
      data: 'id_areaposicion='+idarea,
      dataType: "json",
      beforeSend: function() {
        //showLoader();
      },
      success: function(response) {
    if (response.code==1) {
      $('#id_posicion').html(response.data);
    }                    
      },
      complete: function() {
          //hideLoader();
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