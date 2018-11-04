$( document ).ready(function() {

  jQuery.validator.setDefaults({
    debug: true,
    success: "valid",
    ignore: ""
  });

  $('#datetimepicker6').datetimepicker({
    viewMode: "years", 
    format: 'YYYY',
    locale: moment.locale("es")
  });

  $("#datetimepicker6").on("dp.change", function (e) {
    var temp = "tipo=1&anio="+moment().year(e.date.year()).format("YYYY")+"&sema=0&stro=''";  
    formarsemanfech(temp);
  });

  $('#mes_inicio').datetimepicker({
    viewMode: "months", 
    format: 'MM-YYYY',
    locale: moment.locale("es")
  });

  $('#mes_fin').datetimepicker({
    viewMode: "months",
    format: 'MM-YYYY',
    locale: moment.locale("es")
  });

  $("#mes_inicio").on("dp.change", function (e) {
    $('#mes_fin').data("DateTimePicker").minDate(e.date);
    $('#mes_fin').data("DateTimePicker").maxDate(e.date.add(5,'M'));
  });

  $('#fecha_inicio').datetimepicker({
    format: 'DD-MM-YYYY',
    locale: moment.locale("es")
  });

  $('#fecha_fin').datetimepicker({
    format: 'DD-MM-YYYY',
    locale: moment.locale("es"),
    useCurrent: false
  });

  $("#fecha_inicio").on("dp.change", function (e) {
    $('#fecha_fin').data("DateTimePicker").minDate(e.date);
    $('#fecha_fin').data("DateTimePicker").maxDate(e.date.add(1,'M'));
  });

  $("#fecha_inicio").on("dp.show", function (e) {
    $('#fecha_fin input').prop( "disabled", false );
  });

  $.validator.addMethod("formfecha",
    function(value, element) {
      if(value.trim().length)
        return /^(0?[1-9]|[12]\d|3[01])[\.\/\-](0?[1-9]|1[012])[\.\/\-]([12]\d)?(\d\d)$/.test( value );
      else
        return true;
  }, "");

  $.validator.addMethod("formmes",
    function(value, element) {
      if(value.trim().length)
        return /^(0?[1-9]|1[012])[\.\/\-]([12]\d)?(\d\d)$/.test( value );
      else
        return true;
  }, "");

  $('#form_save_reporte').validate({
    rules:
    {
      id_sucursal: { required:true},
      id_personal: { required:true},
      fecha_inicio: { formfecha:true },
      fecha_fin: { formfecha:true },
      mes_inicio: { formmes:true },
      mes_inicio: { formmes:true }
    },
    messages: 
    {
      id_sucursal: {required:"Sucursal"},
      id_personal: {required:"Personal"}
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
      var i = 0;
      var va = '';
      var id = '';
      var v_u = '';
      var tipo = parseInt($('#mitab li.active a').attr('tipo'));
      if(tipo >0) i++;
      var temp = '&tipo='+tipo;
      var fechi = $('#fecha_inicioo').val();
      var fechf = $('#fecha_finn').val();
      var info = $('#id_sucursal option:selected').text()+' - '+$('#id_personal option:selected').text();
      

      if(fechi.trim().length)
      {
        temp=temp+'&fechai='+datetoing(fechi);
      }
      if(fechf.trim().length)
      {
        temp=temp+'&fechaf='+datetoing(fechf);
      }
      var inp = tipo == 2 ? 'select': 'input';

      $.each($('#tab_contente'+tipo+' '+inp), function(ky, vv) {
        va = $(this).val();
        if(va.trim().length)
          i++;
        if(tipo == 2)
        {
          id = $(this).attr('id');
          v_u = $('#'+id+' option:selected').text();
          temp = temp+'&'+id+'e='+v_u;
          info = info+' - sem->'+v_u;
        }
        else
          info = info+' - '+va;

      });
      
      //alert(i)
      if(i == 3)
      {
        $('#detfiltro').html(info);
        $.ajax({
          url: $('base').attr('href') + 'hhxpersonaxactividad/buscar',
          type: 'POST',
          data: $('#form_save_reporte').serialize()+temp,
          dataType: "json",
          beforeSend: function() {
            $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
          },
          success: function(response) {
            $('#tab_content1 div.table-responsive').html(response.data.tiempo);
            $('#tab_content2 div.table-responsive').html(response.data.costo);
            $('#filtroreporte').modal('hide');
          },
          complete: function(response) {
            $.LoadingOverlay("hide");
          }
        });
      }
      else
      {
        switch(tipo)
        {
          case 1: va = 'los Meses son obligatorios'; break;
          case 2: va = 'las Semanas son obligatorias'; break;
          case 3: va = 'las Fechas son obligatorias'; break;
          default:
        }
        alerta('Error', 'Verificar '+va, 'error');
      } 
    }
  });
});

$(document).on('change', '#id_sucursal', function (e)
{
  var idsuc = parseInt($(this).val());
  if(idsuc > 0)
  {
    $.ajax({
      url: $('base').attr('href') + 'hhxpersonaxactividad/buscar_trabasucu',
      type: 'POST',
      data: 'idsuc='+idsuc,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
        if (response.code==1) {
          $('#id_personal').html(response.data);
        }
      },
      complete: function() {
        //hideLoader();
      }
    });
  }
});

$('#mitab li a').on('shown.bs.tab', function (e) {
  $('#mytabContent div.tab-pane div.form-group input').not('#anio_inicio').val('');
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