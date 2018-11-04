$( document ).ready(function() {
  $.validator.addMethod("time24", function(value, element) {
    var exp = value;
    if($.trim(exp).length>0) {
      return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9] [APap][mM]$/.test(value);
    }
    else {
      return true;
    }
  }, "");

  $('#form_save_conductor').validate({
    rules:
    {
      numero_licencia:{ required:true },
      clase:{ required:true },
      categoria:{ required:true },
      fecha_expedicion:{ required:true },
      fecha_de_revalicion:{ required:true }
    },
    messages:{
      numero_licencia:{ required:"" },
      clase:{ required:"" },
      categoria:{ required:"" },
      fecha_expedicion:{ required:"" },
      fecha_de_revalicion:{ required:"" }
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
      $.ajax({
        url: $('base').attr('href') + 'personanatural/save_conductor',
        type: 'POST',
        data: $('#form_save_conductor').serialize(),
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
          var tipo =  'error';
          var text = "ERROR!";
          if (response.code==1) {
            tipo =  'success';
            text = "se Guardo!";
          }          
          
          alerta(text, 'Este Conductor '+text+'.',tipo);
        },
        complete: function(response) {
          
        }
      });/**/
    }
  });
});

$(function () {
  $('#fecha_expedicion').daterangepicker({
    singleDatePicker: true,
    format: 'YYYY-MM-DD',
    calender_style: "picker_4"
  }, function(start, end, label) {
  });

  $('#fecha_de_revalicion').daterangepicker({
    singleDatePicker: true,
    format: 'YYYY-MM-DD',
    calender_style: "picker_4"
  }, function(start, end, label) {
  });
});