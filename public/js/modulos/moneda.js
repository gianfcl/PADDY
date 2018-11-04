$( document ).ready(function() {

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

    $('#form_save_moneda').validate({
      rules:
      {
        moneda: {
          required:true, 
          minlength: 2,
          remote: {
            url: $('base').attr('href') + 'moneda/validar_moneda',
            type: "post",
            data: {
              moneda: function() { return $( "#moneda" ).val(); },
              id_moneda: function() { return $('#id_moneda').val(); }
            }
          }
        },
        abreviatura:{required:true}
      },
      messages: 
      {
        moneda: {required:"moneda", minlength: "Más de 2 Letras", remote: "Ya existe" },
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
        $('#verificarusu').modal('show');
      }
    });
});

$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
});

$(document).on('click', '.add_moneda', function (e)
{
  limp_todo('form_save_moneda');
});

$(document).on('click', '.btn_limpiar', function (e) {
  limp_todo('form_save_moneda');
  $('#editmoneda').modal('hide');
});

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {
  var page = $(this).find('a').attr('tabindex');
  buscar_monedas(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_monedas(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_monedas(page);
});

function buscar_monedas(page)
{  
  var temp = "page="+page;
  var moneda_busc = $('#moneda_busc').val();
  var abreviatura_busc = $('#abreviatura_busc').val();

  if(moneda_busc.trim().length)
  {
    temp=temp+'&moneda_busc='+moneda_busc;
  }

  if(abreviatura_busc.trim().length)
  {
    temp=temp+'&abreviatura_busc='+abreviatura_busc;
  }

  $.ajax({
    url: $('base').attr('href') + 'moneda/buscar_monedas',
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
  limp_todo('form_save_moneda');
  var idmoneda = $(this).parents('tr').attr('idmoneda');
  $.ajax({
    url: $('base').attr('href') + 'moneda/edit',
    type: 'POST',
    data: 'id_moneda='+idmoneda,
    dataType: "json",
    beforeSend: function() {
      $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
      limp_todo('form_save_moneda');
    },
    success: function(response) {
      if (response.code==1) {
        $('#id_moneda').val(response.data.id_moneda);
        $('#moneda').val(response.data.moneda);
        $('#abreviatura').val(response.data.abreviatura);
        $('#simbolo').val(response.data.simbolo);

        $('#estado label').removeClass('active');
        $('#estado input').prop('checked', false);

        var num = response.data.estado;
        $('#estado #estado_'+num).prop('checked', true);
        $('#estado #estado_'+num).parent('label').addClass('active');

        var es_base = response.data.es_base;
        var bol = (es_base==1) ? true : false;
        $('#es_base').prop('checked',bol)
      }
    },
    complete: function() {
      $.LoadingOverlay("hide");
    }
  });
});

$(document).on('click', '.delete', function (e) {
  e.preventDefault();
  var idmoneda = $(this).parents('tr').attr('idmoneda');
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var nomb = "moneda";
  $.ajax({
  url: $('base').attr('href') + 'moneda/val_delete',
  type: 'POST',
  data: 'id_moneda='+idmoneda,
  dataType: "json",
      beforeSend: function() {},
      success: function(response) {
        if (response.code==1) {
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
                      url: $('base').attr('href') + 'moneda/save_moneda',
                      type: 'POST',
                      data: 'id_moneda='+idmoneda+'&estado=0',
                      dataType: "json",
                      beforeSend: function() {
                        $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
                      },
                      success: function(response) {
                        if (response.code==1) {
                          buscar_monedas(page);
                        }
                      },
                      complete: function(response) {
                        $.LoadingOverlay("hide");
                        var text = "Elimino!";
                        alerta(text, 'Esta '+nomb+' se '+text+'.', 'success');
                        limp_todo('form_save_moneda');
                      }
                    });
                  }
                });
        }else{
          alerta("Error","Esta moneda tiene Cuentas con movimientos");
        }
      },
      complete: function() {}
})
});

$(document).on('click','.limpiarfiltro',function(){
  $(this).parents('tr').find('input').val('');
  buscar_monedas(0);
});

$(document).on('click','.verificar',function(){
  var pwd = $('#password').val();
  $.ajax({
    url: $('base').attr('href') + 'usuarios/validar_clave',
    type: 'POST',
    data: 'pwd='+pwd,
    asunc:false,
    dataType: "json",
    beforeSend: function() {
      $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
    },
    success: function(response) {
      var resp = response;
      $('#password').val('');
      if(resp==true)
      {
        $('#verificarusu').modal('hide');
        $.ajax({
          url: $('base').attr('href') + 'moneda/save_moneda',
          type: 'POST',
          data: $('#form_save_moneda').serialize(),
          dataType: "json",
          beforeSend: function() {
            $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
          },
          success: function(response) {
            if (response.code==1) {
              var page = 0;
              if($('#paginacion_data ul.pagination li.active a').length>0)
              {
                page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
              }                     

              buscar_monedas(page);
            }
            else
            {
              if($('#moneda').parents('.form-group').attr('class')=="form-group")
              {
                $('#moneda').parents('.form-group').addClass('has-error');
              }
              
              if($('#moneda-error').length>0)
              {
                $('#moneda-error').html(response.message);
              }
              else
              {
                $('#moneda').parents('.col-md-6').append("<span id='moneda-error' class='help-block'>"+response.message+"</span>");
              }
            }
          },
          complete: function(response) {
            $.LoadingOverlay("hide");
            var id_moneda = parseInt($('#id_moneda').val());
            id_moneda = (id_moneda>0) ? (id_moneda) : ("0");
            var text = (id_moneda=="0") ? ("Guardo!") : ("Edito!");
            if(response.code == 0)
            {
              text = response.message;
            }
            alerta(text, 'Este Moneda se '+text+'.', 'success');
            limp_todo('form_save_moneda');
            $('#editmoneda').modal('hide');
          }
        });
      }
      else
      {
        alerta('Error','clave incorrecta','error');
      }
    },
    complete: function() {
      $.LoadingOverlay("hide");
    }
  });
});