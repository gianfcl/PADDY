/*@Violeta Damjanová*/
$( document ).ready(function() {

  jQuery.validator.setDefaults({
    debug: true,
    success: "valid",
    ignore: ""
  });

  function fix_paddingr_modal(id_modal)
  {
    $('#'+id_modal).on('hidden.bs.modal', function (e) {
    $('body.nav-md').css('padding-right','0px');
    })

    $('#'+id_modal).on('shown.bs.modal', function (e) {
      $('body.nav-md').css('padding-right','0px');
    })
  }

  $('input#dia_sesion').on('show.daterangepicker', function(ev, picker) {
    $('.dropdown-menu').css('z-index',99999);
  });

  $('#form_save_sesionxequipo').validate({
    rules:
    {
      dia_sesion:
      {
        required:true,
      },
      hora_inicio:
      {
        required:true,
      },
      hora_fin:
      {
        required:true,
      },
    },
    messages: 
    {
      dia_sesion:
      {
        required:"Campo Obligatorio",
      },
      hora_inicio:
      {
        required:"Campo Obligatorio",
      },
      hora_fin:
      {
        required:"Campo Obligatorio",
      },
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
      error.insertAfter(element.parent()); 
    },
    submitHandler: function() {
      $.ajax({
          url: $('base').attr('href') + 'eadequipo/save_sesionxequipo',
          type: 'POST',
          data: $('#form_save_sesionxequipo').serialize(),
          dataType: "json",
          beforeSend: function() {
            $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
          },
          success: function(response) {
            if(response.code==1)
            {
              $('#new_sesion').modal('hide');
              fix_paddingr_modal('new_sesion');
              var id_eadequipo_sesion = parseInt($('#id_eadequipo_sesion').val());
              id_eadequipo_sesion = (id_eadequipo_sesion>0) ? (id_eadequipo_sesion) : ("0");
              var text = (id_eadequipo_sesion=="0") ? ("Agregó!") : ("Edito!");
              swal({
                title : text,
                text: 'Esta sesión se '+text+'.',
                type: 'success',
                confirmButtonText: 'Listo!',
              }).then(function () {
                  var id_eadequipo = $('#id_eadequipo_g').val();
                  buscar_sesionesxequipo(id_eadequipo);
              });
            }
            else
            {
              alerta('Error al momento de','guardar los datos!!!','error');
            }
          },
          complete: function() {
            $.LoadingOverlay("hide"); 
          }
      });
    }
  });

  $(function() {
    $('input#dia_sesion').daterangepicker({
      singleDatePicker: true,
      showDropdowns: true,
      locale : moment.locale('es'),
      format: 'DD-MM-YYYY',
    });
  });

  $(function () {
    $('#datetimepicker1').datetimepicker({
        format: 'LT'
    });
  });

  $('#datetimepicker1').on('dp.change', function(e){
    $('#hora_fin').val('');
    var day = $('#dia_sesion').val();
    var hora = $('#hora_inicio').val();
    var time_c = day+" "+hora;
    var time_converted = moment(time_c, "DD-MM-YYYY hh:mm a").format();
    if(day.trim().length>0 && hora.trim().length>0)
    {
      $('#hora_fin').prop('disabled',false);
      $(function () {
        $('#datetimepicker2').datetimepicker({
          format: 'LT',
          locale : moment.locale('es'),
        });
      });
    }
    else
    {
      $('#hora_fin').val('');
      $('#hora_fin').prop('disabled',true);
    }
  });
});


$(document).on('click', '.new_sesion', function (e) {
  limpiarform();
  var id_eadequipo = $('#id_eadequipo_g').val();
  $('#id_eadequipo').val(id_eadequipo);
});

function limpiarform()
{
  $('#id_eadequipo_sesiones').val('');
  $('#sesionxequipo_div input').parent().removeClass('active');
  $('#sesionxequipo_estado_1').parent().addClass('active');
  $('#sesionxequipo_estado_1').prop('checked',true);
  $('#dia_sesion').val('');
  $('#hora_inicio').val('');
  $('#hora_fin').val('');
  remove_error('form_save_sesionxequipo');
  $('#hora_fin').prop('disabled',true);
}

function remove_error(form){
  $('form#'+(form.toString())+' div.form-group').each(function(indice, elemento) {
    if($(this).attr('class')=="form-group has-error"){
      $(this).removeClass("has-error");
      $(this).find("span.help-block").remove();
    }
  }); 
}

$(document).on('click', '.edit_sesionesxequipo', function (e) {
  limpiarform();
  $id_eadequipo = $('#id_eadequipo').val();
  var id_eadequipo_sesiones = $(this).parents('tr').attr('id_eadequipo_sesiones');

  $.ajax({
    url: $('base').attr('href') + 'eadequipo/edit_sesionesxequipo',
    type: 'POST',
    data: 'id_eadequipo_sesiones='+id_eadequipo_sesiones,
    dataType: "json",
    beforeSend: function() {
      $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
    },
    success: function(response) {
      if (response.code==1) {
        var id_eadequipo = $('#id_eadequipo_g').val();
        $('#hora_fin').prop('disabled',false);
        $('#id_eadequipo').val(id_eadequipo);
        $('#id_eadequipo_sesiones').val(response.data.id_eadequipo_sesiones);
        $('#dia_sesion').val(response.data.dia_reunion);
        $('#hora_inicio').val(response.data.hora_inicio);
        $('#hora_fin').val(response.data.dia_hora_fin);

        $('#sesionxequipo_div label').removeClass('active');
        $('#sesionxequipo_div input').prop('checked', false);

        var num = response.data.estado;
        $('#sesionxequipo_div #sesionxequipo_estado_'+num).prop('checked', true);
        $('#sesionxequipo_div #sesionxequipo_estado_'+num).parent('label').addClass('active');
        
      }
    },
    complete: function() {
      $.LoadingOverlay("hide");
    }
  });
});

$(document).on('click', '.del_sesionesxequipo', function (e) {
  limpiarform();  
  e.preventDefault();
  var id_eadequipo_sesiones = $(this).parents('tr').attr('id_eadequipo_sesiones');
  var id_eadequipo = $('#id_eadequipo').val();
  var nomb = "sesión";
  swal({
    title: 'Estas Seguro?',
    text: "De Eliminar a esta "+nomb,
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, estoy seguro!'
  }).then(function(isConfirm) {
    if (isConfirm) {     
      $.ajax({
        url: $('base').attr('href') + 'eadequipo/save_sesionxequipo',
        type: 'POST',
        data: 'id_eadequipo_sesiones='+id_eadequipo_sesiones+'&id_eadequipo='+id_eadequipo+'&sesionxequipo_estado=0',
        dataType: "json",
        beforeSend: function() {
          $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
        },
        success: function(response) {
          if(response.code==1)
          {
            var text = "Elimino!";
            swal({
              title : text,
              text: 'Esta sesión se '+text+'.',
              type: 'success',
              confirmButtonText: 'Listo!',
            }).then(function () {
              buscar_sesionesxequipo(id_eadequipo);
            });
          }
          else
          {
            alerta('Error al momento de','guardar los datos!!!','error');
          }
        },
        complete: function() {
          $.LoadingOverlay("hide");
        }
      });
    }
  });   
});

$(document).on('change','#filtrarxfecha',function(){
  var id_eadequipo = $('#id_eadequipo_g').val();
  buscar_sesionesxequipo(id_eadequipo);
});

function buscar_sesionesxequipo(id_eadequipo){
  var temp = 'id_eadequipo='+id_eadequipo;
  if($('#filtrarxfecha').is(':checked'))
  {
    temp = temp +'&mostrar_t=true';
  }

  $.ajax({
    url: $('base').attr('href') + 'eadequipo/get_sesionesxequipo',
    type: 'POST',
    data: temp,
    dataType: "json",
    beforeSend: function() {
      $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
    },
    success: function(response) {
      if(response.code==1)
      {
        $('#bodyindex').html(response.data);
      }
      else
      {
        alerta('Error al momento de','obtener los datos!!!','error');
      }
    },
    complete: function() {
      $.LoadingOverlay("hide");
    }
  });
}

$(document).on('click','.btn_limpiar',function(){
  $('#new_sesion').modal('hide');
  fix_paddingr_modal('new_sesion');
  limpiarform();
});