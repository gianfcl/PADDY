$( document ).ready(function() {

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

    $.validator.addMethod("validalerta", function(value, element) {
      var exp = value;
      var chekd = ($("#es_expiracion").is(':checked')) ? (true) : (false);
      console.log(chekd);
      if(chekd)
      {
        if (exp <= 0) { return false; }
        else
        {
          if($.isNumeric(exp)){ return true; }
          else{ return false; }
        }
      }
      else
      {
        if(exp.trim().length) {return false;  console.log('No escribas');}
        else { return true; console.log('vacio');}
      }

    }, "Error");

    $('#form_save_requisitos').validate({
        rules:
        {
          requisitos:
          {
            required:true,
            minlength: 2,
            remote: {
              url: $('base').attr('href') + 'requisitos/validar_cc',
              type: "post",
              data: {
                requisitos: function() { return $( "#requisitos" ).val(); },
                id_requisitos: function() { return $('#id_requisitos').val(); }
              }
            }
          },
          diasalerta:{validalerta:true}      
        },
        messages: 
        {
          requisitos:
          {
            required:"Requisito",
            minlength: "Más de 2 Letras",
            remote: 'Ya Existe'
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
                url: $('base').attr('href') + 'requisitos/save_requisitos',
                type: 'POST',
                data: $('#form_save_requisitos').serialize(),
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

                      $('#editrequisitos').modal('hide');

                      buscar_requisitoss(page);
                    }
                    else
                    {
                      limpiarform();
                    }
                },
                complete: function() {
                  var id_requisitos = parseInt($('#id_requisitos').val());
                  id_requisitos = (id_requisitos>0) ? (id_requisitos) : ("0");
                  var text = (id_requisitos=="0") ? ("Guardo!") : ("Edito!");
                  alerta(text, 'Este Requisito se '+text+'.', 'success');
                  limpiarform();
                }
            });/**/
        }
    });
});

$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
});

$(document).on('click', '.add_requisitos', function (e)
{
    limpiarform();
});

$(document).on('click', '.btn_limpiar', function (e) {
  limpiarform();
  $('#editrequisitos').modal('hide');
});

function limpiarform()
{
  $('#id_requisitos').val('0');
  $('#requisitos').val('');
  $('#estado label').removeClass('active');
  $('#estado input').prop('checked', false);
  $('#es_general').prop('checked', false);
  
  $('#estado #estado_1').prop('checked', true);
  $('#estado #estado_1').parent('label').addClass('active');

  if($('#requisitos').parents('.form-group').attr('class')=="form-group has-error")
  {
    $('#requisitos').parents('.form-group').removeClass('has-error');
  }

  if($('#requisitos-error').length>0)
  {
    $('#requisitos-error').html('');
  }
  $('#es_expiracion').prop('checked', false);
  var validatore = $( "#form_save_requisitos" ).validate();
  validatore.resetForm();
}

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  buscar_requisitoss(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_requisitoss(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_requisitoss(page);
});

function buscar_requisitoss(page)
{
  var um_busc = $('#um_busc').val();
  var temp = "page="+page;
  if(um_busc.trim().length)
  {
    temp=temp+'&um_busc='+um_busc;
  }
  $.ajax({
      url: $('base').attr('href') + 'requisitos/buscar_requisitoss',
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
  var idrequisitos = $(this).parents('tr').attr('idrequisitos');
  $.ajax({
      url: $('base').attr('href') + 'requisitos/edit',
      type: 'POST',
      data: 'id_requisitos='+idrequisitos,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
          if (response.code==1) {
            $('#id_requisitos').val(response.data.id_requisitos);
            $('#requisitos').val(response.data.requisitos);

            $('#estado label').removeClass('active');
            $('#estado input').prop('checked', false);

            var num = response.data.estado;
            $('#estado #estado_'+num).prop('checked', true);
            $('#estado #estado_'+num).parent('label').addClass('active');

            if($('#requisitos').parents('.col-md-8').attr('class')=="col-md-8 col-sm-8 col-xs-12")
            {
              $('#requisitos').parents('.col-md-8').removeClass('has-error');
            }

            if($('#requisitos-error').length>0)
            {
              $('#requisitos-error').html('');
            }
            var es = parseInt(response.data.es_expiracion);
            var es_va = (es==2) ? (true) : (false);
            $('#es_expiracion').prop('checked', es_va);

            $('#diasalerta').val(response.data.diasalerta);

            es = parseInt(response.data.es_general);
            es_va = (es==2) ? (true) : (false);
            $('#es_general').prop('checked', es_va);
          }
      },
      complete: function() {
          //hideLoader();
      }
  });
});

$(document).on('click', '.delete', function (e) {
  e.preventDefault();
  var idrequisitos = $(this).parents('tr').attr('idrequisitos');
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var um_busc = $('#um_busc').val();
  var temp = "page="+page;
  if(um_busc.trim().length)
  {
    temp=temp+'&um_busc='+um_busc;
  }
  var nomb = "requisitos";
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
        url: $('base').attr('href') + 'requisitos/save_requisitos',
        type: 'POST',
        data: 'id_requisitos='+idrequisitos+'&estado=0',
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            if (response.code==1) {
              buscar_requisitoss(temp);
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