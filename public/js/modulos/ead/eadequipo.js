$( document ).ready(function() {

  jQuery.validator.setDefaults({
    debug: true,
    success: "valid",
    ignore: ""
  });

  $('#form_save_eadequipo').validate({
    rules:
    {
      eadequipo:
      {
        required:true,
        minlength: 2,
        remote: {
          url: $('base').attr('href') + 'eadequipo/validar',
          type: "post",
          data: {
            eadequipo: function() { return $( "#eadequipo" ).val(); },
            id_eadequipo: function() { return $('#id_eadequipo').val(); }
          }
        }
      }       
    },
    messages: 
    {
      eadequipo:
      {
        required:"Ingresar el tipo de zona",
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
      $.ajax({
        url: $('base').attr('href') + 'eadequipo/save_eadequipo',
        type: 'POST',
        data: $('#form_save_eadequipo').serialize(),
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

            $('#editeadequipo').modal('hide');

            buscar_eadequipos(page);
          }
          else
          {
            limpiarform();
          }
        },
        complete: function() {
          var id_eadequipo = parseInt($('#id_eadequipo').val());
          id_eadequipo = (id_eadequipo>0) ? (id_eadequipo) : ("0");
          var text = (id_eadequipo=="0") ? ("Guardo!") : ("Edito!");
          alerta(text, 'Este equipo se '+text+'.', 'success');
          limpiarform();

        }
      });/**/
    }
  });

  $(function() {
    $('#colop1').colorpicker({
      format: "hex",
    });
  });
});

$(document).on('click', '.limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
  buscar_eadequipos(0);
});

$(document).on('click', '.add_eadequipo', function (e)
{
    limpiarform();
});

$(document).on('click', '.btn_limpiar', function (e) {
  limpiarform();
  $('#editeadequipo').modal('hide');
});

function limpiarform()
{
  $('#id_eadequipo').val('0');
  $('#eadequipo').val('');
  $('#estado label').removeClass('active');
  $('#estado input').prop('checked', false);
  
  $('#estado_1').prop('checked', true);
  $('#estado_1').parent('label').addClass('active');

  if($('#eadequipo').parents('.form-group').attr('class')=="form-group has-error")
  {
    $('#eadequipo').parents('.form-group').removeClass('has-error');
  }

  if($('#eadequipo-error').length>0)
  {
    $('#eadequipo-error').html('');
  }
  $('#colorxequipo').val('');
  $('span.input-group-addon').find('i').css("background-color", "#000000" );
  
}

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  buscar_eadequipos(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_eadequipos(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_eadequipos(page);
});

function buscar_eadequipos(page)
{
  var eadequipo_busc = $('#eadequipo_busc').val();
  var temp = "page="+page;
  if(eadequipo_busc.trim().length)
  {
    temp=temp+'&eadequipo_busc='+eadequipo_busc;
  }
  $.ajax({
      url: $('base').attr('href') + 'eadequipo/buscar_eadequipos',
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
  limpiarform();
  var ideadequipo = $(this).parents('tr').attr('ideadequipo');
  $.ajax({
      url: $('base').attr('href') + 'eadequipo/edit',
      type: 'POST',
      data: 'id_eadequipo='+ideadequipo,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
          if (response.code==1) {
            $('#id_eadequipo').val(response.data.rta.id_eadequipo);
            $('#eadequipo').val(response.data.rta.eadequipo);
            $('#colorxequipo').val(response.data.rta.colorxequipo);

            $('#estado label').removeClass('active');
            $('#estado input').prop('checked', false);

            var num = response.data.rta.estado;
            $('#estado #estado_'+num).prop('checked', true);
            $('#estado #estado_'+num).parent('label').addClass('active');
            $('span.input-group-addon').find('i').css("background-color", response.data.rta.colorxequipo );
            if($('#eadequipo').parents('.col-md-8').attr('class')=="col-md-8 col-sm-8 col-xs-12")
            {
              $('#eadequipo').parents('.col-md-8').removeClass('has-error');
            }

            if($('#eadequipo-error').length>0)
            {
              $('#eadequipo-error').html('');
            }
            /*
            if(response.data.rta2.length)
            {
              $('#id_ead_rol').html(response.data.rta2);
            }*/
          }
      },
      complete: function() {
          //hideLoader();
      }
  });
});

$(document).on('click', '.delete', function (e) {
  e.preventDefault();
  var ideadequipo = $(this).parents('tr').attr('ideadequipo');
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var eadequipo_busc = $('#eadequipo_busc').val();
  var temp = "page="+page;
  if(eadequipo_busc.trim().length)
  {
    temp=temp+'&eadequipo_busc='+eadequipo_busc;
  }
  var nomb = "eadequipo";
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
        url: $('base').attr('href') + 'eadequipo/save_eadequipo',
        type: 'POST',
        data: 'id_eadequipo='+ideadequipo+'&estado=0',
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            if (response.code==1) {
              buscar_eadequipos(temp);
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
