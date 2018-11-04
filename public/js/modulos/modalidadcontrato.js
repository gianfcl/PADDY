$( document ).ready(function() {

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

    $('#form_save_modalidadcontrato').validate({
        rules:
        {
          modalidadcontrato:
          {
            required:true,
            minlength: 2,
            remote: {
              url: $('base').attr('href') + 'modalidadcontrato/validar_cc',
              type: "post",
              data: {
                modalidadcontrato: function() { return $( "#modalidadcontrato" ).val(); },
                id_modalidadcontrato: function() { return $('#id_modalidadcontrato').val(); }
              }
            }
          }       
        },
        messages: 
        {
          modalidadcontrato:
          {
            required:"Modalidad de Contrato",
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
                url: $('base').attr('href') + 'modalidadcontrato/save_modalidadcontrato',
                type: 'POST',
                data: $('#form_save_modalidadcontrato').serialize(),
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

                      $('#editmodalidadcontrato').modal('hide');

                      buscar_modalidadcontratos(page);
                    }
                    else
                    {
                      limpiarform();
                    }
                },
                complete: function() {
                  var id_modalidadcontrato = parseInt($('#id_modalidadcontrato').val());
                  id_modalidadcontrato = (id_modalidadcontrato>0) ? (id_modalidadcontrato) : ("0");
                  var text = (id_modalidadcontrato=="0") ? ("Guardo!") : ("Edito!");
                  alerta(text, 'Esta Modalidad de Contrato se '+text+'.', 'success');
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

$(document).on('click', '.add_modalidadcontrato', function (e)
{
    limpiarform();
});

$(document).on('click', '.btn_limpiar', function (e) {
  limpiarform();
  $('#editmodalidadcontrato').modal('hide');
});

function limpiarform()
{
  $('#id_modalidadcontrato').val('0');
  $('#modalidadcontrato').val('');
  $('#estado label').removeClass('active');
  $('#estado input').prop('checked', false);
  
  $('#estado #estado_1').prop('checked', true);
  $('#estado #estado_1').parent('label').addClass('active');

  if($('#modalidadcontrato').parents('.form-group').attr('class')=="form-group has-error")
  {
    $('#modalidadcontrato').parents('.form-group').removeClass('has-error');
  }

  if($('#modalidadcontrato-error').length>0)
  {
    $('#modalidadcontrato-error').html('');
  }
  var validatore = $( "#form_save_modalidadcontrato" ).validate();
  validatore.resetForm();
}

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  buscar_modalidadcontratos(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_modalidadcontratos(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_modalidadcontratos(page);
});

function buscar_modalidadcontratos(page)
{
  var um_busc = $('#um_busc').val();
  var temp = "page="+page;
  if(um_busc.trim().length)
  {
    temp=temp+'&um_busc='+um_busc;
  }
  $.ajax({
      url: $('base').attr('href') + 'modalidadcontrato/buscar_modalidadcontratos',
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
  var idmodalidadcontrato = $(this).parents('tr').attr('idmodalidadcontrato');
  $.ajax({
      url: $('base').attr('href') + 'modalidadcontrato/edit',
      type: 'POST',
      data: 'id_modalidadcontrato='+idmodalidadcontrato,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
          if (response.code==1) {
            $('#id_modalidadcontrato').val(response.data.id_modalidadcontrato);
            $('#modalidadcontrato').val(response.data.modalidadcontrato);

            $('#estado label').removeClass('active');
            $('#estado input').prop('checked', false);

            var num = response.data.estado;
            $('#estado #estado_'+num).prop('checked', true);
            $('#estado #estado_'+num).parent('label').addClass('active');

            if($('#modalidadcontrato').parents('.col-md-8').attr('class')=="col-md-8 col-sm-8 col-xs-12")
            {
              $('#modalidadcontrato').parents('.col-md-8').removeClass('has-error');
            }

            if($('#modalidadcontrato-error').length>0)
            {
              $('#modalidadcontrato-error').html('');
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
  var idmodalidadcontrato = $(this).parents('tr').attr('idmodalidadcontrato');
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var um_busc = $('#um_busc').val();
  var temp = "page="+page;
  if(um_busc.trim().length)
  {
    temp=temp+'&um_busc='+um_busc;
  }
  var nomb = "modalidadcontrato";
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
        url: $('base').attr('href') + 'modalidadcontrato/save_modalidadcontrato',
        type: 'POST',
        data: 'id_modalidadcontrato='+idmodalidadcontrato+'&estado=0',
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            if (response.code==1) {
              buscar_modalidadcontratos(temp);
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