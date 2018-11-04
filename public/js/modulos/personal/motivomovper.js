$( document ).ready(function() {

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

    $('#tipo').selectpicker();
    $('#tipo_busc').selectpicker();
    $('#estado_busc').selectpicker();

    $('#form_save_motivomovper').validate({
        rules:
        {
          motivomovper:
          {
            required:true,
            minlength: 2,
            remote: {
              url: $('base').attr('href') + 'motivomovper/validar',
              type: "post",
              data: {
                motivomovper: function() { return $( "#motivomovper" ).val(); },
                id_motivomovper: function() { return $('#id_motivomovper').val(); }
              }
            }
          }       
        },
        messages: 
        {
          motivomovper:
          {
            required:"Ingresar Motivo",
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
            var tipo = ($('#tipo').val()).join();
            $.ajax({
                url: $('base').attr('href') + 'motivomovper/save_motivomovper',
                type: 'POST',
                data: $('#form_save_motivomovper').serialize()+'&tipom='+tipo,
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

                      $('#editmotivomovper').modal('hide');

                      buscar_motivomovpers(page);
                    }
                },
                complete: function() {
                  var id_motivomovper = parseInt($('#id_motivomovper').val());
                  id_motivomovper = (id_motivomovper>0) ? (id_motivomovper) : ("0");
                  var text = (id_motivomovper=="0") ? ("Guardo!") : ("Edito!");
                  alerta(text, 'Este Motivo se '+text+'.', 'success');
                  limpiarform();
                }
            });/**/
        }
    });
});

$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
  $('#tipo_busc').val('');
  $('#estado_busc').val('');
  $('#tipo_busc').selectpicker('refresh');
  $('#estado_busc').selectpicker('refresh');
  buscar_motivomovpers(0);
});

$(document).on('click', '.add_motivomovper', function (e)
{
    limpiarform();
});

$(document).on('click', '.btn_limpiar', function (e) {
  limpiarform();
  $('#editmotivomovper').modal('hide');
});

function limpiarform()
{
  $('#id_motivomovper').val('0');
  $('#motivomovper').val('');
  $('#estado label').removeClass('active');
  $('#estado input').prop('checked', false);
  $('#tipo').val('');
  $('#tipo').selectpicker('refresh');
  $('#estado #estado_1').prop('checked', true);
  $('#estado #estado_1').parent('label').addClass('active');

  if($('#motivomovper').parents('.form-group').attr('class')=="form-group has-error")
  {
    $('#motivomovper').parents('.form-group').removeClass('has-error');
  }

  if($('#motivomovper-error').length>0)
  {
    $('#motivomovper-error').html('');
  }
  var validatore = $( "#form_save_motivomovper" ).validate();
  validatore.resetForm();
}

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  buscar_motivomovpers(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_motivomovpers(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_motivomovpers(page);
});

function buscar_motivomovpers(page)
{
  var motivo_busc = $('#motivo_busc').val();
  var tipo = $('#tipo_busc').val();
  var estado = $('#estado_busc').val();
  var temp = "page="+page;
  if(motivo_busc.trim().length)
  {
    temp=temp+'&motivomovper='+motivo_busc;
  }
  if(tipo && tipo.join().trim().length)
  {
    tipo = tipo.length>1 ? 3 : tipo;
    temp=temp+'&tipo='+tipo;
  }
  if(parseInt(estado)>-1)
  {
    temp=temp+'&estado='+estado; 
  }

  $.ajax({
      url: $('base').attr('href') + 'motivomovper/buscar_motivomovpers',
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
  var idmotivomovper = $(this).parents('tr').attr('idmotivomovper');
  $.ajax({
      url: $('base').attr('href') + 'motivomovper/edit',
      type: 'POST',
      data: 'id_motivomovper='+idmotivomovper,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
          if (response.code==1) {
            $('#id_motivomovper').val(response.data.id_motivomovper);
            $('#motivomovper').val(response.data.motivomovper);

            $('#estado label').removeClass('active');
            $('#estado input').prop('checked', false);

            var num = response.data.estado;
            $('#estado #estado_'+num).prop('checked', true);
            $('#estado #estado_'+num).parent('label').addClass('active');

            if($('#motivomovper').parents('.col-md-8').attr('class')=="col-md-8 col-sm-8 col-xs-12")
            {
              $('#motivomovper').parents('.col-md-8').removeClass('has-error');
            }

            if($('#motivomovper-error').length>0)
            {
              $('#motivomovper-error').html('');
            }

            var tipo = response.data.tipo;
            if(tipo==3)
            {
              $('#tipo option').prop('selected',true)
            }
            else
            {
              $('#tipo').val(tipo); 
            }

            $('#tipo').selectpicker('refresh');
          }
      },
      complete: function() {
          //hideLoader();
      }
  });
});

$(document).on('click', '.delete', function (e) {
  e.preventDefault();
  var idmotivomovper = $(this).parents('tr').attr('idmotivomovper');

  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var temp = "page="+page;

  var nomb = "motivo";
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
        url: $('base').attr('href') + 'motivomovper/save_motivomovper',
        type: 'POST',
        data: 'id_motivomovper='+idmotivomovper+'&estado=0',
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            if (response.code==1) {
              buscar_motivomovpers(temp);
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