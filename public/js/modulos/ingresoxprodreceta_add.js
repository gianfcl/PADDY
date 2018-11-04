$( document ).ready(function() {
	jQuery.validator.setDefaults({
    debug: true,
    success: "valid",
    ignore: ""
  });

  $('#form_save_ingresoxinvinicial').validate({
    rules:
    {
			id_almacen: { required:true },
      fecha_ingreso: { required:true, date:true},
      exist_pedido:{ required:true }
    },
    messages: 
    {
      id_almacen: { required:"Buscar y Seleccionar" },
      fecha_ingreso: { required:"Fecha", date:"Solo Fechas"},
      exist_pedido:{ required: "" }
    },      

    highlight: function(element) {
      $(element).closest('.form-group').addClass('has-error');
      if($(element).attr('id')=="exist_pedido") 
      {
        alerta('Verificar!', 'Artículos', 'error');
      } 
    },
    unhighlight: function(element) {
        $(element).closest('.form-group').removeClass('has-error');
    },
    errorElement: 'span',
    errorClass: 'help-block',
    errorPlacement: function(error, element) 
    {
        if(element.parent('.col-md-4').length) { error.insertAfter(element.parent()); }
    },
    submitHandler: function() {
      var si = valid_exist_pedido();
      if(si == 1)
      {
        $.ajax({
          url: $('base').attr('href') + 'ingresoinvinicial/save_invinicial',
          type: 'POST',
          data: $('#form_save_ingresoxinvinicial').serialize(),
          dataType: "json",
          beforeSend: function() {
              //showLoader();
          },
          success: function(response) {
            if (response.code==1) {
              buscar();              
            }                    
          },
          complete: function(response) {
            if (response.code==1) {
              alerta('Guardo Ok', 'Este Inventario', 'success');
            }
          }
        });
      }
      else
      {
        alerta('No Guardo', 'Verificar Artículos', 'success');
      }
        
    }
  });

	$('#fecha_ingreso').datetimepicker({
    viewMode: 'years',
		format: 'YYYY-MM-DD',
		locale: moment.locale("es")
	});

  $( "#descripcion" ).autocomplete({
    params:{'id_almacen': function() { return $('#id_almacen').val(); }},
    serviceUrl: $('base').attr('href')+"ingresoinvinicial/get_articulo",
    type:'POST',
    onSelect: function (suggestion) {          
      //$('#descripcion').val(suggestion.descripcion);
      $('#id_art_sucursal').val(suggestion.id_art_sucursal);
      limpcbx();
    }
  });

});

function limpcbx()
{
  $('.row .col-xs-12 .control-group select.form-control').val('');
}

function limpdes()
{
  $('#descripcion').val('');
  $('#id_art_sucursal').val('');
}

$(document).on('change', '#id_area', function (e) {
	var id_area = parseInt($(this).val());
  $("#id_ubicacion").html("<option value=''>Seleccione Ubicación</option>");
	if(id_area>0)
	{
    limpdes();
		$.ajax({
			url: $('base').attr('href') + 'ubicacion/cbx_ubicacion',
			type: 'POST',
			data: 'id_area='+id_area,
			dataType: "json",
			beforeSend: function() {
			    //showLoader();
			},
			success: function(response) {
			    if (response.code==1) {
			      $("#id_ubicacion").html(response.data);
			    }
			},
			complete: function() {
			   	//hideLoader();
			}
		});
	}
		
});

$(document).on('change', '#id_ubicacion', function(e) {
  var id_ub = parseInt($(this).val());
  if(id_ub>0) 
  {
    limpdes();
  }
});

$(document).on('change', '#id_grupo', function (e) {
	var id_grupo = parseInt($(this).val());
  $("#id_familia").html("<option value=''>Seleccione Familia</option>");

	if(id_grupo>0)
	{
    limpdes();
		$.ajax({
			url: $('base').attr('href') + 'familia/cbx_familia',
			type: 'POST',
			data: 'id_grupo='+id_grupo,
			dataType: "json",
			beforeSend: function() {
			    //showLoader();
			},
			success: function(response) {
			    if (response.code==1) {
			      $("#id_familia").html(response.data);
			    }
			},
			complete: function() {
			   	//hideLoader();
			}
		});
	}
		
});

$(document).on('change', '#id_familia', function(e) {
  var id_fa = parseInt($(this).val());
  if(id_fa>0) 
  {
    limpdes();
  }
});

$(document).on('click', '.buscar', function (e) {
	buscar();
});

function buscar()
{
  var id_al = $('#id_almacen').val();
  var id_ar = parseInt($('#id_area').val());
  var id_ub = parseInt($('#id_ubicacion').val());
  var id_g = parseInt($('#id_grupo').val());
  var id_f = parseInt($('#id_familia').val());
  var idart = parseInt($('#id_art_sucursal').val());
  var url = $('#linkmodulo').attr('href');

  id_ar = (id_ar>0) ? (id_ar) : ("-");
  id_ub = (id_ub>0) ? (id_ub) : ("-");
  id_g = (id_g>0) ? (id_g) : ("-");
  id_f = (id_f>0) ? (id_f) : ("-");
  idart = (idart>0) ? (idart) : ("-");

  if(id_ar!="-" || id_g!="-" || idart!="-")
  {
    window.location.href = url+'/add/'+id_al+'/'+id_ar+'/'+id_ub+'/'+id_g+'/'+id_f+'/'+idart;
  }
  else
  {
    alerta('No Busco', 'Tiene que seleccionar', 'error'); 
  }
}

$(document).on('keypress', '.padd5', function (e) {
  //if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
  if(e.which != 46 && (e.which < 47 || e.which > 59)) {
    return false;
  }
});

function valid_exist_pedido()
{
  var i = 0;
  var cantidad = 0;
  var cu = 0;
  var va = 0;
  var padre = "";
  var sum = 0;
  var vsum = 0;
  $('.cant').each(function (index, value){
    padre = $(this);
    cantidad = padre.val();

    if(cantidad.trim().length)
    {
      $(this).removeClass('erroinput');  
    }
    else
    {
      $(this).addClass('erroinput');
      i++;          
    }

    cantidad = (cantidad>0) ? (cantidad) : (0);
    cu = padre.closest('tr').find('td input.costo_u').val();

    if(cu.trim().length)
    {
      padre.closest('tr').find('td input.costo_u').removeClass('erroinput');  
    }
    else
    {
      padre.closest('tr').find('td input.costo_u').addClass('erroinput');
      i++;          
    }
    cu = (parseFloat(cu)>0) ? (parseFloat(cu)) : (0);  //console.log(cu);
    vsum = (parseFloat(cantidad*cu)>0) ? (parseFloat(cantidad*cu)) : (0);
    sum = vsum+sum;    
   });

  if(sum==0) {
    i++; console.log("CERO");
  }
  else
  {
    i=0;
  }
  
  var num = parseFloat($('#lista_articulos tbody tr td input.cant').length);
  //console.log('num->'+num);
  if(num>0 && i==0) { va = 1;}
  else {
    if(i>0) { va=2; }
  }
  //console.log('va->'+va);
  if(va==1)
  {
    $('#exist_pedido').val('si');
    $('#exist_pedido').parents('.form-group').removeClass('has-error');
  }
  else
  {
    $('#exist_pedido').val('');
    $('#exist_pedido').parents('.form-group').addClass('has-error');    
  }
  return va;
}

$(document).on('focusout', '.padd5', function (e) {
  var padre = $(this);
  var cantidad = padre.val();

  if(cantidad.trim().length)
  {
    $(this).removeClass('erroinput');    
  }
  else
  {
    $(this).addClass('erroinput');
  }

  valid_exist_pedido();

  padre = padre.parents('tr');

  var cant = parseFloat(padre.find('td input.cant').val());
  var c_un = parseFloat(padre.find('td input.costo_u').val());

  var c_to = (parseFloat(cant*c_un)>0) ? (parseFloat(cant*c_un)) : (0);

  c_to = (c_to>0) ? (c_to.toFixed(2)) : (0);

  padre.find('td.costo_t input').val(c_to);

});