$( document ).ready(function() {

  $('#form_save_guia').validate({
    rules:
      {
        fecha_emision: { required:true, date: true },
        serie:{ required:true},
        numero_correlativo:{ required:true },
        id_formapago:{ required:true}
      },
      messages: 
      {
        fecha_emision: { required:"Fecha", date: "Formato Error" },
        serie:{ required: "" },
        numero_correlativo:{ required: "" },
        id_formapago:{ required:""}
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

        $('.pu').each(function (index, value){
          padre = $(this);
          cantidad = parseFloat(padre.val());

          if(validnum(cantidad))
          {
            $(this).removeClass('erroinput');
          }
          else
          {
            $(this).addClass('erroinput');
            i++;
          }
          nutot++;
          if(cantidad == 0) {no++;}
        });

       

        if(no == nutot) { i++; }

        if(i==0)
        {
          var temp = '';
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
          $.ajax({
            url: $('base').attr('href') + 'facturacion/save_facturacionguia',
            type: 'POST',
            data: $('#form_save_guia').serialize()+temp,
            dataType: "json",
            beforeSend: function() {
              showLoader('saveb');
            },
            success: function(response) {
              if (response.code==1) {
                var url = $('base').attr('href');                
                var url = $('base').attr('href');
                var link = url+'facturacion/ver_factura/'+response.data.fact;
                window.location.href = link;
              }              
            },
            complete: function() {
            }
          });
        }         
      }
  });

  $('#fecha_emision').daterangepicker({
    singleDatePicker: true,
    format: 'YYYY-MM-DD',
    calender_style: "picker_4"
  }, function(start, end, label) {
    console.log(start.toISOString(), end.toISOString(), label);
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

$(document).on('focusout', '.pu', function (e) {
  var thi = $(this);
  var preunit = parseFloat(thi.val());
  var padre = thi.parents('tr');
  var igv = parseFloat(padre.find('td.preunit input.igv').val());
  var canti = parseFloat(padre.find('td.cantidad input').val());

  var preciotot = "0.00";
  var vvu = "0.00";
  var imp_un = "0.00";
  var vvt =  "0.00";
  var imp_to = "0.00";

  if(validnum(canti) && validnum(preunit))
  {
    preciotot = preunit*canti;
    vvu = preunit/igv;
    imp_un = preunit-vvu;
    vvt =  vvu*canti;
    imp_to = imp_un*canti;

    preunit = (preunit>0) ? (preunit.toFixed(2)) : (preunit);
    preciotot = (preciotot>0) ? (preciotot.toFixed(2)) : (preciotot);
    vvu = (vvu>0) ? (vvu.toFixed(2)) : (vvu);
    imp_un = (imp_un>0) ? (imp_un.toFixed(2)) : (imp_un);
    vvt = (vvt>0) ? (vvt.toFixed(2)) : (vvt);
    imp_to = (imp_to>0) ? (imp_to.toFixed(2)) : (imp_to);
  }    

  padre.find('td.pretotal span.pvett b').html(preciotot);
  padre.find('td.vventau span.vvu b').html(vvu);
  padre.find('td.impunit span.imp_un b').html(imp_un);
  padre.find('td.vventat span.vvt b').html(vvt);
  padre.find('td.imptotal span.imp_t b').html(imp_to);
  sumarval();
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
  var vehiculo = $('#id_vehiculo option:selected').text(); console.log(vehiculo);
  $('#texto_vehiculoplaca').val(vehiculo);
});

$(document).on('change', '#id_tipodocumento', function (e) {
  var tipodocumento = $('#id_tipodocumento option:selected').text(); console.log(tipodocumento);
  $('#texto_tipodocumento').val(tipodocumento);
});

function numdocu(e)
{
    var keynum = window.event ? window.event.keyCode : e.which;
    if ((keynum == 8) || (keynum == 46))
        return true;
    var numero = test(String.fromCharCode(keynum)); console.log(numero);    
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

    $('tr#padre_'+id+' td.zona span').html(zona);  console.log(zona);
    $('tr#padre_'+id+' td.area span').html(area); console.log(area);
    $('tr#padre_'+id+' td.ubic span').html(ubic); console.log(ubic);

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
      window.location.href = $('#linkmodulo').attr('href');
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

function sumarval()
{
  var num = parseInt($('table#lista_pedidos tbody tr.ordenes td.orden').length);
  if(num>0)
  {
    var pvett = 0;
    var vvt = 0;
    var imp_t = 0;
    var tipo = '';
    var sum = 0;

    $('#lista_pedidos tbody tr td.sumar').each(function (index, value){
      tipo = $(this).find('span').attr('class'); 
      sum = parseFloat($(this).find('span b').html()); //alert('tipo->'+tipo+'='+sum);

      switch(tipo) {
        case 'pvett':
          pvett = pvett+sum;
            break;

        case 'vvt':
          vvt = vvt+sum;
            break;

        case 'imp_t':
          imp_t = imp_t+sum;
            break;

        default:
          break;
      }    
    });

    pvett = (pvett>0) ? (pvett.toFixed(2)) : ("0.00");
    $('#preciototal').html(pvett);
    vvt = (vvt>0) ? (vvt.toFixed(2)) : ("0.00");
    $('#vvtotal').html(vvt);
    imp_t = (imp_t>0) ? (imp_t.toFixed(2)) : ("0.00");
    $('#imp_total').html(imp_t);
  }
}