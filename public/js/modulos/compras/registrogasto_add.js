$( document ).ready(function() { 

  jQuery.validator.setDefaults({
    debug: true,
    success: "valid",
    ignore: ""
  });

  $('#form_save_registrogasto').validate({
    rules:
    {
      id_proveedor: { required:true, number: true },
      fecha_ingreso:{ required:true, date: true },
      id_tipodocumento:{ required:true},
      serie:{maxlength:8},
      numero_correlativo:{maxlength:10},
      exist_pedido:{ required:true }
    },
    messages: 
    {
      id_proveedor: { required:"Ingresar", number: "Solo #s" },
      fecha_ingreso:{ required: "Ingresar Fecha", date: "Formato Error" },
      id_tipodocumento:{ required: "Ingresar"},
      serie:{maxlength:"Max 4 #s"},
      numero_correlativo:{maxlength:"Max 10 #s"},
      exist_pedido:{ required: "" } 
    },      

    highlight: function(element) {
      var nomb = $(element).attr('id');
      if(nomb == "serie" || nomb == "numero_correlativo")
      {
        $(element).closest('.input-group').addClass('has-error');   
      }
      else
      {
        $(element).closest('.form-group').addClass('has-error');        
        if($(element).attr('id')=="exist_pedido") 
        {
          alerta('Verificar!', 'Artículos', 'error');
        }
      }        
    },
    unhighlight: function(element) {
      var nomb = $(element).attr('id');
      if(nomb == "serie" || nomb == "numero_correlativo")
      {
        $(element).closest('.input-group').removeClass('has-error');
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
      var nomb = $(element).attr('name');
      if(nomb == "serie" || nomb == "numero_correlativo")
      {
        if(element.closest('.col-md-2').length) 
        {
          error.insertAfter(element.parent()); 
        }
      }
      else
      {
        if(element.parent('.col-md-4').length) 
        {
          error.insertAfter(element.parent()); 
        }
      }     
      
    },
    submitHandler: function() {
      var i = valid_exist_pedido();

      if(i==1)
      {
        var orden = parseInt($('#lista_articulos tr.ordenes').length);
        var temp = '&orden='+orden;
        var idfo = parseInt($('#id_formapago').val()); //console.log(idfo+' <-idfo')
        if(idfo==2)
        {
          //console.log("entro credito")
          var va = $(document).data('peri_odo'); //console.log(va);
          if(va.length)
          {
            temp = "&"+$(document).data('peri_odo');
          }
        }
        
        var edit = parseInt($('#edit_orden').val());
        var id_servicios = parseInt($('#id_servicios').val());

        $.ajax({
          url: $('base').attr('href') + 'registrogasto/save_registrogasto',
          type: 'POST',
          data: $('#form_save_registrogasto').serialize()+temp,
          dataType: "json",
          beforeSend: function() {
            showLoader('saveb');
          },
          success: function(response) {
            if (response.code==1) {
              var tipo = $('#myTab li.active').attr('tabs');
              var url = $('base').attr('href') +'registrogasto/edit/'+response.data.id+'/'+tipo;
              window.location.href = url;
            }
          },
          complete: function() {
            $('#addservicio').modal('hide');
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

  $('#form_save_add_elmcosto').validate({
    rules:
    {
      cantidad: { required:true, number: true },
      precio_unitario: { required:true, number: true },
      precio_total: { required:true, number: true } 
    },
    messages: 
    {
      cantidad: { required:"Cantidad", number: "Solo #s" },
      precio_unitario: { required:"Precio U", number: "Solo #s" },
      precio_total: { required:"Precio T", number: "Solo #s" }
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
      if(element.parent('.col-md-6').length) 
      {
        error.insertAfter(element.parent()); 
      }
    },
    submitHandler: function() {
      var edit = parseInt($('#edit_orden').val());
      var orden = parseInt($('#lista_articulos tr.ordenes').length);
      var id_servicios = parseInt($('#form_save_add_elmcosto #id_servicios').val());
      var operacion = parseInt($('.add_proveedor').attr('operacion'));
      var idprovart = $('#id_provart_serv').val();

      var codigo = parseInt($('#form_save_add_elmcosto #id_servicios').val());

      var temp = '&orden='+orden+'&operacion='+operacion+'&id_servicios='+id_servicios+'&codigo='+codigo+'&id_provart='+idprovart;

      $.ajax({
        url: $('base').attr('href') + 'registrogasto/add_elmcosto',
        type: 'POST',
        data: $('#form_save_add_elmcosto').serialize()+temp,
        dataType: "json",
        beforeSend: function() {
        },
        success: function(response) {
          if (response.code==1) {
            if(orden>0)
            {
              if(edit>0)
              {
                $('#lista_articulos tr#tr_'+id_servicios).html(response.data);
              }
              else
              {
                if($('table#lista_articulos tbody tr#tr_'+id_servicios).length) {}
                else
                {
                  $('#lista_articulos tbody').append(response.data);
                }
              }
            }
            else
            {
              if($('table#lista_articulos tbody tr#tr_'+id_servicios).length) {}
              else
              {
                $('table#lista_articulos tbody').html(response.data);
              }
              
            }
            sumarval();
            remover_arti(id_servicios);
          }
        },
        complete: function() {
          $('#addservicio').modal('hide');
        }
      });/**/
    }
  });

});

function remover_arti(id_servicios)
{
  if($('#buscar_serv tr#'+id_servicios).length)
  {
    $('#buscar_serv tr#'+id_servicios).remove();
    var num = parseInt($('#buscar_serv tbody tr td.orden_serv').length);
    if(num>0) 
    {
      var i = 0;
      $('#buscar_serv tbody tr td.orden_serv').each(function (index, value){
        i++;
        $(this).html(i);
      });
    }
    else
    {
      var page = 0;
      buscar_servicioss(page);
      num = parseInt($('#buscar_serv tbody tr td.orden_serv').length);
      if(num>0) { }
      else
      {
        $('#buscarart').modal('hide');
      }
    }
  }    
}

function sumarval()
{
  var num = parseInt($('#lista_articulos tbody tr.ordenes td.orden').length);
  if(num>0)
  {
    var preciot = parseFloat(0);
    var costot = 0;
    var impuestot = 0;
    var tipo = '';
    var sum = 0;
    var padre = "";
    $('#lista_articulos tbody tr td.sumar').each(function (index, value){
      tipo = $(this).find('span').attr('class'); //console.log(tipo);
      sum = parseFloat($(this).find('span').html()); //console.log(sum);

      switch(tipo) {
        case 'preciot':
          preciot = preciot+sum;
            break;

        case 'costot':
          costot = costot+sum;
            break;

        case 'impt':
          impuestot = impuestot+sum;
            break;

        default:
          break;
      }    
    });

    if($('tr#totales').length)
    {
      $('tr#totales').remove();
    }

    var tr = "<tr id='totales'><td colspan='8'><td align='right'><i class='pull-lef'>S/.</i> <span><b>"+preciot.toFixed(2)+"</b></span></td><td colspan='2'><td id='vvtotal' align='right'><i class='pull-lef'>S/.</i> <span><b>"+costot.toFixed(2)+"</b></span></td><td align='right'><i class='pull-lef'>S/.</i><span><b>"+impuestot.toFixed(2)+"</b></span></td><td></td></tr>";
    $('#lista_articulos tbody').append(tr);
    valid_exist_pedido();
  }
    
}

$(function () {
  /*Proveedor*/
  $( "#ruc_dni" ).autocomplete({ 
    params:{tipo_persona: function() { return $('#tipo_persona').val(); }},
    type:'POST',
    serviceUrl: $('base').attr('href')+"registrogasto/ruc_dni",
    onSelect: function (suggestion) {
      $('#id_proveedor').val(suggestion.id_proveedor);
    }
  });

  $('#fecha_busc').daterangepicker({
      singleDatePicker: true,
      format: 'YYYY-MM-DD',
      calender_style: "picker_4"
      }, 
      function(start, end, label) {}
  );

});

function openmodal()
{
  $('#buscarart').modal({
    keyboard: false,
    backdrop: 'static'
  });
}

$(document).on('click', '.buscarart', function (e)
{
    var id_proveedor = parseInt($('#id_proveedor').val());
    if(id_proveedor>0)
    {
      $('#buscarart').on('shown.bs.modal', function (e) {
      });
      openmodal();
      /*$('#buscarart').modal({ show: true, backdrop: 'static'});*/
      var page = 0;
      buscar_servicioss(page);     
    }
    else
    {
        alerta('Error','Tiene que buscar un Proveedor','error')
    }    
});

$(document).on('click', '#paginacion_dataserv li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  buscar_servicioss(page);
});

$(document).on('click', '#paginacion_dataserv a.paginate_button', function (e) {  
  var page = $(this).attr('tabindex');
  buscar_servicioss(page);
});

$(document).on('click', '#buscar_serv a.buscar', function (e) {  
  var page = 0;
  buscar_servicioss(page);
});

function buscar_servicioss(page)
{
  var id_proveedor = parseInt($('#id_proveedor').val());

  if(id_proveedor>0)
  {
    var ids = get_joinids('lista_articulos');
    var temp = "id_proveedor="+id_proveedor+"&page="+page+'&ids='+ids;
    var cd_busc = $('#buscar_serv #cd_busc').val();
    var ec_busc = $('#buscar_serv #ec_busc').val();
    var gr_busc = $('#buscar_serv #gr_busc').val();
    var fa_busc = $('#buscar_serv #fa_busc').val();
    
    if(cd_busc.trim().length)
    {
      temp=temp+'&cd_busc='+cd_busc;
    }

    if(ec_busc.trim().length)
    {
      temp=temp+'&ec_busc='+ec_busc;
    }

    if(gr_busc.trim().length)
    {
      temp=temp+'&gr_busc='+gr_busc;
    }

    if(fa_busc.trim().length)
    {
      temp=temp+'&fa_busc='+fa_busc;
    }

    $.ajax({
      url: $('base').attr('href') + 'registrogasto/buscar_servicioss',
      type: 'POST',
      data: temp,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
          if (response.code==1) {
            $('#buscar_serv tbody').html(response.data.rta);
            $('#paginacion_dataserv').html(response.data.paginacion);
          }
      },
      complete: function() {
          //hideLoader();
      }
    });
  }      
}

$(document).on('click', '.add_elmcosto', function (e)
{
  limp_todo('form_save_add_elmcosto');
  $('#codigo').html('');
  $('#umcompra').html('');
  var operac = parseInt($('.add_proveedor').attr('operacion'));
  operac = (operac>0) ? (operac) : (0);
  var text = (operac==1) ? ('Precio') : ('Costo');
  $('#addservicio label.cambsp span').html(text);

  $('#addservicio').modal({ show: true, backdrop: 'static'});

  var padre = $(this).closest('tr');
  var codigo = padre.find('td.codigo').html(); console.log(codigo);
  var idservicios = padre.attr('id');
  var gruposervicios = padre.find('td.gruposervicios').html();
  var familiaservicios = padre.find('td.familiaservicios').html();
  var servicios = padre.find('td.servicios').html();
  var umelemc = padre.find('td.umc').html();
  var idprovart = padre.attr('idprovart');

  if(umelemc.trim().length)
  {
    umelemc='('+umelemc+')';
  }
  $('#form_save_add_elmcosto #id_provart_serv').val(idprovart);
  $('#form_save_add_elmcosto #codigo').html(codigo);
  $('#form_save_add_elmcosto #gruposervicios').html(gruposervicios);
  $('#form_save_add_elmcosto #familiaservicios').html(familiaservicios);
  $('#form_save_add_elmcosto #servicios').val(servicios); 
  $('#form_save_add_elmcosto #umelemc').html(umelemc);
  $('#form_save_add_elmcosto #id_servicios').val(idservicios);
  $('#exist_pedido').val('si');
  $('#exist_pedido').parents('.form-group').removeClass('has-error');
});

$(document).on('click', '.btn_cancelar', function (e)
{
  $('#addservicio').modal('hide');
});

function get_joinids(div)
{
  var ids =  new Array();
  var i = 0;
  $('#'+div+' tbody tr.ordenes').each(function (index, value){
    ids[i] = $(this).attr('idservicios');
    i++;
  });
  return ids.join(',');
}

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

$(document).on('click', '.delete_elmcosto', function (e)
{
  var padre = $(this).parents('tr');
  var idservicios = parseInt(padre.attr('idservicios'));
  if(idservicios>0)
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
          sumarval();
        }
    });    
  }
});

$(document).on('click', '.edit_elmcosto', function (e)
{
  var padre = $(this).closest('tr');
  var idservicios = parseInt(padre.attr('idservicios'));
  var idprovart = parseInt(padre.attr('idprovart'));
  var operac = ($('.add_proveedor').attr('operacion'));

  if(idservicios>0 && idprovart>0 && operac>0)
  { 
    $('#id_provart_serv').val(idprovart);
    var codigo = padre.find('td.codigo').html();
    var descrip = padre.find('td.descrip span').html();
    var umcompra = padre.find('td.umcompra span').html();
    var cantidad = padre.find('td.cantidad input').val();

    var textu = (operac=="1") ? ('preciou') : ('costou'); console.log(operac); console.log(textu);
    var preciou = padre.find('td.'+textu+' input').val(); console.log(preciou);

    var textp = (operac=="1") ? ('ptotal') : ('costop'); console.log(textp);
    var preciot = padre.find('td.'+textp+' input').val(); console.log(preciot);

    var text = (operac=="1") ? ('Precio') : ('Costo');
    $('#addservicio label.cambsp span').html(text);

    $('#id_servicios').val(idservicios);
    $('#edit_orden').val('1');
    $('#codigo').html(codigo);
    $('#descripcion').val(descrip);
    $('#umcompra').html(umcompra);
    $('#cantidad_serv').val(cantidad);
    $('#preciou_serv').val(preciou);
    $('#preciot_serv').val(preciot);

    $('#addservicio').modal({ show: true, backdrop: 'static'});
  }

});

$(document).on('change', '.almacen', function (e) {
  var id_almacen = parseInt($(this).val());
  if(id_almacen>0)
  {
    $(this).removeClass('erroinput');
    valid_exist_pedido();
  }
  else
  {
    $(this).addClass('erroinput');
  }
});

function valid_exist_pedido()
{
  var i = 0;
  var cantidad = 0;
  var va = 0;
  var padre = "";
  var no = 0;

  $('.almacen').each(function (index, value){
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

  if(num>0 && i==0) { va = 1;}
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

$(document).on('click', '.add_proveedor', function (e) {
  var page = 0;
  $(this).attr({'operacion':''});
  buscar_proveedor(page);
});

$(document).on('click', '#buscar_provee .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
  var page = 0;

  buscar_proveedor(page);
});

$(document).on('click', '#paginacion_datap li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');

  buscar_proveedor(page);
});

$(document).on('click', '#paginacion_datap a.paginate_button', function (e) {  
  var page = $(this).attr('tabindex');

  buscar_proveedor(page);
});

$(document).on('click', '#buscar_provee a.buscarcliente', function (e) {  
  var page = 0;

  buscar_proveedor(page);
});

function buscar_proveedor(page)
{
  var nombres_com = $('tr#filtroprovee input.nombres_com').val(); 
  var razon_soc = $('tr#filtroprovee input.razon_soc').val();
  var ruc_dni = $('tr#filtroprovee input.ruc_dni').val();
  
  var temp = "page="+page;
  if(nombres_com.trim().length)
  {
    temp=temp+'&nombres_com='+nombres_com;
  }

  if(razon_soc.trim().length)
  {
    temp=temp+'&razon_soc='+razon_soc;
  }

  if(ruc_dni.trim().length)
  {
    temp=temp+'&ruc_dni='+ruc_dni;
  }
  //console.log(temp);  
  $.ajax({
      url: $('base').attr('href') + 'registrogasto/buscar_proveedor',
      type: 'POST',
      data: temp,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
          if (response.code==1) {
            $('#buscar_provee tbody').html(response.data.rta);
            $('#paginacion_datap').html(response.data.paginacion);
          }
      },
      complete: function() {
          //hideLoader();
      }
  });      
}

$(document).on('click', '.agre_provee', function (e) { 
  var padre = $(this).parents('tr');
  var rucdni = padre.attr('rucdni');
  var doc = padre.attr('doc');
  var rz = padre.find('td.rz').html();
  var idprov = padre.attr('idproveedor');
  var idprovart = padre.attr('idprovart');
  var tipope = padre.attr('tipope');
  var operac = padre.attr('operacion');
  $('.add_proveedor').attr({'operacion':operac});

  $('#id_proveedor').val(idprov);
  $('#id_provart_serv').val(idprovart);
  $('#tipo_persona').val(tipope);

  var tex = doc+': '+rucdni+','+ rz;
  $('#ruc_dni').val(tex);
  $('#buscarprovee').modal('hide');
  if($('#id_proveedor-error').length)
  {
    $('#id_proveedor-error').html('');
  }

  if($('#ruc_dni').closest('.form-group'))
  {
    if($('#ruc_dni').closest('.form-group').attr('class')=="form-group has-error")
    {
      $('#ruc_dni').closest('.form-group').removeClass('has-error');
    }
  }
});

$(document).on('focusout', '#fecha_busc', function (e) {
  if($('#fecha_busc').closest('.form-group'))
  {
    if($('#fecha_busc').closest('.form-group').attr('class')=="form-group has-error")
    {
      $('#fecha_busc').closest('.form-group').removeClass('has-error');
    }
  }
});

$(document).on('focusout', '#preciou_serv', function (e) {
  var cantidad = parseFloat($('#cantidad_serv').val());
  var pu = parseFloat($(this).val());
  var pt = (pu>0) ? (pu*cantidad) : ("");
  pt = parseFloat(pt);
  pt = (pt>0) ? (pt) : ("0.00");
  $('#preciot_serv').val(pt);
  if($('#preciot_serv').closest('.form-group'))
  {
    if($('#preciot_serv').closest('.form-group').attr('class')=="form-group has-error")
    {
      $('#preciot_serv').closest('.form-group').removeClass('has-error');
    }

    if($('#preciot_serv-error-error').length)
    {
      $('#preciot_serv-error-error').html('');
    }
  }
});

$(document).on('focusout', '#preciot_serv', function (e) {
  var cantidad = parseFloat($('#cantidad_serv').val());
  var pt = parseFloat($(this).val());
  var pu = (pt>0) ? (pt/cantidad) : ("");
  pu = parseFloat(pu);
  pu = (pu>0) ? (pu) : ("0.00");

  $('#preciou_serv').val(pu);
  if($('#preciou_serv').closest('.form-group'))
  {
    if($('#preciou_serv').closest('.form-group').attr('class')=="form-group has-error")
    {
      $('#preciou_serv').closest('.form-group').removeClass('has-error');
    }

    if($('#preciou_serv-error-error').length)
    {
      $('#preciou_serv-error-error').html('');
    }
  }
});

