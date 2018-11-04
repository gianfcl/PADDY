$( document ).ready(function() {

  jQuery.validator.setDefaults({
    debug: true,
    success: "valid",
    ignore: ""
  });

  $('#form_save_definicion').validate({
    rules:
    {
      palabra:
      {
        required:true,
        minlength: 2,
        remote: {
          url: $('base').attr('href') + 'definicion/validar_palabra',
          type: "post",
          data: {
            palabra: function() { return $( "#palabra" ).val(); },
            id_definicion: function() { return $('#id_definicion').val(); }
          }
        }
      },
      definicion:
      {
        required: true,
        minlength: 2
      }       
    },
    messages: 
    {
      palabra:
      {
        required:"Ingresar palabra",
        minlength: "Más de 2 Letras",
        remote: "Ya Existe"
      },
      definicion:
      {
        required: "Ingresar definicion",
        minlength: "Mas de 2 letras",
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
        url: $('base').attr('href') + 'definicion/save_definicion',
        type: 'POST',
        data: $('#form_save_definicion').serialize(),
        dataType: "json",
        beforeSend: function() {
          $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
        },
        success: function(response) {
          if (response.code==1) 
          {
            var page = 0;
            if($('#paginacion_data ul.pagination li.active a').length>0)
            {
              page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
            }                   
            var id_definicion = parseInt($('#id_definicion').val());
            id_definicion = (id_definicion>0) ? (id_definicion) : ("0");
            var text = (id_definicion=="0") ? ("Guardo!") : ("Edito!");
            alerta(text, 'Este definicion se '+text+'.', 'success');
            buscar_definicions(page);
          }
          else
          {
            alerta('Error!','Consultar con el programador!','error');
          }
        },
        complete: function() {
          $.LoadingOverlay("hide");
          $('#editdefinicion').modal('hide');
          limpiarform();
        }
      });/**/
    }
  });
});

$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
  $('#estado_busc').val('-1');
  buscar_definicions(0);
});

$(document).on('click', '.add_definicion', function (e)
{
  $('#myModalLabel').text('Agregar Definición');
  limpiarform();
});

$(document).on('click', '.btn_limpiar', function (e) {
  limpiarform();
  $('#editdefinicion').modal('hide');
});

function limpiarform()
{
  $('#id_definicion').val('0');
  $('#definicion').val('');
  $('#palabra').val('');
  $('#estado label').removeClass('active');
  $('#estado input').prop('checked', false);
  
  $('#estado #estado_1').prop('checked', true);
  $('#estado #estado_1').parent('label').addClass('active');

  if($('#definicion').parents('.form-group').attr('class')=="form-group has-error")
  {
    $('#definicion').parents('.form-group').removeClass('has-error');
  }

  if($('#definicion-error').length>0)
  {
    $('#definicion-error').html('');
  }
  var validatore = $( "#form_save_definicion" ).validate();
  validatore.resetForm();
}

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  buscar_definicions(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_definicions(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_definicions(page);
});

function buscar_definicions(page)
{
  var palabra = $('#palabra_busc').val();
  var definicion = $('#def_busc').val();
  var estado = $('#estado_busc').val();
  var temp = "page="+page;

  if(palabra.trim().length)
  {
    temp=temp+'&palabra='+palabra;
  }
  if(definicion.trim().length)
  {
    temp=temp+'&definicion='+definicion;
  }
  if(parseInt(estado)>-1)
  {
    temp=temp +'&estado='+estado;
  }
  $.ajax({
      url: $('base').attr('href') + 'definicion/buscar_definicions',
      type: 'POST',
      data: temp,
      dataType: "json",
      beforeSend: function() {
        $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
      },
      success: function(response) {
        if (response.code==1) {
          $('#datatable-buttons tbody#bodyindex').html(response.data.rta);
          $('#paginacion_data').html(response.data.paginacion);
        }
      },
      complete: function() {
        $.LoadingOverlay("hide");
      }
  });
}

$(document).on('click', '.edit', function (e) {
  var iddefinicion = $(this).parents('tr').attr('iddefinicion');
  $.ajax({
      url: $('base').attr('href') + 'definicion/edit',
      type: 'POST',
      data: 'id_definicion='+iddefinicion,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
          if (response.code==1) {
            $('#id_definicion').val(response.data.id_definicion);
            $('#definicion').val(response.data.definicion);
            $('#palabra').val(response.data.palabra);

            $('#estado label').removeClass('active');
            $('#estado input').prop('checked', false);

            var num = response.data.estado;
            $('#estado #estado_'+num).prop('checked', true);
            $('#estado #estado_'+num).parent('label').addClass('active');

            if($('#definicion').parents('.col-md-8').attr('class')=="col-md-8 col-sm-8 col-xs-12")
            {
              $('#definicion').parents('.col-md-8').removeClass('has-error');
            }

            if($('#definicion-error').length>0)
            {
              $('#definicion-error').html('');
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
  var iddefinicion = $(this).parents('tr').attr('iddefinicion');
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var nomb = "definicion";
  swal({
    title: 'Estas Seguro?',
    text: "De Eliminar esta "+nomb,
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, estoy seguro!'
  }).then(function(isConfirm) {
    if (isConfirm) {     
      $.ajax({
        url: $('base').attr('href') + 'definicion/save_definicion',
        type: 'POST',
        data: 'id_definicion='+iddefinicion+'&estado=0',
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            if (response.code==1) {
              buscar_definicions(page);
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