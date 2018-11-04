$( document ).ready(function() {

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

    $('#form_save_almacen').validate({
      rules:
      {
        almacen: {
          required:true, 
          minlength: 2,
          remote: {
            url: $('base').attr('href') + 'almacen/validar_almacen',
            type: "post",
            data: {
              almacen: function() { return $( "#almacen" ).val(); },
              id_almacen: function() { return $('#id_almacen').val(); }
            }
          }
        }
      },
      messages: 
      {
        almacen: {required:"Almacén", minlength: "Más de 2 Letras", remote: "Ya existe" }
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
          url: $('base').attr('href') + 'almacen/save_almacen',
          type: 'POST',
          data: $('#form_save_almacen').serialize(),
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

              buscar_almacenes(page);
            }
            else
            {
              if($('#almacen').parents('.form-group').attr('class')=="form-group")
              {
                $('#almacen').parents('.form-group').addClass('has-error');
              }
              
              if($('#almacen-error').length>0)
              {
                $('#almacen-error').html(response.message);
              }
              else
              {
                $('#almacen').parents('.col-md-6').append("<span id='almacen-error' class='help-block'>"+response.message+"</span>");
              }
            }
          },
          complete: function(response) {
            var id_almacen = parseInt($('#id_almacen').val());
            id_almacen = (id_almacen>0) ? (id_almacen) : ("0");
            var text = (id_almacen=="0") ? ("Guardo!") : ("Edito!");
            if(response.code == 0)
            {
              text = response.message;
            }
            alerta(text, 'Este Almacén se '+text+'.', 'success');
            limp_todo('form_save_almacen');
            $('#editalmacen').modal('hide');
            $('#id_almacen').val('');
          }
        });
      }
    });
});

$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
});

$(document).on('click', '.add_almacen', function (e)
{
  limp_todo('form_save_almacen');
});

$(document).on('click', '.btn_limpiar', function (e) {
  limp_todo('form_save_almacen');
  $('#editalmacen').modal('hide');
});

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {
  var page = $(this).find('a').attr('tabindex');
  buscar_almacenes(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_almacenes(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_almacenes(page);
});

function buscar_almacenes(page)
{
  var um_busc = $('#um_busc').val();
  var temp = "page="+page;
  if(um_busc.trim().length)
  {
    temp=temp+'&um_busc='+um_busc;
  }
  $.ajax({
    url: $('base').attr('href') + 'almacen/buscar_almacenes',
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

$(document).on('change', '#id_departamento', function (e)
{
  var id_departamento = $(this).val();

  $.ajax({
    url: $('base').attr('href') + 'ubigeo/combox_prov',
    type: 'POST',
    data: 'id_departamento='+id_departamento,
    dataType: "json",
    success: function(response) {
      if (response.code == "1") {
        $('#id_provincia').html(response.data);
        $('#id_distrito').html("<option value=''>DISTRITO</option>");
      }
    },
    complete: function() {
        //hideLoader();
    }
  });
});


$(document).on('change', '#id_provincia', function (e)
{
  var id_provincia = $(this).val();

  $.ajax({
    url: $('base').attr('href') + 'ubigeo/combox_dist',
    type: 'POST',
    data: 'id_provincia='+id_provincia,
    dataType: "json",
    success: function(response) {
      if (response.code == "1") {
        $('#id_distrito').html(response.data);
      }
    },
    complete: function() {
      //hideLoader();
    }
  });
});

$(document).on('click', '.edit', function (e) {
  var idalmacen = $(this).parents('tr').attr('idalmacen');
  $.ajax({
    url: $('base').attr('href') + 'almacen/edit',
    type: 'POST',
    data: 'id_almacen='+idalmacen,
    dataType: "json",
    beforeSend: function() {
      limp_todo('form_save_almacen');
    },
    success: function(response) {
      if (response.code==1) {
        $('#id_almacen').val(response.data.id_almacen);
        $('#almacen').val(response.data.almacen);
        var vlu = parseInt(response.data.es_inventariado);
        var exp = (vlu==1) ? (true) : (false);
        $('input#es_inventariado').prop('checked', exp);    

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
  var idalmacen = $(this).parents('tr').attr('idalmacen');

  swal({
    title: '¿¿Deseas ver el stock',
    text: "de este almacen?? ",
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: '¡Sí, muestramelo!',
    cancelButtonText: '¡No!'
  }).then(function(isConfirm) {
    console.log(isConfirm.value);
    if (isConfirm.value) {
      var $url = $('base').attr('href') + 'stockxalmacen/buscar/'+idalmacen+'/-/-/-/-';
      window.open($url, '_blank');
      mostrar_swalelim(idalmacen);
      /**/
    }
    else if(isConfirm.dismiss == "cancel")
    { 
      mostrar_swalelim(idalmacen);
    }
  }).catch(swal.noop);    
});

function mostrar_swalelim(id_alm)
{
  swal({
    title: '¿¿Realmente deseas',
    text: "desactivar este almacen?? ",
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: '¡Sí, desactivalo!',
    cancelButtonText: '¡No!'
  }).then(function(isConfirm) {
    if(isConfirm.value)
    {
      var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
      $.ajax({
        url: $('base').attr('href') + 'almacen/save_almacen',
        type: 'POST',
        data: 'id_almacen='+id_alm+'&estado=0',
        dataType: "json",
        beforeSend: function() {
          //showLoader();
        },
        success: function(response) {
          if (response.code==1) {              
            buscar_almacenes(page);
          }
        },
        complete: function() {
          var text = "Elimino!";
          alerta(text, 'Esta '+nomb+' se '+text+'.', 'success');
          limp_todo('form_save_almacen');
        }
      });
    }
    else
    {
      swal('¡No se hicieron cambios!');
    }
  });
}