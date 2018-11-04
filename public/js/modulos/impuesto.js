$( document ).ready(function() {

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

    $('#form_save_impuesto').validate({
      rules:
      {
        impuesto: {
          required:true, 
          minlength: 2,
          remote: {
            url: $('base').attr('href') + 'impuesto/validar_impuesto',
            type: "post",
            data: {
              impuesto: function() { return $( "#impuesto" ).val(); },
              id_impuesto: function() { return $('#id_impuesto').val(); }
            }
          }
        },
        abreviatura:{required:true}
      },
      messages: 
      {
        impuesto: {required:"Impuesto", minlength: "Más de 2 Letras", remote: "Ya existe" },
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
          url: $('base').attr('href') + 'impuesto/save_impuesto',
          type: 'POST',
          data: $('#form_save_impuesto').serialize(),
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

              buscar_impuestos(page);
            }
            else
            {
              if($('#impuesto').parents('.form-group').attr('class')=="form-group")
              {
                $('#impuesto').parents('.form-group').addClass('has-error');
              }
              
              if($('#impuesto-error').length>0)
              {
                $('#impuesto-error').html(response.message);
              }
              else
              {
                $('#impuesto').parents('.col-md-6').append("<span id='impuesto-error' class='help-block'>"+response.message+"</span>");
              }
            }
          },
          complete: function(response) {
            var id_impuesto = parseInt($('#id_impuesto').val());
            id_impuesto = (id_impuesto>0) ? (id_impuesto) : ("0");
            var text = (id_impuesto=="0") ? ("Guardo!") : ("Edito!");
            if(response.code == 0)
            {
              text = response.message;
            }
            alerta(text, 'Este Impuesto se '+text+'.', 'success');
            limp_todo('form_save_impuesto');
            $('#editimpuesto').modal('hide');
          }
        });
      }
    });
});

$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
});

$(document).on('click', '.add_impuesto', function (e)
{
  limp_todo('form_save_impuesto');
});

$(document).on('click', '.btn_limpiar', function (e) {
  limp_todo('form_save_impuesto');
  $('#editimpuesto').modal('hide');
});

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {
  var page = $(this).find('a').attr('tabindex');
  buscar_impuestos(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_impuestos(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_impuestos(page);
});

function buscar_impuestos(page)
{  
  var temp = "page="+page;
  var impuesto_busc = $('#impuesto_busc').val();
  var abreviatura_busc = $('#abreviatura_busc').val();

  if(impuesto_busc.trim().length)
  {
    temp=temp+'&impuesto_busc='+impuesto_busc;
  }

  if(abreviatura_busc.trim().length)
  {
    temp=temp+'&abreviatura_busc='+abreviatura_busc;
  }

  $.ajax({
    url: $('base').attr('href') + 'impuesto/buscar_impuestos',
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
  limp_todo('form_save_impuesto');
  var idimpuesto = $(this).parents('tr').attr('idimpuesto');
  $.ajax({
    url: $('base').attr('href') + 'impuesto/edit',
    type: 'POST',
    data: 'id_impuesto='+idimpuesto,
    dataType: "json",
    beforeSend: function() {
      limp_todo('form_save_impuesto');
    },
    success: function(response) {
      if (response.code==1) {
        $('#id_impuesto').val(response.data.id_impuesto);
        $('#impuesto').val(response.data.impuesto);
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
  var idimpuesto = $(this).parents('tr').attr('idimpuesto');
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var nomb = "Impuesto";

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
        url: $('base').attr('href') + 'impuesto/save_impuesto',
        type: 'POST',
        data: 'id_impuesto='+idimpuesto+'&estado=0',
        dataType: "json",
        beforeSend: function() {
          //showLoader();
        },
        success: function(response) {
          if (response.code==1) {              
            buscar_impuestos(page);
          }
        },
        complete: function() {
          var text = "Elimino!";
          alerta(text, 'Esta '+nomb+' se '+text+'.', 'success');
          limp_todo('form_save_impuesto');
        }
      });
    }
  });    
});