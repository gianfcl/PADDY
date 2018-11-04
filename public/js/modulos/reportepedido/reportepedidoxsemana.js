$( document ).ready(function() {

  jQuery.validator.setDefaults({
    debug: true,
    success: "valid",
    ignore: ""
  });

  /*$.validator.addMethod("formespn",
    function(value, element) {
      if(value.trim().length)
        return /^(0?[1-9]|[12]\d|3[01])[\.\/\-](0?[1-9]|1[012])[\.\/\-]([12]\d)?(\d\d)$/.test( value );
      else
        return false;
  }, "");*/

  $('#form_busc_consolidado').validate({
    rules:
    {
      anio_inicio:{ required:true },
      semana_ini: {required:true},
      semana_fin: {required:true}
    },
    messages: 
    {
      anio_inicio:{ required:'Ingresar' },
      semana_ini: { required:"seleccionar" },
      semana_fin: { required:"seleccionar" }
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
      if(element.parent('.col-md-8').length) 
      { 
        error.insertAfter(element.parent()); 
      }
      if(element.parent('.col-md-4').length) 
      { 
        error.insertAfter(element.parent()); 
      }
    },
    submitHandler: function() { alert('mostro3')
      buscar_consolidado();      
    }
  });

  $('#datetimepicker6').datetimepicker({
    format: 'YYYY'
  });

  $("#datetimepicker6").on("dp.change", function (e) {
    var temp = "tipo=1&anio="+moment().year(e.date.year()).format("YYYY")+"&sema=0&stro=''";  
    formarsemanfech(temp);
  });
});

function buscar_consolidado()
{
  var url = $('#linkmodulo').val();
  var anio_inicio = $('#anio_inicio').val();
  var semana_ini = $('#semana_ini').val();
  var semana_fin = $('#semana_fin').val();

  anio_inicio = (anio_inicio.trim().length) ? (anio_inicio) : ("_");
  semana_ini = (semana_ini.trim().length) ? (semana_ini) : ("_");
  semana_fin = (semana_fin.trim().length) ? (semana_fin) : ("_");

  var idcliente = parseInt($('#id_cliente').val());
  var idsucursal = parseInt($('#id_sucursal').val());
  var idformulario = parseInt($('#id_formulario').val());

  if(anio_inicio != '-' && semana_ini != '-' && semana_fin != '-')
  {
    idcliente = (idcliente>0) ? (idcliente) : ("_");
    idsucursal = (idsucursal>0) ? (idsucursal) : ("_");
    idformulario = (idformulario>0) ? (idformulario) : ("_");

    url = url+'/buscar'+'/'+anio_inicio+'/'+semana_ini+'/'+semana_fin+'/'+idcliente+'/'+idsucursal+'/'+idformulario;

    var idgrupo = parseInt($('#id_grupo').val());
    idgrupo = (idgrupo>0) ? (idgrupo) : ('-');

    var idfamilia = parseInt($('#id_familia').val());
    idfamilia = (idfamilia>0) ? (idfamilia) : ('-');

    var idusub = parseInt($('#id_subfamilia').val());
    idusub = (idusub>0) ? (idusub) : ('-');
    url = url+'/'+idgrupo+'/'+idfamilia+'/'+idusub;

    window.location.href = url;
  }
  else
  {
    alerta('seleccionar','Escojer Atributos','error');
  } 
}

$(document).on('click', '.buscar', function (e)
{
  buscar_consolidado();
  //$('#form_busc_consolidado').submit();
});

$(document).on('change', '.id_grupo', function (e) {
  var idgrupo = parseInt($(this).val());
  idgrupo = (idgrupo>0) ? (idgrupo) : (0);
  
  $('.id_familia').html('');
  $('.id_subfamilia').html('');
  if(idgrupo>0)
  {
    $.ajax({
      url: $('base').attr('href') + 'familia/cbox_familia',
      type: 'POST',
      data: 'id_grupo='+idgrupo,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
        if (response.code==1) { console.log(response.data)
          $('select.id_familia').html(response.data);
        }
      },
      complete: function() {
        //hideLoader();
      }
    });
  }
});

$(document).on('change', '.id_familia', function (e) {
  var idfamilia = parseInt($(this).val());
  idfamilia = (idfamilia>0) ? (idfamilia) : (0);

  
  $('.id_subfamilia').html('');
  if(idfamilia>0)
  {
    $.ajax({
      url: $('base').attr('href') + 'subfamilia/cbox_subfamilia',
      type: 'POST',
      data: 'id_subfamilia='+idfamilia,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
        if (response.code==1) {
          $('.id_subfamilia').html(response.data);
        }
      },
      complete: function() {
        //hideLoader();
      }
    });
  }
});

$(function () {
  $( "#cliente" ).autocomplete({
    type:'POST',
    serviceUrl: $('base').attr('href')+"clientes/get_all_info_cliente",
    onSelect: function (suggestion) 
    {
      $('#id_cliente').val(suggestion.id_cliente);
      $('#cliente').val(suggestion.value);
      $('#id_sucursal').html(suggestion.cbx_sucur);
      if($('#id_cliente-error').size())
      {
        $('#id_cliente-error').remove();
      }
    }
  });
});

$('#pro_a input[type="checkbox"]').on('change', function() {
  var valor = false;
  var id = $(this).attr('id');
  if($(this).is(":checked"))  {
    valor = true;
  }

  $('#pro_a input[type="checkbox"]').prop('checked', false);
  

  if(valor)
  {
    $('#'+id).prop('checked', valor );
  }
});

function formarsemanfech(temp)
{
  var sem1 = $('#semana_ini');
  var sem2 = $('#semana_fin');

  sem2.html('');
  var tipo = 0;
  if(temp.trim().length)
  {
    $.ajax({
        url: $('base').attr('href') + 'reportepedidoxsemana/formarsemanfech',
        type: 'POST',
        data: temp,
        dataType: "json",
        beforeSend: function() {
          $.LoadingOverlay("show", {image : "", fontawesome : "fa fa-spinner fa-spin"});
        },
        success: function(response) {
          if (response.code==1) {
            tipo = parseInt(response.data.tipo);
            switch(tipo)
            {
              case 1:
              //alert(tipo)
              sem1.html(''); 
              $.each(response.data.cbosemi, function(ky, vv) {
                sem1.append($("<option></option>").attr("value",vv).text(ky));
              });
              sem1.val(response.data.selec);

              break;

              case 2:
              
              break;

              default: break;
            }
            $.each(response.data.cbosemf, function(ky, vv) {
              sem2.append($("<option></option>").attr("value",vv).text(ky));
            });
          }
        },
        complete: function() {
          $.LoadingOverlay("hide");
        }
    });
  }
}
$(document).on('change', '#semana_ini', function (e) {
  var temp = "tipo=2&anio=0&sema=0&stro="+$(this).val()+'&semi='+$("#semana_ini option:selected").text(); 
  
  formarsemanfech(temp);
});