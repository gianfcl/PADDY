$( document ).ready(function() {
  $(".select2_multiple").select2({
    maximumSelectionLength: 6,
    placeholder: "Estados",
    allowClear: true
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
  });

  $("#fecha_inicio").on("dp.show", function (e) {
    $('#fecha_fin input').prop( "disabled", false );
  });  

  $("#fecha_fin").on("dp.change", function (e) {
    $('#fecha_inicio').data("DateTimePicker").maxDate(e.date);
  });

  $("#filtroreporte").modal();

  $('#form_save_reporte').validate({
    rules:
    {
      id_tipo_igv: { required:true}
    },
    messages: 
    {
      id_tipo_igv: {required:"Sucursal"}
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
      var temp = $('#form_save_reporte').serialize();
      var fi = $('#fecha_inin').val();
      var ff = $('#fecha_finn').val();
      var alma  = $( "#id_tipo_igv option:selected" ).text();
      $('#detfiltro').html(alma);
      if(fi.trim().length)
      {
        temp=temp+'&fechai='+datetoing(fi);
      }
      if(ff.trim().length)
      {
        temp=temp+'&fechaf='+datetoing(ff);
      }
      if($('#idestados').length)
      {
        var idform = ifrome();
        if(idform != "-")
        {
          temp=temp+'&estosesta='+idform;
        }
      }
      buscar(temp)
    }
  });


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

/*$(document).on('change', '#id_tipo_igv', function (e) {
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
});*/

function buscar(temp)
{
  var cant = $('#articulosalmacenes thead tr td').length;
  var hx = '';
  const urlx = $('base').attr('href')+"stockvscantreqinsu"
  $.ajax({
    url: $('base').attr('href') + 'stockvscantreqinsu/buscar',
    type: 'POST',
    data: temp,
    dataType: "json",
    beforeSend: function() {
      $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
    },
    success: function(response) {
      if(response.code == 1){
        $('#articulosalmacenes tbody').html(response.data.html);
        TableManageButtons.init();      
      }
      else
      {
        //$('#articulosalmacenes tbody').html('<tr><td colspan="'+cant+'"><h2 class="text-center text-success">No se hay registro</h2><td></tr>');
        swal.queue([{
          title: 'No hay registro',
          confirmButtonText: 'Actualizar F5',
          text:'Buscar de Nuevo',
          showLoaderOnConfirm: true,
          allowOutsideClick: false,
          preConfirm: () => {
            window.location.href = urlx;
          }
        }])
      }
      $("#filtroreporte").modal('hide');
    },
    complete: function(response) {
      $.LoadingOverlay("hide");
    }
  });
}

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
          //showLoader();
      },
      success: function(response) {
        if (response.code==1) { console.log(response.data)
          $('select#idfamil').html(response.data);
        }
      },
      complete: function() {
        //hideLoader();
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
          //showLoader();
      },
      success: function(response) {
        if (response.code==1) {
          $('#idsubfa').html(response.data);
        }
      },
      complete: function() {
        //hideLoader();
      }
    });
  }
});

$(document).on('focusout', '#descripcion', function (e) {
  var txt = $(this).val();
  if(txt.trim().length){}
  else { $('id_art_sucursal').val('');}
});