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

  $('#form_busc_reporte').validate({
    rules:
    {
      fecha_inicio:{ formespn:true }
    },
    messages: 
    {
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
      buscar_reporte();      
    }
  });

  $('#datetimepicker6').datetimepicker({
    format: 'DD-MM-YYYY',
    locale: moment.locale("es")
  });

  $('#datetimepicker7').datetimepicker({
    format: 'DD-MM-YYYY',
    locale: moment.locale("es"), 
    useCurrent: false //Important! See issue #1075
  });

  $("#datetimepicker6").on("dp.change", function (e) { console.log(e.date);
    $('#datetimepicker7').data("DateTimePicker").minDate(e.date);
  });

  $("#datetimepicker6").on("dp.show", function (e) {
    $('#datetimepicker7 input').prop( "disabled", false );
  });
  

  $("#datetimepicker7").on("dp.change", function (e) {
    $('#datetimepicker6').data("DateTimePicker").maxDate(e.date);
  });

  $(".select2_multiple").select2({
    maximumSelectionLength: 6,
    placeholder: "Maximo 6",
    allowClear: true
  });
});

$(document).on('change', '.id_grupo', function (e) {
  var idgrupo = parseInt($(this).val());
  idgrupo = (idgrupo>0) ? (idgrupo) : (0);
  
  $('.id_familia').html('');
  $('.id_subfamilia').html('');
  if(idgrupo>0)
  {
    $.ajax({
      url: $('base').attr('href') + 'familia/cbox_familia',
      type: 'POST',
      data: 'id_grupo='+idgrupo,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
        if (response.code==1) { console.log(response.data)
          $('select.id_familia').html(response.data);
        }
      },
      complete: function() {
        //hideLoader();
      }
    });
  }
});

$(document).on('change', '.id_familia', function (e) {
  var idfamilia = parseInt($(this).val());
  idfamilia = (idfamilia>0) ? (idfamilia) : (0);

  
  $('.id_subfamilia').html('');
  if(idfamilia>0)
  {
    $.ajax({
      url: $('base').attr('href') + 'subfamilia/cbox_subfamilia',
      type: 'POST',
      data: 'id_familia='+idfamilia,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
        if (response.code==1) {
          $('.id_subfamilia').html(response.data);
        }
      },
      complete: function() {
        //hideLoader();
      }
    });
  }
});

function buscar_reporte()
{
  var url = $('#linkmodulo').val();
  var fechai = $('#fecha_inicio').val();
  var fechaf = $('#fecha_fin').val();
  fechaf = (fechaf.trim().length) ? (fechaf) : ("-");

  var idform = ifrome();

  if(fechai.trim().length)
  {
    var idgrupo = parseInt($('#id_grupo').val());
    idgrupo = (idgrupo>0) ? (idgrupo) : ('-');

    var idfamilia = parseInt($('#id_familia').val());
    idfamilia = (idfamilia>0) ? (idfamilia) : ('-');

    var idusub = parseInt($('#id_subfamilia').val());
    idusub = (idusub>0) ? (idusub) : ('-');

    var idartsu = parseInt($('#id_art_sucursal').val());
    idartsu = (idartsu>0) ? (idartsu) : ('-');
    alert(idartsu);
    var url = url+'/buscar'+'/'+fechai+'/'+fechaf+'/'+idform+'/'+idgrupo+'/'+idfamilia+'/'+idusub+'/'+idartsu;

    window.location.href = url;
  }
  else
  {
    alerta('seleccionar','Escojer Atributos','error');
  } 
}

$(document).on('click', '.buscar', function (e)
{
  $('#form_busc_reporte').submit();
});

$(document).on('focusout', '#fecha_i input', function (e) {
  var fechi = $(this).val();
  if(fechi.trim().length) {}
  else { $('#fecha_f input').prop( "disabled", true );}
});

function ifrome()
{
  var idform = "-";
  if(jQuery.type($('.select2_multiple').select2("val")) == "null"){}
  else
  {
    idform = $('.select2_multiple').select2("val");
    idform = idform.join('_');
  }
  return idform;
}

$(function () {
  $( "#articulo" ).autocomplete({
    params: { 'idgrupo': function() { return $('#id_grupo').val(); }, 
              'idfamilia': function() { return $('#id_familia').val();},
              'idsubfamilia': function() { return $('#id_subfamilia').val();},
              'idformulario': function() { return ifrome();},
            },
    type:'POST',
    serviceUrl: $('base').attr('href')+"articuloxsucursal/search_articulo",
    onSelect: function (suggestion) 
    {
      $('#id_art_sucursal').val(suggestion.id_art_sucursal);
      $('#articulo').val(suggestion.value);
      if($('#articulo-error').size())
      {
        $('#articulo-error').remove();
      }
    }
  });
});