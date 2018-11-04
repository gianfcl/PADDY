$( document ).ready(function() {

  jQuery.validator.setDefaults({
    debug: true,
    success: "valid",
    ignore: ""
  });

  $(".select2_multiple").select2({
    maximumSelectionLength: 6,
    placeholder: "Tipo Movimiento",
    allowClear: true
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
      id_almacen: { required:true},
      id_personal: { required:true},
      fecha_inicio: { formfecha:true },
      fecha_fin: { formfecha:true },
      mes_inicio: { formmes:true },
      mes_fin: { formmes:true }
    },
    messages: 
    {
      id_almacen: {required:"Sucursal"},
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
      var desc = $('#descripcion').val();
      var iarti = parseInt($('#id_art_sucursal').val());
      iarti = iarti > 0 ? iarti : 0;

      var info = 'Sucursal->'+$('#id_almacen option:selected').text();

      if($('#idtipomov').length)
      {
        var idform = ifrome();
        if(idform != "-")
        {
          temp=temp+'&tipomov='+idform;
          info = info+' - Tipo Mov ('+$('#idtipomov  option:selected').text()+')';
        }
      }

      var idgrupo = parseInt($('#idgrupo').val());
      idgrupo = idgrupo > 0 ? idgrupo : 0;
      if(idgrupo >0)
      {
        info = info+' Grupo->'+$('#idgrupo option:selected').text()
      }
      var idfamil = parseInt($('#idfamil').val());
      idfamil = idfamil > 0 ? idfamil : 0;
      if(idfamil >0)
      {
        info = info+' - Familia->'+$('#idfamil option:selected').text()
      }
      var idsubfa = parseInt($('#idsubfa').val());
      idsubfa = idsubfa > 0 ? idsubfa : 0;
      if(idsubfa >0)
      {
        info = info+' - SubFamilia->'+$('#idsubfa option:selected').text()
      }

      if(desc.trim().length && iarti>0)
      {
        info=info+' - Descripción->'+desc;
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
          if(tipo == 3)
          {
            $('#'+id).attr({'nufech':va});
          }
        }

      });
      
      //alert(i)
      if(i == 3)
      {
        $('#detfiltro').html(info);
        $.ajax({
          url: $('base').attr('href') + 'evolucionsalalmartdia/buscar',
          type: 'POST',
          data: $('#form_save_reporte').serialize()+temp,
          dataType: "json",
          beforeSend: function() {
            $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
          },
          success: function(response) {
            $('#inforta').html(response.data.cant);
            $('#filtroreporte').modal('hide');
            TableManageButtons.init();
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

  var nombre = "Lista_Articulos";

  var handleDataTableButtons = function() {
    $("#datatable-buttons").DataTable({
      fixedHeader: true,
      dom: "Bfrtip",
      buttons: [
        {
          extend: "copy",
          className: "btn-sm"
        },
        {
          extend: "excel",
          className: "btn-sm",
          filename: nombre
        },
        {
          extend: "pdfHtml5",
          className: "btn-sm",
          filename: nombre,
          pageSize: 'A4'
        },
        {
          extend: "print",
          className: "btn-sm",
          text: 'Imprimir',
          autoPrint: true,
          orientation: 'landscape',
          pageSize: 'A4'
        }
      ],
      paging: false,
      "ordering": true,
      "searching": false,
      "autoWidth": false
    });
  };
  TableManageButtons = function() {
    "use strict";
    return {
      init: function() {
        handleDataTableButtons();
      }
    };
  }();

});

$(document).on('click', '.clickdescrip', function (e) {
  var i = 0;
  var alma = $('#id_tipo_igv option:selected').text();
  var id = '';
  var v_u = '';
  var tipo = parseInt($('#mitab li.active a').attr('tipo'));
  var desc = $(this).html();
  var umb = $(this).parents('tr').find('td.umb').html();
  if(tipo >0) i++;
  var temp = '&tipo='+tipo+'&vergraf=1';
  var fechi = $('#fecha_inicioo').val();
  var fechf = $('#fecha_finn').val();
  
  var idaxt = parseInt($(this).attr('idaxt'));
  idaxt = idaxt > 0 ? idaxt : 0;
  temp = temp+"&id_art_graf="+idaxt;
  if($('#idtipomov').length)
  {
    var idform = ifrome();
    if(idform != "-")
    {
      temp=temp+'&tipomov='+idform;
    }
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

  $.each($('#tab_contente'+tipo+' '+inp+'.cuenvalid'), function(ky, vv) {
    va = $(this).val();
    if(va.trim().length)
      i++;
    id = $(this).attr('id');
    if(tipo == 2)
    {          
      v_u = $('#'+id+' option:selected').text();
      temp = temp+'&'+id+'e='+v_u;
    }
    else
    {
      if(tipo == 3)
      {
        $('#'+id).attr({'nufech':va});
      }
    }

  });
  
  //alert(i+' -- '+temp)
  if(i == 3)
  {
    var textos = 'x Mes';
    $('#graph_line').html('');
    $.ajax({
      url: $('base').attr('href') + 'evolucionsalalmartdia/buscar',
      type: 'POST',
      data: $('#form_save_reporte').serialize()+temp,
      dataType: "json",
      beforeSend: function() {
        $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
      },
      success: function(response) {
        switch(parseInt(response.data.tipo))
        {
          case 1:
              creargraficames(response.data.graf);
          break;

          case 2:
              textos = 'x Semana';
              creargraficasemana(response.data.graf);
          break;

          case 3:
              textos = 'x Día';
              creargraficadia(response.data.graf);
          break;

          default:
          break;
        }
        $('#verdocu').html(alma+' '+textos+':');
        $('#infodesc').html(desc+' ('+umb+')');
      },
      complete: function(response) {
        $.LoadingOverlay("hide");
      }
    });
  }
});

function creargraficames(info)
{
  var IndexToMonth = [ "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ]; 
  new Morris.Line({
    element: 'graph_line',
    data: info,
    xkey: ['date'],
    ykeys: ['costo'],
    xLabels:['date'],
    labels: ['Costo'],
    xLabelFormat: function(d) { return IndexToMonth[ d.getMonth() ]+' '+d.getFullYear(); },
    lineColors: ['#26B99A'],
    lineWidth: 2,
    resize: true,
    dateFormat: function(date) {
      d = new Date(date);
      return IndexToMonth[ d.getMonth() ]+' '+d.getFullYear();
    }
  });
}

function creargraficasemana(info)
{  
  new Morris.Line({
    element: 'graph_line',
    data: info,
    xkey: ['date'],
    ykeys: ['costo'],
    xLabels:['date'],
    labels: ['Costo'],
    xLabelFormat: function(d) { return 'S '+moment(d).week()},
    lineColors: ['#26B99A'],
    lineWidth: 2,
    resize: true,
    dateFormat: function(date) {
      d = new Date(date);
      return 'S '+moment(d).week();
    }
  });
}

function creargraficadia(info)
{
  var weekdays = ["Dom", "Lu", "Mar", "Mie", "Jue", "Vie", "Sab"]; var IndexToMonth = [ "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ]; 
  new Morris.Line({
    element: 'graph_line',
    data: info,
    xkey: ['date'],
    ykeys: ['costo'],
    xLabels:'date',
    labels: ['Costo'],
    xLabelFormat: function(d) { return d.getDate()+' '+IndexToMonth[ d.getMonth() ]+' '+weekdays[d.getDay()]; },
    lineColors: ['#26B99A'],
    lineWidth: 2,
    resize: true,
    dateFormat: function(date) {
      d = new Date(date);
      return d.getDate()+' '+IndexToMonth[ d.getMonth() ]+' '+weekdays[d.getDay()];
    }
  });
}

$('#mitab li a').on('shown.bs.tab', function (e) {
  $('#mytabContent div.tab-pane div.form-group input[type=text]').not('#anio_inicio').val('');
  var target = $(e.target).attr("href");
  if(target=="#tab_contente3")
  {
    var fi = $('#fecha_inicioo').attr('nufech');
    var ff = $('#fecha_finn').attr('nufech');
    $('#fecha_inicioo').val(fi);
    $('#fecha_finn').val(ff);
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
  else { $('#id_art_sucursal').val('');}
});