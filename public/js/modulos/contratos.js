$( document ).ready(function() {

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

    $('#form_save_contratos').validate({
      rules:
      {
        contratos: {
          required:true, 
          minlength: 2,
          remote: {
            url: $('base').attr('href') + 'contratos/validar_contratos',
            type: "post",
            data: {
              contratos: function() { return $( "#contratos" ).val(); },
              id_contratos: function() { return $('#id_contratos').val(); }
            }
          }
        },
        id_tipocontrato: {required:true},
        id_modalidadcontrato: {required:true}
      },
      messages: 
      {
        contratos: {required:"Sistema Pensionario", minlength: "Más de 2 Letras", remote: "Ya existe" },
        id_tipocontrato: {required:"Tipo Contrato"},
        id_modalidadcontrato: {required:"Modalidad Contrato"}
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
          url: $('base').attr('href') + 'contratos/save_contratos',
          type: 'POST',
          data: $('#form_save_contratos').serialize(),
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

              buscar_contratos(page);              
            }
            else
            {
              if($('#contratos').parents('.form-group').attr('class')=="form-group")
              {
                $('#contratos').parents('.form-group').addClass('has-error');
              }
              
              if($('#contratos-error').length>0)
              {
                $('#contratos-error').html(response.message);
              }
              else
              {
                $('#contratos').parents('.col-md-6').append("<span id='contratos-error' class='help-block'>"+response.message+"</span>");
              }
            }
          },
          complete: function(response) {
            var id_contratos = parseInt($('#id_contratos').val());
            id_contratos = (id_contratos>0) ? (id_contratos) : ("0");
            var text = (id_contratos=="0") ? ("Guardo!") : ("Edito!");
            if(response.code == 0)
            {
              text = response.message;
            }
            alerta(text, 'Este Contrato se '+text+'.', 'success');
            limpform('form_save_contratos');
            $('#editcontratos').modal('hide');
            $('#id_contratos').val('');
          }
        });
      }
    });
});

$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
});

$(document).on('click', '.add_contratos', function (e)
{
  limpform('form_save_contratos');
  $('#id_contratos').val('');
});

$(document).on('click', '.btn_limpiar', function (e) {
  limpform('form_save_contratos');
  $('#editcontratos').modal('hide');
});

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {
  var page = $(this).find('a').attr('tabindex');
  buscar_contratos(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_contratos(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_contratos(page);
});

function buscar_contratos(page)
{
  var id_tipocontrato_busc = $('#id_tipocontrato_busc').val();
  var id_modalidadcontrato_busc = $('#id_modalidadcontrato_busc').val();
  var contratos_busc = $('#contratos_busc').val();
  var temp = "page="+page;
  if(id_tipocontrato_busc.trim().length)
  {
    temp=temp+'&id_tipocontrato_busc='+id_tipocontrato_busc;
  }
  if(id_modalidadcontrato_busc.trim().length)
  {
    temp=temp+'&id_modalidadcontrato_busc='+id_modalidadcontrato_busc;
  }
  if(contratos_busc.trim().length)
  {
    temp=temp+'&contratos_busc='+contratos_busc;
  }
  $.ajax({
    url: $('base').attr('href') + 'contratos/buscar_contratos',
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
  var idcontratos = $(this).parents('tr').attr('idcontratos');
  $.ajax({
    url: $('base').attr('href') + 'contratos/edit',
    type: 'POST',
    data: 'id_contratos='+idcontratos,
    dataType: "json",
    beforeSend: function() {
      limpform('form_save_contratos');
    },
    success: function(response) {
      if (response.code==1) {
        $('#id_contratos').val(response.data.id_contratos);
        $('#contratos').val(response.data.contratos);
        $('#id_tipocontrato').val(response.data.id_tipocontrato);
        $('#id_modalidadcontrato').val(response.data.id_modalidadcontrato);

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
  var idcontratos = $(this).parents('tr').attr('idcontratos');
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var nomb = "Vehículo";

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
        url: $('base').attr('href') + 'contratos/save_contratos',
        type: 'POST',
        data: 'id_contratos='+idcontratos+'&estado=0',
        dataType: "json",
        beforeSend: function() {
          //showLoader();
        },
        success: function(response) {
          if (response.code==1) {              
            buscar_contratos(page);
          }
        },
        complete: function() {
          var text = "Elimino!";
          alerta(text, 'Esta '+nomb+' se '+text+'.', 'success');
          limpform('form_save_contratos');
        }
      });
    }
  });    
});