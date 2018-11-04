$( document ).ready(function() {
  $('#tipo_persona').selectpicker();

  jQuery.validator.setDefaults({
    debug: true,
    success: "valid",
    ignore: ""
  });

  $('#form_save_tipodocumentomaestro').validate({
    rules:
    {
      tipodocumentomaestro: {
        required:true, 
        minlength: 2,
        remote: {
          url: $('base').attr('href') + 'tipodocumentomaestro/validar_tipodocumentomaestro',
          type: "post",
          data: {
            tipodocumentomaestro: function() { return $( "#tipodocumentomaestro" ).val(); },
            id_tipodocumentomaestro: function() { return $('#id_tipodocumentomaestro').val(); }
          }
        },
      },
      chekmod: {required: true}
    },
    messages: 
    {
      tipodocumentomaestro: {required:"Almacén", minlength: "Más de 2 Letras", remote: "Ya existe" },
      chekmod: {required: "Seleccionar un Módulo"}
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
      else
      {
        if (element.attr("type") == "checkbox") 
        {
            error.insertAfter(element.closest('.col-md6').children('.error_check') );
        } 
        else 
        {
            error.insertAfter(element.parent());
        }
      }
    },
    submitHandler: function() {
      $.ajax({
        url: $('base').attr('href') + 'tipodocumentomaestro/save_tipodocumentomaestro',
        type: 'POST',
        data: $('#form_save_tipodocumentomaestro').serialize(),
        dataType: "json",
        beforeSend: function() {
          $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
        },
        success: function(response) {
          if(response.code==1)
          {
            $('#edittipodocumentomaestro').modal('hide');
            buscar_tipodocumentomaestros(0);
            var id_tipodocumentomaestro = parseInt($('#id_tipodocumentomaestro').val());
            id_tipodocumentomaestro = (id_tipodocumentomaestro>0) ? (id_tipodocumentomaestro) : ("0");
            var text = (id_tipodocumentomaestro=="0") ? ("Guardo!") : ("Edito!");
            alerta(text, 'Este Tipo de documento se '+text+'.', 'success');
            limpform('form_save_tipodocumentomaestro');
          }
        },
        complete: function(response) {
          $.LoadingOverlay("hide");
        }
      });
    }
  });
});

$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
  $('#estado_busc').val(-1);
  buscar_tipodocumentomaestros(0);
});

$(document).on('click', '.add_tipodocumentomaestro', function (e)
{
  limpform('form_save_tipodocumentomaestro');
  limpcheckform('form_save_tipodocumentomaestro', 'chekmod-error');
  $('#desc_sunat').val('');
  $('#primercaracter').val(0);
  $('#add_1').prop('checked', true);
});

$(document).on('click', '.btn_limpiar', function (e) {
  limpform('form_save_tipodocumentomaestro');
  limpcheckform('form_save_tipodocumentomaestro', 'chekmod-error');
  $('#edittipodocumentomaestro').modal('hide');
});

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {
  var page = $(this).find('a').attr('tabindex');
  buscar_tipodocumentomaestros(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_tipodocumentomaestros(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_tipodocumentomaestros(page);
});

function buscar_tipodocumentomaestros(page)
{
  var um_busc = $('#um_busc').val();
  var temp = "page="+page;
  var cod_sunat_busc = $('#cod_sunat_busc').val();
  var desc_sunat = $('#desc_sunat_busc').val();

  var estado = $('#estado_busc').val();

  if(estado > -1)
  {
    temp=temp+'&estado_busc='+estado;
  }
  if(um_busc.trim().length)
  {
    temp=temp+'&um_busc='+um_busc;
  }
  if(cod_sunat_busc.trim().length)
  {
    temp=temp+'&cod_sunat='+cod_sunat_busc;
  }
  if(desc_sunat.trim().length)
  {
    temp=temp+'&desc_sunat='+desc_sunat;
  }
  $.ajax({
    url: $('base').attr('href') + 'tipodocumentomaestro/buscar_tipodocumentomaestros',
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
    },
    complete: function() {
      $.LoadingOverlay("hide");
    }
  });
}

$(document).on('click', '.edit', function (e) {
  var idtipodocumentomaestro = $(this).parents('tr').attr('idtipodocma');
  $.ajax({
    url: $('base').attr('href') + 'tipodocumentomaestro/edit',
    type: 'POST',
    data: 'id_tipodocumentomaestro='+idtipodocumentomaestro,
    dataType: "json",
    beforeSend: function() {
      $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
      limpform('form_save_tipodocumentomaestro');
      limpcheckform('form_save_tipodocumentomaestro', 'chekmod-error');
    },
    success: function(response) {
      if (response.code==1) {
        $('#id_tipodocumentomaestro').val(response.data.id_tipodocumentomaestro);
        $('#tipodocumentomaestro').val(response.data.tipodocumentomaestro);
        $('#abreviatura').val(response.data.abreviatura);
        $('#cod_sunat').val(response.data.cod_sunat);
        $('#desc_sunat').val(response.data.desc_sunat);

        $('#estado label').removeClass('active');
        $('#estado input').prop('checked', false);

        var num = response.data.estado;
        $('#estado #estado_'+num).prop('checked', true);
        $('#estado #estado_'+num).parent('label').addClass('active');
        var valorcheck = "";
        var cantz = parseInt(response.data.cantz);
        cantz = (cantz > 0) ? cantz : 0;

        if(cantz > 0)
        {
          $.each( response.data.chekmod, function( index, value ){
              valorcheck = (value==0) ? (false) : (true);
              $('#chekmod'+index).prop('checked', valorcheck);
          });
        }
          
        $('#check_docu').html(response.data.hidden);

        var chckradio = parseInt(response.data.tienevarioscaracteres);
        $('#add_'+chckradio).prop('checked', true);
        $('#primercaracter').val(response.data.primercaracter);
        if(chckradio == 2)
        {
          $('#primercaracter').removeClass('collapse');
        }
        else
        {
          $('#primercaracter').addClass('collapse');
        }
      }
    },
    complete: function() {
      $.LoadingOverlay("hide");
    }
  });
});

$(document).on('click', '.delete', function (e) {
  e.preventDefault();
  var idtipodocumentomaestro = $(this).parents('tr').attr('idtipodocma');
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var nomb = "Almacén";

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
        url: $('base').attr('href') + 'tipodocumentomaestro/delete',
        type: 'POST',
        data: 'id_tipodocumentomaestro='+idtipodocumentomaestro+'&estado=0',
        dataType: "json",
        beforeSend: function() {
          //showLoader();
        },
        success: function(response) {
          if (response.code==1) {              
            buscar_tipodocumentomaestros(page);
          }
        },
        complete: function() {
          var text = "Elimino!";
          alerta(text, 'Esta '+nomb+' se '+text+'.', 'success');
          limpform('form_save_tipodocumentomaestro');
          limpcheckform('form_save_tipodocumentomaestro', 'chekmod-error');
        }
      });
    }
  });    
});

$('#div_docu input[type="checkbox"]').on('change', function() {
    if($(this).is(":checked"))  {
        $('#form_save_tipodocumentomaestro #check_docu').append("<input id='modulo"+$(this).val()+"' type='hidden' value='"+$(this).val()+"' name='modulos["+$(this).val()+"]' />");
    } else {
        $("#modulo"+$(this).val()).remove();
    }  
});

$(document).on('click','button.getformatos',function () {
    $.LoadingOverlay("show", {image : "", fontawesome : "fa fa-spinner fa-spin"}); 
    window.location.href = $(this).attr('url');
});

/*$(".adduno").on('ifChanged', function(e) {
  $(e.target).trigger('change');
});*/

$(document).on('change','.adduno',function () {
  var tis = $(this);
  var esval = parseInt(tis.val());
  $('#primercaracter').addClass('collapse');
  if(esval == 2)
  {
    if(tis.is(":checked"))  {
      $('#primercaracter').removeClass('collapse');
    }
  }
});