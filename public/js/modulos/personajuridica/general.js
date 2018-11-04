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

  $.validator.addMethod("formespn",
    function(value, element) {
      if(value.trim().length)
        return /^(0?[1-9]|[12]\d|3[01])[\.\/\-](0?[1-9]|1[012])[\.\/\-]([12]\d)?(\d\d)$/.test( value );
      else
        return true;
  }, "Ingrese est Formato dd-mm-yyyy");

  $.validator.addMethod("forni", function(value, element) {
      var exp = value;
      var num = parseInt($('input:radio[name=id_documentoidentidad]:checked').val());// console.log(num);
      if(num==1)
      {
        if (exp <= 0) { return false; }
        else {
            if($.isNumeric(exp) && exp.trim().length==8){ return true; }
            else{ return false; }
        }
      }
      else
      {
        if(exp.trim().length<20) {return true}
        else { return false;}
      }
        
  }, "Corregir");

  $('#form_save_pers_juridica').validate({
    rules:
    {
      ruc:{ required:true },
      razon_social:{ required:true },
      direccion_fiscal:{ required:true },
      id_departamento:{ required:true },
      id_provincia:{ required:true },
      id_distrito:{ required:true}      
    },
    messages:{
      ruc: { required:"Ingrese RUC" },
      razon_social:{ required:"" },
      direccion_fiscal:{ required: "" },
      id_departamento: { required:"" },
      id_provincia:{ required: "" },
      id_distrito:{ required:true} 
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
        url: $('base').attr('href') + 'personajuridica/save_persona_jurdica',
        type: 'POST',
        data: $('#form_save_pers_juridica').serialize(),
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
          var tip = (response.data.error_code==1) ? "success" : "error";
          var tit = tip == "error" ? "No" : "";
          var msn = response.data.error_msg;
          alerta(tit+' Guardo',msn,tip);
        },
        complete: function(response) {
          
        }
      });
    }
  });

  $('#aniversario').daterangepicker({
    singleDatePicker: true,
    format: 'DD-MM-YYYY',
    calender_style: "picker_4"
  }, function(start, end, label) {
    console.log(start.toISOString(), end.toISOString(), label);
  });
});


$(document).on('change', '#id_pais', function (e)
{
  var id_pais = $(this).val();
  $('#id_departamento').html('');
  $('#id_provincia').html("");   
  $('#id_distrito').html("");    
  $.ajax({
      url: $('base').attr('href') + 'ubigeo/combox_dep',
      type: 'POST',
      data: 'idPais='+id_pais,
      dataType: "json",
      success: function(response) {
        if (response.code == "1") {
          $('#id_departamento').html(response.data);
          $('#id_provincia').html("<option value=''>Provincia</option>");  
          $('#id_distrito').html("<option value=''>Distrito</option>");        
        }
      },
      complete: function() {
        //hideLoader();
      }
  });
});

$(document).on('change', '#id_departamento', function (e)
{
  var padre = $(this);
  var id_departamento = padre.val();
  
  $.ajax({
      url: $('base').attr('href') + 'ubigeo/combox_prov',
      type: 'POST',
      data: 'id_departamento='+id_departamento,
      dataType: "json",
      success: function(response) {
        if (response.code == "1") {
          $('#id_provincia').html(response.data);
          $('#id_distrito').html("<option value=''>Distrito</option>");        
        }
      },
      complete: function() {
        //hideLoader();
      }
  });
});


$(document).on('change', '#id_provincia', function (e)
{
  var padre = $(this);
  var id_provincia = padre.val();

  var tipo = padre.attr('tipo');
  
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

/*Validar Al Salir del Formulario*/
$(document).on('click', '#myTab li.tab a, .breadcrumb li a', function (e) {
    var url = $(this).attr('url');
    window.location.href = url;       
});
/*<---->*/