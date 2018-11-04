$( document ).ready(function() {

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

    $('#form_save_frecuenciainventfisico').validate({
      rules:
      {
        frecuenciainventfisico: {
          required:true, 
          minlength: 2,
          remote: {
            url: $('base').attr('href') + 'frecuenciainventfisico/validar_frecuenciainventfisico',
            type: "post",
            data: {
              frecuenciainventfisico: function() { return $( "#frecuenciainventfisico" ).val(); },
              id_frecuenciainventfisico: function() { return $('#id_frecuenciainventfisico').val(); }
            }
          }
        },
        abreviatura:{required:true}
      },
      messages: 
      {
        frecuenciainventfisico: {required:"Motivo de Ajuste", minlength: "Mas de 2 Letras", remote: "Ya existe" },
        abreviatura:{required:"Ingresar"}
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
          url: $('base').attr('href') + 'frecuenciainventfisico/save_frecuenciainventfisico',
          type: 'POST',
          data: $('#form_save_frecuenciainventfisico').serialize(),
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

              buscar_frecuenciainventfisicos(page);
            }
            else
            {
              if($('#frecuenciainventfisico').parents('.form-group').attr('class')=="form-group")
              {
                $('#frecuenciainventfisico').parents('.form-group').addClass('has-error');
              }
              
              if($('#frecuenciainventfisico-error').length>0)
              {
                $('#frecuenciainventfisico-error').html(response.message);
              }
              else
              {
                $('#frecuenciainventfisico').parents('.col-md-6').append("<span id='frecuenciainventfisico-error' class='help-block'>"+response.message+"</span>");
              }
            }
          },
          complete: function(response) {
            var id_frecuenciainventfisico = parseInt($('#id_frecuenciainventfisico').val());
            id_frecuenciainventfisico = (id_frecuenciainventfisico>0) ? (id_frecuenciainventfisico) : ("0");
            var text = (id_frecuenciainventfisico=="0") ? ("Guardo!") : ("Edito!");
            if(response.code == 0)
            {
              text = response.message;
            }
            alerta(text, 'Este Tipo Movimiento se '+text+'.', 'success');
            limp_todo('form_save_frecuenciainventfisico');
            $('#editfrecuenciainventfisico').modal('hide');
          }
        });
      }
    });
});

$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
});

$(document).on('click', '.add_frecuenciainventfisico', function (e)
{
  limp_todo('form_save_frecuenciainventfisico');
});

$(document).on('click', '.btn_limpiar', function (e) {
  limp_todo('form_save_frecuenciainventfisico');
  $('#editfrecuenciainventfisico').modal('hide');
});

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {
  var page = $(this).find('a').attr('tabindex');
  buscar_frecuenciainventfisicos(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_frecuenciainventfisicos(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  buscar_frecuenciainventfisicos(0);
});

$(document).on('click', '#datatable-buttons .limpiar', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
  $('#'+id+' select').val('');
  buscar_frecuenciainventfisicos(0);
});

function buscar_frecuenciainventfisicos(page)
{  
  var temp = "page="+page;
  var frecuenciainventfisico_busc = $('#frecuenciainventfisico_busc').val();
  var abreviatura_busc = $('#abreviatura_busc').val();

  if(frecuenciainventfisico_busc.trim().length)
  {
    temp=temp+'&frecuenciainventfisico_busc='+frecuenciainventfisico_busc;
  }

  if(abreviatura_busc.trim().length)
  {
    temp=temp+'&abreviatura_busc='+abreviatura_busc;
  }

  $.ajax({
    url: $('base').attr('href') + 'frecuenciainventfisico/buscar_frecuenciainventfisicos',
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
  limp_todo('form_save_frecuenciainventfisico');
  var idfrecuenciainventfisico = $(this).parents('tr').attr('idfrecuenciainventfisico');
  $.ajax({
    url: $('base').attr('href') + 'frecuenciainventfisico/edit',
    type: 'POST',
    data: 'id_frecuenciainventfisico='+idfrecuenciainventfisico,
    dataType: "json",
    beforeSend: function() {
      limp_todo('form_save_frecuenciainventfisico');
    },
    success: function(response) {
      if (response.code==1) {
        $('#id_frecuenciainventfisico').val(response.data.id_frecuenciainventfisico);
        $('#frecuenciainventfisico').val(response.data.frecuenciainventfisico);
        $('#abreviatura').val(response.data.abreviatura);

        $('#estado label').removeClass('active');
        $('#estado input').prop('checked', false);

        var num = response.data.estado;
        $('#estado #estado_'+num).prop('checked', true);
        $('#estado #estado_'+num).parent('label').addClass('active');
      }
    },
    complete: function() {
      //hideLoader();
    }
  });
});

$(document).on('click', '.delete', function (e) {
  e.preventDefault();
  var idfrecuenciainventfisico = $(this).parents('tr').attr('idfrecuenciainventfisico');
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var nomb = "Motivo de Ajuste";

  swal({
    title: 'Estas Seguro?',
    text: "De Eliminar este "+nomb,
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'SÃ­, estoy seguro!'
  }).then(function(isConfirm) {
    if (isConfirm) {     
      $.ajax({
        url: $('base').attr('href') + 'frecuenciainventfisico/save_frecuenciainventfisico',
        type: 'POST',
        data: 'id_frecuenciainventfisico='+idfrecuenciainventfisico+'&estado=0',
        dataType: "json",
        beforeSend: function() {
          //showLoader();
        },
        success: function(response) {
          if (response.code==1) {              
            buscar_frecuenciainventfisicos(page);
          }
        },
        complete: function() {
          var text = "Elimino!";
          alerta(text, 'Esta '+nomb+' se '+text+'.', 'success');
          limp_todo('form_save_frecuenciainventfisico');
        }
      });
    }
  });    
});