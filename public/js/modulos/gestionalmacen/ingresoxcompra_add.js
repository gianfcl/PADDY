$( document ).ready(function() { 
  jQuery.validator.setDefaults({
    debug: true,
    success: "valid",
    ignore: ""
  });
  $('li[tabs="almacen"]').addClass('hidden');
  $("#sumarcant").popover({
    html: true, 
    content: function() {
      return $('#popover-content').html();
    },
    animation: false,
    container: '#cont'
  });

  $("#sumarcant_serv").popover({
    html: true,
    content: function () {
      return $('#popover-content2').html();
    },
    animation: false,
    container: '#cont_serv',
  });

  $("#sumartotal").popover({
    html: true,
    content: function () {
      return $('#popover-content_pt').html();
    },
    animation: false,
    container: '#cont_ptotal',
  });

  $("#sumartotals").popover({
    html: true,
    content: function () {
      return $('#popover-content_pts').html();
    },
    animation: false,
    container: '#cont_ptotals',
  });

  $.validator.addMethod("formespn",
    function(value, element) {
      if(value.trim().length)
        return /^(0?[1-9]|[12]\d|3[01])[\.\/\-](0?[1-9]|1[012])[\.\/\-]([12]\d)?(\d\d)$/.test( value );
      else
        return false;
  }, "");

  $('#form_save_ingresoxcompra').validate({
    rules:
    {
      id_proveedor: { required:true, number: true },
      fecha_ingreso:{ formespn:true},
      id_tipodocumento:{ required:true},
      serie:{maxlength:8},
      numero_correlativo:{maxlength:15},
      exist_pedido:{ required:true },
      id_moneda:{ required: true}
    },
    messages: 
    {
      id_proveedor: { required:"Ingresar", number: "Solo #s" },
      id_tipodocumento:{ required: "Ingresar"},
      serie:{maxlength:"Max 4 #s"},
      numero_correlativo:{maxlength:"Max 15 #s"},
      exist_pedido:{ required: "" },
      id_moneda:{ required: "Ingresar"} 
    },      

    highlight: function(element) {
      console.log(element);
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
        var idfo = parseInt($('#id_formapago').val());
        if(idfo==2)
        {
          var va = $(document).data('peri_odo');
          if(va.length)
          {
            temp = "&"+$(document).data('peri_odo');
          }
        }
        var edit = parseInt($('#edit_orden').val());
        var id_art_sucursal = parseInt($('#id_art_sucursal').val());

        if(parseFloat($('#totales td:nth-child(2) span').text())>0)
        {
          var fc = $('#factor_compra').val();
          if(isNaN(parseFloat(fc)))
          {
            alerta('Tipo de Cambio','No configurado para la fecha actual!!','error');
          }
          else
          {
            console.log(fc);
            $.ajax({
              url: $('base').attr('href') + 'ingresoxcompra/save_ingresoxcompra',
              type: 'POST',
              data: $('#form_save_ingresoxcompra').serialize()+temp,
              dataType: "json",
              beforeSend: function() {
                $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
                showLoader('saveb');
              },
              success: function(response) {
                if (response.code==1) {
                  var tipo = $('#myTab li.active').attr('tabs');
                  var es_arti = response.data.es_arti;
                  var afecta_kardex = response.data.afecta_kardex;
                  var url = "";
                  if(es_arti==2 || afecta_kardex==2)
                  {
                    url = $('base').attr('href') +'ingresoxcompra/edit/'+response.data.id+'/'+tipo;
                  }
                  else
                  {
                    url = $('base').attr('href') +'ingresoxcompra/ver_documento/'+response.data.id;
                  }
                  
                  window.location.href = url;
                }
              },
              complete: function() {
                $('#addarticulo').modal('hide');
              }
            });/**/
          }
        }
        else
        {
          alerta('El Precio Total','no puede ser menor a 0!!','error');
        }
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

  $('#form_save_add_articulo').validate({
    rules:
    {
      id_unidadmedida: {required: true},
      cantidad: { required:true, number: true },
      precio_unitario: { required:true, number: true },
      precio_total: { required:true, number: true } 
    },
    messages: 
    {
      cantidad: { required:"", number: "" },
      precio_unitario: { required:"Precio U", number: "Solo #s" },
      precio_total: { required:"Precio T", number: "Solo #s" },
      id_unidadmedida: {required: "Unidad de Medida"}
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
      if(element.parents('.form-group').length) 
      {
        error.insertAfter(element.parents('.form-group')); 
      }
    },
    submitHandler: function() {
      var fecha_ = $('#fecha_busc').val();
      var cod_ = parseInt($('#codigo').text());

      var pasa = true;
      var tiene_igv = null;

      $.ajax({
          url: $('base').attr('href') + 'ingresoxcompra/impxregimen',
          type: 'POST',
          async: false,
          data: 'fecha='+fecha_,
          dataType: "json",
          beforeSend: function() {
            $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
        },
        success: function(response) {
          if (response.code==1) {
            var resp = response.data;
            if(resp=="no tiene")
            {
              alerta('Error','No hay un Régimen Configurado en la fecha seleccionada!!','error');
              pasa = false;
              return 0;
            }
            else
            {
              if(resp==0)
              {
                tiene_igv = 0;
              }
              else
              {
                tiene_igv = (parseInt($('#tipodocuigv').val())) ? $('#tipodocuigv').val() : 0;
                if(tiene_igv)
                {
                  $.ajax({
                      url: $('base').attr('href') + 'ingresoxcompra/validar_igvxarti',
                      type: 'POST',
                      async: false,
                      data: 'id_art='+cod_+'&fecha_='+fecha_,
                      dataType: "json",
                      beforeSend: function() {
                        $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
                    },
                    success: function(response) {
                      if (response.code==1) {
                        var boo = response.data;
                        if(boo)
                          pasa = boo;
                        else
                          alerta('Error','No hay IGV configurado en el articulo en la fecha seleccionada!!','error');
                          return 0;
                      }
                    },
                    complete: function() {
                      $.LoadingOverlay("hide");
                    }
                  });
                }

                if(!parseInt($('#umcompra').find('select').val()))
                {
                  alerta('Error','Seleccione Unidad Medida de Compra','error');
                  pasa = false;
                  return 0;
                }
              }
            }
          }
        },
        complete: function() {
          $.LoadingOverlay("hide");
        }
      });
      var id_unidadmedida = parseInt($('select[name="id_unidadmedida"]').val());

      if(!(id_unidadmedida))
      {
        pasa = false;
        alerta('Unidad de Medida de Compra','inválida','error');
      }

      if(pasa)
      {  
        var edit = parseInt($('#edit_orden').val());
        var orden = parseInt($('#lista_articulos tr.ordenes').length);
        var id_art_sucursal = parseInt($('#id_art_sucursal').val());
        var operacion = parseInt($('.add_proveedor').attr('operacion'));
        var fecha_ = $('#fecha_busc').val();
        var sim = ($('#id_moneda').val()) ? $('#id_moneda').find('option:selected').attr('sim') : '';
        var temp = '&orden='+orden+'&operacion='+operacion+'&fecha='+fecha_+'&tiene_igv='+tiene_igv+'&simbolo='+sim;

        $.ajax({
          url: $('base').attr('href') + 'ingresoxcompra/add_articulo',
          type: 'POST',
          data: $('#form_save_add_articulo').serialize()+temp,
          dataType: "json",
          async: false,
          beforeSend: function() {
            $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
          },
          success: function(response) {
            if (response.code==1) {
              if(orden>0)
              {
                if(edit>0)
                {
                  $('table#lista_articulos tr#tr_arti_'+id_art_sucursal).html(response.data.det);
                  $('table#logistica_t tr#tr_artil_'+id_art_sucursal).html(response.data.log);
                  $('table#almacen_t tr#tr_artialm_'+id_art_sucursal).html(response.data.alm);
                }
                else
                {
                  if($('table#lista_articulos tbody tr#tr_arti_'+id_art_sucursal).length) {}
                  else
                  {
                    $('table#lista_articulos tbody').append(response.data.det);
                    $('table#logistica_t tbody').append(response.data.log);
                    $('table#almacen_t tbody').append(response.data.alm);
                  }
                }
              }
              else
              {
                if($('table#lista_articulos tbody tr#tr_arti_'+id_art_sucursal).length) {}
                else
                {
                  $('table#lista_articulos tbody').html(response.data.det);
                  $('table#logistica_t tbody').html(response.data.log);
                  $('table#almacen_t tbody').html(response.data.alm);
                }
                
              }
              sumarval();
              remover_arti(id_art_sucursal,'arti');
              num_orden('lista_articulos');
              ocultar_almtab();
            }
          },
          complete: function() {
            $('#addarticulo').modal('hide');
            $.LoadingOverlay("hide");
          }
        });/**/
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
      cantidad: { required:"", number: "" },
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
      if (element.parents('.form-group').length) {
        error.insertAfter(element.parents('.form-group'));
      }
    },
    submitHandler: function() {

      var fecha_ = $('#fecha_busc').val();
      var id_servicios = parseInt($('#form_save_add_elmcosto #id_servicios').val());
      var pasa = false;
      $.ajax({
        url: $('base').attr('href') + 'ingresoxcompra/validar_igvxserv',
        type: 'POST',
        async: false,
        data: 'id_servicios=' + id_servicios+'&fecha_='+fecha_,
        dataType: "json",
        beforeSend: function() {
          $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
        },
        success: function(response) {
          if (response.code==1) {
            var boo = response.data;
            if(boo)
              pasa = boo;
            else
              alerta('Error','No hay IGV configurado en el articulo en la fecha seleccionada!!','error');

          }
          ocultar_almtab();
        },
        complete: function() {
          $.LoadingOverlay("hide");
        }
      });
      
      if (pasa) 
      {
        var edit = parseInt($('#edit_orden_serv').val());
        var orden = parseInt($('#lista_articulos tr.ordenes').length);
        
        var operacion = parseInt($('.add_proveedor').attr('operacion'));
        var idprovart = $('#id_provart_serv').val();

        var codigo = parseInt($('#form_save_add_elmcosto #id_servicios').val());
        var sim = ($('#id_moneda').val()) ? $('#id_moneda').find('option:selected').attr('sim') : '';
        var temp = '&orden='+orden+'&operacion='+operacion+'&id_servicios='+id_servicios+'&codigo='+codigo+'&id_provart='+idprovart+'&simbolo='+sim;

        $.ajax({
          url: $('base').attr('href') + 'ingresoxcompra/add_elmcosto',
          type: 'POST',
          data: $('#form_save_add_elmcosto').serialize()+temp,
          dataType: "json",
          beforeSend: function() {
            $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
          },
          success: function(response) {
            if (response.code==1) {
              if(orden>0)
              {
                if(edit>0)
                {
                  $('table#lista_articulos tr#tr_serv_'+id_servicios).html(response.data.det);
                  $('table#logistica_t tr#tr_servl_'+id_servicios).html(response.data.log);
                }
                else
                {
                  if($('table#lista_articulos tbody tr#tr_serv_'+id_servicios).length) {}
                  else
                  {
                    $('table#lista_articulos tbody').append(response.data.det);
                    $('table#logistica_t tbody').append(response.data.log);
                  }
                }
              }
              else
              {
                if($('table#lista_articulos tbody tr#tr_serv_'+id_servicios).length) {}
                else
                {
                  $('table#lista_articulos tbody').html(response.data.det);
                  $('table#logistica_t tbody').html(response.data.log);
                }
                
              }
              sumarval();
              remover_arti(id_servicios,'serv');
              num_orden('lista_articulos');
              buscar_servicios(0);
              buscar_articulos(0);
            }
          },
          complete: function() {
            $('#addservicio').modal('hide');
            $.LoadingOverlay("hide");
          }
        });
      }
    }
  });
});

function remover_arti(id,tip)
{
  if($('#buscar_'+tip+' tr#'+id).length)
  {
    $('#buscar_'+tip+' tr#'+id).remove();
    var num = parseInt($('#buscar_'+tip+' tbody tr td.orden_'+tip).length);
    if(num>0) 
    {
      var i = 0;
      $('#buscar_'+tip+' tbody tr td.orden_'+tip).each(function (index, value){
        i++;
        $(this).html(i);
      });
    }
    else
    {
      var page = 0;
      if(tip=="arti")
      {
        buscar_articulos(page);
      }
      else
      {
        buscar_servicios(page);
      }
      
      num = parseInt($('#buscar_'+tip+' tbody tr td.orden_'+tip).length);
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
  var sim = ($('#id_moneda').val()) ? $('#id_moneda').find('option:selected').attr('sim') : '';
  var num = parseInt($('#lista_articulos tbody tr.ordenes td.orden').length);
  if(num>0)
  {
    var preciot = parseFloat(0);
    var costot = 0;
    var impuestot = 0;
    var tipo = '';
    var sum = 0;
    var padre = "";
    var opGrav = 0;
    var opExo = 0;
    var opIna = 0;
    var percep = 0;
    var tipoOp = "";
    $('#lista_articulos tbody tr td.sumar').each(function (index, value){
      tipoelm = $(this).parent().attr('tipi');
      tipo = $(this).find('span').attr('class');
      sum = parseFloat($(this).find('input').val());
      tipoOp = parseInt($(this).parent().attr('tipo_igv'));
      switch (tipoelm)
      {
        case 'arti':
          var id_art = $(this).parent().attr('idartsucursal');
          var igxart = parseFloat($('table#logistica_t tr#tr_artil_' + id_art).find('input[name="imppp[' + id_art + ']"]').val());
          igxart = (!isNaN(igxart)) ? igxart : 0
          impuestot += igxart;
          sum_ = parseFloat($('table#logistica_t tr#tr_artil_' + id_art + ' td.costop').find('input').val());
        break;
        case 'serv':
          var id_serv = $(this).parent().attr('idservicios');
          var igxserv = parseFloat($('table#logistica_t tr#tr_servl_' + id_serv).find('input[name="imppp[' + id_serv + ']"]').val());
          igxserv = (!isNaN(igxserv)) ? igxserv : 0;
          impuestot += igxserv;
          sum_ = parseFloat($('table#logistica_t tr#tr_servl_' + id_serv + ' td.costop').find('input').val());
          break;
      }

      switch(tipoOp)
      {
        case 1:
          opExo += sum_;
        break;
        case 2:
          opGrav += sum_;
        break;
        case 3:
          opIna += sum_;
        break;
      }

      switch(tipo) {
        case 'preciot':

          preciot = preciot+sum;
            break;
        /*
        case 'costot':
          costot = costot+sum;
            break;
        case 'impt':
          impuestot = impuestot+sum;
            break;
        */
        default:
          break;
      }    
    });

    if($('tr#totales').length)
    {
      $('tr.tot').remove();
    }
    
    var percep = ($('#es_agente').val()==1) ? parseFloat(preciot*($('#percepcion_p').val()/100)) : 0;
    var hidden_class = ($('#es_agente').val()==!1) ? "hidden" : "";

    var TotalT = (percep) ? percep + preciot : preciot;
    percep = (typeof(percep)=='number' && !isNaN(percep)) ? (percep) : ("0.00");
    preciot = (typeof(preciot)=='number' && !isNaN(preciot)) ? (preciot) : ("0.00");
    //costot = (typeof(costot)=='number' && !isNaN(costot)) ? (costot.toFixed(2)) : ("0.00");
    impuestot = (typeof(impuestot)=='number' && !isNaN(impuestot)) ? (impuestot.toFixed(2)) : ("0.00");
    TotalT = (typeof(TotalT)=='number' && !isNaN(TotalT)) ? (TotalT) : ("0.00");
    var tr =  "<tr class='tot'><td colspan='6' class='text-right'>OP Exoneradas</td>"+
                "<td align='right'>"+
                  "<i class='pull-left simbol'>"+sim+"</i> <span><b>"+(opExo.toFixed(2))+"</b></span>"+
                  "<input type='hidden' name='op_exoneradas' value='"+opExo+"' >"+
                "</td><td colspan='2'></td>"+
              "</tr>"+
              "<tr class='tot'><td colspan='6' class='text-right'>OP Inafectas</td>"+
                "<td align='right'>"+
                    "<input  type='hidden' name='op_inafectas' value='"+opIna+"' >"+
                    "<i class='pull-left simbol'>"+sim+"</i> <span><b>"+(opIna.toFixed(2))+"</b></span>"+
                "</td><td colspan='2'></td>"+
              "</tr>"+
              "<tr class='tot'><td colspan='6' class='text-right'>OP Gravadas</td>"+
                "<td align='right'>"+
                    "<input type='hidden' name='op_gravadas' value='"+opGrav+"' >"+
                    "<i class='pull-left simbol'>"+sim+"</i> <span><b>"+(opGrav.toFixed(2))+"</b></span></td>"+
                "<td colspan='2'></td>"+
              "</tr>"+
              "<tr class='tot'><td colspan='6' class='text-right'>Total Descuentos</td>"+
                "<td><input type='hidden' name='total_descuentos' value='' ></td>"+
                "<td colspan='2'></td></tr>"+
              "<tr class='tot'><td colspan='6' class='text-right'>IGV</td>"+
                "<td align='right'>"+
                  "<input type='hidden' name='impuesto_total' value='"+impuestot+"'>"+
                  "<i class='pull-left simbol'>"+sim+"</i> <span><b>"+(impuestot)+"</b></span></td>"+
                "</td>"+
                "<td colspan='2'></td></tr>"+
              "<tr class='tot'><td colspan='6' class='text-right'>Importe Total</td>"+
                "<td align='right'>"+
                  "<input type='hidden' name='precio_total' value='"+preciot+"'>"+
                  "<i class='pull-left simbol'>"+sim+"</i> <span><b>"+(preciot.toFixed(2))+"</b></span></td>"+
                "</td>"+
                "<td colspan='2'></td>"+
              "</tr>"+
              "<tr class='tot "+hidden_class+"'><td colspan='6' class='text-right'>Percepción</td>"+
                "<td align='right'>"+
                  "<input type='hidden' name='percepcion' value='"+percep+"'>"+
                  "<i class='pull-left simbol'>"+sim+"</i> <span><b>"+percep.toFixed(2)+"</b></span></td>"+
                "</td>"+
                "<td colspan='2'></td></tr>"+
              "<tr class='tot "+hidden_class+"'  id='totales'>"+
                "<td colspan='6' class='text-right'>Total a Pagar</td>"+
                "<td align='right'>"+
                  "<input type='hidden' name='precio_totalizado' value='"+TotalT+"'>"+
                  "<i class='pull-left simbol'>"+sim+"</i> <span><b>"+TotalT.toFixed(2)+"</b></span>"+
                "</td>"+
                "<td colspan='2'></td>"+
              "</tr>";
    $('#lista_articulos tbody').append(tr);
    valid_exist_pedido();
  }

  var idformapago = parseInt($('#id_formapago').val());

  if(idformapago==2)
  {
    var monto = parseFloat($('#vvtotal span b').html());
    var temp = '&pvett='+get_joinpvett('lista_articulos')+'&monto='+monto;

    $.ajax({
      url: $('base').attr('href') + 'facturacion/add_periodos',
      type: 'POST',
      data: $('#form_add_periodocredito').serialize()+temp,
      dataType: "json",
      beforeSend: function() {
        $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
      },
      success: function(response) {
        if (response.code==1) {
          $('#menufactu').html(response.data.tabs);
          $('#contfactu').html(response.data.peri);          
        }
      },
      complete: function() {
        $.LoadingOverlay("hide");
      }
    });

  }
}

$(function () {
  /*Proveedor*/
  $( "#ruc_dni" ).autocomplete({ 
    params:{tipo_persona: function() { return $('#tipo_persona').val(); }},
    type:'POST',
    serviceUrl: $('base').attr('href')+"ingresoxcompra/ruc_dni",
    onSelect: function (suggestion) {
      $('#id_proveedor').val(suggestion.id_proveedor);
    }
  });

  $('#fecha_busc').daterangepicker({
      singleDatePicker: true,
      format: 'DD-MM-YYYY',
      calender_style: "picker_4"
      }, 
      function(start, end, label) {}
  );
});

function openmodal(val)
{
  if(val)
  {
    $('#buscarart').modal({show: "'"+val+"'", backdrop: 'static'});
  }
  else
  {
    $('#buscarart button.close').click();
  }
}

$(document).on('click', '.buscarart', function (e)
{
    var id_proveedor = parseInt($('#id_proveedor').val());
    var fecha = ($('#fecha_busc').val()).trim();
    if(fecha)
    {
      if(id_proveedor>0)
      {
        /*$('#buscarart').on('shown.bs.modal', function (e) {
        });*/
        openmodal(true);
        /*$('#buscarart').modal({ show: true, backdrop: 'static'});*/
        $('#filtro input').val('');
        $('#buscar_arti #grupo_busc').val('');
        $('#buscar_arti #familia_busc').html('');
        $('#buscar_arti #subfamilia_busc').html('');

        buscar_articulos(0,true);
        if($('#tab_content2').size())
        {
          buscar_servicios(0,true)
        }    
      }
      else
      {
        alerta('Error','Tiene que buscar un Proveedor','error');
      }
    }else
    {
      alerta('Error','Seleccione Fecha de Documento','error')
    }  
});

$(document).on('click', '#paginacion_data li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');

  buscar_articulos(page);
});

$(document).on('click', '#paginacion_data a.paginate_button', function (e) {  
  var page = $(this).attr('tabindex');

  buscar_articulos(page);
});

$(document).on('click', '#buscar_arti a.buscar', function (e) {  
  var page = 0;

  buscar_articulos(page);
});

function buscar_articulos(page,valid=false)
{
  var id_proveedor = parseInt($('#id_proveedor').val());

  if(id_proveedor>0)
  {
    var ids = get_joinids('lista_articulos','arti');
    var temp = "id_proveedor="+id_proveedor+"&page="+page+'&ids='+ids;
    var codigo_busc = $('#buscar_arti #codigo_busc').val();
    var descripcion_busc = $('#buscar_arti #descripcion_busc').val();
    var codigo_busc_pro = $('#buscar_arti #codigo_busc_pro').val();
    var descripcion_busc_pro = $('#buscar_arti #descripcion_busc_pro').val();
    var grupo =$('#grupo_busc').val();
    var familia =$('#familia_busc').val();
    var subfamilia =$('#subfamilia_busc').val();

    if(codigo_busc.trim().length)
      temp=temp+'&codigo_busc='+codigo_busc;

    if(descripcion_busc.trim().length)
      temp=temp+'&descripcion_busc='+descripcion_busc;

    if(codigo_busc_pro.trim().length)
      temp=temp+'&codigo_busc_pro='+codigo_busc_pro;

    if(descripcion_busc_pro.trim().length)
      temp=temp+'&descripcion_busc_pro='+descripcion_busc_pro;

    if(parseInt(grupo)>0)
      temp=temp+'&grupo_busc='+grupo;

    if(parseInt(familia)>0)
      temp=temp+'&familia_busc='+familia;

    if(parseInt(subfamilia)>0)
      temp=temp+'&subfamilia_busc='+subfamilia;

    $.ajax({
      url: $('base').attr('href') + 'ingresoxcompra/buscar_articulos',
      type: 'POST',
      data: temp,
      async: false,
      dataType: "json",
      beforeSend: function() {
        $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
      },
      success: function(response) {
          if (response.code==1) {
            if(valid)
            {
              var hidden = response.data.hidden_arti;
              if(hidden)
              {
                $('#tabs1').parent().removeClass('active');
                $('#tabs2').parent().addClass('active');
                $('#tabs1').addClass('hidden');
                $('#tab_content1').addClass('hidden').removeClass('active in');
                $('#tab_content2').addClass('active in');
              }
              else
              {
                $('#tabs1').parent().addClass('active');
                $('#tabs1').removeClass('hidden');
                $('#tab_content1').removeClass('hidden').addClass('active in');
                $('#tab_content2').removeClass('active in');
                $('#tabs2').parent().removeClass('active');
              }
            }
            $('#buscar_arti tbody').html(response.data.rta);
            $('#paginacion_data').html(response.data.paginacion);
          }
      },
      complete: function() {
        $.LoadingOverlay("hide");
      }
    });
  }      
}

$(document).on('click', '.add_articulo', function (e)
{ 
  limp_todo('form_save_add_articulo');
  $('#codigo').html('');
  $('#umcompra').html('');
  var operac = parseInt($('.add_proveedor').attr('operacion'));
  operac = (operac>0) ? (operac) : (0);
  var text = (operac==1) ? ('Precio') : ('Costo');
  var plhu = (operac==1) ? "Precio U." : "Costo U.";
  $('#preciou').prop('placeholder',plhu);
  var plht = (operac==1) ? "Precio T." : "Costo T.";
  $('#preciot').prop('placeholder',plht);
  $('#addarticulo label.cambsp span').html(text);

  $('#addarticulo').modal({ show: true, backdrop: 'static'});

  var padre = $(this).parents('tr');
  var id_provart = padre.attr('idprovart');
  var id_art_sucursal = padre.attr('idartsucursal');
  var codigo = padre.find('td.codigo').html();
  var descrip = padre.find('td.descrip').html();
  var umcompra = padre.attr('cbxum');

  $('#codigo').html(codigo);
  $('#descripcion').val(descrip);
  $('#umcompra').html(umcompra);
  $('#id_provart').val(id_provart);
  $('#id_art_sucursal').val(id_art_sucursal);
  $('#exist_pedido').val('si');
  $('#exist_pedido').parents('.form-group').removeClass('has-error');
  
});

$(document).on('click', '.btn_cancelar', function (e)
{
  $('#addarticulo').modal('hide');
});

function get_joinids(div, tip)
{
  var ids =  new Array();
  var i = 0;
  var info = '';
  $('#'+div+' tbody tr.ordenes').each(function (index, value){
    if(tip == $(this).attr('tipi'))
    {
      info = (tip == 'serv') ? ('idservicios') : ('idartsucursal');
      ids[i] = $(this).attr(info);
      i++;
    }      
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
      var tipo = $(this).parents('tr').attr('tipi');
      switch(tipo)
      {
        case 'arti':
          var id = $(this).parents('tr').attr('idartsucursal');
        break;
        case 'serv':
          var id = $(this).parents('tr').attr('idservicios');
        break;
      }
      var text = "<input type='hidden' name='li_id_serv["+id+"]'' id='serv_"+id+"' value="+i+">";
      $(this).append(text);
    });
  }    
}

$(document).on('click', '.delete_articulo', function (e)
{
  var padre = $(this).parents('tr');
  var idartsucursal = parseInt(padre.attr('idartsucursal'));
  if(idartsucursal>0)
  {
    $('#tr_artil_'+idartsucursal).remove();
    eliminar('Artículos',padre);    
  }
});

$(document).on('click', '.edit_articulo', function (e)
{ 
  var operac = ($('.add_proveedor').attr('operacion'));
  var idartsucursal = parseInt( $(this).closest('tr').attr('idartsucursal'));
  var padre = (operac=="1") ? $(this).closest('tr') : $('#logistica_t tr#tr_artil_'+idartsucursal);
  var idprovart = parseInt(padre.attr('idprovart'));
  var glosa = padre.find('td.glosa textarea').val();

  if(idartsucursal>0 && idprovart>0 && operac>0)
  {    
    var codigo = padre.find('td.codigo').html();
    var descrip = padre.find('td.descrip span').html();
    var umcompra = padre.find('td.umcompra span').html();
    var cantidad = padre.find('td.cantidad input').val();

    var textu = (operac=="1") ? ('preciou') : ('costou');
    var preciou = padre.find('td.'+textu+' input').val();

    var textp = (operac=="1") ? ('ptotal') : ('costop');
    var preciot = padre.find('td.'+textp+' input').val();

    var text = (operac=="1") ? ('Precio') : ('Costo');
    $('#addarticulo label.cambsp span').html(text);

    $('#id_provart').val(idprovart);
    $('#id_art_sucursal').val(idartsucursal);
    $('#edit_orden').val('1');
    $('#codigo').html(codigo);
    $('#descripcion').val(descrip);
    $('#umcompra').html(umcompra);
    $('#cantidad').val(cantidad);
    $('#preciou').val(preciou);
    $('#preciot').val(preciot);
    $('#glosita').val(glosa);

    $('#addarticulo').modal({ show: true, backdrop: 'static'});
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
  var $this = "";
  var no = 0;
  var id_art = 0;
  var entra_k;
  $('.almacen').each(function (index, value){
    $this = $(this);
    cantidad = $this.val();
    id_art = $this.parents('tr').attr('idartsucursal');
    entra_k = $('#lista_articulos tr[idartsucursal='+id_art+'] td.afe_ka a').hasClass('afecta_kardex') ? true : false;
    if(cantidad == 0 && entra_k)
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
  console.log("num->"+num);
  if(num>0 && i==0) { va = 1;}
  else {
    if(i>0) { va=2; }
  }
  console.log("va->"+va);
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
  buscar_proveedornat(page);
});

$(document).on('click', '#buscar_provee .limpiarfiltro', function (e) {
  $('#buscar_provee #filtroprovee').find('input[type=text]').val('');
  buscar_proveedor(0);
});

$(document).on('click', '#buscar_serv .limpiarfiltro', function (e) {
  $('#buscar_serv #filtro').find('input[type=text]').val('');
  buscar_servicios(0);
});

$(document).on('click', '#buscar_arti .limpiarfiltro', function (e) {
  $('#buscar_arti #filtro').find('input[type=text]').val('');
  $('#buscar_arti #grupo_busc').val('');
  $("#buscar_arti #familia_busc").html('');
  $("#buscar_arti #subfamilia_busc").html('');
  buscar_articulos(0);
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

  $.ajax({
      url: $('base').attr('href') + 'ingresoxcompra/buscar_proveedor',
      type: 'POST',
      data: temp,
      dataType: "json",
      beforeSend: function() {
        $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
      },
      success: function(response) {
          if (response.code==1) {
            $('#buscar_provee tbody').html(response.data.rta);
            $('#paginacion_datap').html(response.data.paginacion);
          }
      },
      complete: function() {
        $.LoadingOverlay("hide");
      }
  });      
}

function buscar_proveedornat(page) {
  var nombre = $('#nombrenat_busc').val();
  var apellido = $('#apenat_busc').val();
  var dni = $('#dninat_busc').val();
  var nom_comercial = $("#nomconat_busc").val();
  var ruc_busc = $("#ruc_busc").val();

  var temp = "page=" + page;
  if (nombre.trim().length) {
    temp = temp + '&nombre=' + nombre;
  }

  if (apellido.trim().length) {
    temp = temp + '&apellido=' + apellido;
  }

  if (dni.trim().length) {
    temp = temp + '&dni=' + dni;
  }

  if (nom_comercial.trim().length) {
    temp = temp + '&nom_comercial=' + nom_comercial;
  }

  if (ruc_busc.trim().length) {
    temp = temp + '&ruc=' + ruc_busc;
  }
  
  $.ajax({
    url: $('base').attr('href') + 'ingresoxcompra/buscar_proveedornat',
    type: 'POST',
    data: temp,
    dataType: "json",
    beforeSend: function () {
      $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
    },
    success: function (response) {
      if (response.code == 1) {
        $('#buscar_proveenat tbody').html(response.data.rta);
        $('#paginacion_datap2').html(response.data.paginacion);
      }
    },
    complete: function () {
      $.LoadingOverlay("hide");
    }
  });
}

$(document).on('click', '#paginacion_datap2 li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  buscar_proveedornat(page);
});

$(document).on('click', '#paginacion_datap2 a.paginate_button', function (e) {  
  var page = $(this).attr('tabindex');
  buscar_proveedornat(page);
});

$(document).on('click','.buscarprovnat',function(){
  buscar_proveedornat(0);
});

$(document).on('click','.limpiarfiltronat',function(){
  $('#filtroproveenat input').val('');
  buscar_proveedornat(0); 
});

$(document).on('click', '.agre_provee', function (e) { 
  var padre = $(this).parents('tr');
  var rucdni = padre.attr('rucdni');
  var doc = padre.attr('doc');
  var rz = padre.find('td.rz').html();
  var idprov = padre.attr('idproveedor');
  var tipope = padre.attr('tipope');
  var operac = padre.attr('operacion');
  var es_agen = padre.attr('es_ag');
  var percepcion = padre.attr('perc');
  var id_tipodocumento = padre.attr('tipdoc');
  var id_formapago = padre.attr('formpago');
  var id_moneda = padre.attr('moneda');

  buscar_tipodoc(tipope,id_tipodocumento);

  es_agen = (es_agen) ? es_agen : "0";
  percepcion = (percepcion) ? percepcion : "0";
  $('.add_proveedor').attr({'operacion':operac});
  $('#id_formapago').val(id_formapago);
  $('#es_agente').val(es_agen);
  $('#percepcion_p').val(percepcion);
  $('#id_moneda').val(id_moneda);
  $('#id_moneda').change();
  $('#id_proveedor').val(idprov);
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
  $('#exist_pedido').val('');
  $('#lista_articulos tbody').html("<tr><td colspan='14'><h2 class='text-center text-success'>No agregó Artículos</h2></td></tr>")
  $('#logistica_t tbody').html("<tr><td colspan='14'><h2 class='text-center text-success'>No agregó Artículos</h2></td></tr>")
  $('#id_tipodocumento').change();
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

$(document).on('focusout', '#preciou', function (e) {
  var cantidad = parseFloat($('#cantidad').val());
  var pu = parseFloat($(this).val());
  var pt = (typeof(pu)=='number' && !isNaN(pu)) ? (pu*cantidad) : (0.00);
  pt = parseFloat(pt);
  pt = (typeof(pt)=='number' && !isNaN(pt)) ? (pt) : ("0.00");
  $('#preciot').val(pt);
  if($('#preciot').closest('.form-group'))
  {
    if($('#preciot').closest('.form-group').attr('class')=="form-group has-error")
    {
      $('#preciot').closest('.form-group').removeClass('has-error');
    }

    if($('#preciot-error-error').length)
    {
      $('#preciot-error-error').html('');
    }
  }
});

$(document).on('focusout', '#preciot', function (e) {
  var cantidad = parseFloat($('#cantidad').val());
  var pt = parseFloat($(this).val());
  var pu = (typeof(pt)=='number' && !isNaN(pt)) ? (pt/cantidad) : ("0.00");
  pu = parseFloat(pu);
  pu = (typeof(pu)=='number' && !isNaN(pu)) ? (pu) : ("0.00");

  $('#preciou').val(pu);
  if($('#preciou').closest('.form-group'))
  {
    if($('#preciou').closest('.form-group').attr('class')=="form-group has-error")
    {
      $('#preciou').closest('.form-group').removeClass('has-error');
    }

    if($('#preciou-error-error').length)
    {
      $('#preciou-error-error').html('');
    }
  }
});

$(document).on('focusout', '#preciou_serv', function (e) {
  var cantidad = parseFloat($('#cantidad_serv').val());
  var pu = parseFloat($(this).val());
  var pt = (typeof(pu)=='number' && !isNaN(pu)) ? (pu*cantidad) : ("0.00");
  pt = parseFloat(pt);
  pt = (typeof (pt) == 'number' && !isNaN(pu)) ? (pt) : ("0.00");
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
  var pu = (typeof(pt)=='number' && !isNaN(pt)) ? (pt/cantidad) : ("0.00");
  pu = parseFloat(pu);
  pu = (typeof(pu)=='number' && !isNaN(pu)) ? (pu) : ("0.00");

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

$(document).on('click', '#paginacion_dataserv li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  buscar_servicios(page);
});

$(document).on('click', '#paginacion_dataserv a.paginate_button', function (e) {  
  var page = $(this).attr('tabindex');
  buscar_servicios(page);
});

$(document).on('click', '#buscar_serv a.buscar', function (e) {  
  var page = 0;
  buscar_servicios(page);
});

function buscar_servicios(page,valid = false)
{
  var id_proveedor = parseInt($('#id_proveedor').val());

  if(id_proveedor>0)
  {
    var ids = get_joinids('lista_articulos','serv');
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
      url: $('base').attr('href') + 'registrogasto/buscar_servicios',
      type: 'POST',
      data: temp,
      async: false,
      dataType: "json",
      beforeSend: function() {
        $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
      },
      success: function(response) {
          if (response.code==1) {
            if(valid)
            {  
              var hidden = response.data.hidden_serv;
              if(hidden)
              {
                $('#tabs2').addClass('hidden');
                $('#tab_content2').addClass('hidden');
              }
              else
              {
                $('#tab_content2').removeClass('hidden');
                $('#tabs2').removeClass('hidden');
              }
            }

            $('#buscar_serv tbody').html(response.data.rta);
            $('#paginacion_dataserv').html(response.data.paginacion);
          }
      },
      complete: function() {
        $.LoadingOverlay("hide");
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
  var codigo = padre.find('td.codigo').html();
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

function eliminar(tipo,padre)
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
        num_orden('lista_articulos');
        valid_exist_pedido();
        sumarval();
        ocultar_almtab();
      }
  });
}

$(document).on('click', '.delete_elmcosto', function (e)
{
  var padre = $(this).parents('tr');
  var idservicios = parseInt(padre.attr('idservicios'));
  if(idservicios>0)
  {    
    $('#tr_servl_'+idservicios).remove();
    eliminar('Servicio',padre);
  }
});

$(document).on('click', '.edit_elmcosto', function (e)
{

  var operac = ($('.add_proveedor').attr('operacion'));
  var idservicios = parseInt($(this).closest('tr').attr('idservicios'));
  var padre = (operac=="1") ? $(this).closest('tr') : $('#logistica_t tr#tr_servl_'+idservicios);

  var idprovart = parseInt(padre.attr('idprovart'));
  var glosa = padre.find('td.glosa textarea').val();
  if(idservicios>0 && idprovart>0 && operac>0)
  { 
    $('#id_provart_serv').val(idprovart);
    var codigo = padre.find('td.codigo').html();
    var descrip = padre.find('td.descrip span').html();
    var umcompra = padre.find('td.umcompra span').html();
    var cantidad = padre.find('td.cantidad input').val();

    var textu = (operac=="1") ? ('preciou') : ('costou');
    var preciou = padre.find('td.'+textu+' input').val();

    var textp = (operac=="1") ? ('ptotal') : ('costop');
    var preciot = padre.find('td.'+textp+' input').val();

    var text = (operac=="1") ? ('Precio') : ('Costo');
    $('#addservicio label.cambsp span').html(text);

    $('#id_servicios').val(idservicios);
    $('#edit_orden_serv').val('1');
    $('#codigo').html(codigo);
    $('#descripcion').val(descrip);
    $('#umcompra').html(umcompra);
    $('#cantidad_serv').val(cantidad);
    $('#preciou_serv').val(preciou);
    $('#preciot_serv').val(preciot);
    $('#glosita1').val(glosa);

    $('#addservicio').modal({ show: true, backdrop: 'static'});
  }

});


$(".modal-wide").on("show.bs.modal", function() {
  var height = $(window).height() - 200;
  $(this).find(".modal-body").css("max-height", height);
});

$('#addarticulo').on('shown.bs.modal', function () {
    $('#cantidad').focus();
}) 

$('#addservicio').on('shown.bs.modal', function () {
    $('#cantidad_serv').focus();
}) 

$(document).on('change','#grupo_busc',function(){
  var id = $(this).val();
  $("#familia_busc").html('');
  $("#subfamilia_busc").html('');
  if(id>0)
  {
    
    $.ajax({
      url: $('base').attr('href') + 'familia/cbx_familia',
      type: 'POST',
      data: 'id_grupo='+id,
      dataType: "json",
      beforeSend: function() {
        $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
      },
      success: function(response) {
          if (response.code==1) {
            
            $("#familia_busc").html(response.data);
          }
      },
      complete: function() {
        $.LoadingOverlay("hide");
      }
    });
  }
});

$(document).on('change','#familia_busc',function(){
  var id = $(this).val();
  $("#subfamilia_busc").html('');
  if(id>0)
  {
    $.ajax({
      url: $('base').attr('href') + 'subfamilia/cbox_subfamilia',
      type: 'POST',
      data: 'id_familia='+id,
      dataType: "json",
      beforeSend: function() {
        $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
      },
      success: function(response) {
        if (response.code==1) {
          $("#subfamilia_busc").html(response.data);
        }
      },
      complete: function() {
        $.LoadingOverlay("hide");
      }
    });
  }
});

$('#cantidad').keypress(function(e) {
  var code = e.keyCode || e.which;
  if (code >= 48 && code <= 57 || code == 44 || code == 46 || code==8 || code==9){ return true; }
  else
  {
    if (code == 43) { 
      $('#sumarcant').popover('show');
    }
    return false; 
  }
});

$('#preciot').keypress(function(e) {
  var code = e.keyCode || e.which;
  if (code >= 48 && code <= 57 || code == 44 || code == 46 || code==8 || code==9){ return true; }
  else
  {
    if (code == 43) { 
      $('#sumartotal').popover('show');
    }
    return false; 
  }
});

$('#preciot_serv').keypress(function(e) {
  var code = e.keyCode || e.which;
  if (code >= 48 && code <= 57 || code == 44 || code == 46 || code==8 || code==9){ return true; }
  else
  {
    if (code == 43) { 
      $('#sumartotals').popover('show');
    }
    return false; 
  }
});

$('body').on('hidden.bs.popover', function (e) {
    $(e.target).data("bs.popover").inState.click = false;
});

$('#sumarcant').on('shown.bs.popover', function () {
  $('#cant_').focus();
}); 

$(document).on('click','#sum',function(){

  var num = $(this).closest('div').find('input[type=text]').val();

  num = (!isNaN(parseFloat(num))) ? parseFloat(num) : 0;
  elm = $('#cantidad');
  $('#sumarcant').popover('hide');
  sumarcantidad(num,elm); 
});

$(document).on('click','#sumpt',function(){

  var num = $(this).closest('div').find('input[type=text]').val();

  num = (!isNaN(parseFloat(num))) ? parseFloat(num) : 0;
  elm = $('#preciot');
  $('#sumartotal').popover('hide');
  sumarpreciot(num,elm); 
});

$(document).on('click','#sumpts',function(){

  var num = $(this).closest('div').find('input[type=text]').val();

  num = (!isNaN(parseFloat(num))) ? parseFloat(num) : 0;
  elm = $('#preciot_serv');
  $('#sumartotals').popover('hide');
  sumarpreciot(num,elm); 
});

function sumarcantidad(cantidad,elm)
{
  cant_actual = (!isNaN(parseFloat(elm.val()))) ? parseFloat(elm.val()) : 0.00;
  elm.val(cant_actual+cantidad);
  elm.parents('div.form-group').find('input[name=cantidad]').focus();
}

function sumarpreciot(cantidad,elm)
{
  cant_actual = (!isNaN(parseFloat(elm.val()))) ? parseFloat(elm.val()) : 0.00;
  elm.val(cant_actual+cantidad);
  elm.parents('div.form-group').find('input[name=precio_total]').focus();
}

$(document).on('keypress','#cant_', function (e ) {
  var code = e.keyCode || e.which;
  if (code >= 48 && code <= 57 || code == 44 || code == 46 || code==8 || code==9) { return true; }
  else {
    if (code == 13) {
      var num = $('#cant_').val();
      num = (!isNaN(parseFloat(num))) ? parseFloat(num) : 0;
      elm = $('#cantidad');
      $('#sumarcant').popover('hide');
      sumarcantidad(num, elm);
    }
    return false;
  }
});

$(document).on('keypress','#cant_pt', function (e ) {
  var code = e.keyCode || e.which;
  if (code >= 48 && code <= 57 || code == 44 || code == 46 || code==8 || code==9) { return true; }
  else {
    if (code == 13) {
      var num = $('#cant_pt').val();
      num = (!isNaN(parseFloat(num))) ? parseFloat(num) : 0;
      elm = $('#preciot');
      $('#sumartotal').popover('hide');
      sumarpreciot(num, elm);
    }
    return false;
  }
});

$(document).on('keypress','#cant_pts', function (e ) {
  var code = e.keyCode || e.which;
  if (code >= 48 && code <= 57 || code == 44 || code == 46 || code==8 || code==9) { return true; }
  else {
    if (code == 13) {
      var num = $('#cant_pts').val();
      num = (!isNaN(parseFloat(num))) ? parseFloat(num) : 0;
      elm = $('#preciot_serv');
      $('#sumartotals').popover('hide');
      sumarpreciot(num, elm);
    }
    return false;
  }
});

$('#sumarcant_serv').on('shown.bs.popover', function () {
  $('#cont_serv .cant_serv').focus();
}); 

$('#sumartotal').on('shown.bs.popover', function () {
  $('#cant_pt').focus();
}); 

$('#sumartotals').on('shown.bs.popover', function () {
  $('#cant_pts').focus();
}); 

$(document).on('keypress', '#cont_serv .cant_serv', function (e) {
  var code = e.keyCode || e.which;
  if (code >= 48 && code <= 57 || code == 44 || code == 46 || code == 8) { return true; }
  else {
    if (code == 13) {
      var num = $('#cont_serv .cant_serv').val();
      num = (!isNaN(parseFloat(num))) ? parseFloat(num) : 0;
      elm = $('#cantidad_serv');
      $('#sumarcant_serv').popover('hide');
      sumarcantidad(num, elm);
    }
    return false;
  }
});

$(document).on('click', '#sum_serv', function () {

  var num = $(this).closest('div').find('input[type=text]').val();

  num = (!isNaN(parseFloat(num))) ? parseFloat(num) : 0;
  elm = $('#cantidad_serv');
  $('#sumarcant_serv').popover('hide');
  sumarcantidad(num, elm);
});

$('#cantidad_serv').keypress(function (e) {
  var code = e.keyCode || e.which;
  if (code >= 48 && code <= 57 || code == 44 || code == 46 || code == 8 || code==9) { return true; }
  else {
    if (code == 43) {
      $('#sumarcant_serv').popover('show');
    }
    return false;
  }
});

function buscar_tipodoc(tipo_persona, id_tipodocumento) 
{
  var param = 'tipo_persona='+tipo_persona+'&id_tipodocumento='+id_tipodocumento;
  $.ajax({
    url: $('base').attr('href') + 'tipodocumento/cbx_tipodocpers',
    type: 'POST',
    data: param,
    dataType: "json",
    async: false,
    beforeSend: function() {
      $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
    },
    success: function(response) {
      if (response.code==1) {
        $("#id_tipodocumento").html(response.data);
      }
    },
    complete: function() {
      $.LoadingOverlay("hide");
    }
  });
}

$(document).on('change','#id_tipodocumento',function(){

  var id_tipo = $(this).val();
  $('#lista_articulos tbody').html("<tr><td colspan='14'><h2 class='text-center text-success'>No agregó Artículos</h2></td></tr>")
  $('#logistica_t tbody').html("<tr><td colspan='14'><h2 class='text-center text-success'>No agregó Artículos</h2></td></tr>");
  
  if(id_tipo)
  {
    var tiene_igv = $(this).find('option:selected').attr('tiene_igv');
    $('#tipodocuigv').val(tiene_igv);
  }
});

$(document).on('change','.umc_cbx',function(){
  var id_art_sucursal = $(this).parents('tr').attr('idartsucursal');
  var id = $(this).val();
  var factor = $(this).find('option:selected').attr('factor');
  var txtsele = $(this).find('option:selected').text();
  var papa = $(this).parents('td.umcompra');
  if(id)
  {
    papa.find('input.id_umc').val(id);
    papa.find('input.factor_c').val(factor);
    $('.umcompraspan').text(txtsele);
  }
});

$(document).on('click','.c',function () {
  var icn =  $(this).find('i');
  var inpt = $(this).find('input');
  var n_icn = (icn.hasClass("fa-square-o fa-2x")) ? icn.removeClass('fa fa-square-o fa-2x').addClass("fa fa-check-square-o fa-2x") : icn.removeClass('fa fa-check-square-o fa-2x').addClass("fa fa-square-o fa-2x");
  var art_sucu = $(this).parents('tr').attr('idartsucursal');
  var almsele = $(this).parents('#myTabContent').find('div#almacen table#almacen_t tbody tr[idartsucursal="'+art_sucu+'"] td.almcn select');

  if($(this).hasClass('afecta_kardex'))
  {
    $(this).removeClass('afecta_kardex').addClass('noafecta_kardex');
    inpt.val(2);
    almsele.prop('disabled',true);
    almsele.addClass('hidden');
  }
  else
  {
    $(this).removeClass('noafecta_kardex').addClass('afecta_kardex');
    inpt.val(1);
    almsele.prop('disabled',false);
    almsele.removeClass('hidden');
  }
  ocultar_almtab();
});

function ocultar_almtab()
{
  var tot = 0;
  var nokardx = 0;
  $('#lista_articulos tbody tr').each(function (index, value){
    tot++;
    var tipi = $(this).attr('tipi');
    if(tipi=="arti")
    {
      var muevekrdx = $(this).find('td.afe_ka input').val();
      if(muevekrdx==1)
      {
        $('li[tabs="almacen"]').removeClass('hidden');
      }
      else
      {
        nokardx++;
      }
    }
    else
    {
      nokardx++;
    }
  });

  if(tot==nokardx)
  {
    $('li[tabs="almacen"]').addClass('hidden');
  }    
}

$(document).on('change','#id_moneda',function(){
  var id = $(this).val();
  $('#factor_compra').val('');
  $('.simbol').html('');
  if(parseInt(id)>0)
  {
    var sim = $(this).find('option:selected').attr('sim');
    $('.simbol').html(sim);

    var es_base = $(this).find('option:selected').attr('es_base');
    if(parseInt(es_base)==1)
    {
      $('#factor_compra').val(1);  
    }
    else
    {
      var fch = $('#fecha_busc').val();
      $('#factor_compra').val(get_fc(id,fch))
    }
  }
});

function get_fc(id_moneda,fecha)
{
  var fc = null;
  var param = 'id_moneda='+id_moneda+'&fecha='+fecha;
  $.ajax({
    url: $('base').attr('href') + 'tipocambio/tipocambioxmoneda',
    type: 'POST',
    data: param,
    dataType: "json",
    async: false,
    beforeSend: function() {
      $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
    },
    success: function(response) {
      if (response.code==1) {
        fc = response.data;
        fc = parseFloat(fc);
      }
    },
    complete: function() {
      $.LoadingOverlay("hide");
    }
  });

  return fc;
}
