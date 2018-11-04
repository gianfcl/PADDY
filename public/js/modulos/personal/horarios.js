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

  $('#formhorario').validate({
    rules: 
    {
  		id_posicion: { required:true},
  		id_iniciotrabajo: {required:true},
  		hora_iniciotrabajo: {required:true},
  		id_fintrabajo: {required:true},
  		hora_fintrabajo:{required:true}
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
      var contr = $('#url_modulo').val();
		$.ajax({
			url: $('base').attr('href') +'personal/save_horario',
			type: 'POST',
			data: $('#formhorario').serialize()+'&'+temp,
			dataType: "json",
			beforeSend: function() {
			  $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});  
			},
			success: function(response) {
			if (response.code==1) {
					var tipo = $('#myTab li.active').attr('tabs');
					var idp = $('#id_personal').val();
          var strtot = $('#strtot').val();
          if(strtot.trim().length)
          {
            tipo = tipo+'/'+strtot;
          }
					window.location.href = $('base').attr('href') + contr+'/edit/'+idp+'/'+tipo;
        }
			},
			complete: function() {
			  $.LoadingOverlay("hide");
			}
		});
    }
  });
  
  $('#hora_init').datetimepicker({
    sideBySide: true,
    useCurrent: false,
    format: 'DD-MM-YYYY hh:mm A',
    locale: moment.locale("es")
  });

  $('#hora_fint').datetimepicker({
    sideBySide: true,
    useCurrent: false,
    format: 'DD-MM-YYYY hh:mm A',
    locale: moment.locale("es")
  });

  $("#hora_init").on("dp.change", function (e) { console.log(e.date);
    console.log("1--");
    console.log(e.date);
    $('#hora_fint').data("DateTimePicker").minDate(e.date);
  });  

  $("#hora_fint").on("dp.change", function (e) {
    console.log("2--");
    console.log(e.date);
    $('#hora_init').data("DateTimePicker").maxDate(e.date);
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

$(document).on('click', '.copiar_horario', function (e)
{
  var semana_copiar = parseInt($(this).attr('semana'));
  semana_copiar = (semana_copiar>0) ? (semana_copiar) : (0);

  var anio_copiar = parseInt($(this).attr('anio'));
  anio_copiar = (anio_copiar>0) ? (anio_copiar) : (0);

  var idpsu = parseInt($(this).attr('idpsu'));
  idpsu = (idpsu>0) ? (idpsu) : (0);
  var contr = $('#url_modulo').val();

  if(semana_copiar>0 && idpsu>0 && anio_copiar>0)
  {
    var strtot = $('#strtot').val();
    if(strtot.trim().length)
    {
      swal({
      title: 'Estas Seguro?',
      text: "De Copiar este Horario",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, estoy seguro!'
    }).then(function(isConfirm) {
      if (isConfirm) {     
        $.ajax({
          url: $('base').attr('href') + 'personal/copiar_horario',
          type: 'POST',
          data: 'idpsu='+idpsu+'&semana_copiar='+semana_copiar+'&anio_copiar='+anio_copiar+'&strtot='+strtot,
          dataType: "json",
          beforeSend: function() {
            $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
          },
          success: function(response) {
            if (response.code==1) {
              var tipo = $('#myTab li.active').attr('tabs');
              var idp = $('#id_personal').val();
              var strtot = $('#strtot').val();
              if(strtot.trim().length)
              {
                tipo = tipo+'/'+strtot;
              }
              window.location.href = $('base').attr('href') +contr+'/edit/'+idp+'/'+tipo;
            }
          },
          complete: function() {
            $.LoadingOverlay("hide");
          }
        });
      }
    });

        
    }
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

$(document).on('click', '.add_horario', function (e)
{
	var padre = $(this);
	var numerodia = padre.closest('.col-md-6').find('table').attr('numerodia');
	var strtotime = padre.closest('.col-md-6').find('table').attr('strtotime');
  var nombdia = padre.closest('.col-md-6').find('table').attr('nombdia');
  var fe1 = padre.closest('.col-md-6').find('table').attr('fe1');
  var fe2 = padre.closest('.col-md-6').find('table').attr('fe2');
  var def = padre.closest('.col-md-6').find('table').attr('def');
  var defd = padre.closest('.col-md-6').find('table').attr('defd');
  var defm = padre.closest('.col-md-6').find('table').attr('defm');
  var defy = padre.closest('.col-md-6').find('table').attr('defy');
  var anio = $('#anio').val();
  var cbx_apos = padre.parents('.cont_horarios').find('input.cbx_apos').val();
  var cbx_pos = padre.parents('.cont_horarios').find('input.cbx_pos').val();

  $('#id_areaposicion').html(cbx_apos);
  $('#id_posicion').html(cbx_pos);

  $('#edithorario #formhorario input.anio').val(anio);
  $('#myModalLabel b').html(nombdia);
  //console.log(fe1+' -- '+fe2);
  var padre = padre.closest('.cont_horarios');
  var id_personalsucursal = parseInt(padre.find('input.id_personalsucursal').val());
  console.log(id_personalsucursal);
  console.log(fe1);
  console.log(fe2);
  console.log( $('#hora_init').data("DateTimePicker"));
  fe1 = moment(fe1,'DD-MM-YYYY hh:mm A').format('DD-MM-YYYY hh:mm A');
  fe2 = moment(fe2,'DD-MM-YYYY hh:mm A').format('DD-MM-YYYY hh:mm A');
  console.log(fe1);
  console.log(fe2);
  console.log($('#hora_init').data("DateTimePicker").maxDate());
  $('#hora_init').data("DateTimePicker").minDate(fe1);
  $('#hora_init').data("DateTimePicker").maxDate(fe2);
  $('#hora_fint').data("DateTimePicker").minDate(fe1);
  $('#hora_fint').data("DateTimePicker").maxDate(fe2);

  //$('#hora_init').data("DateTimePicker").options({minDate: fe1, maxDate: fe2});
  //$('#hora_fint').data("DateTimePicker").options({minDate: fe1, maxDate: fe2});
  var id_pos = $('#id_posicion').val();
  var time = (id_pos) ? (get_horaentrada(id_pos)) : ' 08:00 AM';
  var hora_init = defd+"-"+defm+"-"+defy+time;
  //$('#hora_fint').data("DateTimePicker").viewDate(hora_init);
  $('#hora_iniciotrabajo').val(defd+"-"+defm+"-"+defy+time);
  if(time)
  {
    var h = get_horas(id_pos);
    h = h ? h : 0;
    $('#horas_n').val(h);

    var f1 = $('#hora_iniciotrabajo').val();
    console.log(f1);
    if(f1.trim().length)
    {
      f1 = moment(f1,'DD-MM-YYYY hh:mm A');   
      console.log(f1);
      var horas = $('#horas_n').val();
      console.log(horas);
      var f2 = moment(f1,'DD-MM-YYYY hh:mm A').add(horas,'hours');
      $('#hora_fintrabajo').val(moment(f2,'DD-MM-YYYY hh:mm A').format('DD-MM-YYYY hh:mm A'));
    }
  }
  
  //console.log(moment(defy+"-"+defm+"-"+defd+' 00:00:00'));
  $('#hora_iniciotrabajo').val(hora_init);
  //$("#hora_init").data('datetimepicker').setLocalDate(new Date(defy, defm, defd, 00, 00));
  if(id_personalsucursal>0)
  {
    console.log("entro");
  	var id_personalsemana = padre.find('input.id_personalsemana').val();
  	$('#id_personalsucursal').val(id_personalsucursal);
    console.log($('#id_personalsucursal').val());
  	$('#id_personalsemana').val(id_personalsemana);
  	$('#numerodia').val(numerodia);
  	$('.strtotime').val(strtotime);

  	var semana = $('#semana').val();
    var anio = $('#anio').val();
    $('.semana').val(semana);
    $('.anio').val(anio);

    var fechi = $('#fecha_inicio').val();
    var fechf = $('#fecha_fin').val();

    $('.fecha_inicio').val(fechi);
    $('.fecha_fin').val(fechf);
  }
  
});

$(document).on('click', '.edit_horario', function (e)
{ 
  var padre = $(this);
  var padre = padre.closest('tr');
  var idph = parseInt(padre.attr('idpersonalhorario'));
  var semana = $('#semana').val();
  var anio = $('#anio').val();
  var fechi = $('#fecha_inicio').val();
  var fechf = $('#fecha_fin').val();
  var numerodia = padre.closest('table').attr('numerodia');
  var nombdia = padre.closest('table').attr('nombdia');

  $('#myModalLabel b').html(nombdia);

  $('.semana').val(semana);
  $('.anio').val(anio);
  $('#numerodia').val(numerodia);
  $('.fecha_inicio').val(fechi);
  $('.fecha_fin').val(fechf);

    if(idph>0)
    {
    	$.ajax({
            url: $('base').attr('href') + 'personal/edit_horario',
            type: 'POST',
            data: 'id_personalhorario='+idph,
            dataType: "json",
            beforeSend: function() {
              $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
            },
            success: function(response) {
                if (response.code==1) {
                   $('#id_personalsucursal').val(response.data.id_personalsucursal);
                   $('#id_personalsemana').val(response.data.id_personalsemana);
                   $('#id_personalhorario').val(response.data.id_personalhorario);
                   var dialibre = parseInt(response.data.id_dialibre);
                   $('input:radio[name=id_dialibre]').prop('checked', false);
                   $('#rad_'+dialibre).prop('checked', true);

                   if(dialibre==2)
                   {
                    $('#div_dialibre input').prop('disabled', true);
                   } else {
                    $('#div_dialibre input').prop('disabled', false);
                   }
                   var cbx_apos = padre.parents('.cont_horarios').find('input.cbx_apos').val();
                   $('#id_areaposicion').html(cbx_apos);
                   $('#id_areaposicion').val(response.data.id_areaposicion);
                   $('#id_posicion').html(response.data.cbx);
                   $('#id_iniciotrabajo').val(response.data.id_iniciotrabajo);
                   $('#hora_iniciotrabajo').val(response.data.hora_iniciotrabajo);
                   $('#id_fintrabajo').val(response.data.id_fintrabajo);
                   $('#hora_fintrabajo').val(response.data.hora_fintrabajo);

                   $('.strtotime').val(response.data.strtotime);

                }
            },
            complete: function() {
              $.LoadingOverlay("hide");
            }
        });
    }    
});

$(document).on('click', '.delete_horario', function (e)
{
  e.preventDefault();
  var idpersonalhorario = parseInt($(this).parents('tr').attr('idpersonalhorario'));
  var contr = $('#url_modulo').val();
  if(idpersonalhorario>0)
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
          url: $('base').attr('href') + 'personal/delete_horario',
          type: 'POST',
          data: 'id_personalhorario='+idpersonalhorario,
          dataType: "json",
          beforeSend: function() {
            $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
          },
          success: function(response) {
              if (response.code==1) {
                var tipo = $('#myTab li.active').attr('tabs');
                var idp = $('#id_personal').val();
                var strtot = $('#strtot').val();
                if(strtot.trim().length)
                {
                  tipo = tipo+'/'+strtot;
                }
                window.location.href = $('base').attr('href') +contr+'/edit/'+idp+'/'+tipo;
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
      async: false,
      data: 'id_areaposicion='+idarea,
      dataType: "json",
      beforeSend: function() {
        $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
      },
      success: function(response) {
        if (response.code==1) {
          $('#id_posicion').html(response.data);
        }                    
      },
      complete: function() {
        $('#id_posicion').trigger('change');
        $.LoadingOverlay("hide");
      }
    });
  }
});
$(document).on('focus','#hora_fint',function(){
  var f1 = $('#hora_iniciotrabajo').val();
  console.log(f1);
  if(f1.trim().length)
  {
    f1 = moment(f1,'DD-MM-YYYY hh:mm A');   
    console.log(f1);
    var horas = $('#horas_n').val();
    var f2 = moment(f1,'DD-MM-YYYY hh:mm A').add(horas,'hours');
    $('#hora_fintrabajo').val(moment(f2,'DD-MM-YYYY hh:mm A').format('DD-MM-YYYY hh:mm A'));
  }

});
/*Validar Al Salir del Formulario*/
$(document).on('click', '#myTab li.tab a, .breadcrumb li a', function (e) {
    var url = $(this).attr('url');
    window.location.href = url;       
});
/*<---->*/

$(document).on('change','#id_posicion',function () {
  var id = $(this).val();
  $('#horas_n').val('');
  if(id)
  {
    var h_actual = $('#hora_iniciotrabajo').val();
    if(h_actual)
    {
      var fech = h_actual.substring(0,11);
      fech +=get_horaentrada(id);
      $('#hora_iniciotrabajo').val(fech);
    }
    var h = get_horas(id);
    h = h ? h : 0;

    $('#horas_n').val(h);
    var f1 = $('#hora_iniciotrabajo').val();
    console.log(f1);
    if(f1.trim().length)
    {
      f1 = moment(f1,'DD-MM-YYYY hh:mm A');   
      console.log(f1);
      var horas = $('#horas_n').val();
      console.log(horas);
      var f2 = moment(f1,'DD-MM-YYYY hh:mm A').add(horas,'hours');
      $('#hora_fintrabajo').val(moment(f2,'DD-MM-YYYY hh:mm A').format('DD-MM-YYYY hh:mm A'));
    }
  }
});

function get_horas(id)
{
  var horas = 0;
  if(id)
  {
    $.ajax({
      url: $('base').attr('href') + 'posicion/get_horasposicion',
      type: 'POST',
      async: false,
      data: 'id_posicion='+id,
      dataType: "json",
      beforeSend: function() {
        $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
      },
      success: function(response) {
        if (response.code==1) {
          horas = response.data;
        }                    
      },
      complete: function() {
        $.LoadingOverlay("hide");
      }
    });
  }

  return horas;
}

function get_horaentrada(id)
{
  if(id)
  {
    var horas = '';
    $.ajax({
      url: $('base').attr('href') + 'posicion/get_horaentrada',
      type: 'POST',
      async: false,
      data: 'id_posicion='+id,
      dataType: "json",
      beforeSend: function() {
        $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
      },
      success: function(response) {
        if (response.code==1) {
          horas = response.data;
          console.log("->"+horas);
        }                    
      },
      complete: function() {
        $.LoadingOverlay("hide");
      }
    });
    console.log("2->"+horas);
    return (horas) ? ' '+horas : ' 08:00 AM';
  }
}