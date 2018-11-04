$( document ).ready(function() {

  jQuery.validator.setDefaults({
    debug: true,
    success: "valid",
    ignore: ""
  });

  $('#form_save_mesam').validate({
    rules:
    {
      id_pisom:
      {
        required:true
      },
      mesam:
      {
        required:true,
        remote: {
          url: $('base').attr('href') + 'mesam/validar',
          type: "post",
          data: {
            mesam: function() { return $("#mesam").val(); },
            id_mesam: function() { return $('#id_mesam').val(); },
            id_pisom: function() { return $('#id_pisom').val(); },
          }
        }
      }       
    },
    messages: 
    {
      mesam:
      {
        required:"Ingresar una mesa",
        remote: "Ya existe."
      },
      id_pisom:
      {
        required:"Seleccione Piso",
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
          url: $('base').attr('href') + 'mesam/save_mesam',
          type: 'POST',
          data: $('#form_save_mesam').serialize(),
          dataType: "json",
          beforeSend: function() 
          {
            $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
          },
          success: function(response) 
          {
            if (response.code==1) {
              $('#editmesam').modal('hide');
              var page = 0;
              if($('#paginacion_data ul.pagination li.active a').length>0)
              {
                page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
              }                   

              buscar_mesams(page);
              var id_mesam = parseInt($('#id_mesam').val());
              id_mesam = (id_mesam>0) ? (id_mesam) : ("0");
              var text = (id_mesam=="0") ? ("Guardo!") : ("Edito!");
              alerta(text, 'Esta Mesa se '+text+'.', 'success');
            }
            else
            {
              alerta('Error!', 'Hubo un error interno!!', 'error');
            }

            limpiarform();
          },
          complete: function() 
          {
            $.LoadingOverlay("hide");
          }
      });
    }
  });
});

$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
  $('#id_pisom_busc').val('');
  buscar_mesams(0);
});

$(document).on('click', '.add_mesam', function (e)
{
    limpiarform();
});

$(document).on('click', '.btn_limpiar', function (e) {
  limpiarform();
  $('#editmesam').modal('hide');
});

function limpiarform()
{
  $('#id_mesam').val('0');
  $('#mesam').val('');
  $('#id_pisom').val('');
  $('#estado label').removeClass('active');
  $('#estado input').prop('checked', false);
  
  $('#estado #estado_1').prop('checked', true);
  $('#estado #estado_1').parent('label').addClass('active');

  if($('#mesam').parents('.form-group').attr('class')=="form-group has-error")
  {
    $('#mesam').parents('.form-group').removeClass('has-error');
  }

  if($('#mesam-error').length>0)
  {
    $('#mesam-error').html('');
  }
  var validatore = $( "#form_save_mesam" ).validate();
  validatore.resetForm();
}

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  buscar_mesams(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_mesams(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_mesams(page);
});

function buscar_mesams(page)
{
  var mesam_busc = $('#mesam_busc').val();
  var id_pisom = $('#id_pisom_busc').val();
  var temp = "page="+page;
  if(mesam_busc.trim().length)
  {
    temp=temp+'&mesam_busc='+mesam_busc;
  }

  if(parseInt(id_pisom)>0)
  {
    temp=temp+'&id_pisom='+id_pisom;
  }

  $.ajax({
      url: $('base').attr('href') + 'mesam/buscar_mesams',
      type: 'POST',
      data: temp,
      dataType: "json",
      beforeSend: function() {
        $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
      },
      success: function(response) {
        if (response.code==1) {
          $('#datatable-buttons tbody#bodyindex').html(response.data.rta);
          $('#paginacion_data').html(response.data.paginacion);
        }
        else
        {
          alerta('Error!', 'Hubo un error interno!!', 'error');
        }
      },
      complete: function() {
        $.LoadingOverlay("hide");
      }
  });
}

$(document).on('click', '.edit', function (e) {
  limpiarform();
  var idmesam = $(this).parents('tr').attr('idmesam');
  $.ajax({
      url: $('base').attr('href') + 'mesam/edit',
      type: 'POST',
      data: 'id_mesam='+idmesam,
      dataType: "json",
      beforeSend: function() {
        $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
      },
      success: function(response) {
          if (response.code==1) {
            $('#id_pisom').val(response.data.id_pisom);
            $('#id_mesam').val(response.data.id_mesam);
            $('#mesam').val(response.data.mesam);

            $('#estado label').removeClass('active');
            $('#estado input').prop('checked', false);

            var num = response.data.estado;
            $('#estado #estado_'+num).prop('checked', true);
            $('#estado #estado_'+num).parent('label').addClass('active');

            if($('#mesam').parents('.col-md-8').attr('class')=="col-md-8 col-sm-8 col-xs-12")
            {
              $('#mesam').parents('.col-md-8').removeClass('has-error');
            }

            if($('#mesam-error').length>0)
            {
              $('#mesam-error').html('');
            }
          }
          else
          {
            lerta('Error!', 'Hubo un error interno!!', 'error');
          }
      },
      complete: function() {
        $.LoadingOverlay("hide");
      }
  });
});

$(document).on('click', '.delete', function (e) {
  e.preventDefault();
  var idmesam = $(this).parents('tr').attr('idmesam');
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var nomb = "Mesa";
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
        url: $('base').attr('href') + 'mesam/save_mesam',
        type: 'POST',
        data: 'id_mesam='+idmesam+'&estado=0',
        dataType: "json",
        beforeSend: function() 
        {
          $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
        },
        success: function(response) 
        {
          if (response.code==1) 
          {
            buscar_mesams(page);
            alerta(text, 'Esta '+nomb+' se Eliminó', 'success');
          }
          else
          {
            alerta('Error!', 'Hubo un error interno!!', 'error');
          }
        },
        complete: function() 
        {
          $.LoadingOverlay("hide");
        }
      });
    }
  });   
});