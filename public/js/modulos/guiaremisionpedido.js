$( document ).ready(function() {

  $('#form_save_guiarpedido').validate({
    rules:
      {
        fecha_traslado: { required:true, date: true },
        serie:{ required:true},
        numero_correlativo:{ required:true },
        id_vehiculo:{ required:true  },
        id_conductor:{ required:true  }
      },
      messages: 
      {
        fecha_traslado: { required:"Fecha", date: "Formato Error" },
        serie:{ required: "" },
        numero_correlativo:{ required: "" },
        id_vehiculo:{ required: "" },
        id_conductor: { required: "" }
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
            url: $('base').attr('href') + 'guiaremision/save_guiaremisionpedido',
            type: 'POST',
            data: $('#form_save_guiarpedido').serialize(),
            dataType: "json",
            beforeSend: function() {
              showLoader('sub_guiaaa');
              $.LoadingOverlay("show", {image : "", fontawesome : "fa fa-spinner fa-spin"});
            },
            success: function(response) {
              if (response.code==1) {
                //$('#sub_guia').remove();
                var url = $('base').attr('href');
                var link = url+'guiaremision/pdf_guia/'+response.data.pdf;
                $('#guiaremisionpdf .crear-evento').html("<iframe width='100%' height='500' src='"+link+"'></iframe>");
                $('#guiaremisionpdf').modal({ show: true, backdrop: 'static'});
                var cbx = response.data.cbx;
                $(document).data('arrcbx',cbx);

                //window.location.href = $('#linkmodulo').attr('href') +'/pedido/'+$('#id_pedido').val();
              }              
            },
            complete: function() {
              $.LoadingOverlay("hide");
            }
          });
        }         
      }
  });

  $('#fecha_traslado').daterangepicker({
    singleDatePicker: true,
    format: 'YYYY-MM-DD',
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
  var cantmax = parseFloat(padre.parents('tr').find('td.cantidadp input').val());
  var cantidad = parseFloat(padre.val());
  var stock = parseFloat(padre.parents('tr').find('td.stock span').html());
  var identidicador = parseInt(padre.parents('tr').attr('identidicador'));

  
  if(validnum(cantidad))
  {
    if(stock>=cantidad)
    {
      $('.cantidad'.concat(identidicador)).text(padre.val());//
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
