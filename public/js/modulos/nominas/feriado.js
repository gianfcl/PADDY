$( document ).ready(function() {

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

    $('#form_save_feriado').validate({
      rules:
      {
        feriado:
        {
          required:true,
          minlength: 2,
          remote: {
            url: $('base').attr('href') + 'feriado/validar_cc',
            type: "post",
            data: {
              feriado: function() { return $( "#feriado" ).val(); },
              id_feriado: function() { return $('#id_feriado').val(); }
            }
          }
        },
        descripcion:
        {
          required:true,
          minlength: 2
        }      
      },
      messages: 
      {
        feriado:
        {
          required:"Ingresar feriado",
          minlength: "Más de 2 Letras",
          remote: 'Ya Existe'
        },
        descripcion:
        {
          required:"Ingresar feriado",
          minlength: "Más de 2 Letras"
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
          url: $('base').attr('href') + 'feriado/save_feriado',
          type: 'POST',
          data: $('#form_save_feriado').serialize(),
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

                $('#editferiado').modal('hide');

                buscar_feriados(page);
              }
              else
              {
                limpiarform();
              }
          },
          complete: function() {
            var id_feriado = parseInt($('#id_feriado').val());
            id_feriado = (id_feriado>0) ? (id_feriado) : ("0");
            var text = (id_feriado=="0") ? ("Guardo!") : ("Edito!");
            alerta(text, 'Esta feriado se '+text+'.', 'success');
            limpiarform();
          }
        });/**/
      }
    });

  $('#selemes').datetimepicker({    
    viewMode: 'years',
    format: 'DD-MM-YYYY',
    locale: moment.locale("es")
  });

  $('#buscaperidodo').datetimepicker({    
    viewMode: 'years',
    format: 'DD-MM-YYYY',
    locale: moment.locale("es")
  });
});

$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
});

$(document).on('click', '.add_feriado', function (e)
{
    limpiarform();
});

$(document).on('click', '.btn_limpiar', function (e) {
  limpiarform();
  $('#editferiado').modal('hide');
});

function limpiarform()
{
  $('#id_feriado').val('0');
  $('#feriado').val('');
  $('#estado label').removeClass('active');
  $('#estado input').prop('checked', false);
  
  $('#estado #estado_1').prop('checked', true);
  $('#estado #estado_1').parent('label').addClass('active');

  if($('#feriado').parents('.form-group').attr('class')=="form-group has-error")
  {
    $('#feriado').parents('.form-group').removeClass('has-error');
  }

  if($('#feriado-error').length>0)
  {
    $('#feriado-error').html('');
  }
  var validatore = $( "#form_save_feriado" ).validate();
  validatore.resetForm();
}

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  buscar_feriados(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_feriados(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_feriados(page);
});

function buscar_feriados(page)
{
  var um_busc = $('#um_busc').val();
  var desc_busc = $('#desc_busc').val();
  var temp = "page="+page;

  if(um_busc.trim().length)
  {
    temp=temp+'&um_busc='+um_busc;
  }

  if(desc_busc.trim().length)
  {
    temp=temp+'&desc_busc='+desc_busc;
  }

  $.ajax({
      url: $('base').attr('href') + 'feriado/buscar_feriados',
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
  var idferiado = $(this).parents('tr').attr('idferiado');
  $.ajax({
      url: $('base').attr('href') + 'feriado/edit',
      type: 'POST',
      data: 'id_feriado='+idferiado,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
          if (response.code==1) {
            $('#id_feriado').val(response.data.id_feriado);
            $('#feriado').val(response.data.feriado);
            $('#descripcion').val(response.data.descripcion);

            $('#estado label').removeClass('active');
            $('#estado input').prop('checked', false);

            var num = response.data.estado;
            $('#estado #estado_'+num).prop('checked', true);
            $('#estado #estado_'+num).parent('label').addClass('active');

            if($('#feriado').parents('.col-md-8').attr('class')=="col-md-8 col-sm-8 col-xs-12")
            {
              $('#feriado').parents('.col-md-8').removeClass('has-error');
            }

            if($('#feriado-error').length>0)
            {
              $('#feriado-error').html('');
            }
          }
      },
      complete: function() {
          //hideLoader();
      }
  });
});

$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
  $('#'+id+' select').val('');
  buscar_feriados(0);
});

$(document).on('click', '.delete', function (e) {
  e.preventDefault();
  var idferiado = $(this).parents('tr').attr('idferiado');
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var um_busc = $('#um_busc').val();
  var temp = "page="+page;
  if(um_busc.trim().length)
  {
    temp=temp+'&um_busc='+um_busc;
  }
  var nomb = "feriado";
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
        url: $('base').attr('href') + 'feriado/save_feriado',
        type: 'POST',
        data: 'id_feriado='+idferiado+'&estado=0',
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            if (response.code==1) {
              buscar_feriados(temp);
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