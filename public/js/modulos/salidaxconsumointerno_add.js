$( document ).ready(function() { 

  jQuery.validator.setDefaults({
    debug: true,
    success: "valid",
    ignore: ""
  });

  $('#form_save_salidaxconsumointerno').validate({
    rules:
    {
      fecha_ingreso:{ required:true, date: true },
      exist_pedido:{ required:true }
    },
    messages: 
    {
      fecha_ingreso: { required:"Ingresar", number: "Solo #s" },
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
      if(element.parent('.col-md-4').length) 
      {
        error.insertAfter(element.parent()); 
      }
    },
    submitHandler: function() {
      var i = valid_exist_pedido();

      if(i==1)
      {
        $.ajax({
          url: $('base').attr('href') + 'salidaxconsumointerno/save_salidaxconsumointerno',
          type: 'POST',
          data: $('#form_save_salidaxconsumointerno').serialize(),
          dataType: "json",
          beforeSend: function() {
          },
          success: function(response) {
            if (response.code==1) {
            var tipo = $('#myTab li.active').attr('tabs');
            var url = $('base').attr('href') +'salidaxconsumointerno/edit/'+response.data.id+'/'+tipo;
            window.location.href = url;
            }
          },
          complete: function() {
          }
        });/**/
      }
      else
      {
        var text = '';
        if(i>0) {
          text = 'Verificar Artículos';
        }
        else
        {
          text = 'Seleccionar Almacén';
        }
        alerta('No Puede Guardar!', text, 'error');
      }        
    }
  });

  $('#datetimepicker6').datetimepicker({
    format: 'YYYY-MM-DD',
    locale: moment.locale("es")
  });
});

function valid_exist_pedido()
{
  var i = 0;
  var cantidad = 0;
  var va = 0;
  var padre = "";
  var no = 0;
  var canti = 0;
  var ialm = 0;
  var sto = 0;

  $('select.almacen').each(function (index, value){
    padre = $(this);
    cantidad = padre.val(); //console.log(cantidad);
    canti = parseFloat(padre.closest('tr').find('td.cantidad input').val());
    canti = (canti>0) ? (canti) : (0);
    ialm = parseInt(padre.closest('tr').find('td.alma select.almacen').val());
    ialm = (ialm>0) ? (ialm) : (0);
    sto = parseFloat(padre.closest('tr').find('td.stock input.sto_'+ialm).val());
    sto = (sto>0) ? (sto) : (0);

    if(cantidad == 0)
    {
      $(this).addClass('erroinput');
      i++;          
    }
    else
    {
      $(this).removeClass('erroinput');  
    }

    if(sto>=canti)
    {
      padre.closest('tr').find('td.cantidad input').removeClass('erroinput');
    }
    else
    {
      padre.closest('tr').find('td.cantidad input').addClass('erroinput');
      i++;
    }

  });

  $('select.acosto').each(function (index, value){
    padre = $(this);
    cantidad = padre.val(); //console.log(cantidad);
    if(cantidad == 0)
    {
      $(this).addClass('erroinput');
      i++;          
    }
    else
    {
      $(this).removeClass('erroinput');  
    }
  });

  
  var num = parseInt($('#lista_articulos tbody tr.ordenes td.orden').length);

  if(num>0 && i==0) { va = 1; }
  else {
    if(i>0) { va=2; }
  }

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

$(document).on('click', '.add_articulos, .buscar', function (e) {
  var page = 0;
  buscar_articulos(page);
});

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');

  buscar_articulos(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {  
  var page = $(this).attr('tabindex');

  buscar_articulos(page);
});

function buscar_articulos(page)
{
  var codigo_busc = $('#codigo_busc').val();
  var descripcion_busc = $('#descripcion_busc').val();
  var ids = get_joinids('lista_articulos');

  var temp = "page="+page+'&ids='+ids;


  if(codigo_busc.trim().length)
  {
    temp=temp+'&codigo_busc='+codigo_busc; //console.log(codigo_busc);
  }
  if(descripcion_busc.trim().length)
  {
    temp=temp+'&descripcion_busc='+descripcion_busc; //console.log(descripcion_busc);
  }


  $.ajax({
    url: $('base').attr('href') + 'salidaxconsumointerno/buscar_articulos',
    type: 'POST',
    data: temp,
    dataType: "json",
    beforeSend: function() {
      //showLoader();
    },
    success: function(response) {
      if (response.code==1) {
        $('#buscar_arti tbody').html(response.data.rta);
        $('#pagina_data_buscar').html(response.data.paginacion);
      }
    },
    complete: function() {
        //hideLoader();
    }
  });      
}

$(document).on('click', 'a.edit_articulo', function (e)
{
  var padre = $(this).parents('tr');
  var idsu = padre.attr('idartsucursal');
  var orden = parseInt(padre.find('td.orden').html());
  orden = (orden>0) ? (orden-1) : (orden);

  var temp = 'id_art_sucursal='+idsu+'&orden='+orden;

  $.ajax({
    url: $('base').attr('href') + 'salidaxconsumointerno/add_articulo',
    type: 'POST',
    data: temp,
    dataType: "json",
    beforeSend: function() {
    },
    success: function(response) {
      if (response.code==1) { console.log('tr_'+idsu);
        $('table#lista_articulos tbody tr#tr_'+idsu).html(response.data);
      }
    },
    complete: function() {
      $('#addarticulo').modal('hide');
    }
  });
});

$(document).on('click', 'a.add_arti', function (e)
{
  var padre = $(this).parents('tr');
  var idsu = padre.attr('idartsucursal');
  var orden = parseInt($('table#lista_articulos tbody tr.ordenes').length);

  var temp = 'id_art_sucursal='+idsu+'&orden='+orden+'&edit_orden=1';
  var num = parseInt($('table#lista_articulos tbody tr td h2').length);
  $.ajax({
    url: $('base').attr('href') + 'salidaxconsumointerno/add_articulo',
    type: 'POST',
    data: temp,
    dataType: "json",
    beforeSend: function() {
    },
    success: function(response) {
      if (response.code==1) {
        var exist = 1;
        if(num>0)
        {
          exist = (parseInt($('table#lista_articulos tbody tr#tr_'+idsu).length)) ? exist : 0;
          if(exist==0)
          {
            $('table#lista_articulos tbody').html(response.data);
            padre.remove();
          }            
        }
        else
        {
          exist = (parseInt($('table#lista_articulos tbody tr#tr_'+idsu).length)) ? exist : 0;
          if(exist==0)
          {
            $('table#lista_articulos tbody').append(response.data);
            padre.remove();
          }          
        }          
        
        var cant = parseInt($('table#buscar_arti tbody tr td.orden_arti').length);
        if(cant==0)
        {
          buscar_articulos(0);
        }
      }
    },
    complete: function() {
      $('#addarticulo').modal('hide');
    }
  });/**/
});

function get_joinids(div)
{
  var ids =  new Array();
  var i = 0;
  $('#'+div+' tbody tr.ordenes').each(function (index, value){
    ids[i] = $(this).attr('idartsucursal');
    i++;
  });
  return ids.join(',');
}

$(document).on('click', '.delete_articulo', function (e)
{
  var padre = $(this).parents('tr');
  var idartsucursal = parseInt(padre.attr('idartsucursal'));
  if(idartsucursal>0)
  {
    swal({
      title: 'Estas Seguro?',
      text: "De Eliminar este Artículo",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, estoy seguro!'
      }).then(function(isConfirm) {
        if (isConfirm) {
          padre.remove();
          num_orden('lista_articulos');
          valid_exist_pedido();
        }
    });    
  }
});

function num_orden(div)
{
  var i = 0;
  var num = parseInt($('#'+div+' tbody tr.ordenes td.orden').length);
  if(num>0)
  {
    $('#'+div+' tbody tr.ordenes td.orden').each(function (index, value){
      i++;
      $(this).html(i);
    });
  }    
}

$(document).on('change', '.almacen', function (e) {
  var padre = $(this);
  var ialm = parseInt(padre.val());

  if(ialm>0)
  {
    var sto = padre.closest('tr').find('td.stock input.sto_'+ialm).val();
    var cp_u = padre.closest('tr').find('td.stock input.cpu_'+ialm).val(); console.log(sto);
    cp_u = (validnum(cp_u)==1) ? (cp_u) : (0);
    padre.closest('tr').find('td.alma input.copu').val(cp_u);

    sto = (validnum(sto)==1) ? (parseFloat(sto)) : (0);
    sto = (sto>0) ? (sto.toFixed(2)):("0.00");
    padre.closest('tr').find('td.stock span').html(sto);
  }
  else
  {
    padre.closest('tr').find('td.stock span').html('0.00');
    padre.closest('tr').find('td.alma input.copu').val('0.00');
  }
  valid_exist_pedido();
});

$(document).on('focusout', '.canti', function (e) {
  var padre = $(this);
  var canti = padre.val();
  var ialm = parseInt(padre.closest('tr').find('td.alma select.almacen').val());
  ialm = (ialm>0) ? (ialm) : (0); console.log('ialm->'+ialm);
  var sto = parseFloat(padre.closest('tr').find('td.stock input.sto_'+ialm).val());
  sto = (sto>0) ? (sto) : (0); console.log('sto->'+sto);
  if(mayorqcero(canti) == 1) {
    canti = parseFloat(canti);
    canti = (canti>0) ? (canti) : (0); console.log('canti->'+canti);
    if(sto>=canti)
    {
      $(this).removeClass('erroinput');
    }
    else
    {
      $(this).addClass('erroinput');
      alerta('Error', 'Stock Insuficiente', 'error');
    }    
  }
  else
  {
    $(this).addClass('erroinput');
    alerta('Error', 'Ingresar # Mayor a 0', 'error');
  }
  valid_exist_pedido();
});

function validnum(exp)
{
  var valor = 0;
  if (exp <= 0) {  }
  else {
    if($.isNumeric(exp)) { 
      valor = 1;
    }
  }
  return parseInt(valor);
}

function mayorqcero(exp)
{
  var valor = 0;
  if (exp <= 0) {  }
  else {
    if($.isNumeric(exp)) {
      valor = parseFloat(exp);
      if(valor>0){ valor = 1; }      
    }
  }
  return parseInt(valor);
}