$( document ).ready(function() {

  jQuery.validator.setDefaults({
    debug: true,
    success: "valid",
    ignore: ""
  });

  $('#form_save_eplantilla').validate({
    rules:
    {
      id_egrupo:{ required:true },
      eplantilla:{ required:true, minlength: 2 }       
    },
    messages: 
    {
      id_egrupo:{
        required:"Seleccione egrupo" },
      eplantilla:{ required:"Ingresar eplantilla", minlength: "Más de 2 Letras" }
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
        url: $('base').attr('href') + 'eplantilla/save_eplantilla',
        type: 'POST',
        data: $('#form_save_eplantilla').serialize(),
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
            
            buscar_eplantillas(page);
            $('#editeplantilla').modal('hide');

            var id_eplantilla = parseInt($('#id_eplantilla').val());
            id_eplantilla = (id_eplantilla>0) ? (id_eplantilla) : ("0");
            var text = (id_eplantilla=="0") ? ("Guardo!") : ("Edito!");
            alerta(text, 'Esta plantilla se '+text+'.', 'success');
          }
          else
          {
            alerta('Contacte con Soporte!!','Error al guardar los datos!!','error')
          }
        },
        complete: function() {
          limpiarform();
        }
      });/**/
    }
  });
});

$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
  $('#'+id).find('select').val('');
  buscar_eplantillas(0);
});

$(document).on('click', '.add_eplantilla', function (e)
{
    $('#myModalLabel').text("Crear Plantilla");
    limpiarform();
});

$(document).on('click', '.btn_limpiar', function (e) {
    limpiarform();
    $('#editeplantilla').modal('hide');
});

function limpiarform()
{
  $('#id_eplantilla').val('0');
  $('#id_egrupo').val('');
  $('#eplantilla').val('');
  $('#titulo').val('');
  $('#descripcion').val('');
  $('#m_despedida').val('');

  if($('#eplantilla').parents('.form-group').attr('class')=="form-group has-error")
  {
    $('#eplantilla').parents('.form-group').removeClass('has-error');
  }
  
  if($('#eplantilla-error').length>0)
  {
    $('#eplantilla-error').html("");    
    $('#eplantilla-error').parents('.form-group').removeClass('has-error');
  }

  if($('#id_egrupo').parents('.form-group').attr('class')=="form-group has-error")
  {
    $('#id_egrupo').parents('.form-group').removeClass('has-error');
  }
  
  if($('#id_egrupo-error').length>0)
  {
    $('#id_egrupo-error').html("");
    $('#id_egrupo-error').parents('.form-group').removeClass('has-error');
  }

  $('#estado label').removeClass('active');
  $('#estado input').prop('checked', false);
  
  $('#estado #estado_1').prop('checked', true);
  $('#estado #estado_1').parent('label').addClass('active');

  var validatore = $( "#form_save_eplantilla" ).validate();
  validatore.resetForm();
}

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {
  var page = $(this).find('a').attr('tabindex');
  buscar_eplantillas(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_eplantillas(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_eplantillas(page);
});

function buscar_eplantillas(page)
{
  var egrupo_busc = $('#egrupo_busc').val();
  var eplantilla_busc = $('#eplantilla_busc').val();
  var titulo_busc = $('#titulo_busc').val();

  var temp = "page="+page;
  if(parseInt(egrupo_busc)>0)
  {
    temp=temp+'&id_egrupo='+egrupo_busc;
  }

  if(eplantilla_busc.trim().length)
  {
    temp=temp+'&eplantilla='+eplantilla_busc;
  }
  if(titulo_busc.trim().length)
  {
    temp=temp+'&titulo='+titulo_busc;
  }
  
  $.ajax({
    url: $('base').attr('href') + 'eplantilla/buscar_eplantillas',
    type: 'POST',
    data: temp,
    dataType: "json",
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
  $('#myModalLabel').text("Editar Plantilla");
  var ideplantilla = $(this).parents('tr').attr('ideplantilla');
  $.ajax({
    url: $('base').attr('href') + 'eplantilla/edit',
    type: 'POST',
    data: 'id_eplantilla='+ideplantilla,
    dataType: "json",
    beforeSend: function() {
        //showLoader();
    },
    success: function(response) {
      if (response.code==1) {
        $('#id_eplantilla').val(response.data.id_eplantilla);
        $('#eplantilla').val(response.data.eplantilla);
        $('#titulo').val(response.data.titulo);
        $('#descripcion').val(response.data.descripcion);
        $('#id_egrupo').val(response.data.id_egrupo);
        $('select#id_egrupo').val(response.data.id_egrupo);
        $('#m_despedida').val(response.data.m_despedida);

        $('#estado label').removeClass('active');
        $('#estado input').prop('checked', false);

        var num = response.data.estado;
        $('#estado #estado_'+num).prop('checked', true);
        $('#estado #estado_'+num).parent('label').addClass('active');

        if($('#eplantilla').parents('.form-group').attr('class')=="form-group has-error")
        {
          $('#eplantilla').parents('.form-group').removeClass('has-error');
        }

        if($('#eplantilla-error').length>0)
        {
          $('#eplantilla-error').html('');
        }
      }
    },
    complete: function() {
    }
  });

});

$(document).on('click', '.delete', function (e) {
  e.preventDefault();
  var ideplantilla = $(this).parents('tr').attr('ideplantilla');
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var nomb = "plantilla";
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
        url: $('base').attr('href') + 'eplantilla/delete',
        type: 'POST',
        data: 'id_eplantilla='+ideplantilla,
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            if (response.code==1) {              
              buscar_eplantillas(page);
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