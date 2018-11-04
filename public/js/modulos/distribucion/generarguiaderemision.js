$( document ).ready(function() {
  jQuery.validator.setDefaults({
    debug: true,
    success: "valid",
    ignore: ""
  });

  $('#form_save_guiarpedido').validate({
    rules:
      {
        //braulio
        id_proveedor: { required:true, number: true },
        //sede_llegada: { required:true},
        fecha_traslado: { required:true},
        fecha_entrega: { required:true},

        //serie:{ required:true},
        id_vehiculo:{ required:true  },
        id_conductor:{ required:true  },
        id_cliente_llegada:{required:true  },
        //id_tipodocumento:{required:true},
        exist_pedido:{ required:true }
      },
      messages: 
      {
        fecha_traslado: { required:"Fecha", date: "Formato Error" },
        //texto_fechaentrega: { required:"Fecha", date: "Formato Error" },
        fecha_entrega: { required:"Fecha", date: "Formato Error" },        
        //serie:{ required: "ingresar" },
        id_vehiculo:{ required: "ingresar" },
        id_conductor: { required: "ingresar" },
        id_cliente_llegada: { required: "ingresar" },
        //id_tipodocumento: { required: "ingresar" },
        exist_pedido:{ required:"" }
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
        var i = 0;
        var cantidad = 0;
        var cantmax = 0;
        var padre = "";
        var no = 0;
        var nutot = 0;
        var stock = 0;

        $('.bfh-number').each(function (index, value){
          padre = $(this);
          cantidad = parseFloat(padre.val()); //console.log(cantidad);
          cantmax = parseFloat(padre.parents('tr').find('td.cantidadp input').val());
          stock = parseFloat(padre.parents('tr').find('td.stock span').html());
          if(validnum(cantidad))
          {
            if(stock>=cantidad)
            {              
             $(this).removeClass('erroinput');
            }
            else
            {
              $(this).addClass('erroinput');
              i++;
            }
          }
          else
          {
            $(this).addClass('erroinput');
            i++;
          }
          nutot++;
          if(cantidad == 0) {no++;}
        });

        $('.almacen').each(function (index, value){
          padre = $(this);
          cantidad = parseFloat(padre.val());
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

        if(no == nutot) { i++; }

        if(i==0)
        {
          $.ajax({
            url: $('base').attr('href') + 'generarguiaderemision/save_generarguiaderemision',
            type: 'POST',
            data: $('#form_save_guiarpedido').serialize(),
            dataType: "json",
            beforeSend: function() {
              showLoader();
            },
            success: function(response) {
              if (response.code==1) {
                console.log(response.data.motivo);
                if(response.data.motivo==='04'){ 
                  alerta('Registrado', 'guiaremision correctamente', 'success');
                  window.location.href = $('base').attr('href')+'trasladosucursal';
                }else{
                  $('#sub_guia').remove();
                  var url = $('base').attr('href');
                  var link = url+'guiaremision/pdf_guia/'+response.data.pdf;
                  $('#guiaremisionpdf .crear-evento').html("<iframe width='100%' height='500' src='"+link+"'></iframe>");
                  $('#guiaremisionpdf').modal({ show: true, backdrop: 'static'});
                  hideLoader();
                  var cbx = response.data.cbx;
                  $(document).data('arrcbx',cbx);             
                }    
              }          
            },
            complete: function() {
            }
          });
        }         
      }
  });

  $('#fecha_traslado').daterangepicker({
    singleDatePicker: true,
    format: 'DD-MM-YYYY',
    calender_style: "picker_4"
  }, function(start, end, label) {
    console.log(start.toISOString(), end.toISOString(), label);
  });

  $('#fecha_entrega').daterangepicker({
    singleDatePicker: true,
    format: 'DD-MM-YYYY',
    calender_style: "picker_4"
  }, function(start, end, label) {
    console.log(start.toISOString(), end.toISOString(), label);
  });
});

$(document).on('click', 'a#irfacturar', function (e) {
  cbx = $(document).data('arrcbx'); console.log(cbx);
  var url = $('base').attr('href')+'facturacion/guia/';
  var idg = 0;
  $('#guiaremisionpdf').modal('hide');

  swal({
    title: 'Selecionar Guía a Facturar',
    input: 'select',
    inputOptions: eval(cbx),
    inputPlaceholder: 'Guía',
    showCancelButton: true,
    cancelButtonColor: '#d33',
    inputValidator: function(value) {
      return new Promise(function(resolve, reject) {
        idg = parseInt(value);
        idg = (idg>0) ? (idg) : (0);
        if (idg>0) {
          resolve();
          url = url+idg;                            
        } else {
          reject('Seleccionar Guía');
        }
      });
    }
  }).then(function(result) {
    console.log(result);
    if (result) {     
      window.location.href = url;
    }
    else
    {
      $('#guiaremisionpdf').modal({ show: true, backdrop: 'static'});
    }
  });
    
});

$(document).on('keypress', '.bfh-number', function (e) {
  /*if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
    return false;
  }*/
  if(e.which != 46 && (e.which < 47 || e.which > 59)) {
    return false;
  }
});

$(document).on('focusout', '.bfh-number', function (e) {
  var padre = $(this);
  var cantidad = parseFloat(padre.val());
  var stock = parseFloat(padre.parents('tr').find('td.stock span').html());
  //console.log(stock);
  var tr = $(this).parents('tr');//
  var ideliminar = parseInt(tr.attr('ideliminar'));//
  var pesoU = parseInt(tr.attr('peso'));//
  var pesototal = cantidad * pesoU;//


  var CostoVU = parseFloat(tr.attr('CostoVU'));//
  var CostoTotal = CostoVU *  cantidad;//

  if(validnum(cantidad))
  {
    if(stock>=cantidad)
    {
     // SumarTotales();
      $('.cantidad'.concat(ideliminar)).text(padre.val());//
     // console.log(padre);
      $('.pesoTotal' + ideliminar + ' .p__t').html(pesototal);
      $('.CostoVentaT'+ideliminar + ' .c__t' ).html(CostoTotal);
     

      $(this).removeClass('erroinput');
      var pesou = padre.parents('tr').find('td.pesou input').val();
      var pesot = pesou*cantidad;
      padre.parents('tr').find('td.pesot span').html(pesot);
      padre.parents('tr').find('td.pesot input').val(pesot);

      var costou = parseFloat(padre.parents('tr').find('td.costo_u input.costo_unitario').val());
      costou = (costou>0) ? (costou) : (0);
      var factov = parseFloat(padre.parents('tr').find('td.costo_u input.factor_venta').val());
      factov = (factov>0) ? (factov) : (0);
      var costov = parseFloat(costou*factov*cantidad);
      costov = (costov>0) ? (costov.toFixed(2)) : ('0.00');
      padre.parents('tr').find('td.costo_t span.pull-right').html(costov);

      costototal();
    }
    else
    {
      $(this).addClass('erroinput');
      alerta("Error!", 'Verificar el Stock.', 'error');
    }
    
  }
  else
  {
    $(this).addClass('erroinput');
  }      

});

$(document).on('change', '#id_conductor', function (e) {
  var id_conductor = $(this).val();
  $('#licencia_conducir').html('');
  $('#texto_licenciaconducir').html('');
  if(id_conductor>0)
  {
    $.ajax({
      url: $('base').attr('href') + 'guiaremision/get_all_conductores',
      type: 'POST',
      data: 'id_conductor='+id_conductor,
      dataType: "json",
      beforeSend: function() {
        //showLoader();
      },
      success: function(response) {
        if (response.code==1) {
          $('#licencia_conducir').html(response.data);
          $('#texto_licenciaconducir').val(response.data);
          var conductor = $('#id_conductor option:selected').text();
          $('#texto_conductor').val(conductor);
        }              
      },
      complete: function() {        
      }
    });
  }    
});

$(document).on('change', '#id_vehiculo', function (e) {
  var vehiculo = $('#id_vehiculo option:selected').text();  //console.log(vehiculo);
  $('#texto_vehiculoplaca').val(vehiculo);
});

$(document).on('change', '#id_tipodocumento', function (e) {
  var tipodocumento = $('#id_tipodocumento option:selected').text(); // console.log(tipodocumento);
  $('#texto_tipodocumento').val(tipodocumento);
});

function numdocu(e)
{
  var keynum = window.event ? window.event.keyCode : e.which;
  if ((keynum == 8) || (keynum == 46))
      return true;
  var numero = test(String.fromCharCode(keynum)); // console.log(numero);    
  return /\d/.numero;
}

function addzeros(s) {
  var str = "000000";
  var cant = 6-s.length;
  return (cant==0) ? ("") : (str.substring(0, cant));
}

$(document).on('focusout', '#numero', function (e) {
  var padre = $(this);
  var ceros = addzeros(padre.val());
  $('#ceros').html(ceros);
  $('#cero_numeguia').val(ceros);
});

$(document).on('focusout', '#serie', function (e) {
  var serie = $(this).val();
  if(serie>0)
  {
    $.ajax({
      url: $('base').attr('href') + 'guiaremision/get_numcorrelativo',
      type: 'POST',
      data: 'serie='+serie,
      dataType: "json",
      beforeSend: function() {
        //showLoader();
      },
      success: function(response) {
        if (response.code==1) {
          var numero = parseInt(response.data.numero);
          $('#numero').val(numero);
          var str = "000000";
          var len = response.data.cantdig;
          var cant = 6-len;
          var ceros = (cant==0) ? ("") : (str.substring(0, cant));
          $('#ceros').html(ceros);
          $('#cero_numeguia').val(ceros);
        }              
      },
      complete: function() {
      }
    });
  }
    
});

$(document).on('change', '.almacen', function (e) {
  var padre = $(this);
  var id_almacen = parseInt(padre.val());
  if(id_almacen>0)
  {
    $(this).removeClass('erroinput');
  }
  else
  {
    $(this).addClass('erroinput');
  }

  var id = parseInt(padre.parents('tr').attr('idartisucu'));
  if(id>0)
  {
    var cantidad = parseFloat($('tr#padre_'+id+' td.cantidad input').val());
    cantidad = (cantidad>0) ? (cantidad) : (0);
    var stock = parseFloat($('tr#padre_'+id+' td.stock input.idalma_'+id_almacen).val());
    stock = (stock>0) ? (stock.toFixed(2)) : (0);
    $('tr#padre_'+id+' td.stock span').html(stock);

    var zona = $('tr#padre_'+id+' td.zona input.zona_'+id_almacen).val();
    var area = $('tr#padre_'+id+' td.area input.area_'+id_almacen).val();
    var ubic = $('tr#padre_'+id+' td.ubic input.ubic_'+id_almacen).val();

    $('tr#padre_'+id+' td.zona span').html(zona);  //console.log(zona);
    $('tr#padre_'+id+' td.area span').html(area); //console.log(area);
    $('tr#padre_'+id+' td.ubic span').html(ubic); //console.log(ubic);

    if(cantidad>0)
    {      
      if(stock>=cantidad)
      {
        var costou = parseFloat($('#idalm_'+id+' option:selected').attr('label'));
        costou = (costou>0) ? (costou) : (0);
        $('tr#padre_'+id+' .costo_unitario').val(costou);
        
        var factov = parseFloat($('tr#padre_'+id+' .factor_venta').val());
        factov = (factov>0) ? (factov) : (0);

        var costov = (parseFloat(costou*factov)>0) ? (parseFloat(costou*factov)) : (0);
        var costot = (parseFloat(costov*cantidad)>0) ? (parseFloat(costov*cantidad)) : (0);

        costov = (costov>0) ? (costov.toFixed(2)) : ('0.00');
        costot = (costot>0) ? (costot.toFixed(2)) : ('0.00');

        $('tr#padre_'+id+' td.costo_u span.pull-right').html(costov);
        $('tr#padre_'+id+' td.costo_t span.pull-right').html(costot);
      }
      else
      {
        alerta("Error!", 'Verificar el Stock.', 'error');
        $('tr#padre_'+id+' td.zona span').html('');
        $('tr#padre_'+id+' td.area span').html('');
        $('tr#padre_'+id+' td.ubic span').html('');
      }
    }        
  }
});

$(document).on('click', '.btn_salir', function (e) {  
  swal({
    title: 'Ya imprimio?',
    text: "Desea Salir ",
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, estoy seguro!'
  }).then(function(isConfirm) {
    if (isConfirm) {     
      window.location.href = $('#linkmodulo').attr('href') +'/pedido/'+$('#id_pedido').val();
    }
    else
    {
      $('#guiaremisionpdf').modal({ show: true, backdrop: 'static'});
    }
  });
});

function validnum(exp)
{
  var valor = 0;

  if (exp <= 0) {
    if(exp==0)
    {
      valor = 1;
    }
  }
  else {
    if($.isNumeric(exp)) { 
      valor = 1;
    }
  }
  return parseInt(valor);
}

$(document).on('click', 'table#buscar_arti .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
});

$(document).on('click', '#pagina_data_buscar li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');

  buscar_articulos(page);
});

$(document).on('click', '#pagina_data_buscar a.paginate_button', function (e) {  
  var page = $(this).attr('tabindex');

  buscar_articulos(page);
});

$(document).on('click', 'table#buscar_arti a.buscar', function (e) {  
  var page = 0;

  buscar_articulos(page);
});

function buscar_articulos(page)
{
  var codigo_busc = $('#codigo_busc').val();
  var descripcion_busc = $('#descripcion_busc').val();
  var temp = "page="+page;
  if(codigo_busc.trim().length)
  {
    temp=temp+'&codigo_busc='+codigo_busc;  //console.log(codigo_busc);
  }
  if(descripcion_busc.trim().length)
  {
    temp=temp+'&descripcion_busc='+descripcion_busc; // console.log(descripcion_busc);
  }
  var ids = get_joinids('lista_pedidos');

  $.ajax({
    url: $('base').attr('href') + 'articuloxsucursal/buscar_art_venta',
    type: 'POST',
    data: temp,
    dataType: "json",
    beforeSend: function() {
      $('#cargando').removeClass('collapse');
    },
    success: function(response) {
      if (response.code==1) {
        $('#buscar_arti tbody').html(response.data.rta);
        $('#pagina_data_buscar').html(response.data.paginacion);
      }
    },
    complete: function() {
        $('#cargando').addClass('collapse');
    }
  });
}

$(document).on('click', 'table#buscar_arti tbody td.almi select.alm', function (e) {
  var tis = $(this);
  var idalma = parseInt(tis.val());
  var padre = tis.closest('tr');
  var idarts = parseInt(padre.attr('idartsucursal'));

  var stoki = (idalma>0 && idarts>0) ? (parseFloat(padre.find('td.stock input.stoki_'+idarts+'_'+idalma).val())) : (0);

  stoki = (stoki>0) ? (stoki.toFixed(2)) : ('');
  padre.find('td.stock span').html(stoki);
});

$(document).on('click', '.add_articulos', function (e) {
  var page = 0;
  buscar_articulos(page);
});




$(document).on('click', '.add_arti', function (e)
{
  var padre = $(this).parents('tr');
  var id = parseInt(padre.attr('idartsucursal'));
  if(id>0)
  {    
    var temp = 'idartsu='+id
    var idalm = parseInt(padre.find('td.almi input').val());

    var canti = parseFloat(padre.find('td.canntid input').val());
    
    if(idalm>0)
    {
      if($('table#lista_pedidos tbody tr#padre_'+id).length)
      {
        alerta('No!', 'Ya esta agregado', 'error');
      }
      else
      {
        var ky = parseInt($('#lista_pedidos tbody tr.ordenes td.orden').length);
        temp = temp+'&idalm='+idalm+'&ky='+ky;
        var stoki = parseFloat(padre.find('td.stock span').html());
        //console.log('canti->'+canti+' stoki->'+stoki);
        if(canti>0)
        {
          if(canti<=stoki)
          {
            temp = temp+'&canti='+canti;
            //console.log(temp);
            $.ajax({
              url: $('base').attr('href') + 'guiaremision/add_arti_alm',
              type: 'POST',
              data: temp,
              dataType: "json",
              beforeSend: function() {
                //showLoader();
              },
              success: function(response) {
                if (response.code==1) {
                  //console.log(response);
                  if($('table#lista_pedidos tbody tr#padre_'+id).length)
                  {
                    alerta('No!', 'Ya esta agregado', 'error');
                  }
                  else
                  {
                    if(ky>0)
                    {
                      $('#lista_pedidos tbody').append(response.data.data1);
                      $('#lista_pedidos1 tbody').append(response.data.data2);
                      $('#lista_pedidos2 tbody').append(response.data.data3);
                    }
                    else
                    {
                      $('#lista_pedidos tbody').html(response.data.data1);
                      $('#lista_pedidos1 tbody').html(response.data.data2);
                      $('#lista_pedidos2 tbody').html(response.data.data3);                    }
                    remover_arti(id);
                    sumarval();
                  }                    
                }
              },
              complete: function() {
                //hideLoader();
              }
            });
          }
          else
          {
            alerta('No puedo Agregar!', 'Cantidad excede Stock', 'error');
          }
        }
        else
        {
          alerta('No puedo Agregar!', 'Cantidad Incorrecta', 'error');
        }
      }        
    }
    else
    {
      alerta('No puedo Agregar!', 'Seleccionar Almacén', 'error');
    }
  }
    
});

function remover_arti(id_art_sucursal)
{
  if($('#buscar_arti tr#'+id_art_sucursal).length)
  {
    $('#buscar_arti tr#'+id_art_sucursal).remove();
    var num = parseInt($('#buscar_arti tbody tr td.orden').length);
    if(num>0) 
    {
      var i = 0;
      $('#buscar_arti tbody tr td.orden').each(function (index, value){
        i++;
        $(this).html(i);
      });
    }
    else
    {
      var page = 0;
      buscar_articulos(page);
      num = parseInt($('#buscar_arti tbody tr td.orden').length);
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
  var num = parseInt($('#lista_pedidos1 tbody tr.ordenes td.orden').length);
  if(num>0)
  {
    var costot = 0;
    var pesot = 0;
    var tipo = '';
    var sum = 0;
    var padre = "";
    $('#lista_pedidos1 tbody tr td.sumar').each(function (index, value){
      tipo = $(this).find('span.pull-right').attr('class'); //console.log('tipo->'+tipo);
      tipo = tipo.replace("pull-right ", ""); //console.log('tipo2->'+tipo);
      sum = parseFloat($(this).find('span.pull-right').html()); //console.log('su suma->'+sum);
      switch(tipo) {
        case 'c__t':
          costot = costot+sum;
            break;

        case 'p__t':
          pesot = pesot+sum;
            break;

        default:
          break;
      }    
    });
    $('#lista_pedidos2 tbody tr td.sumar').each(function (index, value){
      tipo = $(this).find('span.pull-right').attr('class'); //console.log('tipo2018->'+tipo);
      tipo = tipo.replace("pull-right ", ""); //console.log('tipo22018->'+tipo);
      sum = parseFloat($(this).find('span.pull-right').html()); //console.log('su suma2018->'+sum);
      switch(tipo) {
        case 'c__t':
          costot = costot+sum;
            break;

        case 'p__t':
          pesot = pesot+sum;
            break;

        default:
          break;
      }    
    });
//
    if($('tr#totalescosto').length)
    {
      $('tr#totalescosto').remove();
    }

    if($('tr#totalespeso').length)
    {
      $('tr#totalespeso').remove();
    }
    
    costot = (costot>0) ? (costot.toFixed(2)) : ("0.00");
    pesot = (pesot>0) ? (pesot.toFixed(0)) : ("0.00");
    var tr = "<tr id='totalescosto'><td colspan='7'></td><td align='right' class='costototal'><i class='pull-lef'>S/.</i> <span><b>"+costot+"</b></span></td></tr>";
    var tr1 = "<tr id='totalespeso'><td colspan='6'></td><td align='right' class='pesototal'><i class='pull-lef'></i> <span><b>"+pesot+"</b></span></td><td colspan='1'></td></tr>";
    $('#lista_pedidos1 tbody').append(tr);
    $('#lista_pedidos2 tbody').append(tr1);
    valid_exist_pedido();
  }     
}

function valid_exist_pedido()
{
  var i = 0;
  var cantidad = 0;
  var prec = 0;
  var va = 0;
  var padre = "";
  var no = 0;

  $('.bfh-number').each(function (index, value){
    padre = $(this);
    cantidad = padre.val(); //console.log(cantidad);
    if(cantidad >0)
    {
      $(this).removeClass('erroinput');        
    }
    else
    {
      $(this).addClass('erroinput');
      i++;  
    }
  });
  
  var num = parseInt($('#lista_pedidos1 tbody tr.ordenes td.orden').length);

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

$(document).on('click', '.limpiarform', function (e) {
  lip_busqueda('form_busc_kardex');
});

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
  var page = $(this).find('a').attr('tabindex'); //console.log('enra1');

  buscar_proveedor(page);
});

$(document).on('click', '#paginacion_datap a.paginate_button', function (e) {  
  var page = $(this).attr('tabindex'); //console.log('enra2');

  buscar_proveedor(page);
});

$(document).on('click', '#buscar_provee a.buscarcliente', function (e) {  
  var page = 0;

  buscar_proveedor(page);
});



$(document).on('click', '#buscar_proveenat .limpiarfiltronat', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
  var page = 0;

  buscar_proveedorNatural(page);
});

$(document).on('click', '#paginacion_datap2 li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex'); //console.log('enra1');

  buscar_proveedorNatural(page);
});

$(document).on('click', '#paginacion_datap2 a.paginate_button', function (e) {  
  var page = $(this).attr('tabindex');//console.log('enra2');

  buscar_proveedorNatural(page);
});

$(document).on('click', '#buscar_proveenat a.buscarprovnat', function (e) {  
  var page = 0;

  buscar_proveedorNatural(page);
});


$(document).on('change', '#id_tipodocumento', function (e) { 
  var tis = $(this);
  var txt = "";
  var id = parseInt(tis.val());
  if(id>0)
  {
    txt = $('#id_tipodocumento option:selected').text();
  }
  $('#texto_tipodocumento').val(txt);
});

$(document).on('click', '.agre_cliente', function (e) {  
  var padre = $(this).parents('tr');
  var idsuc = parseInt(padre.find('td.sucursal select').val());
 // console.log(idsuc);
  if(idsuc>0)
  {
    var tipope = parseFloat(padre.attr('tipope'));
   
    var idcliente = parseFloat(padre.find('td.orden input.id_cliente').val());
    var id_pers = parseFloat(padre.find('td.orden input.id_pers').val());
    var tipo = parseFloat(padre.find('td.orden input.tipo_persona').val());
    var r_d = padre.find('td.orden input.r_d').val();

    var rz = padre.find('td.orden input.razons').val();
    var dniruc = parseFloat(padre.find('td.orden input.dni_ruc').val());

    var texto_etiqcliente = padre.find('td.orden input.texto_etiqcliente').val();
    var texto_etiqdniruc = padre.find('td.orden input.texto_etiqdniruc').val();
    if(padre.find('td.orden input#direc_'+idsuc).length)
    {
      var texto_direcllegada = padre.find('td.orden input#direc_'+idsuc).val();
      $('#texto_direcllegada').val(texto_direcllegada);
      $('#direc_llega').html(texto_direcllegada);
      $('#sede_llegada').val(texto_direcllegada);
    }
    

    var cbxm = $('#cbxm_'+tipope).val();
    $('#id_tipodocumento').html(cbxm);
    var tipodocumento = $('#txt_'+tipope).val(); //console.log(tipodocumento);
    $('#texto_tipodocumento').val($('#id_tipodocumento option:selected').text());

    //braulio
    var tex = 'Ruc:' + dniruc +' '+rz;
    $('#ruc_dni').val(tex);//
    //$('#id_cliente_llegada').val(tex);

    $('#etqcli').html(texto_etiqcliente);
    $('#texto_etqcliente').val(texto_etiqcliente);

    $('#cl_ie').html(rz);
    $('#texto_cliente').val(rz);

    $('#dn_ru').html(dniruc);
    $('#texto_dni_ruc').val(dniruc);

    $('#etqdr').html(texto_etiqdniruc);
    $('#texto_etqdniruc').val(texto_etiqdniruc);    

    $('#id_sucursal_llegada').val(idsuc);

    $('#id_cliente_llegada').val(idcliente);

    $('#tipo_persona').val(tipo);

    $('#buscarclientes').modal('hide');
  }
  else
  {
    alerta('Error','Seleccionar una sucursal','error');
  }
});

function buscar_proveedor(page)
{
  var nombres_com = $('tr#filtrocljud input.nombres_com').val(); 
  var razon_soc = $('tr#filtrocljud input.razon_soc').val();
  var ruc_dni = $('tr#filtrocljud input.ruc_dni').val();
  
  var temp = 'page='+page+'&tipo_persona=1';
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
      url: $('base').attr('href') + 'guiaremision/getallcliente',
      type: 'POST',
      data: temp,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
          if (response.code==1) {
            //console.log(response.data.paginacion);
            $('#buscar_provee tbody').html(response.data.rta);
            $('#paginacion_datap').html(response.data.paginacion);
          }
      },
      complete: function() {
          //hideLoader();
      }
  });      
}

function get_joinids(div)
{
  var ids =  new Array();
  var i = 0;
  $('#'+div+' tbody tr.ordenes').each(function (index, value){
    ids[i] = $(this).attr('idartisucu');
    i++;
  });
  return ids.join(',');
}


//braulio

function eliminar(tipo,padre,tr1,tr2)
{
  swal({
    title: 'Estas Seguro?',
    text: "De Eliminar este "+tipo,
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, estoy seguro!'
    }).then(function(isConfirm) {
      if (isConfirm) {
        padre.remove();
        tr1.remove();
        tr2.remove();
        costototal();
        num_orden('lista_articulos');
        valid_exist_pedido();
        sumarval();
        ocultar_almtab();

      }
  });

}

$(document).on('click', '.delete_guia', function (e)
{
  var padre = $(this).parents('tr');
  var ideliminar = parseInt(padre.attr('ideliminar'));
  var tr1 = $('#lista_pedidos1 tbody tr.trE'+ ideliminar);
  var tr2 = $('#lista_pedidos2 tbody tr.trE'+ ideliminar);




  if(ideliminar>0)
  { 
    //$('#padre_'+ideliminar).remove();
    eliminar('Articulo',padre,tr1,tr2);    
  }
});

function costototal(){
  var total=0;
  var pesot=0;
  $('#lista_pedidos1 tbody td.costo_t .c__t').each(function(index,element){
    total += parseFloat($(this).html());
  
    //console.log("TOTAL -- " + total);

  });
   $('#lista_pedidos2 tbody td.pesot .p__t').each(function(index,element){
    pesot += parseFloat($(this).html());
  
   // console.log("PESO--" + pesot);

  });

  $('.costototal span').html(total);  
  $('.pesototal span').html(pesot);

}


$(document).on('click', '#p-nat', function (e) {  
    var page = 0;
    $(this).attr({'operacion':''});
    buscar_proveedorNatural(page);
});

function buscar_proveedorNatural(page)
{
  var dninat_busc = $('tr#filtroproveenat input.dninat_busc').val(); 
  var nombrenat_busc = $('tr#filtroproveenat input.nombrenat_busc').val();
  var apenat_busc = $('tr#filtroproveenat input.apenat_busc').val();
  
  //console.log(dninat_busc + "--" + nombrenat_busc + "--"+ apenat_busc)
  var temp = 'page='+page+'&tipo_persona=2';
  if(dninat_busc.trim().length)
  {
    temp=temp+'&dninat_busc='+dninat_busc;
  }

  if(nombrenat_busc.trim().length)
  {
    temp=temp+'&nombrenat_busc='+nombrenat_busc;
  }

  if(apenat_busc.trim().length)
  {
    temp=temp+'&apenat_busc='+apenat_busc;
  }
  console.log(temp);  
  $.ajax({
      url: $('base').attr('href') + 'guiaremision/getallcliente',
      type: 'POST',
      data: temp,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
          if (response.code==1) {
            //console.log(response.data.paginacion);
            $('#buscar_proveenat tbody').html(response.data.rta);
            $('#paginacion_datap2').html(response.data.paginacion);
          }
      },
      complete: function() {
          //hideLoader();
      }
  });      
}

$(function () {
    /*Proveedor*/
    $( "#sede" ).autocomplete({ 
        params:{id_art_sucursal:$('#id_art_sucursal').val()},
        type:'POST',
        serviceUrl: $('base').attr('href')+"guiaremision/sede_llegada",
        onSelect: function (suggestion) {
            //$('#sede_llegada').val(suggestion.direccion);
            $('#texto_direcllegada').val(suggestion.direccion);
            $('#id_cliente_llegada').val(suggestion.id_persona_juridica);
            $('#id_sucursal_llegada').val(suggestion.id_sucursal);
            $('#tipo_persona').val(1);

        }
    });

  });


//fin