$( document ).ready(function() {

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

    $('#form_save_cuenta').validate({
      rules:
      {
        cuenta: {
          required:true, 
          minlength: 2,
          remote: {
            url: $('base').attr('href') + 'cuenta/validar_cuenta',
            type: "post",
            data: {
              cuenta: function() { return $( "#cuenta" ).val(); },
              id_cuenta: function() { return $('#id_cuenta').val(); }
            }
          }
        },
        abreviatura:{required:true}
      },
      messages: 
      {
        cuenta: {required:"cuenta", minlength: "Más de 2 Letras", remote: "Ya existe" },
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
          url: $('base').attr('href') + 'cuenta/save_cuenta',
          type: 'POST',
          data: $('#form_save_cuenta').serialize(),
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

              buscar_cuentas(page);
            }
            else
            {
              if($('#cuenta').parents('.form-group').attr('class')=="form-group")
              {
                $('#cuenta').parents('.form-group').addClass('has-error');
              }
              
              if($('#cuenta-error').length>0)
              {
                $('#cuenta-error').html(response.message);
              }
              else
              {
                $('#cuenta').parents('.col-md-6').append("<span id='cuenta-error' class='help-block'>"+response.message+"</span>");
              }
            }
          },
          complete: function(response) {
            var id_cuenta = parseInt($('#id_cuenta').val());
            id_cuenta = (id_cuenta>0) ? (id_cuenta) : ("0");
            var text = (id_cuenta=="0") ? ("Guardo!") : ("Edito!");
            if(response.code == 0)
            {
              text = response.message;
            }
            alerta(text, 'Este cuenta se '+text+'.', 'success');
            limp_todo('form_save_cuenta');
            $('#editcuenta').modal('hide');
          }
        });
      }
    });
});

$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
});

$(document).on('click', '.add_cuenta', function (e)
{
  limp_todo('form_save_cuenta');
});

$(document).on('click', '.btn_limpiar', function (e) {
  limp_todo('form_save_cuenta');
  $('#editcuenta').modal('hide');
});

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {
  var page = $(this).find('a').attr('tabindex');
  buscar_cuentas(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_cuentas(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_cuentas(page);
});

function buscar_cuentas(page)
{  
  var temp = "page="+page;
  var cuenta_busc = $('#cuenta_busc').val();
  var abreviatura_busc = $('#abreviatura_busc').val();

  if(cuenta_busc.trim().length)
  {
    temp=temp+'&cuenta_busc='+cuenta_busc;
  }

  if(abreviatura_busc.trim().length)
  {
    temp=temp+'&abreviatura_busc='+abreviatura_busc;
  }

  $.ajax({
    url: $('base').attr('href') + 'cuenta/buscar_cuentas',
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
  limp_todo('form_save_cuenta');
  var idcuenta = $(this).parents('tr').attr('idcuenta');
  $.ajax({
    url: $('base').attr('href') + 'cuenta/edit',
    type: 'POST',
    data: 'id_cuenta='+idcuenta,
    dataType: "json",
    beforeSend: function() {
      limp_todo('form_save_cuenta');
    },
    success: function(response) {
      if (response.code==1) {
        $('#id_cuenta').val(response.data.id_cuenta);
        $('#cuenta').val(response.data.cuenta);
        $('#abreviatura').val(response.data.abreviatura);

        $('#estado label').removeClass('active');
        $('#estado input').prop('checked', false);

        var num = response.data.estado;
        $('#estado #estado_'+num).prop('checked', true);
        $('#estado #estado_'+num).parent('label').addClass('active');

        var valorcheck = "";
        $.each( response.data.chekmod, function( index, value ){
          valorcheck = (value==0) ? (false) : (true); console.log('index->'+index+' value->'+value);
          $('#chekmod'+index).prop('checked', valorcheck);
        });
        
        $('#check_docu').html(response.data.hidden);
      }
    },
    complete: function() {
      //hideLoader();
    }
  });
});

$(document).on('click', '.delete', function (e) {
  e.preventDefault();
  var idcuenta = $(this).parents('tr').attr('idcuenta');
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var nomb = "cuenta";

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
        url: $('base').attr('href') + 'cuenta/save_cuenta',
        type: 'POST',
        data: 'id_cuenta='+idcuenta+'&estado=0',
        dataType: "json",
        beforeSend: function() {
          //showLoader();
        },
        success: function(response) {
          if (response.code==1) {              
            buscar_cuentas(page);
          }
        },
        complete: function() {
          var text = "Elimino!";
          alerta(text, 'Esta '+nomb+' se '+text+'.', 'success');
          limp_todo('form_save_cuenta');
        }
      });
    }
  });    
});

$('#modcuenta input[type="checkbox"]').on('change', function() {
  console.log("entra");
  if($(this).is(":checked"))  {
    $('#form_save_cuenta #check_docu').append("<input id='moneda"+$(this).val()+"' type='hidden' value='"+$(this).val()+"' name='moneda["+$(this).val()+"]' />");
  }
  else {
    $("#moneda"+$(this).val()).remove();
  }
});