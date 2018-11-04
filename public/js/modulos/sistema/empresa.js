$( document ).ready(function() {

  jQuery.validator.setDefaults({
    debug: true,
    success: "valid",
    ignore: ""
  });

    $('#form_save_pers_juridica').validate({
        rules:
        {
          ruc:
          {
            required:true,
            number: true,
            rangelength:[11,11]
          },
          razon_social:{ required:true },
          direccion_fiscal:{ required:true },
          id_departamento:{ required:true },
          id_provincia:{ required:true },
          id_distrito:{ required:true },
          email:{email: true }     
        },
        messages: 
        {
          ruc:
          {
            required:"Ingrese RUC",
            number: "Solo #s",
            rangelength:"RUC Incorrecto"
          },
          razon_social:{ required: "" },
          direccion_fiscal:{ required: "" },
          aniversario:{ date: "Ingrese una fecha valida" },
          id_departamento:{ required:"" },
          id_provincia:{ required:"" },
          id_distrito:{ required:"" },
          email:{email: "Incorrecto" }    
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
            if(element.parent('.form-group').length) 
            {
              error.insertAfter(element.parent());
              //element.closest('.control-group').find('.help-block').html(error.text()); 
            } 
            else { 
              if(element.parent('.col-md-12').length) { error.insertAfter(element.parent());}
              else if(element.parent('.col-md-9').length) { error.insertAfter(element.parent());}
              else {}
            }
        },
        submitHandler: function() {
            $.ajax({
                url: $('base').attr('href') + 'empresa/save_empresa',
                type: 'POST',
                data: $('#form_save_pers_juridica').serialize(),
                dataType: "json",
                beforeSend: function() {
                    //showLoader();
                },
                success: function(response) {
                    if (response.code==1) {
                       //window.location.href = $('base').attr('href') +'empresa/edit_juri/'+response.data.id;
                    }
                    else
                    {
                      if($('#ruc').parents('.col-md-4').attr('class')=="col-md-4")
                      {
                        $('#ruc').parents('.col-md-4').addClass('has-error');
                      }
                      
                      if($('#ruc-error').length>0)
                      {
                        $('#ruc-error').html(response.message);
                      }
                      else
                      {
                        $('#ruc').parents('.col-md-4').append("<span id='ruc-error' class='help-block'>"+response.message+"</span>");
                      }
                    }
                },
                complete: function() {
                  alerta('Ok!','Guardo Con exito','success');
                }
            });/**/
        }
    });

    $('#aniversario').daterangepicker({
      singleDatePicker: true,
      format: 'YYYY-MM-DD',
      calender_style: "picker_4"
    }, function(start, end, label) {
      console.log(start.toISOString(), end.toISOString(), label);
    }); 
});

$(function () {

  $( "#ruc2" ).autocomplete({
  //appendTo: autondni,
  type:'POST',
  serviceUrl: $('base').attr('href')+"personajuridica/get_ruc",
  onSelect: function (suggestion) 
  {
    $('#id_persona_juridica').val(suggestion.id_persona_juridica);
    $('#nombre_comercial').val(suggestion.nombre_comercial);
    $('#razon_social').val(suggestion.razon_social);
    $('#direccion_fiscal').val(suggestion.direccion_fiscal);
    $('#id_departamento').val(suggestion.id_departamento);
    $('#id_provincia').val(suggestion.id_provincia);
    $('#id_distrito').val(suggestion.id_distrito);
    $('#aniversario').val(suggestion.aniversario);
    $('#pagina_web').val(suggestion.pagina_web);
    $('#ruc').val(suggestion.ruc);
  }
});

});


$(document).on('change', '#id_departamento', function (e)
{
  var id_departamento = $(this).val();

  $.ajax({
      url: $('base').attr('href') + 'ubigeo/combox_prov',
      type: 'POST',
      data: 'id_departamento='+id_departamento,
      dataType: "json",
      success: function(response) {
        if (response.code == "1") {
          $('#id_provincia').html(response.data);
          $('#id_distrito').html("<option value=''>DISTRITO</option>");
        }
      },
      complete: function() {
          //hideLoader();
      }
  });
});


$(document).on('change', '#id_provincia', function (e)
{
  var id_provincia = $(this).val();

  $.ajax({
      url: $('base').attr('href') + 'ubigeo/combox_dist',
      type: 'POST',
      data: 'id_provincia='+id_provincia,
      dataType: "json",
      success: function(response) {
        if (response.code == "1") {
          $('#id_distrito').html(response.data);
        }
      },
      complete: function() {
          //hideLoader();
      }
  });

});
