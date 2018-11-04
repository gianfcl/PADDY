$( document ).ready(function() {

  jQuery.validator.setDefaults({
    debug: true,
    success: "valid",
    ignore: ""
  });

  $('#datetimepicker6').datetimepicker({
    format: 'DD-MM-YYYY',
    locale: moment.locale("es")
  });

  $.validator.addMethod("formespn",
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
      id_personal: { required:true},
      fecha_inicio: { formespn:true }
    },
    messages: 
    {
      id_sucursal: {required:"Sucursal"},
      id_personal: {required:"Personal"}
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
      $('#tab_content1 div.table-responsive').html('');
      $('#tab_content2 div.table-responsive').html('');
      var info = $('#id_sucursal option:selected').text()+' - '+$('#id_personal option:selected').text()+' - '+$('#fecha_inicio').val();
      $('#detfiltro').html(info);
      $.ajax({
        url: $('base').attr('href') + 'actividadesxpersonaxdia/buscar',
        type: 'POST',
        data: $('#form_save_reporte').serialize(),
        dataType: "json",
        beforeSend: function() {
          $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
        },
        success: function(response) {
          if(response.code==1)
          {
            $('#tab_content1 div.table-responsive').html(response.data.gen);
            $('#tab_content2 div.table-responsive').html(response.data.cos);
          }
          $('#filtroreporte').modal('hide');
        },
        complete: function(response) {
          $.LoadingOverlay("hide");
        }
      });
    }
  });
});

$(document).on('change', '#id_sucursal', function (e)
{
  var idsuc = parseInt($(this).val());
  if(idsuc > 0)
  {
    $.ajax({
      url: $('base').attr('href') + 'actividadesxpersonaxdia/buscar_trabasucu',
      type: 'POST',
      data: 'idsuc='+idsuc,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
        if (response.code==1) {
          $('#id_personal').html(response.data);
        }
      },
      complete: function() {
        //hideLoader();
      }
    });
  }
});