$( document ).ready(function() {
  $('#form-add-contactos-nat').validate({
    rules:
    {
      dni:
      {
        required:true
      },
      apellidos:
      {
        required:true,
        minlength: 3
      },
      nombres:
      {
        required:true,
        minlength: 3
      },
      cargo:
      {
        required:true
      }            
    },
    messages: 
    {
      dni:
      {
        required:""
      },
      apellidos:
      {
        required:""
      },
      nombres:
      {
        required:"",
        minlength: ""
      },
      cargo:
      {
        required:""
      }
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
        if(element.parent('.col-md-5').length) { error.insertAfter(element.parent()); }
        else if(element.parent('.col-md-8').length) { error.insertAfter(element.parent()); }
        else {}         
    },
    submitHandler: function() {
      var orden_ = 0;
      var orden = 0;
      var id_cliente = parseInt($('#id_cliente').val());

      //alerta('Ok',"lo formamos-->"+orden+'id_sucursal-->'+id_sucursal,'success');
      if(id_cliente>0)
      {            
        $.ajax({
            url: $('base').attr('href') + 'clientes/save_contacto_nat',
            type: 'POST',
            data: $('#form-add-contactos-nat').serialize()+'&id_cliente='+id_cliente,
            dataType: "json",
            beforeSend: function() {
              //showLoader();
            },
            success: function(response) {
              if (response.code==1) {
                direccionar();
              }
            },
            complete: function() {
              //hideLoader();
            }
        });
      }
        
    }
  });
});

$.extend({
  xResponse: function(url, data) {
    // local var
    var theResponse = null;
    // jQuery ajax
    $.ajax({
        url: url,
        type: 'POST',
        data: data,
        dataType: "json",
        async: false,
        success: function(respText) {
            theResponse = respText;
        }
    });
    // Return the response text
    return theResponse;
  }
});

/*function isSession(temp) {
  return $.ajax({
    type: "POST",
    url: $('base').attr('href') + 'clientes/traercont',
    data: {temp},
    dataType: "json",
    success: function(response) {
      if (response.code==1) {
        $('#div_celu').html(response.data.cell);
        $('#div_tel').html(response.data.tele);
      }
    },
    async: false,
    error: function() {
      alert("Error occured")
    }
  });
}*/
// global param

/*var selector = !0;
// get return ajax object
var ajaxObj = isSession(selector);
// store ajax response in var
var ajaxResponse = ajaxObj.responseText;
// check ajax response
console.log(ajaxResponse);
// your ajax callback function for success
ajaxObj.success(function(response) {
    alert(response);
});*/

$(function () {
  function construir (suggest)
  {
    $('#id_persona_natural').val(suggest.id_persona);
    $('#dni_').val(suggest.dni);
    $('#apellidos_').val(suggest.apellidos);
    $('#nombres_').val(suggest.nombres);
    $('#email').val(suggest.email);

    $('#gender label').removeClass('active');
    $('#gender input').prop('checked', false);

    var num = suggest.sexo;
    $('#gender #sexo_'+num).prop('checked', true);
    $('#gender #sexo_'+num).parent('label').addClass('active');
    var obj = isSession(suggest.id_persona);    
  }

  $( "#dni_" ).autocomplete({
    params: { 
      'id_documentoidentidad': function() { return $('input:radio[name=id_documentoidentidad]:checked').val(); },
      'ids': function() { return $('#allids').val(); },
      'va': function() { return "dni"}
    },
    type:'POST',
    serviceUrl: $('base').attr('href')+"persona/get_infopn",
    onSelect: function (suggestion) 
    {
      construir(suggestion)
    }
  });

  $( "#apellidos_" ).autocomplete({
    params: { 
      'id_documentoidentidad': function() { return $('input:radio[name=id_documentoidentidad]:checked').val(); },
      'ids': function() { return $('#allids').val(); },
      'va': function() { return "apellidos"}
    },
    type:'POST',
    serviceUrl: $('base').attr('href')+"persona/get_infopn",
    onSelect: function (suggestion) 
    {
      construir(suggestion)
    }
  });

  $( "#nombres_" ).autocomplete({
    params: { 
      'id_documentoidentidad': function() { return $('input:radio[name=id_documentoidentidad]:checked').val(); },
      'ids': function() { return $('#allids').val(); },
      'va': function() { return "nombres"}
    },
    type:'POST',
    serviceUrl: $('base').attr('href')+"persona/get_infopn",
    onSelect: function (suggestion) 
    {
      construir(suggestion)
    }
  });
});

$(document).on('click', '.edit_contacte', function (e)
{
  var idcontacto = $(this).parents('tr').attr('idcontacto');
  $.ajax({
    url: $('base').attr('href') + 'clientes/get_un_contacto',
    type: 'POST',
    data: 'id_contactos_cliente='+idcontacto,
    dataType: "json",
    success: function(response) {
      if (response.code == "1") {
        $('#id_contactos_cliente').val(response.data.id_contactos_cliente);
        $('#id_persona_natural').val(response.data.id_persona);
        $('#dni_').val(response.data.dni);
        $('#apellidos_').val(response.data.apellidos);
        $('#nombres_').val(response.data.nombres);
        $('#cargo').val(response.data.cargo);          
        $('#email').val(response.data.email);

        $('#gender label').removeClass('active');
        $('#gender input').prop('checked', false);
        var num = response.data.id_documentoidentidad;
        $('#iddocidn_'+num).prop('checked', true);

        $('#genera').prop('checked', false);
        $('#nodocu').prop('checked', true);

        num = response.data.sexo;
        $('#gender #sexo_'+num).prop('checked', true);
        $('#gender #sexo_'+num).parent('label').addClass('active');

        $('#div_celu').html(response.data.cell);
        $('#div_tel').html(response.data.tele);
      }
    },
    complete: function() {
        //hideLoader();
    }
  });
    
});

$(document).on('change', '#form-add-contactos-nat input:radio[name=id_documentoidentidad]', function (e)
{
  var id = parseInt($(this).val());
  $('#dni_').val('');
  $('#dni_').prop( "disabled", false );
  $('#divdocu input').prop('checked', false);
  $('input#nodocu').prop('checked', true);
  if(id>0)
  {
    var autoge = $('#autoge').val();
    var nombr = autoge+$('input.doc_'+id).val();
    var padre = $('#dni_').closest('.form-group');
    padre.find('label.control-label span').html(nombr+' *');
    $('#dni_').attr({'placeholder':nombr});
  }    
});

$(document).on('change', '#form-add-contactos-nat input:radio[name=genera]', function (e)
{
  var id = parseInt($(this).val());
  var va = false;
  if(id>0)
  {
    va = true;
    $.ajax({
      url: $('base').attr('href') + 'persona/dni_genera',
      type: 'POST',
      data: 'id_documentoidentidad='+$('input:radio[name=id_documentoidentidad]:checked').val(),
      dataType: "json",
      success: function(response) {
        if (response.code == "1") {
          $('#dni_').val(response.data);
        }
      },
      complete: function() {
          //hideLoader();
      }
    });
  }
  else
  {
    $('#dni_').val('');
  }
  $('#dni_').prop( "disabled", va );
});

$(document).on('click', '.delete_contacte', function (e)
{
  e.preventDefault();
  var idcontacto = $(this).parents('tr').attr('idcontacto');
  var nomb = $(this).parents('tr').find('td.nomb').html();
  swal({
    title: 'Estas Seguro?',
    text: "De Eliminar "+nomb+"?",
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, estoy seguro!'
  }).then(function(isConfirm) {
    if(isConfirm)
    {
      $.ajax({
          url: $('base').attr('href') + 'clientes/delete_contacto_nat',
          type: 'POST',
          data: 'id_contactos_cliente='+idcontacto,
          dataType: "json",
          beforeSend: function() {
            $.LoadingOverlay("show", {image : "", fontawesome : "fa fa-spinner fa-spin"});
          },
          success: function(response) {
              if (response.code==1) {
                direccionar();
              }
          },
          complete: function() {
            $.LoadingOverlay("hide");
          }
      });
    }
      
  });
});