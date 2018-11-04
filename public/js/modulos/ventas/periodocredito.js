$( document ).ready(function() {

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

    $('#form_save_periodocredito').validate({
      rules:
      {
        periodocredito: {
          required:true, 
          minlength: 2,
          remote: {
            url: $('base').attr('href') + 'periodocredito/validar_periodocredito',
            type: "post",
            data: {
              periodocredito: function() { return $( "#periodocredito" ).val(); },
              id_periodocredito: function() { return $('#id_periodocredito').val(); }
            }
          }
        }
      },
      messages: 
      {
        periodocredito: {required:"periodocredito", minlength: "Más de 2 Letras", remote: "Ya existe" }
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
          url: $('base').attr('href') + 'periodocredito/save_periodocredito',
          type: 'POST',
          data: $('#form_save_periodocredito').serialize(),
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

              buscar_periodocreditos(page);
            }
            else
            {
              if($('#periodocredito').parents('.form-group').attr('class')=="form-group")
              {
                $('#periodocredito').parents('.form-group').addClass('has-error');
              }
              
              if($('#periodocredito-error').length>0)
              {
                $('#periodocredito-error').html(response.message);
              }
              else
              {
                $('#periodocredito').parents('.col-md-6').append("<span id='periodocredito-error' class='help-block'>"+response.message+"</span>");
              }
            }
          },
          complete: function(response) {
            var id_periodocredito = parseInt($('#id_periodocredito').val());
            id_periodocredito = (id_periodocredito>0) ? (id_periodocredito) : ("0");
            var text = (id_periodocredito=="0") ? ("Guardo!") : ("Edito!");
            if(response.code == 0)
            {
              text = response.message;
            }
            alerta(text, 'Este periodocredito se '+text+'.', 'success');
            limp_todo('form_save_periodocredito');
            $('#editperiodocredito').modal('hide');
          }
        });
      }
    });

    $('#form_add_periodocredito').validate({
      rules:
      {
        nombre: {
          required:true, 
          minlength: 2,          
          remote: {
            url: $('base').attr('href') + 'periodocredito/validar_nombre',
            type: "post",
            data: {
              nombre: function() { return $( "#nombre" ).val(); },
              id_periodocredito: function() { return $('#id_periodocredito').val(); },
              id_periodocredito_det: function() { return $('#id_periodocredito_det').val(); }
            }
          }
        },
        valor:{required:true, number:true, min: 1}
      },
      messages: 
      {
        nombre: {required:"periodocredito", minlength: "Más de 2 Letras", remote: "Ya existe" },
        valor:{required:"Ingresar",number:"Solo #s", min:"Mayor a 0"}
      },      

      highlight: function(element) {
        $(element).closest('.control-group').addClass('has-error');     
      },
      unhighlight: function(element) {
        $(element).closest('.control-group').removeClass('has-error');
      },
      errorElement: 'span',
      errorClass: 'help-block',
      errorPlacement: function(error, element) 
      {
        error.insertAfter(element);
      },
      submitHandler: function() {
        var temp = "&id_periodocredito="+$('#id_periodocredito').val();
        $.ajax({
          url: $('base').attr('href') + 'periodocredito/save_periodocredito_det',
          type: 'POST',
          data: $('#form_add_periodocredito').serialize()+temp,
          dataType: "json",
          beforeSend: function() {
            //showLoader();
          },
          success: function(response) {
            if (response.code==1) {
             $('#rtadocumentos').html(response.data.htmconf);         
            }
          },
          complete: function(response) {
            limp_todo('form_add_periodocredito');
          }
        });
      }
    });
});

$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
});

$(document).on('click', '.add_periodocredito', function (e)
{
  limp_todo('form_save_periodocredito');
  limp_todo('form_add_periodocredito');
  $('#rtadocumentos').html('');
  $('#ocultaedit').removeClass('collapse');
  $('#configuracion-tabs').closest('li').addClass('hidden');
  $("a#usuario-tabs").click();
  $('#namesucu').html('');
});

$(document).on('click', '.btn_limpiar', function (e) {
  limp_todo('form_save_periodocredito');
  limp_todo('form_add_periodocredito');
  $('#editperiodocredito').modal('hide');
  $('#namesucu').html('');
});

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {
  var page = $(this).find('a').attr('tabindex');
  buscar_periodocreditos(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_periodocreditos(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_periodocreditos(page);
});

function buscar_periodocreditos(page)
{  
  var temp = "page="+page;
  var periodocredito_busc = $('#periodocredito_busc').val();

  if(periodocredito_busc.trim().length)
  {
    temp=temp+'&periodocredito_busc='+periodocredito_busc;
  }

  $.ajax({
    url: $('base').attr('href') + 'periodocredito/buscar_periodocreditos',
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
  limp_todo('form_save_periodocredito');
  limp_todo('form_add_periodocredito');
  $('#configuracion-tabs').closest('li').removeClass('hidden');
  var idperiodocredito = $(this).parents('tr').attr('idperiodocredito');
  $.ajax({
    url: $('base').attr('href') + 'periodocredito/edit',
    type: 'POST',
    data: 'id_periodocredito='+idperiodocredito,
    dataType: "json",
    beforeSend: function() {
      limp_todo('form_save_periodocredito');
    },
    success: function(response) {
      if (response.code==1) {
        $('#id_periodocredito').val(response.data.id_periodocredito);
        $('#periodocredito').val(response.data.periodocredito);

        $('#estado label').removeClass('active');
        $('#estado input').prop('checked', false);

        var num = response.data.estado;
        $('#estado #estado_'+num).prop('checked', true);
        $('#estado #estado_'+num).parent('label').addClass('active');
        $('#rtadocumentos').html(response.data.htmconf);
        $('#namesucu').html(response.data.periodocredito);
      }
    },
    complete: function() {
      //hideLoader();
    }
  });
});

$(document).on('click', '.delete', function (e) {
  e.preventDefault();
  var idperiodocredito = $(this).parents('tr').attr('idperiodocredito');
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var nomb = "periodocredito";

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
        url: $('base').attr('href') + 'periodocredito/save_periodocredito',
        type: 'POST',
        data: 'id_periodocredito='+idperiodocredito+'&estado=0',
        dataType: "json",
        beforeSend: function() {
          //showLoader();
        },
        success: function(response) {
          if (response.code==1) {              
            buscar_periodocreditos(page);
          }
        },
        complete: function() {
          var text = "Elimino!";
          alerta(text, 'Esta '+nomb+' se '+text+'.', 'success');
          limp_todo('form_save_periodocredito');
        }
      });
    }
  });    
});

$(document).on('click', '.de_e', function (e) {
  e.preventDefault();
  var idpedet = $(this).parents('tr').attr('idpedet');
  var nomb = "Período";

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
        url: $('base').attr('href') + 'periodocredito/save_periodocredito_det',
        type: 'POST',
        data: 'id_periodocredito_det='+idpedet+'&estado=0',
        dataType: "json",
        beforeSend: function() {
          //showLoader();
        },
        success: function(response) {
          if (response.code==1) {              
            $('#rtadocumentos').html(response.data.htmconf);
          }
        },
        complete: function() {
          var text = "Elimino!";
          alerta(text, 'Esta '+nomb+' se '+text+'.', 'success');
          limp_todo('form_save_periodocredito_det');
        }
      });
    }
  });    
});

$(document).on('click', '.ed_t', function (e) {
  limp_todo('form_add_periodocredito');
  var padre = $(this).parents('tr');
  var idpedet = padre.attr('idpedet');

  var nombre = padre.find('td.nombre span').html();
  var valor = padre.find('td.valor span').html();
  $('#nombre').val(nombre);
  $('#valor').val(valor);
  $('#id_periodocredito_det').val(idpedet);
});