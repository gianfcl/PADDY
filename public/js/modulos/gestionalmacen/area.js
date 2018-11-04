$( document ).ready(function() {

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

    $('#form_save_area').validate({
      rules:
      {
        id_zona:{ required:true },
        area:{ 
          required:true, 
          minlength: 2,
          remote: {
            url: $('base').attr('href') + 'area/validar_ac',
            type: "post",
            data: {
              id_zona: function() { return $( "#id_zona" ).val(); },
              id_area: function() { return $( "#id_area" ).val(); },
              area: function() { return $( "#area" ).val(); }
            }
          } 
        }
      },
      messages: 
      {
        id_zona:{ required:"Seleccione Zona" },
        area:{ required:"Ingresar Área", minlength: "Más de 2 Letras", remote: "Ya Existe" }
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
          url: $('base').attr('href') + 'area/save_area',
          type: 'POST',
          data: $('#form_save_area').serialize(),
          dataType: "json",
          beforeSend: function() {            
          },
          success: function(response) {
            if (response.code==1) {
              var page = 0;
              if($('#paginacion_data ul.pagination li.active a').length>0)
              {
                page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
              }
              
              buscar_areas(page);
              $('#editarea').modal('hide');
            }
            limpiarform();
          },
          complete: function() {
            var id_area = parseInt($('#id_area').val());
            id_area = (id_area>0) ? (id_area) : ("0");
            var text = (id_area=="0") ? ("Guardo!") : ("Edito!");
            alerta(text, 'Esta Área se '+text+'.', 'success');
            limpiarform();
          }
        });/**/
      }
    });
});

$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
  buscar_areas(0);
});

$(document).on('click', '.add_area', function (e)
{
  limpiarform();
});

$(document).on('click', '.btn_limpiar', function (e) {
    limpiarform();
    $('#editarea').modal('hide');
});

function limpiarform()
{
  $('#id_area').val('0');
  $('#id_zona').val('');
  $('#area').val('');

  if($('#area').parents('.form-group').attr('class')=="form-group has-error")
  {
    $('#area').parents('.form-group').removeClass('has-error');
  }
  
  if($('#area-error').length>0)
  {
    $('#area-error').html("");    
    $('#area-error').parents('.form-group').removeClass('has-error');
  }

  if($('#id_zona').parents('.form-group').attr('class')=="form-group has-error")
  {
    $('#id_zona').parents('.form-group').removeClass('has-error');
  }
  
  if($('#id_zona-error').length>0)
  {
    $('#id_zona-error').html("");
    $('#id_zona-error').parents('.form-group').removeClass('has-error');
  }

  $('#estado label').removeClass('active');
  $('#estado input').prop('checked', false);
  
  $('#estado #estado_1').prop('checked', true);
  $('#estado #estado_1').parent('label').addClass('active');

  var validatore = $( "#form_save_area" ).validate();
  validatore.resetForm();
}

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {
  var page = $(this).find('a').attr('tabindex');
  buscar_areas(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_areas(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_areas(page);
});

function buscar_areas(page)
{
  var um_busc = $('#um_busc').val();
  var um_busc1 = $('#um_busc1').val();
  
  var temp = "page="+page;
  if(um_busc.trim().length)
  {
    temp=temp+'&um_busc='+um_busc;
  }

  if(um_busc1.trim().length)
  {
    temp=temp+'&um_busc1='+um_busc1;
  }
  
  $.ajax({
      url: $('base').attr('href') + 'area/buscar_areas',
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
  var idarea = $(this).parents('tr').attr('idarea');
  $.ajax({
    url: $('base').attr('href') + 'area/edit',
    type: 'POST',
    data: 'id_area='+idarea,
    dataType: "json",
    beforeSend: function() {
        //showLoader();
    },
    success: function(response) {
      if (response.code==1) {
        $('#id_area').val(response.data.id_area);
        $('#area').val(response.data.area);
        $('#id_zona').val(response.data.id_zona);
        $('select#id_zona').val(response.data.id_zona);

        $('#estado label').removeClass('active');
        $('#estado input').prop('checked', false);

        var num = response.data.estado;
        $('#estado #estado_'+num).prop('checked', true);
        $('#estado #estado_'+num).parent('label').addClass('active');

        if($('#area').parents('.form-group').attr('class')=="form-group has-error")
        {
          $('#area').parents('.form-group').removeClass('has-error');
        }

        if($('#area-error').length>0)
        {
          $('#area-error').html('');
        }
      }
    },
    complete: function() {
    }
  });

});

$(document).on('click', '.delete', function (e) {
  e.preventDefault();
  var idarea = $(this).parents('tr').attr('idarea');
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var nomb = "Área";
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
        url: $('base').attr('href') + 'area/delete',
        type: 'POST',
        data: 'id_area='+idarea,
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            if (response.code==1) {              
              buscar_areas(page);
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