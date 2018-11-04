$( document ).ready(function() {

    

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

    $('#form_save_zonam').validate({
        rules:
        {
          id_pisom:{ required:true },
          id_tipozonam:{ required:true },
          chekday: {required: true},
          zonam:{ 
            required:true, 
            minlength: 2,
            remote: {
              url: $('base').attr('href') + 'zonam/validar_zo',
              type: "post",
              data: {
                zonam: function() { return $( "#zonam" ).val(); },
                id_tipozonam: function() { return $('#id_tipozonam').val(); },
                id_pisom: function() { return $('#id_pisom').val(); },
                id_zonam: function() { return $('#id_zonam').val(); }

              }
            } 
          },
          nom_zona_v:{ 
            required:true,
            minlength: 2
          },     
        },
        
        messages: 
        {
          id_tipozonam:{
            required:"Seleccione el tipo de zona" },
          id_pisom:{
            required:"Seleccione el piso" },
          zonam:{ required:"Ingresar valor", minlength: "Más de 2 Letras", remote:"Ya Existe."},
          nom_zona_v:{ required:"Ingresar valor", minlength: "Más de 2 Letras."},
          chekday: { required: "Seleccionar un día."},
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
          else
          {
            if (element.attr("type") == "checkbox") 
            {
                error.insertAfter(element.closest('.col-md6').children('.error_check') );
            } 
            else 
            {
                error.insertAfter(element.parent());
            }
          }
        },
        submitHandler: function() {
            $.ajax({
                url: $('base').attr('href') + 'zonam/save_zonam',
                type: 'POST',
                data: $('#form_save_zonam').serialize(),
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
                      
                      buscar_zonams(page);
                      $('#editzonam').modal('hide');
                    }
                    limpiarform();
                },
                complete: function() {
                  var id_zonam = parseInt($('#idzonam').val());
                  id_zonam = (id_zonam>0) ? (id_zonam) : ("0");
                  var text = (id_zonam=="0") ? ("Guardo!") : ("Edito!");
                  alerta(text, 'Esta Grupo se '+text+'.', 'success');
                    limpiarform();
                }
            });
        }
    });

    $(".select2_single").select2({
      placeholder: "Seleccione Piso",
      allowClear: true,
      width: 'resolve'
    });

    var $eventLog = $(".js-event-log");
    var $eventSelect = $(".js-example-events");
     
    $eventSelect.on("select1:open", function (e) { console.log("select1:open", e); });
    $eventSelect.on("select1:close", function (e) {  if($('#id_grupo-error').length>0) { $('#id_grupo-error').html("Seleccione Grupo");}  });
    $eventSelect.on("select1:select", function (e) { if($('#id_grupo-error').length>0) { $('#id_grupo-error').html(""); }});
});

$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
  $('#pisom_idbusc').val('');
  $('#tipoz_idbusc').val('');
  $('#zonam_busc').val('');
  $('#nom_zonam_v_busc').val('');
  
  buscar_zonams(0);
});

$(document).on('click', '.add_zonam', function (e)
{
    limpiarform();
});

$(document).on('click', '.btn_limpiar', function (e) {
    limpiarform();
    $('#editzonam').modal('hide');
});

function limpiarform()
{
  $('#id_tipozonam').val('');
  $('#nom_zona_v').val('');
  $('#id_pisom').val('');
  $('#zonam').val('');
  for(var i = 1 ; i <= 7; i++){
    $('#chekday'+i.toString()).prop('checked',false);
  }

  $('form#form_save_zonam div#check_docu input').each(function(indice, elemento) {
    $("#dia"+$(elemento).val()).remove();
  }); 



  if($('#zonam').parents('.form-group').attr('class')=="form-group has-error")
  {
    $('#zonam').parents('.form-group').removeClass('has-error');
  }
  
  if($('#zonam-error').length>0)
  {
    $('#zonam-error').html("");    
    $('#zonam-error').parents('.form-group').removeClass('has-error');
  }

  if($('#id_grupo').parents('.form-group').attr('class')=="form-group has-error")
  {
    $('#id_grupo').parents('.form-group').removeClass('has-error');
  }
  
  if($('#id_grupo-error').length>0)
  {
    $('#id_grupo-error').html("");
    $('#id_grupo-error').parents('.form-group').removeClass('has-error');
  }

  $('#estado label').removeClass('active');
  $('#estado input').prop('checked', false);
  
  $('#estado #estado_1').prop('checked', true);
  $('#estado #estado_1').parent('label').addClass('active');

  var validatore = $( "#form_save_zonam" ).validate();
  validatore.resetForm();
}

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {
  var page = $(this).find('a').attr('tabindex');
  buscar_zonams(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_zonams(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_zonams(page);
});

function buscar_zonams(page)
{
  var pisom_idbusc = $('#pisom_idbusc').val();
  var tipoz_idbusc = $('#tipoz_idbusc').val();
  var zonam_busc = $('#zonam_busc').val();
  var nom_zonam_v_busc = $('#nom_zonam_v_busc').val();
  
  var temp = "page="+page;
  if(pisom_idbusc.length >0 )
  {
    temp=temp+'&pisom_idbusc='+pisom_idbusc;
  }

  if(tipoz_idbusc.length > 0)
  {
    temp=temp+'&tipoz_idbusc='+tipoz_idbusc;
  }

  if(zonam_busc.trim().length > 0)
  {
    temp=temp+'&zonam_busc='+zonam_busc;
  }
  
  if(nom_zonam_v_busc.length > 0)
  {
    temp=temp+'&nom_zonam_v_busc='+nom_zonam_v_busc;
  }

  $.ajax({
      url: $('base').attr('href') + 'zonam/buscar_zonams',
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
            limpiarform();
          }
      },
      complete: function() {
          //hideLoader();
      }
  });
}

$(document).on('click', '.edit', function (e) {
  limpiarform();
  var idzonam = $(this).parents('tr').attr('idzonam');
  //alerta($(this).parents('tr').attr('idzonam'));
  $.ajax({
    url: $('base').attr('href') + 'zonam/edit',
    type: 'POST',
    data: 'id_zonam='+idzonam,
    dataType: "json",
    beforeSend: function() {
        //showLoader();
    },
    success: function(response) {
      if (response.code==1) {
        $('#id_zonam').val(response.data.zonam.id_zonam);
        $('#zonam').val(response.data.zonam.zonam);
        $('#id_pisom').val(response.data.zonam.id_pisom);
        $('#id_tipozonam').val(response.data.zonam.id_tipozonam);
        $('#nom_zona_v').val(response.data.zonam.nom_zona_v);

        $.each(response.data.zonam_config, function(i,value){
          $('form#form_save_zonam div.form-group div#div_dias input').each(function(indice, elemento) {
              if($(elemento).val() == response.data.zonam_config[i].id_dia){
               $(elemento).prop('checked',true);
               $('#form_save_zonam #check_docu').append("<input id='dia"+$(elemento).val()+"' type='hidden' value='"+$(elemento).val()+"' name='dia["+$(elemento).val()+"]' />");
              }  
          }); 
        });
         
        $('#estado label').removeClass('active');
        $('#estado input').prop('checked', false);

        var num = response.data.zonam.estado;
        $('#estado #estado_'+num).prop('checked', true);
        $('#estado #estado_'+num).parent('label').addClass('active');
      
        if($('#zonam').parents('.form-group').attr('class')=="form-group has-error"){
          $('#zonam').parents('.form-group').removeClass('has-error');
        }

        if($('#zonam-error').length>0)
        {
          $('#zonam-error').html('');
        }
      }
    },
    complete: function() {
    }
  }); 
});

$(document).on('click', '.delete', function (e) {
  e.preventDefault();
  var idzonam = $(this).parents('tr').attr('idzonam');
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var nomb = "zonam";
  swal({
    title: 'Estas Seguro?',
    text: "De Eliminar este "+nomb,
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, estoy seguro!'
  }).then(function(isConfirm) {
    if (isConfirm) {     
      $.ajax({
        url: $('base').attr('href') + 'zonam/delete',
        type: 'POST',
        data: 'id_zonam='+idzonam,
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            if (response.code==1) {              
              buscar_zonams(page);
            }
        },
        complete: function() {
          var text = "Elimino!";
          alerta(text, 'Esta '+nomb+' se '+text+'.', 'success');
          limpiarform();
        }
      });
    }
  });   
});

$('#div_dias input[type="checkbox"]').on('change', function() {
          if($(this).is(":checked"))  {
        $('#form_save_zonam #check_docu').append("<input id='dia"+$(this).val()+"' type='hidden' value='"+$(this).val()+"' name='dia["+$(this).val()+"]' />");
    } else {
        $("#dia"+$(this).val()).remove();
    }  
});



