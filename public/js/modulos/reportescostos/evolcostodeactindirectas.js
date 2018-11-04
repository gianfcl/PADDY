$( document ).ready(function() {

  jQuery.validator.setDefaults({
    debug: true,
    success: "valid",
    ignore: ""
  });

  $( "#descripcion" ).autocomplete({
    serviceUrl: $('base').attr('href')+"articuloxsucursal/search_articulo3",
    type:'POST',
    onSelect: function (suggestion) {
      $('#id_art_sucursal').val(suggestion.id_art_sucursal);
      limpcbx();
    }
  });

  $('#fecha_inicio').datetimepicker({
    format: 'DD-MM-YYYY',
    locale: moment.locale("es")
  });

  $('#fecha_fin').datetimepicker({
    format: 'DD-MM-YYYY',
    locale: moment.locale("es"),
    useCurrent: false
  });

  $("#fecha_inicio").on("dp.change", function (e) {
    $('#fecha_fin').data("DateTimePicker").minDate(e.date);
    $('#fecha_fin').data("DateTimePicker").maxDate(e.date.add(1,'M'));
  });

  $("#fecha_inicio").on("dp.show", function (e) {
    $('#fecha_fin input').prop( "disabled", false );
  });

  $.validator.addMethod("formfecha",
    function(value, element) {
      if(value.trim().length)
        return /^(0?[1-9]|[12]\d|3[01])[\.\/\-](0?[1-9]|1[012])[\.\/\-]([12]\d)?(\d\d)$/.test( value );
      else
        return false;
  }, "");

  $('#form_save_reporte').validate({
    rules:
    {
      id_sucursal: { required:true},
      fecha_inicio: { formfecha:true },
      fecha_fin: { formfecha:true },
      id_art_sucursal: { required:true }
    },
    messages: 
    {
      id_sucursal: {required:"Sucursal"},
      fecha_inicio: { formfecha: ""},
      fecha_fin: { formfecha:"" },
      id_art_sucursal: { required:"" }
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
      var temp = '';
      var fechi = $('#fecha_inicioo').val();
      var fechf = $('#fecha_finn').val();

      if(fechi.trim().length)
      {
        temp=temp+'&fechai='+datetoing(fechi);
      }
      if(fechf.trim().length)
      {
        temp=temp+'&fechaf='+datetoing(fechf);
      }
      
      $.ajax({
        url: $('base').attr('href') + 'evolcostodeactindirectas/buscar',
        type: 'POST',
        data: $('#form_save_reporte').serialize()+temp,
        dataType: "json",
        beforeSend: function() {
          $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
        },
        success: function(response) {
          $('#tab_content1 div.table-responsive').html(response.data.tiempo);
          $('#tab_content2 div.table-responsive').html(response.data.costo);
          $('#detfiltro').html(response.data.desc);
          $('#filtroreporte').modal('hide');
        },
        complete: function(response) {
          $.LoadingOverlay("hide");
        }
      }); 
    }
  });

  $("#filtroreporte").modal();
});

function limpcbx()
{
  $('.row .col-xs-12 .control-group select.form-control').val('');
}

$(document).on('focusout', '#descripcion', function (e) {
  var txt = $(this).val();
  if(txt.trim().length){}
  else { $('id_art_sucursal').val();}
});