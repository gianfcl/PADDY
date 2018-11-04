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

  $('#fecha_inicios').datetimepicker({
    format: 'DD-MM-YYYY',
    locale: moment.locale("es"),
    useCurrent: false
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
      fecha_inicio: { formfecha:true },
      fecha_fin: { formfecha:true },
      mes_inicio: { formmes:true },
      mes_fin: { formmes:true }
    },
    messages: 
    {
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
      var fecha_inicixx = $('#fecha_inicixx').val();

      var info = '';
      if(fecha_inicixx.trim().length)
      {
        temp=temp+'&fechai='+datetoing(fecha_inicixx);
      }

      if(fechi.trim().length)
      {
        temp=temp+'&fechai='+datetoing(fechi);
      }
      if(fechf.trim().length)
      {
        temp=temp+'&fechaf='+datetoing(fechf);
      }
      var inp = tipo == 2 ? 'select': 'input';
      var fi = $('#fecha_inicioo').attr('fech');
      var ff = $('#fecha_finn').attr('fech');
      $('#fecha_inicioo').attr({'nufech':fi});
      $('#fecha_finn').attr({'nufech':ff});

      $.each($('#tab_contente'+tipo+' '+inp+'.cuenvalid'), function(ky, vv) {
        va = $(this).val();
        if(va.trim().length)
          i++;
        id = $(this).attr('id');
        if(tipo == 2)
        {          
          v_u = $('#'+id+' option:selected').text();
          temp = temp+'&'+id+'e='+v_u;
          info = info+' - sem->'+v_u;
        }
        else
        {
          info = info+' - '+va;
          if(tipo == 3 || tipo == 4)
          {
            $('#'+id).attr({'nufech':va});
            i = (tipo == 4) ? i+1 : i;
          }
        }

      });

      if(tipo == 4)
      {
        if($('#produreceta').is(":checked"))
        {
          temp = temp+'&verreceta=1';
        }
        if($('#produsub').is(":checked"))
        {
          temp = temp+'&versubprod=1';
        }
      }
      
      if(i == 3)
      {
        $('#detfiltro').html(info);
        $.ajax({
          url: $('base').attr('href') + 'balancedecostosdeprod/buscar',
          type: 'POST',
          data: $('#form_save_reporte').serialize()+temp,
          dataType: "json",
          beforeSend: function() {
            $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
          },
          success: function(response) {
            $('#inforta').html(response.data.cant);
            $('#filtroreporte').modal('hide');
          },
          complete: function(response) {
            $.LoadingOverlay("hide");
          }
        });
      }
      else
      {
        $('#detfiltro').html('Reporte');
        switch(tipo)
        {
          case 1: va = 'los Meses son obligatorios'; break;
          case 2: va = 'las Semanas son obligatorias'; break;
          case 3: va = 'las Fechas son obligatorias'; break;
          case 4: va = 'la Fecha es obligatoria'; break;
          default:
        }
        alerta('Error', 'Verificar '+va, 'error');
      } 
    }
  });
  
  $( "#descripcion" ).autocomplete({
    serviceUrl: $('base').attr('href')+"articuloxsucursal/search_articulo3",
    type:'POST',
    params: { 
      'id_grupo': function() { return $('#idgrupo').val(); },
      'id_familia': function() { return $('#idfamil').val(); },
      'id_subfamilia': function() { return $('#idsubfa').val(); }
    },
    onSelect: function (suggestion) {
      $('#id_art_sucursal').val(suggestion.id_art_sucursal);
      limpcbx();
    }
  });
});


$('#mitab li a').on('shown.bs.tab', function (e) {
  $('#mytabContent div.tab-pane div.form-group input[type=text]').not('#anio_inicio').val('');
  var target = $(e.target).attr("href");
  switch(target)
  {
    case '#tab_contente3':
      var fi = $('#fecha_inicioo').attr('nufech');
      var ff = $('#fecha_finn').attr('nufech');
      $('#fecha_inicioo').val(fi);
      $('#fecha_finn').val(ff);
    break;

    case '#tab_contente4':
      var fi = $('#fecha_inicixx').attr('nufech');
      $('#fecha_inicixx').val(fi);
    break;

    default: break;
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

$(document).on('change', '#idgrupo', function (e) {
  var idgrupo = parseInt($(this).val());
  idgrupo = (idgrupo>0) ? (idgrupo) : (0);
  
  $('#idfamil').html('');
  $('#idsubfa').html('');
  if(idgrupo>0)
  {
    $.ajax({
      url: $('base').attr('href') + 'familia/cbox_familia',
      type: 'POST',
      data: 'id_grupo='+idgrupo,
      dataType: "json",
      beforeSend: function() {
        $.LoadingOverlay("show", {image : "", fontawesome : "fa fa-spinner fa-spin"});
      },
      success: function(response) {
        if (response.code==1) {
          $('select#idfamil').html(response.data);
        }
      },
      complete: function() {
        $.LoadingOverlay("hide");
      }
    });
  }
});

$(document).on('change', '#idfamil', function (e) {
  var idfamilia = parseInt($(this).val());
  idfamilia = (idfamilia>0) ? (idfamilia) : (0);
  
  $('#idsubfa').html('');
  if(idfamilia>0)
  {
    $.ajax({
      url: $('base').attr('href') + 'subfamilia/cbox_subfamilia',
      type: 'POST',
      data: 'id_familia='+idfamilia,
      dataType: "json",
      beforeSend: function() {
        $.LoadingOverlay("show", {image : "", fontawesome : "fa fa-spinner fa-spin"});
      },
      success: function(response) {
        if (response.code==1) {
          $('#idsubfa').html(response.data);
        }
      },
      complete: function() {
        $.LoadingOverlay("hide");
      }
    });
  }
});

function limpcbx()
{
  $('.row .col-xs-12 .control-group select.form-control').val('');
}

$(document).on('focusout', '#descripcion', function (e) {
  var txt = $(this).val();
  if(txt.trim().length){}
  else { $('id_art_sucursal').val('');}
});