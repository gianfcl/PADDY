$(document).ready(function() {
  var path_url = ($(location).attr('href')).split("/");
  var active_tab = $('.tabs_pan ul li.active').attr('tabs');
  console.log("----" + path_url);

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


  console.log(path_url[4]);
    console.log(path_url[6]);
      console.log(path_url[5]);

 if((path_url[5]) != "reportexdias")
  {
   
   $('.open_filtro').trigger('click');  
  }



 
  
});

  

$(document).on('click', '.buscar', function () {
  var fecha_i = ($('#f_inicio').val()) ? $('#f_inicio').val() : null;

  if(fecha_i)
  {
    var fecha_f = ($('#f_fin').val()) ? $('#f_fin').val() : "-";
    var uri = $('base').attr('href') + "comercial/reportexdias";
       
        uri = uri+"/"+fecha_i+"/"+fecha_f;
        console.log(uri);
       
    
    
    
    
         window.location.replace(uri);
     
  }
  else
  {
    alerta('La fecha de Inicio','no puede estar vacía!!!','error');
  }
});






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



$(document).on('click','.open_filtro',function(){

  var active_tab = $('.tabs_pan ul li.active').attr('tabs');

  switch (active_tab)
  {
    case "grupo":
      $('div.familia').addClass('hidden');
      $('div.subfamilia').addClass('hidden');
    break;
    case "familia":
      $('div.subfamilia').addClass('hidden');
    break;
  }
});



//implementacaion de cargar el combo box cuando cambia
$(document).on('change','#familia_busc',function(){
  var active_tab = $('.tabs_pan ul li.active').attr('tabs');
  console.log(active_tab);
  if(active_tab !== 'familia' && active_tab !== 'grupo')
  {
    var ids = $(this).val();
    console.log(ids);

    $.ajax({
      url: $('base').attr('href') + 'comprasxarticulo/buscar_subfamxfam',
      type: 'POST',
      data: 'id_familia='+ids,
      dataType: "json",
      beforeSend: function() {
        $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
      },
      success: function(response) {
        if (response.code==1) 
        {
          $('#subfamilia_busc').html(response.data);
          $('#subfamilia_busc').selectpicker('refresh');
        }
      },
      complete: function() {
        $.LoadingOverlay("hide");
      }
    });
  }
});

$(document).on('click','.limpiar',function(){


  $('#grupos_busc').val('');
  $('#familia_busc').html('');
  $('#subfamilia_busc').html('');

  $('#grupos_busc').selectpicker('refresh');
  $('#familia_busc').selectpicker('refresh');
  $('#subfamilia_busc').selectpicker('refresh');

  $('#datet1').data("DateTimePicker").date(moment().startOf('month'));
  $('#datet2').data("DateTimePicker").date(moment());
});


//genera grafico
$(document).on('click','.gen_graf',function(){
  var active_tab = $('.tabs_pan ul li.active').attr('tabs');
  var path_ = ($(location).attr('href')).split("/"); 
  var param = "tab="+active_tab;
  console.log(path_);

  switch(active_tab)
  {
    case  'grupo':
      var g_idgrupo = path_[7];
      var g_fini = path_[8];
      var g_ffin = path_[9];

      g_idgrupo = (g_idgrupo == "-") ? null : g_idgrupo;
      g_fini = (g_fini == "-") ? null : g_fini;
      g_ffin = (g_ffin == "-") ? null : g_ffin;

      param = param + '&g_idgrupo='+g_idgrupo+'&g_fini='+g_fini+'&g_ffin='+g_ffin;
    break;
    case 'familia':
      var f_idgrupo = path_[10];
      var f_idfamilia = path_[11];
      var f_fini = path_[12];
      var f_ffin = path_[13];

      f_idgrupo = (f_idgrupo == "-") ? null : f_idgrupo;
      f_idfamilia = (f_idfamilia == "-") ? null : f_idfamilia;
      f_fini = (f_fini == "-") ? null : f_fini;
      f_ffin = (f_ffin == "-") ? null : f_ffin;

      param = param + '&f_idgrupo='+f_idgrupo+'&f_idfamilia='+f_idfamilia+'&f_fini='+f_fini+'&f_ffin='+f_ffin;
    break;
    case 'subfamilia':
      var s_idgrupo = path_[14];
      var s_idfamilia = path_[15];
      var s_idsubfamilia= path_[16];
      var s_fini = path_[17];
      var s_ffin = path_[18];

      s_idgrupo = (s_idgrupo == "-") ? null : s_idgrupo;
      s_idfamilia = (s_idfamilia == "-") ? null : s_idfamilia;
      s_idsubfamilia = (s_idsubfamilia == "-") ? null : s_idsubfamilia;
      s_fini = (s_fini == "-") ? null : s_fini;
      s_ffin = (s_ffin == "-") ? null : s_ffin;

      param = param + '&s_idgrupo='+s_idgrupo+'&s_idfamilia='+s_idfamilia+'&s_idsubfamilia='+s_idsubfamilia+'&s_fini='+s_fini+'&s_ffin='+s_ffin;
    break;
    case 'articulo':
      var a_idarticulo = path_[20];
      var a_idsubfamilia = path_[21];
      var a_fini = path_[22];
      var a_ffin = path_[23];

      a_idarticulo = (a_idarticulo == "-") ? null : a_idarticulo;
      a_idsubfamilia = (a_idsubfamilia == "-") ? null : a_idsubfamilia;
      a_fini = (a_fini == "-") ? null : a_fini;
      a_ffin = (a_ffin == "-") ? null : a_ffin;

      param = param + '&a_idarticulo='+a_idarticulo+'&a_idsubfamilia='+a_idsubfamilia+'&a_fini='+a_fini+'&a_ffin='+a_ffin;
    break;
  }

  $.ajax({
    url: $('base').attr('href') + 'ventaxarticulo/gen_graph',
    type: 'POST',
    data: param,
    dataType: "json",
    beforeSend: function() {
      $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
    },
    success: function(response) {
      if (response.code==1) 
      {
      
        var label = [] , data = [], bckgroundC = [];

        for (var i = 0; i < response.data.data.length; i++) 
        {
          bckgroundC.push(getRandomColor());
          switch(active_tab)
          {
            case 'grupo':
              label.push(response.data.data[i].grupo);
            break;
            case 'familia':
              label.push(response.data.data[i].familia);
            break;
            case 'subfamilia':
              label.push(response.data.data[i].subfamilia);
            break;
            case 'articulo':
              label.push(response.data.data[i].descripcion);
            break;
          }
          data.push(parseFloat(response.data.data[i].compras_totales));
          if(isNaN(data[data.length-1]))
          {
            data.splice(-1,1);
            label.splice(-1,1);
            bckgroundC.splice(-1,1);
          }
        }
        
        var div = $('#chart');
        var graph = new Chart(div,{
          type:'horizontalBar',
          data:{
            labels: label,
            datasets:[{
              label: 'Reporte de Ventas ',
              data: data,
              backgroundColor : bckgroundC
            }]
          },
          options: {
              scales: {
                  yAxes: [{
                      ticks: {
                          beginAtZero:true
                      }
                  }]
              },
          }
        });
      }
    },
    complete: function() {
      $.LoadingOverlay("hide");
    }
  });
});

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}





