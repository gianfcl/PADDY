$( document ).ready(function() {
  $('#filtro').modal('show');
});

$(document).ready(function() {
  var path_url = ($(location).attr('href')).split("/");
  var active_tab = $('.tabs_pan ul li.active').attr('tabs');

  $('#datet1').datetimepicker({
    format: 'DD-MM-YYYY',
    locale: moment.locale('es'),
    defaultDate: moment().startOf('month')
  });

  $('#datet2').datetimepicker({
    format: 'DD-MM-YYYY',
    locale: moment.locale('es'),
    useCurrent: false,
    defaultDate: moment()
  });
  
});
  
$(document).on('click', '.buscar', function () {
  var url_metodo = $(this).attr('url_busc');
  var active_tab = $('.tabs_pan ul li.active').attr('tabs');
  var path_url = ($(location).attr('href')).split("/");
  var fecha_i = ($('#f_inicio').val()) ? $('#f_inicio').val() : null;
  if(fecha_i)
  {
    var fecha_f = ($('#f_fin').val()) ? $('#f_fin').val() : "-";
    var uri = $('base').attr('href') + "evoinvevalxempre/"+url_metodo+"/"+active_tab+"/";
    var buscar = false;

    if (fecha_f) {
      switch(active_tab)
      {
        case 'sucursal':

          var s_idsucursal = ($('#sucursales_busc').val()) ? $('#sucursales_busc').val().join() : "-";
          //s_idsucursal= s_idsucursal.replace(/,/s,"-");
          //$('#graph_barra').html('');
          console.log(s_idsucursal);
          uri = uri+s_idsucursal+"/"+fecha_i+"/"+fecha_f;
          buscar = true;
          var sucursales = ($('#sucursales_busc').val()).join();
          var param = 'fecha_i='+fecha_i+'&fecha_f='+fecha_f+'&sucursales='+sucursales;
          console.log(param); 
          var d = new Array($('#sucursales_busc').val(),fecha_i,fecha_f);
          //console.log(d[0]);
              $.ajax({
                url: $('base').attr('href') + 'evoinvevalxempre/buscar_stock',
                type: 'POST',
                data: param,
                dataType: "json",
                beforeSend: function() {
                  $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
                },
                success: function(response) {
                  if (response.code==1) 
                  {
                    //creargraficabarra(response.data.graf);
                    $('#tabla_v').html(response.data);
                    //console.log(response.data);
                  }
                },
                complete: function() {
                  $.LoadingOverlay("hide");
                  $('#filtro').modal('hide');
                }
              });
        break;
      }
      if(buscar)
      {
        console.log(uri);
        //window.location.replace(uri);
      }
    }
  }
  else
  {
    alerta('Debe llenar todos los campos','no puede estar vacía!!!','error');
  }
});

function creargraficabarra(info)
{
  var barra = new Morris.Bar({
      element: 'graph_barra',
      data: info,
      xkey: 'date',
      ykeys: ['VALOR'],
      labels: ['VALOR'],
      //xLabelFormat: function(d) { return (d.getMonth()+1)+'/'+d.getDate()+'/'+d.getFullYear(); },
      resize: true,
      hideHover: 'always',
      xLabelMargin: 10
    });
}

$("#datet1").on("dp.change", function (e) {
  console.log(e.date);
  if ($('#datet2').data("DateTimePicker")) {
    var d1 = $('#datet1').data("DateTimePicker").date();
    var d2 = $('#datet2').data("DateTimePicker").date();
    diff = d2.diff(d1, 'month');
    console.log(diff);
    if (diff) {
      $('button[url_busc="buscar_det"]').removeClass('hidden');
    }
    else {
      $('button[url_busc="buscar_det"]').addClass('hidden');
    }
    $('#datet2').data("DateTimePicker").minDate(e.date);
  }
});
$("#datet2").on("dp.change", function (e) {
  if ($('#datet2').data("DateTimePicker")) {
    var d1 = $('#datet1').data("DateTimePicker").date();
    var d2 = $('#datet2').data("DateTimePicker").date();
    diff = d2.diff(d1, 'month');
    console.log(diff);
    if (diff) {
      $('button[url_busc="buscar_det"]').removeClass('hidden');
    }
    else {
      $('button[url_busc="buscar_det"]').addClass('hidden');
    }
    $('#datet1').data("DateTimePicker").maxDate(e.date);
  }
});

$("#datet3").on("dp.change", function (e) {
  console.log(e.date);
  if($('#datet4').data("DateTimePicker"))
  {
    $('#datet4').data("DateTimePicker").minDate(e.date);
  }
});
$("#datet4").on("dp.change", function (e) {
  $('#datet3').data("DateTimePicker").maxDate(e.date);
});

$(document).on('click','.limpiar',function(){
  $('#filtro input[type="text"]').val('');
});

$(document).on('click','.open_filtro',function(){

  var active_tab = $('.tabs_pan ul li.active').attr('tabs');

  switch (active_tab)
  {
    case "sucursal":
      
    break;
  }
});

$(document).on('click','.limpiar',function(){

  $('#sucursales_busc').val('');
  $('#almacen_busc').html('');
  $('#grupo_busc').html('');
  $('#familia_busc').html('');

  $('#sucursales_busc').selectpicker('refresh');
  $('#almacen_busc').selectpicker('refresh');
  $('#grupos_busc').selectpicker('refresh');
  $('#familia_busc').selectpicker('refresh');

  $('#datet1').data("DateTimePicker").date(moment().startOf('month'));
  $('#datet2').data("DateTimePicker").date(moment());
});

$(document).on('click','#myTab2 li',function(){
  var id_ = $(this).find('a').prop('id');
  if(id_=="txarticulos")
  {
    $(this).parents('div.modal-dialog').removeClass('modal-sm').addClass('modal-lg');
  }
  else
  {
    $(this).parents('div.modal-dialog').removeClass('modal-lg').addClass('modal-sm');
  }
});
