$( document ).ready(function() {

  jQuery.validator.setDefaults({
    debug: true,
    success: "valid",
    ignore: ""
  });

  $.validator.addMethod("formespn",
    function(value, element) {
      if(value.trim().length)
        return /^(0?[1-9]|[12]\d|3[01])[\.\/\-](0?[1-9]|1[012])[\.\/\-]([12]\d)?(\d\d)$/.test( value );
      else
        return false;
  }, "");

  $.validator.addMethod("regex", function(value, element) {
    var exp = value;
    if (exp <= 0) { return false; }
    else {
      if($.isNumeric(exp)){ return true; }
      else{ return false; }
    }
  }, "Solo #s Mayores a 0");

  $('#form_cobranza').validate({
    rules:
    {
      fecha_ingreso: { formespn:true },
      monto: { regex:true },
      id_cajapartida:{required:true},
      id_moneda:{required:true},
      cajallegada:{required:true}
    },
    messages: 
    {
      id_cajapartida:{required:"Seleccione"},
      id_moneda:{required:"Seleccione"},
      cajallegada:{required:"Seleccione"}
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
      if(element.parent('.col-md-4').length) 
      { 
        error.insertAfter(element.parent()); 
      }
      else
      {
        error.insertAfter(element);
      }
    },
    submitHandler: function() {
      var sto = parseFloat($('#stock').val());
      var mon = parseFloat($('#monto').val());
      sto = (sto>0) ? (sto) : (0);
      if(sto<mon)
      {
        $('#monto').addClass('erroinput');
        alerta('Verificar!', 'Stock Insuficiente', 'error');
      }
      else
      {
        $('#monto').removeClass('erroinput');
        $.ajax({
          url: $('base').attr('href') + 'moventrecaja/save_moventrecaja',
          type: 'POST',
          data: $('#form_cobranza').serialize(),
          dataType: "json",
          beforeSend: function() {
            //showLoader();
          },
          success: function(response) {
            if (response.code==1) {
              var page = 0;
              if($('#paginacion_data ul.pagination li.active a').length>0)
              {
                page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
              }                   

              $('#editcobranza').modal('hide');

              buscar_moventrecajas(page);
            }
            else
            {
              limpiarform();
            }
          },
          complete: function() {
            var id_cobranza = parseInt($('#id_cobranza').val());
            id_cobranza = (id_cobranza>0) ? (id_cobranza) : ("0");
            var text = (id_cobranza=="0") ? ("Guardo!") : ("Edito!");
            alerta(text, 'Este cobranza se '+text+'.', 'success');
            limpiarform();
          }
        });/**/
      }
    }
  });

  $('#fechad_busc').daterangepicker({
    singleDatePicker: true,
    format: 'DD-MM-YYYY',
    calender_style: "picker_4"
  }, function(start, end, label) {
    console.log(start.toISOString(), end.toISOString(), label);
  });

  $('#datetimepicker6').datetimepicker({
    format: 'DD-MM-YYYY',
    locale: moment.locale("es"),
    maxDate: moment()
  });
});

$(document).on('click', 'table#datatable-buttons  tr#filtro a.limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
  buscar_moventrecajas(0);
});

$(document).on('click', '.add_cobranza', function (e)
{
    limpiarform();
});

$(document).on('click', '.btn_limpiar', function (e) {
  limpiarform();
  $('#editcobranza').modal('hide');
});

function limpiarform()
{
  $('#id_cobranza').val('0');
  $('#cobranza').val('');
  $('#estado label').removeClass('active');
  $('#estado input').prop('checked', false);
  
  $('#estado #estado_1').prop('checked', true);
  $('#estado #estado_1').parent('label').addClass('active');

  limp_todo( "form_cobranza" );
}

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  buscar_moventrecajas(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_moventrecajas(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_moventrecajas(page);
});

function buscar_moventrecajas(page)
{
  var codigo_busc = $('#codigo_busc').val();
  var fechad_busc = $('#fechad_busc').val();

  var temp = "page="+page;
  if(codigo_busc.trim().length)
  {
    temp=temp+'&codigo_busc='+codigo_busc;
  }
  if(fechad_busc.trim().length)
  {
    temp=temp+'&fechad_busc='+fechad_busc;
  }

  $.ajax({
      url: $('base').attr('href') + 'moventrecaja/buscar_moventrecajas',
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
          }
      },
      complete: function() {
          //hideLoader();
      }
  });
}

$(document).on('change', '#id_cajapartida', function (e) {
  var padre = $(this);
  var idcaj = parseInt(padre.val());
  if(idcaj>0)
  {
    $('#id_cajallegada').html("");
    var value = padre.val();

    $.ajax({
      url: $('base').attr('href') + 'moventrecaja/cbx_cajamoneda',
      type: 'POST',
      data: 'id_caja='+idcaj,
      dataType: "json",
      beforeSend: function() {
        //showLoader();
      },
      success: function(response) {
        if (response.code==1) {
          $('#id_moneda').html(response.data);          
        }
        else
        {
          $('#id_cajallegada').html('')
        }
      },
      complete: function() {
        //hideLoader();
      }
    });    
  }
  else
  {
    $('#id_cajallegada').html('');
  }

  $('#id_moneda').val('');
  $('#monto').val('');
  $('#monto').removeClass('erroinput');
  $('#stock').val('');
  $('table#cajallegada tbody tr td.moneda span').html('');
  $('table#cajallegada tbody tr td.nuevomonto span').html('');
  $('table#cajallegada tbody tr td.stock span').html('');
  $('table#cajapartida tbody tr td.stock span').html('');
});

$(document).on('change', '#id_moneda', function (e) {
  var padre = $(this);
  var idmon = parseInt(padre.val());
  var moneda = '';
  if(idmon>0)
  {
    moneda = $('#id_moneda option:selected').text();
    var cajpa = parseInt($('#id_cajapartida').val());
    if(cajpa>0)
    {
      var cajll = parseInt($('#id_cajallegada').val());
      var temp = 'idmoneda='+idmon+'&cajpa='+cajpa;
      if(cajll>0)
      {
        temp=temp+'&cajll='+cajll;
      }
      $.ajax({
        url: $('base').attr('href') + 'moventrecaja/stock_cajamoneda',
        type: 'POST',
        data: temp,
        dataType: "json",
        beforeSend: function() {
        },
        success: function(response) {
          if (response.code==1) {
            $('table#cajapartida tbody tr td.stock span').html(response.data.part);
            $('#stock').val(response.data.part);
            $('table#cajallegada tbody tr td.stock span').html(response.data.lleg);
            $('#id_cajallegada').html(response.data.cbxcaja)
          }
        },
        complete: function() {
          //hideLoader();
        }
      });
    }
    else
    {
      alerta('Error','Seleccionar Caja','error')
    } 
  }
  $('table#cajallegada tbody tr td.moneda span').html(moneda);
});

$(document).on('change', '#id_cajallegada', function (e) {
  var padre = $(this);
  var cajll = parseInt(padre.val());
  var idmon = parseInt($('#id_moneda').val());
  if(cajll>0 && idmon>0)
  {
    temp='idmoneda='+idmon+'&cajll='+cajll;
    $.ajax({
      url: $('base').attr('href') + 'moventrecaja/stock_cajamoneda',
      type: 'POST',
      data: temp,
      dataType: "json",
      beforeSend: function() {
      },
      success: function(response) {
        if (response.code==1) {
          $('table#cajallegada tbody tr td.stock span').html(response.data.lleg);
        }
      },
      complete: function() {
        //hideLoader();
      }
    });
  }
});

$(document).on('focusout', '#monto', function (e) {
  var cant = parseFloat($(this).val());
  $('table#cajallegada tbody tr td.nuevomonto span').html(cant);
});

$(document).on('click', '.ver_info', function (e) {
  var tis = $(this);
  var padre = tis.closest('tr');
  var idcob = parseInt(padre.attr('idcobranza'));
  if(idcob>0)
  {
    $.ajax({
      url: $('base').attr('href') + 'moventrecaja/ver_documento',
      type: 'POST',
      data: 'id_cobranza='+idcob,
      dataType: "json",
      beforeSend: function() {
      },
      success: function(response) {
        if (response.code==1) {
          $('#verdocu').html(response.data.codigo);
          $('#verform_cobranza').html(response.data.html);
        }
      },
      complete: function() {
        //hideLoader();
      }
    });
  }
});

$(document).on('focusout', '.add_trans', function (e) {
  var fec = $('#form_cobranza').attr('fecha');
  $('#fecha_ingreso').val(fec);
});