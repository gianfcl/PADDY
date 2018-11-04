$( document ).ready(function() {
  $('#fecha_inicio').datetimepicker({
    format: 'DD-MM-YYYY',
    locale: moment.locale("es")
  });

  $('#fecha_fin').datetimepicker({
    format: 'DD-MM-YYYY',
    locale: moment.locale("es"),
    useCurrent: false
  });
  
  $("#fecha_inicio").on("dp.change", function (e) { console.log(e.date);
    $('#fecha_fin').data("DateTimePicker").minDate(e.date);
  });

  $("#fecha_inicio").on("dp.show", function (e) {
    $('#fecha_fin input').prop( "disabled", false );
  });  

  $("#fecha_fin").on("dp.change", function (e) {
    $('#fecha_inicio').data("DateTimePicker").maxDate(e.date);
  });

  $.validator.addMethod("formfecha",
    function(value, element) {
      if(value.trim().length)
        return /^(0?[1-9]|[12]\d|3[01])[\.\/\-](0?[1-9]|1[012])[\.\/\-]([12]\d)?(\d\d)$/.test( value );
      else
        return false;
  }, "");

  $('#form_save_reporte').validate({
    rules:
    {
      id_sucursal: { required:true},
      fecha_inicio: { formfecha:true },
      fecha_fin: { formfecha:true },
      id_art_sucursal: { required:true }
    },
    messages: 
    {
      id_sucursal: {required:"Sucursal"},
      fecha_inicio: { formfecha: ""},
      fecha_fin: { formfecha:"" },
      id_art_sucursal: { required:"" }
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
      var temp = '';
      var fechi = $('#fecha_inicioo').val();
      var fechf = $('#fecha_finn').val();

      if(fechi.trim().length)
      {
        temp=temp+'&fechai='+datetoing(fechi);
      }

      if(fechf.trim().length)
      {
        temp=temp+'&fechaf='+datetoing(fechf);
      }
      $('#graph_barra').html('');
      $('#graph_line').html('');
      $.ajax({
        url: $('base').attr('href') + 'opnoplanificadas/buscaropplanificados',
        type: 'POST',
        data: $('#form_save_reporte').serialize()+temp,
        dataType: "json",
        beforeSend: function() {
          $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
        },
        success: function(response) {
          if(response.code == 1)
          {
            $('#articulosalmacenes tbody').html(response.data.html);
            creargraficabarra(response.data.graftot);
            creargraficalinea(response.data.grafnoop);
            TableManageButtons.init();
          }
          $('#filtroreporte').modal('hide');
        },
        complete: function(response) {
          $.LoadingOverlay("hide");
        }
      }); 
    }
  });

  $("#filtroreporte").modal();

  var nombre = "Lista_Articulos";

  var handleDataTableButtons = function() {
    $("#articulosalmacenes").DataTable({
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
      "ordering": false,
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

function creargraficabarra(info)
{
  var barra = new Morris.Bar({
      element: 'graph_barra',
      data: info,
      xkey: 'date',
      ykeys: ['cantidad','por'],
      labels: ['Cantidad','Porcentaje'],
      /*xLabelFormat: function(d) { return (d.getMonth()+1)+'/'+d.getDate()+'/'+d.getFullYear(); },*/
      resize: true,
      hideHover: 'always',
      xLabelMargin: 10,
      stacked:true
    });
}

function creargraficalinea(info)
{
  var linea = new Morris.Line({
    element: 'graph_line',
    data: info,
    xkey: ['date'],
    ykeys: ['cantidad'],
    xLabels:'date',
    labels: ['Cantidad'],
    xLabelFormat: function(d) { return (d.getMonth()+1)+'/'+d.getDate()+'/'+d.getFullYear(); },
    lineColors: ['#26B99A'],
    lineWidth: 2,
    hideHover: 'always',
    resize: true
  });
}

$(document).on('change', '#id_tipo_igv', function (e) {
  var id = parseInt($(this).val());    
  if(id>0)
  {
    var temp = 'id_almacen='+id;
    if($('#idestados').length)
    {
      var idform = ifrome();
      if(idform != "-")
      {
        temp=temp+'&estosesta='+idform;
      }
    }
    buscar(temp);
  }
  else
  {
    $('#articulosalmacenes tabody').html('<h2 class="text-center text-success">No se hay registro</h2>');
  }
});

function buscar(temp)
{
  $.ajax({
    url: $('base').attr('href') + 'stockvscantreqinsu/buscar',
    type: 'POST',
    data: temp,
    dataType: "json",
    beforeSend: function() {
      $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
    },
    success: function(response) {
      $('#articulosalmacenes tbody').html(response.data.html);
    },
    complete: function(response) {
      $.LoadingOverlay("hide");
    }
  });
}

$('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
  var target = $(e.target).attr("href") // activated tab
  switch (target) {
    case "#tab_content1":
      barra.redraw();
      $(window).trigger('resize');
      break;
    case "#tab_content2":
      linea.redraw();
      $(window).trigger('resize');
      break;
  }
});