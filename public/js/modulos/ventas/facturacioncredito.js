$( document ).ready(function() {
  jQuery.validator.setDefaults({
    debug: true,
    success: "valid",
    ignore: ""
  });

  $(document).data('peri_odo','');

  $('#form_add_periodocredito').validate({
    rules:
      {
        cuotas: { required:true, number:true, min: 1 },
        id_periodocredito_det:{required:true  }
      },
      messages: 
      {
        cuotas: { required:"Ingresar", number: "Solo #s", min: "Mayor a 0" },
        id_periodocredito_det: { required: "" }
      }, 
      highlight: function(element) {
        $(element).closest('.control-group').addClass('has-error');        
      },
      unhighlight: function(element) {
        $(element).closest('.control-group').removeClass('has-error');
      },
      errorElement: 'span',
      errorClass: 'help-block',
      errorPlacement: function(error, element) 
      {
        if(element.parent('.control-group').length) 
        {
          error.insertAfter(element.parent());
        }
      },
      submitHandler: function() {
        var monto = parseFloat($('#vvtotal').html());
        var pvett = get_joinpvett('lista_pedidos');
        var temp = '&pvett='+pvett+'&monto='+monto;
        $.ajax({
          url: $('base').attr('href') + 'facturacion/add_periodos',
          type: 'POST',
          data: $('#form_add_periodocredito').serialize()+temp,
          dataType: "json",
          beforeSend: function() {
          },
          success: function(response) {
            if (response.code==1) {
              $('#menufactu').html(response.data.tabs);
              $('#contfactu').html(response.data.peri);
              $('.datetimepicker6').datetimepicker({
                format: 'DD-MM-YYYY',
                locale: moment.locale("es")
              });
            }
          },
          complete: function() {
            
          }
        });      
      }
  });
});

$(document).on('change', '#id_formapago', function (e) {  
  var id = parseInt($(this).val());
  var txt = "Agregar Árticulos";
  if(id==2)
  {
    if($('#lista_pedidos tbody tr.ordenes td.orden').length)
    {
      $('#si_add').removeClass('collapse');
      $('#no_add').addClass('collapse');
      var monto = parseFloat($('#vvtotal').html());

      if(monto>0)
      {
        txt = "";        
      }
      else
      {
        txt = "El monto debe ser Mayor a 0";
      }
    }
    else
    {
      $('#si_add').addClass('collapse');
      $('#no_add').removeClass('collapse');
      $(this).val('');
    }
    $('#no_add h2').html(txt);
    $('#editperiodocredito').modal('show');

  }
});

$(document).on('change', '#id_periodocredito_det', function (e) {
  var periodo = parseInt($('#id_periodocredito_det option:selected').text()); console.log(periodo);
  var idpedet = parseInt($(this).val());

  if(idpedet>0)
  {
    if(idpedet==100)
    {
      $('#numperiodo').removeClass('collapse');
      periodo = '';
    }
    else
    {
      $('#numperiodo').addClass('collapse');    
    }
  }
  else
  {
    periodo = '';
    $('#numperiodo').addClass('collapse');
  }  

  $('#periodo').val(periodo);
});

$(document).on('focusout', '.montot', function (e) {
  var mont = parseFloat($(this).val());
  var mold = parseFloat($(this).attr('tumonto'));

  var index = parseInt($( '.montot' ).index( this )) + 1;
  var ultim = parseInt($( '.montot' ).length);

  var finnuevomont = mont;
  var padre = $( "#tb_confcredito .orden:last").find("td.monti input.montot");

  if(index!=ultim)
  {
    var vaia = mont-mold;
    $(this).attr({'tumonto':mont});    
    finoldmont = parseFloat(padre.val());
    var finnuevomont = finoldmont-vaia;
    padre.val(finnuevomont);
  }  
  padre.attr({'tumonto':finnuevomont});
});

$(document).on('click', '.add_credi', function (e) {
  var peri = $('#creditos').serialize();
  $(document).data('peri_odo',peri);
  console.log($(document).data('peri_odo'));
  $('#editperiodocredito').modal('hide');
});

function get_joinpvett(div)
{
  var ids =  new Array();
  var i = 0;
  $('#'+div+' tbody tr.ordenes td.pretotal span.pvett b').each(function (index, value){
    ids[i] = $(this).html();
    i++;
  });
  return ids.join(',');
}

$(document).on('click', '#pagarya', function (e) {
  var idcuenta = parseInt($('#id_kardexcuenta').val());
  if(idcuenta)
  {
    $('#guiaremisionpdf').modal('hide');
    $('#editkardexcuenta').modal({ show: true, backdrop: 'static'});
    var moto = $('#vvtotal').html();

    $('#monto_total').val(moto);
  }  
});

$(document).on('click', '.salir_pagokardex', function (e) {
  $('#editkardexcuenta').modal('hide');
  $('#guiaremisionpdf').modal({ show: true, backdrop: 'static'});
});


$(document).on('click', '#linkguias', function (e) {
  $('#editkardexcuenta').modal('hide');
  $('#guiaremisionpdf').modal({ show: true, backdrop: 'static'});
});

$(document).on('click', '#buscar_guias .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
});

$(document).on('click', '#pagina_guias_buscar li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  buscar_pedidos(page);
});

$(document).on('click', '#pagina_guias_buscar a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_pedidos(page);
});

$(document).on('click', '#buscar_guias .buscar', function (e) {
  var page = 0;
  buscar_pedidos(page);
});

function buscar_pedidos(page)
{
  var codigo_busc = $('#cod_busc').val();
  var serie_busc = $('#serie_busc').val();
  var numero_busc = $('#numero_busc').val();

  var fechat_busc = $('#fechat_busc').val();
  var ruc_dni = $('#ruc_dni').val();
  var nombres_com = $('#nombres_com').val();
  //var estado_busc = $('#estado_busc').val();

  var temp = "page="+page;
  if(codigo_busc.trim().length)
  {
    temp=temp+'&codigo_busc='+codigo_busc;
  }
  if(numero_busc.trim().length)
  {
    temp=temp+'&numero_busc='+numero_busc;
  }
  if(serie_busc.trim().length)
  {
    temp=temp+'&serie_busc='+serie_busc;
  }

  if(fechat_busc.trim().length)
  {
    temp=temp+'&fechat_busc='+fechat_busc;
  }
  if(ruc_dni.trim().length)
  {
    temp=temp+'&ruc_dni='+ruc_dni;
  }
  if(nombres_com.trim().length)
  {
    temp=temp+'&nombres_com='+nombres_com;
  }

  $.ajax({
    url: $('base').attr('href') + 'guiaremision/buscar_guiasremision',
    type: 'POST',
    data: temp,
    dataType: "json",
    beforeSend: function() {
        //showLoader();
    },
    success: function(response) {
      if (response.code==1) {
        $('#datatable-buttons tbody#bodyindex').html(response.data.rta);
        $('#paginacion_data').html(response.data.paginacion);
        $('#fechat_busc').daterangepicker({
          singleDatePicker: true,
          format: 'YYYY-MM-DD',
          calender_style: "picker_4"
        }, function(start, end, label) {
          console.log(start.toISOString(), end.toISOString(), label);
        });
      }
    },
    complete: function() {        
    }
  });
}