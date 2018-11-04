$( document ).ready(function() {

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

    $('#form_save_periodo').validate({
      rules:
      {
        periodo:
        {
          required:true,
          minlength: 2,
          remote: {
            url: $('base').attr('href') + 'periodo/validar_cc',
            type: "post",
            data: {
              periodo: function() { return $( "#periodo" ).val(); },
              id_periodo: function() { return $('#id_periodo').val(); }
            }
          }
        }       
      },
      messages: 
      {
        periodo:
        {
          required:"Ingresar Periodo",
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
          url: $('base').attr('href') + 'periodo/save_periodo',
          type: 'POST',
          data: $('#form_save_periodo').serialize(),
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

                $('#editperiodo').modal('hide');

                buscar_periodos(page);
              }
              else
              {
                limpiarform();
              }
          },
          complete: function() {
            var id_periodo = parseInt($('#id_periodo').val());
            id_periodo = (id_periodo>0) ? (id_periodo) : ("0");
            var text = (id_periodo=="0") ? ("Guardo!") : ("Edito!");
            alerta(text, 'Esta Periodo se '+text+'.', 'success');
            limpiarform();
          }
        });/**/
      }
    });

  $('#selemes').datetimepicker({    
    viewMode: 'years',
    format: 'MM-YYYY',
    locale: moment.locale("es")
  });

  $('#buscaperidodo').datetimepicker({    
    viewMode: 'years',
    format: 'MM-YYYY',
    locale: moment.locale("es")
  });
});

$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
});

$(document).on('click', '.add_periodo', function (e)
{
    limpiarform();
});

$(document).on('click', '.btn_limpiar', function (e) {
  limpiarform();
  $('#editperiodo').modal('hide');
});

function limpiarform()
{
  $('#id_periodo').val('0');
  $('#periodo').val('');
  $('#estado label').removeClass('active');
  $('#estado input').prop('checked', false);
  
  $('#estado #estado_1').prop('checked', true);
  $('#estado #estado_1').parent('label').addClass('active');

  if($('#periodo').parents('.form-group').attr('class')=="form-group has-error")
  {
    $('#periodo').parents('.form-group').removeClass('has-error');
  }

  if($('#periodo-error').length>0)
  {
    $('#periodo-error').html('');
  }
  var validatore = $( "#form_save_periodo" ).validate();
  validatore.resetForm();
  $('#estadoc input').prop('checked',false);
  $('#estadoc label').removeClass('active');

  $('#estadoc #estadoc_1').prop('checked',true);
  $('#estadoc #estadoc_1').parent().addClass('active');
}

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  buscar_periodos(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_periodos(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_periodos(page);
});

function buscar_periodos(page)
{
  var um_busc = $('#um_busc').val();
  var temp = "page="+page;
  if(um_busc.trim().length)
  {
    temp=temp+'&um_busc='+um_busc;
  }
  $.ajax({
      url: $('base').attr('href') + 'periodo/buscar_periodos',
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
  var idperiodo = $(this).parents('tr').attr('idperiodo');
  $.ajax({
      url: $('base').attr('href') + 'periodo/edit',
      type: 'POST',
      data: 'id_periodo='+idperiodo,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
          if (response.code==1) {
            $('#id_periodo').val(response.data.id_periodo);
            $('#periodo').val(response.data.periodo);

            $('#estado label').removeClass('active');
            $('#estado input').prop('checked', false);

            var num = response.data.estado;
            $('#estado #estado_'+num).prop('checked', true);
            $('#estado #estado_'+num).parent('label').addClass('active');

            $('#estadoc label').removeClass('active');
            $('#estadoc input').prop('checked', false);

            var num2 = response.data.estado_contable;
            $('#estadoc #estadoc_'+num2).prop('checked', true);
            $('#estadoc #estadoc_'+num2).parent('label').addClass('active');

            if($('#periodo').parents('.col-md-8').attr('class')=="col-md-8 col-sm-8 col-xs-12")
            {
              $('#periodo').parents('.col-md-8').removeClass('has-error');
            }

            if($('#periodo-error').length>0)
            {
              $('#periodo-error').html('');
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
  buscar_periodos(0);
});

$(document).on('click', '.delete', function (e) {
  e.preventDefault();
  var idperiodo = $(this).parents('tr').attr('idperiodo');
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var um_busc = $('#um_busc').val();
  var temp = "page="+page;
  if(um_busc.trim().length)
  {
    temp=temp+'&um_busc='+um_busc;
  }
  var nomb = "Periodo";
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
        url: $('base').attr('href') + 'periodo/save_periodo',
        type: 'POST',
        data: 'id_periodo='+idperiodo+'&estado=0',
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            if (response.code==1) {
              buscar_periodos(temp);
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