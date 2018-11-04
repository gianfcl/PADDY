$( document ).ready(function() {

  $('#filtro').modal('show');
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

$("#datet1").on("dp.change", function (e) {
  console.log(e.date);
  if($('#datet2').data("DateTimePicker"))
  {
    $('#datet2').data("DateTimePicker").minDate(e.date);
  }
});
$("#datet2").on("dp.change", function (e) {
  $('#datet1').data("DateTimePicker").maxDate(e.date);
});


$(document).on('click','.buscar',function(){
  buscar_articulos();
});

function buscar_articulos()
{ 
  var temp = "";
  var fecha_ini = $('#f_inicio').val();
  var fecha_fin = $('#f_fin').val();
  if(fecha_ini)
  {
    temp = temp + "&fecha_ini="+fecha_ini;
  }
  if(fecha_fin)
  {
    temp = temp + "&fecha_fin="+fecha_fin;
  }


  $.ajax({
    url: $('base').attr('href') + 'evocostonetoajustes/buscar_registros',
    type: 'POST',
    data: temp,
    dataType: "json",
    beforeSend: function() {
      $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
    },
    success: function(response) {
      if (response.code==1) 
      { 
        $('#filtro').modal('hide');
        var r = response.data;
        var label = [] , data_main = [];
        $.each(r, function(i, item) {
          data_main.push(item);
          label.push(i);
        });

        var data_sets = [
              {
                  label: 'Costo de Ajustes de Inventario',
                  data: data_main,
                  backgroundColor: "rgba(55, 160, 225, 0.7)",
                  hoverBackgroundColor: "rgba(55, 160, 225, 0.7)",
                  hoverBorderWidth: 2,
                  hoverBorderColor: 'lightgrey'
              },
          ];

        var bar_ctx = document.getElementById('myChart');
        var bar_chart = new Chart(bar_ctx, {
            type: 'bar',
            data: {
                labels: label,
                datasets: data_sets,
            },
            options: {
                animation: {
                  duration: 10,
                },
                tooltips: {
                  mode: 'label',
                  callbacks: {
                  label: function(tooltipItem, data) { 
                    return data.datasets[tooltipItem.datasetIndex].label + ": S/." + tooltipItem.yLabel;
                  }
                  }
                 },
                scales: {
                  xAxes: [{ 
                    gridLines: { display: false },
                    }]
                }, // scales
                legend: {display: true}
            } // options
           }
        );
        console.log(bar_chart.data);
      }
    },
    complete: function() {
      $.LoadingOverlay("hide");
    }
  });
}

var numberWithCommas = function(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
