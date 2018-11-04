$( document ).ready(function() {

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

    $('#form_save_atributos').validate({
        rules:
        {
          atributos:
          {
            required:true,
            minlength: 2,
            remote: {
              url: $('base').attr('href') + 'atributos/validar',
              type: "post",
              data: {
                atributos: function() { return $( "#atributos" ).val(); },
                id_atributos: function() { return $('#id_atributos').val(); }
              }
            }
          }       
        },
        messages: 
        {
          atributos:
          {
            required:"Ingresar atributos",
            minlength: "Más de 2 Letras",
            remote: "Ya Existe"
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
            if(element.parent('.col-md-6').length) 
            {
              error.insertAfter(element.parent()); 
            }
        },
        submitHandler: function() {
            $.ajax({
                url: $('base').attr('href') + 'atributos/save_atributos',
                type: 'POST',
                data: $('#form_save_atributos').serialize(),
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

                      $('#editatributos').modal('hide');

                      buscar_atributoss(page);
                    }
                    else
                    {
                      limpiarform();
                    }
                },
                complete: function() {
                  var id_atributos = parseInt($('#id_atributos').val());
                  id_atributos = (id_atributos>0) ? (id_atributos) : ("0");
                  var text = (id_atributos=="0") ? ("Guardo!") : ("Edito!");
                  alerta(text, 'Este atributos se '+text+'.', 'success');
                  limpiarform();
                }
            });/**/
        }
    });
});

$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
  $('#'+id).find('input[type=hidden]').val('');
  $('#tat_busc').val('');
  buscar_atributoss(0);
});

$(document).on('click', '.add_atributos', function (e)
{
    limpiarform();
});

$(document).on('click', '.btn_limpiar', function (e) {
  limpiarform();
  $('#editatributos').modal('hide');
});

function limpiarform()
{
  $('#id_atributos').val('0');
  $('#atributos').val('');
  $('#abreviatura').val('');
  $('#id_tatributo').val('');
  $('#estado label').removeClass('active');
  $('#estado input').prop('checked', false);
  
  $('#estado #estado_1').prop('checked', true);
  $('#estado #estado_1').parent('label').addClass('active');

  if($('#atributos').parents('.form-group').attr('class')=="form-group has-error")
  {
    $('#atributos').parents('.form-group').removeClass('has-error');
  }

  if($('#atributos-error').length>0)
  {
    $('#atributos-error').html('');
  }
  var validatore = $( "#form_save_atributos" ).validate();
  validatore.resetForm();
}

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  buscar_atributoss(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_atributoss(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_atributoss(page);
});

function buscar_atributoss(page)
{
  
  //Atributo 
  var at_busc = $('#at_busc').val();
  var temp = "page="+page+'&esban=1';
  if(at_busc.trim().length)
  {
    temp=temp+'&at_busc='+at_busc;
  }
  //Abreviatura
  var abre_busc = $('#abre_busc').val();

  if((abre_busc.trim()).length)
  {
    temp=temp+'&abre_busc='+abre_busc;
  }
  //Tipo de Atributo
    var tat_busc = $('#tat_busc').val();

  if((tat_busc.trim()).length)
  {
    temp=temp+'&tat_busc='+tat_busc;
  }
  $.ajax({
      url: $('base').attr('href') + 'atributos/buscar_atributoss',
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

$(document).on('click', '.edit', function (e) {
  var idatributos = $(this).parents('tr').attr('idatributos');
  $.ajax({
      url: $('base').attr('href') + 'atributos/edit',
      type: 'POST',
      data: 'id_atributos='+idatributos,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
          if (response.code==1) {
            $('#id_atributos').val(response.data.id_atributos);
            $('#atributos').val(response.data.atributos);
            $('#abreviatura').val(response.data.abreviatura);
            $('#id_tatributo').html(response.data.cbx_tatr);

            $('#estado label').removeClass('active');
            $('#estado input').prop('checked', false);

            var num = response.data.estado;
            $('#estado #estado_'+num).prop('checked', true);
            $('#estado #estado_'+num).parent('label').addClass('active');

            if($('#atributos').parents('.col-md-8').attr('class')=="col-md-8 col-sm-8 col-xs-12")
            {
              $('#atributos').parents('.col-md-8').removeClass('has-error');
            }

            if($('#atributos-error').length>0)
            {
              $('#atributos-error').html('');
            }
          }
      },
      complete: function() {
          //hideLoader();
      }
  });
});

$(document).on('click', '.delete', function (e) {
  e.preventDefault();
  var idatributos = $(this).parents('tr').attr('idatributos');
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var um_busc = $('#um_busc').val();
  var temp = "page="+page;
  var nomb = "atributos";
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
        url: $('base').attr('href') + 'atributos/save_atributos',
        type: 'POST',
        data: 'id_atributos='+idatributos+'&estado=0',
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            if (response.code==1) {
              buscar_atributoss(temp);
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

$(function () {
    $( "#abreviatura" ).autocomplete({
    serviceUrl: $('base').attr('href')+"unidadmedidaaf/get_unidadmedidaaf",
    minChars: 2,
    onSelect: function (suggestion) {
      //alert('You selected: ' + suggestion.value + ', ' + suggestion.data);
      $('#id_um').val(suggestion.id_um);
      if($('#id_um-error').length>0)
      {
        if($('#id_um-error').attr('class')=="help-block")
        {
          $('#id_um-error').remove();
        }
      }
    }
  });
});