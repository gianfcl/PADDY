$( document ).ready(function() {

  jQuery.validator.setDefaults({
    debug: true,
    success: "valid",
    ignore: ""
  });

  $('#form_save_personal').validate({
    rules:
    {
      id_personal: { required:true }   
    },
    messages: 
    {
      id_personal: { required:"Seleccionar Personal" }
    },
    highlight: function(element) {
        $(element).parent().addClass('has-error');       
    },
    unhighlight: function(element) {
        $(element).parent().removeClass('has-error');
    },
    errorElement: 'span',
    errorClass: 'help-block',
    errorPlacement: function(error, element) 
    {
      error.insertAfter(element.parent());
    },
    submitHandler: function() {
        var id_personal = parseInt($('#id_personal').val());
        var url = $('#linkmodulo').val();
        if(id_personal>0)
        {
          window.location.href = url+'/buscar/'+id_personal;
        }
      }
    });
    
});

$(function () {
  $( "#dni" ).autocomplete({
    params: {'va': function() { return 'dni';}
    },
    type:'POST',
    serviceUrl: $('base').attr('href')+"personal/get_persona",
    onSelect: function (suggestion) 
    {
      $('#id_personal').val(suggestion.id_personal);
      $('#apellidos').val(suggestion.apellidos);
      $('#nombres').val(suggestion.nombres);
      $('#dni').val(suggestion.dni);
    }
  });

  $( "#nombres" ).autocomplete({
      params: {'va': function() { return 'nombres';}
    },
      //appendTo: autondni,
      type:'POST',
      serviceUrl: $('base').attr('href')+"personal/get_persona",
      onSelect: function (suggestion) 
      {
        $('#id_personal').val(suggestion.id_personal);
        $('#apellidos').val(suggestion.apellidos);
        $('#nombres').val(suggestion.nombres);
        $('#dni').val(suggestion.dni);
      }
  });

  $( "#apellidos" ).autocomplete({
      params: {'va': function() { return 'apellidos';}
    },
      //appendTo: autondni,
      type:'POST',
      serviceUrl: $('base').attr('href')+"personal/get_persona",
      onSelect: function (suggestion) 
      {
        $('#id_personal').val(suggestion.id_personal);
        $('#apellidos').val(suggestion.apellidos);
        $('#nombres').val(suggestion.nombres);
        $('#dni').val(suggestion.dni);
      }
  });
});
