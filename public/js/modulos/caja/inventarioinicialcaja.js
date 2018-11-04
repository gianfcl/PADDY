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
      id_caja:{required:true},
      id_moneda:{required:true},
    },
    messages: 
    {
      id_caja:{required:"Seleccione"},
      id_moneda:{required:"Seleccione"}
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
      $.ajax({
        url: $('base').attr('href') + 'inventarioinicialcaja/save_inventarioinicialcaja',
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

            buscar_inventarioinicialcajas(page);
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
          alerta(text, 'Con exito este Inventario '+text+'.', 'success');
          limpiarform();
        }
      });/**/
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
  buscar_inventarioinicialcajas(0);
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
  buscar_inventarioinicialcajas(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_inventarioinicialcajas(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_inventarioinicialcajas(page);
});

function buscar_inventarioinicialcajas(page)
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
      url: $('base').attr('href') + 'inventarioinicialcaja/buscar_inventarioinicialcajas',
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

$(document).on('change', '#id_moneda', function (e) {
  var padre = $(this);
  var idmon = parseInt(padre.val());
  $('#id_caja').html('');
  if(idmon>0)
  {
    var temp = 'idmoneda='+idmon;
    
    $.ajax({
      url: $('base').attr('href') + 'inventarioinicialcaja/cbx_cajadetin',
      type: 'POST',
      data: temp,
      dataType: "json",
      beforeSend: function() {
      },
      success: function(response) {
        if (response.code==1) {
          $('#id_caja').html(response.data.cbxcaja);
          $('#simbo').html(response.data.simbolo);
        }
      },
      complete: function() {
        //hideLoader();
      }
    }); 
  }
});

$(document).on('click', '.ver_info', function (e) {
  var tis = $(this);
  var padre = tis.closest('tr');
  var idcob = parseInt(padre.attr('idcobranza'));
  if(idcob>0)
  {
    $.ajax({
      url: $('base').attr('href') + 'inventarioinicialcaja/ver_documento',
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

$(document).on('focusout', '.add_invent', function (e) {
  var fec = $('#form_cobranza').attr('fecha');
  $('#fecha_ingreso').val(fec);
});