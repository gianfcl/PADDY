$( document ).ready(function() {
  var d = new Date();

  jQuery.validator.setDefaults({
    debug: true,
    success: "valid",
    ignore: ""
  });

  $.validator.addMethod("regex", function(value, element) {
      var exp = value;
      if (exp <= 0) { return false; }
      else {
          if($.isNumeric(exp)){ return true; }
          else{ return false; }
      }
  }, "Solo #s Mayores a 0");

  $('#form_save_movialmacen').validate({
    rules:
    {
      id_art_sucursal: {required:true, number: true},
      fecha_ingreso:{ required: true },
      cantidad:{regex:true},
      alma_partida:{required:true},
      id_llegada:{required:true}
    },
    messages: 
    {
      id_art_sucursal: {required:"Agregar Artículo"},
      fecha_ingreso:{ date: "Fecha Invalida" },
      alma_partida:{required:'Seleccione'},
      id_llegada:{required:'Seleccione'}
    },      

    highlight: function(element) {
      if($(element).attr('type') == "hidden")
      {
        $(element).closest('.row').addClass('has-error');
      }
      else
      {
        $(element).closest('.form-group').addClass('has-error');
      }
      
    },
    unhighlight: function(element) {
      if($(element).attr('type') == "hidden")
      {
        $(element).closest('.row').removeClass('has-error');
      }
      else
      {
        $(element).closest('.form-group').removeClass('has-error');
      }
    },
    errorElement: 'span',
    errorClass: 'help-block',
    errorPlacement: function(error, element) 
    {
      if(element.parent('.col-md-3').length) 
      { 
        error.insertAfter(element.parent()); 
      }
      else
      {
        error.insertAfter(element);
      }
    },
    submitHandler: function() {
      var ialm = parseInt($('#id_partida').val());
      ialm = (ialm>0) ? (ialm) : (0);

      var sto = parseFloat($('table#alma_variante tr td.stock input.stock_'+ialm).val());
      sto = (sto>0) ? (sto) : (0);

      var cant = parseFloat($('#cantidad').val());
      cant = (cant>0) ? (cant) : (0);

      if(sto<cant)
      {
        $(this).addClass('erroinput');
        alerta('Verificar!', 'Stock Insuficiente', 'error');
      }
      else
      {
        $(this).removeClass('erroinput');
        $.ajax({
          url: $('base').attr('href') + 'moventrealmacen/save_movientrealmacen',
          type: 'POST',
          data: $('#form_save_movialmacen').serialize(),
          dataType: "json",
          beforeSend: function() {
            $.LoadingOverlay("show", {image : "", fontawesome : "fa fa-spinner fa-spin"});
          },
          success: function(response) {
            if (response.code==1) 
            {
              var url = $('base').attr('href') +'moventrealmacen/ver_documento/'+response.data.id;
              window.location.href = url;
            }
          },
          complete: function(response) {
            $.LoadingOverlay("hide");
          }
        });
      }        
    }
  });

  if($('#datetimepicker6').length)
  {
    $('#datetimepicker6').datetimepicker({
      format: 'DD-MM-YYYY',
      locale: moment.locale("es"),
      minDate: moment()
    });
  }   

  if($('#fecha_busc').length)
  {
    $('#fecha_busc').daterangepicker({
      singleDatePicker: true,
      format: 'DD-MM-YYYY',
      calender_style: "picker_4"
      }, 
      function(start, end, label) {}
    );
  }
});

$(document).on('click', '#paginacion_data li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  buscar_documentos(page);
});

$(document).on('click', '#paginacion_data a.paginate_button', function (e) {  
  var page = $(this).attr('tabindex');
  buscar_documentos(page);
});

$(document).on('click', '#datatable-buttons a.buscar', function (e) {  
  buscar_documentos(0);
});

$(document).on('click', '#datatable-buttons li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  buscar_documentos(page);
});

function buscar_documentos(page)
{
  var codigo_busc = $('#codigo').val();
  var fecha_busc = $('#fecha_busc').val();
  var idpart = parseInt($('#idalmapa').val());
  idpart = (idpart>0) ? (idpart) : (0);
  var idlle = parseInt($('#idalmall').val());
  idlle = (idlle>0) ? (idlle) : (0);
  var idope = parseInt($('#idoperador').val());
  idope = (idope>0) ? (idope) : (0);

  var temp = "page="+page;

  if(codigo_busc.trim().length)
  {
    temp=temp+'&codigo_busc='+codigo_busc; console.log(codigo_busc);
  }
  if(fecha_busc.trim().length)
  {
    temp=temp+'&fecha_busc='+fecha_busc; console.log(fecha_busc);
  }

  if(idpart>0)
  {
    temp=temp+'&idpart='+idpart;
  }
  if(idlle>0)
  {
    temp=temp+'&idlle='+idlle;
  }
  if(idope>0)
  {
    temp=temp+'&idope='+idope;
  }

  $.ajax({
    url: $('base').attr('href') + 'moventrealmacen/buscar_moventrealmacen',
    type: 'POST',
    data: temp,
    dataType: "json",
    beforeSend: function() {
      $.LoadingOverlay("show", {image : "", fontawesome : "fa fa-spinner fa-spin"});
    },
    success: function(response) {
      if (response.code==1) {
        $('#datatable-buttons tbody').html(response.data.rta);
        $('#paginacion_data').html(response.data.paginacion);
      }
    },
    complete: function() {
      $.LoadingOverlay("hide");
    }
  });      
}

$(document).on('click', '#buscar_arti a.paginate_button', function (e) {  
  var page = $(this).attr('tabindex');
  buscar_articulos(page);
});
$(document).on('click', '#buscar_arti a.buscar', function (e) {  
  buscar_articulos(0);
});

function buscar_articulos(page)
{
  var codigo_busc = $('#codigo_busc').val();
  var descripcion_busc = $('#descripcion_busc').val();
  var temp = "page="+page;

  if(codigo_busc.trim().length)
  {
    temp=temp+'&codigo_busc='+codigo_busc; console.log(codigo_busc);
  }
  if(descripcion_busc.trim().length)
  {
    temp=temp+'&descripcion_busc='+descripcion_busc; console.log(descripcion_busc);
  }

  $.ajax({
    url: $('base').attr('href') + 'moventrealmacen/buscar_articulos',
    type: 'POST',
    data: temp,
    dataType: "json",
    beforeSend: function() {
      $.LoadingOverlay("show", {image : "", fontawesome : "fa fa-spinner fa-spin"});
    },
    success: function(response) {
      if (response.code==1) {
        $('#buscar_arti tbody').html(response.data.rta);
        $('#pagina_data_buscar').html(response.data.paginacion);
      }
    },
    complete: function() {
      $.LoadingOverlay("hide");
    }
  });      
}

$(document).on('click', '.add_arti', function (e)
{
  var padre = $(this).parents('tr');
  var id_art_sucursal = padre.attr('idartsucursal');

  window.location.href = $('base').attr('href') +'moventrealmacen/add/'+id_art_sucursal;
});

$(document).on('click', '.add_articulos', function (e) {
  var page = 0;
  buscar_articulos(page);
});

$(document).on('click', '.limpiarform', function (e) {
  lip_busqueda('form_save_movialmacen');
});

function lip_busqueda(form)
{
  $('#'+form+' input').each(function (index, value){
    if($(this).attr('type')=="text" || $(this).attr('type')=="hidden")
    {
      if($(this).parents('.form-group').attr('class')=="form-group has-error")
      {
        $(this).parents('.form-group').removeClass('has-error');
      }

      $(this).val('');

      id = $(this).attr('id');
      if($('#'+id+'-error').length>0)
      {
        $('#'+id+'-error').html('');
      }
    }
  });

  $('#'+form+' label.bordelabel').each(function (index, value){
    $(this).html('');
  });

  $('#datetimepicker7 input').prop( "disabled", true );
  $('#num_page').val( "0" );

  var validatore = $( '#'+form ).validate();
  validatore.resetForm();
  $('#datatable-buttons tbody#bodyindex').html("<tr><td colspan='11'><h2 class='text-center text-success'>No se hay registro</h2></td></tr>");
  $('#paginacion_data').html('');
}

$(document).on('click', '#datatable-buttons li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  $('#num_page').val(page);
  $('#form_save_movialmacen').submit();
});

$(document).on('click', '#datatable-buttons a.paginate_button', function (e) {  
  var page = $(this).attr('tabindex');
  $('#num_page').val(page);
  $('#form_save_movialmacen').submit();
});

function cargacostos(tipo)
{
  var alma = $('#id_'+tipo+' option:selected').text();
  var ialm = $('#id_'+tipo).val();
  var cant = parseFloat($('#cantidad').val()); console.log(cant);
  cant = (cant>0) ? (cant) : (0);
  var sto = parseFloat($('table#alma_variante tr td.stock input.stock_'+ialm).val()); //console.log(sto);
  var cpu = parseFloat($('table#alma_variante tr td.stock input.cpu_'+ialm).val()); //console.log(cpu);
  var cp_t = parseFloat($('table#alma_variante tr td.stock input.cp_t_'+ialm).val());
  var cpt = (cpu*cant);
  cpt = parseFloat(cpt);   console.log(cpt);
  //var cp_t = parseFloat($('table#alma_variante tr td.stock input.cp_t_'+ialm).val());

  var cp_uu = (cpu!=0) ? (cpu.toFixed(6)) : ("0.00");
  var stuqi = (sto>0) ? (sto.toFixed(2)) : ("0.00");
  $('table#alma_'+tipo+' tr td.stock span').html(stuqi);
  if(tipo == 'partida')
  {
    var cp_tt = (cpt!=0) ? (cpt.toFixed(2)) : ("0.00");
    $('table#alma_variante tr td.cp_u span').html(cp_uu);
    $('table#alma_variante tr td.cp_t span').html(cp_tt);    
  }
  else
  {
    sto = sto + cant;
  }
   
  var cppt = (cp_t.length!=0) ? (cp_t.toFixed(2)) : ("0.00")
  
  $('table#alma_'+tipo+' tr td.cp_u span').html(cp_uu);
  $('table#alma_'+tipo+' tr td.cp_t span').html(cppt);

  var stoq = sto;
  var cpuq = cpu;
  var cp_tq = cp_t;
  if(tipo == 'partida')
  {
    cp_tq = cp_tq - cpt;
    stoq = stoq - cant;
  }
  else
  { 
    cp_tq = cp_tq + parseFloat($('table#alma_variante tr td.cp_t span').html());
    cpuq = cpuq + parseFloat($('table#alma_variante tr td.cp_u span').html());
    cpuq = (stoq!=0) ? (cp_tq/stoq) : (0);
  }

  cp_t = (cp_t!=0) ? (cp_t.toFixed(2)) : ('0.0');
  stoq = (stoq!=0) ? (stoq.toFixed(2)) : ('0.0');
  cpuq = (cpuq!=0) ? (cpuq.toFixed(6)) : ('0.0');
  cp_tq = (cp_tq!=0) ? (cp_tq.toFixed(2)) : ('0.0');

  $('table#stock_'+tipo+' tr td.almace span').html(alma);
  $('table#stock_'+tipo+' tr td.stock span').html(stoq);
  $('table#stock_'+tipo+' tr td.cp_u span').html(cpuq);
  $('table#stock_'+tipo+' tr td.cp_t span').html(cp_tq);  
}

function limpcarga(tipo)
{
  $('table#stock_'+tipo+' tr td span').html('&nbsp;');
  $('table#alma_'+tipo+' tr td span').html('&nbsp;');
}

$(document).on('change', '#id_partida', function (e) {
  var padre = $(this);
  var ialm = parseInt(padre.val());
  var tipo = $('#id_partida').closest('td.almace').attr('tipo');
  if(ialm>0)
  {
    cargacostos(tipo);
    $('#id_llegada').prop("disabled", false);
    var value = padre.val();
    $('select#id_llegada').children('option').each(function() {
        if ( $(this).val() === value ) {
            $(this).attr('disabled', true).siblings().removeAttr('disabled');   
        }
    });
    
  }
  else
  {
    $('#id_llegada').prop("disabled", true);    
    $('table#alma_variante tr td span').html('&nbsp;');
    limpcarga(tipo);
  } 

});

$(document).on('change', '#id_llegada', function (e) {
  var padre = $(this);
  var ialm = parseInt(padre.val());
  var tipo = $('#id_llegada').closest('td.almace').attr('tipo');

  if(ialm>0)
  {
    cargacostos(tipo);
  }
  else
  {
    limpcarga(tipo);
  }

});

$(document).on('focusout', '#cantidad', function (e) {
  var ialm = parseInt($('#id_partida').val());
  ialm = (ialm>0) ? (ialm) : (0);

  var sto = parseFloat($('table#alma_variante tr td.stock input.stock_'+ialm).val());
  sto = (sto>0) ? (sto) : (0);

  var cant = parseFloat($('#cantidad').val());
  cant = (cant>0) ? (cant) : (0);

  var tipo = $('#id_partida').closest('td.almace').attr('tipo');

  if(ialm>0)
  {
    cargacostos(tipo);
  }

  ialm = parseInt($('#id_llegada').val());
  tipo = $('#id_llegada').closest('td.almace').attr('tipo');
  if(ialm>0)
  {
    cargacostos(tipo);      
  }

  if(sto<cant)
  {
    $(this).addClass('erroinput');
    alerta('Verificar!', 'Stock Insuficiente', 'error');
  }
  else
  {
    $(this).removeClass('erroinput');
  }

});