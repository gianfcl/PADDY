$( document ).ready(function() {
  $('#motivo_busc option').each(function(index,value,){
    if($(this).val()>0)
    {
      $(this).prop('selected',true);
    }
  });
  var path_url = ($(location).attr('href')).split("/");
  if(path_url[4]=="evocostoajustes")
  {
    $('div.modal-footer div.row button.buscar').removeClass('buscar').addClass('buscar_evo');
  }
  else
  {
    if(path_url[4]=="evocostonetoajustes")
    {
      $('div.modal-footer div.row button.buscar').removeClass('buscar').addClass('buscar_evoneto');
    }
  }

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

  $('#datet3').datetimepicker({
    format: 'DD-MM-YYYY',
    locale: moment.locale('es'),
    useCurrent: false,
    defaultDate: moment().startOf('month')
  });

  $('#datet4').datetimepicker({
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

//$('#motivo_busc option').prop('selected',true);

$(document).on('change','#grupos_busc',function(){
  var id = $(this).val();
  $("#familia_busc").html('');
  $("#subfamilia_busc").html('');
  if(id>0)
  {
    
    $.ajax({
      url: $('base').attr('href') + 'familia/cbx_familia',
      type: 'POST',
      data: 'id_grupo='+id,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
          if (response.code==1) {
            
            $("#familia_busc").html(response.data);
          }
      },
      complete: function() {
          //hideLoader();
      }
    });
  }
});

$(document).on('change','#familia_busc',function(){
  var id = $(this).val();
  $("#subfamilia_busc").html('');
  if(id>0)
  {
    $.ajax({
      url: $('base').attr('href') + 'subfamilia/cbox_subfamilia',
      type: 'POST',
      data: 'id_familia='+id,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
        if (response.code==1) {
          $("#subfamilia_busc").html(response.data);
        }
      },
      complete: function() {
          //hideLoader();
      }
    });
  }
});

$(document).on('click','.buscar',function(){
  var path_url = ($(location).attr('href')).split("/");
  console.log(path_url);
  if($('#almacen_busc').val())
  {
    var proced = true;
    var active_tab = $('#myTab li.active').attr('tabs');
    var active_tab2 = $('#myTab2 li.active').attr('tabs');

    console.log(active_tab);
    console.log(active_tab2);
    var data = "data="+active_tab;
    
    var id_almacen = $('#almacen_busc').val();
    var id_motivo = $('#motivo_busc').val();
    var null_values = $('#null_values').is(':checked')
    var id_tipomov = $('#tipomov_busc').val();

    if(null_values==true)
    {
      data = data + "&null_values="+null_values;
    }
    data = data + "&id_almacen="+id_almacen;
    if(id_motivo)
    {
      data = data +"&id_motivo="+id_motivo;
    }
    if(id_tipomov)
    {
      data = data +"&id_tipomov="+id_tipomov;
    }

    switch(active_tab2)
    {
      case 'xfechaingreso':
        var fechaingreso_i = $('#f_inicio').val();
        var fechaingreso_h = $('#f_fin').val();

        if(fechaingreso_i)
        {
          data = data + "&fechaingreso_i="+fechaingreso_i;
        }
        if(fechaingreso_h)
        {
          data = data + "&fechaingreso_h="+fechaingreso_h;
        }

      break;
      case 'xfechacreado':
        var fechacreado_i = $('#f_inicio_2').val();
        var fechacreado_h = $('#f_fin_2').val();

        if(fechacreado_i)
        {
          data = data + "&fechacreado_i="+fechacreado_i;
        }
        if(fechacreado_h)
        {
          data = data + "&fechacreado_h="+fechacreado_h;
        }
      break;
    }

    switch(active_tab)
    {
      case 'xgrupos':

        var id_grupo = $('#grupos_busc').val();
        var id_familia = $('#familia_busc').val();
        var id_subfamilia = $('#subfamilia_busc').val();
        var id_zona = $('#zona_busc').val();
        var id_area = $('#area_busc').val();
        var id_ubicacion = $('#ubicacion_busc').val();
        var id_frecuencia =$('#frecuencia_busc').val();

        if(parseInt(id_frecuencia)>0)
        {
           data = data + "&id_frecuencia="+id_frecuencia;
        }
        if(parseInt(id_zona)>0)
        {
           data = data + "&id_zona="+id_zona;
        }
        if(parseInt(id_area)>0)
        {
           data = data + "&id_area="+id_area;
        }
        if(parseInt(id_ubicacion)>0)
        {
           data = data + "&id_ubicacion="+id_ubicacion;
        }
        if(parseInt(id_subfamilia)>0)
        {
           data = data + "&id_subfamilia="+id_subfamilia;
        }
        if(parseInt(id_familia)>0)
        {
           data = data + "&id_familia="+id_familia;
        }
        if(parseInt(id_grupo)>0)
        {
           data = data + "&id_grupo="+id_grupo;
        }
      break;

      case 'xarticulos':
        var i = new Array();
        $('table#list_artselected tr.arti_select').each(function(index,value){
          i.push($(this).attr('id_art_sucu'));
        })

        if(i.length>0)
        {
          var i2 = i.join();
        
          data = data + "&id_arti_sucu="+i2;
        }
        else
        {
          alerta('Error!','No ha seleccionado artículos!!','error');
          proced = false;
        }
      break;
    }

    if(proced==true)
    {
      $.ajax({
        url: $('base').attr('href') +path_url[4]+'/buscar_registros',
        type: 'POST',
        data: data,
        dataType: "json",
        beforeSend: function() {
          $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
        },
        success: function(response) {
          if (response.code==1) 
          {
            $('#table').html(response.data);
            $('#filtro').modal('hide');
          }
          else
          {
            alerta('No se encontraron datos! ','Revise sus filtros.','info');
          }
        },
        complete: function() {
          $.LoadingOverlay("hide");
        }
      });
    }
  }
  else
  {
    alerta('Error!','Seleccione Almacen','error');
  }
});

$(document).on('click','.limpiar',function(){

  var active_tab = $('#myTab li.active').attr('tabs');
  var active_tab2 = $('#myTab2 li.active').attr('tabs');
  $('#almacen_busc').val('');
  $('#almacen_busc').selectpicker('refresh');
  $('#f_fin').val('');
  $('#f_inicio').val('');
  switch(active_tab)
  {
    case 'xgrupos':
      $('#grupos_busc').val('');
      $('#familia_busc').html('');
      $('#subfamilia_busc').html('');
      $('#zona_busc').val('');
      $('#area_busc').html('');
      $('#ubicacion_busc').html('');
    break;
    case 'xarticulos':
      $('#list_artselected tbody').html("<tr class='default_tr'><td colspan='5'><h2 class='text-center text-success'>No agregó artículos</h2></td></tr>");
      buscar_articulos(0);
    break;
  }

  switch(active_tab2)
  {
    case 'xfechaingreso':
      $('#f_inicio').val('');
      $('#f_fin').val('');
    break;
    case 'xfechacreado':
      $('#almacen_busc').val('');
      $('#motivo_busc').val('');
    break;
  }
});

$(document).on('click', 'div ul#myTab li[tabs="xarticulos"]',function(){
  buscar_articulos(0);
});

function buscar_articulos(page)
{
  var id_almacen =$('#almacen_busc').val();
  if(id_almacen)
  {  
    var temp = 'page='+page;
    var codigo_busc = $('#codigo_busc2').val();
    var descripcion_busc = $('#descripcion_busc2').val();
    var grupo_busc = $('#grupo_busc2').val();
    var familia_busc = $('#familia_busc2').val();
    var subfamilia_busc = $('#subfamilia_busc2').val();
    var um_busc = $('#um_busc2').val();
    var temp = "page="+page+"&para_compras=false&id_almacen="+id_almacen;

    var i = new Array();
    var c = 0;
    $('table#list_artselected tr.arti_select').each(function(index,value){
      c++;
      i.push($(this).attr('id_art_sucu'));
    })

    var i2 = (!isNaN(parseInt(c)) && i.length>0) ? i.join() : null;

    if(codigo_busc.trim().length)
    {
      temp=temp+'&codigo_busc='+codigo_busc; console.log(codigo_busc);
    }
    if(descripcion_busc.trim().length)
    {
      temp=temp+'&descripcion_busc='+descripcion_busc; console.log(descripcion_busc);
    }
    if(parseInt(grupo_busc)>0)
    {
      temp=temp+'&grupo_busc='+grupo_busc;
    }
    if(parseInt(familia_busc)>0)
    {
      temp=temp+'&familia_busc='+familia_busc;
    }
    if(parseInt(subfamilia_busc)>0)
    {
      temp=temp+'&subfamilia_busc='+subfamilia_busc;
    }
    if(parseInt(um_busc)>0)
    {
      temp=temp+'&um_busc='+um_busc;
    }
    if(i2)
    {
      temp=temp +'&w_not='+i2;
    }

    $.ajax({
      url: $('base').attr('href') + 'comprasxarticulo/buscar_articulos',
      type: 'POST',
      data: temp,
      dataType: "json",
      beforeSend: function() {
        $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
      },
      success: function(response) {
        if (response.code==1) 
        {
          var r = response.data;
          $('table#buscar_arti tbody').html(r.table);
          $('#pagina_data_buscar').html(r.paginacion);
        }
      },
      complete: function() {
        $.LoadingOverlay("hide");
      }
    });
  }
  else
  {
    alerta('Debe Seleccionar ','un almacen!!!','info');
  }
}

$(document).on('click', 'li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  buscar_articulos(page);
});

$(document).on('click', 'a.paginate_button', function (e) {  
  var page = $(this).attr('tabindex');
  buscar_articulos(page);
});

$(document).on('click','.buscar2',function(){
  buscar_articulos(0);
});

$(document).on('click','.add_arti',function(){
  var padre = $(this).parents('tr');

  var id_art_sucu = padre.attr('idartsucursal');
  var id_grupo = padre.attr('idgrupo');
  var id_familia = padre.attr('idfamilia');
  var id_subfamilia = padre.attr('idsubfamilia');
  var cod = padre.find('td.codigo').text();
  var subfamilia = padre.find('td.subfamilia').text();
  var desc = padre.find('td.descrip').text();
  var um_base = padre.find('td.um_base').text();
  var btn = "";

  var tr = "<tr class = 'arti_select' id_art_sucu="+id_art_sucu+" id_grupo="+id_grupo+" id_familia="+id_familia+" id_subfamilia="+id_subfamilia+">";
  tr += "<td>"+cod+"</td>";
  tr += "<td>"+subfamilia+"</td>";
  tr += "<td>"+desc+"</td>";
  tr += "<td>"+um_base+"</td>";
  tr += "<td><a class='btn btn-danger btn-xs delete_arti' href='javascript:void(0);'><i aria-hidden='true' class='fa fa-trash'></i> Eliminar</a></td>";
  tr += "</tr>";

  $('#list_artselected tbody .default_tr').remove();
  $('#list_artselected tbody').append(tr);

  buscar_articulos(0);
});

$(document).on('click','.delete_arti',function(){
  $(this).parents('tr').remove();
  buscar_articulos(0);
});

$(document).on('change','#grupo_busc2',function(){
  var id_grupo = $(this).val();

  $.ajax({
    url: $('base').attr('href') + 'reportecompras/combox_familia',
    type: 'POST',
    data: 'id_grupo='+id_grupo,
    dataType: "json",
    beforeSend: function() {
      //showLoader();
    },
    success: function(response) {
      if (response.code==1) 
      {
        $('#familia_busc2').html(response.data);
      }
    },
    complete: function() {
        //hideLoader();
    }
  }); 
});

$(document).on('change','#familia_busc2',function(){
  var id_familia = $(this).val();

  $.ajax({
    url: $('base').attr('href') + 'reportecompras/combox_subfamilia',
    type: 'POST',
    data: 'id_familia='+id_familia,
    dataType: "json",
    beforeSend: function() {
      //showLoader();
    },
    success: function(response) {
      if (response.code==1) 
      {
        $('#subfamilia_busc2').html(response.data);
      }
    },
    complete: function() {
        //hideLoader();
    }
  }); 
});

$(document).on('click', '.limpiarfiltro2', function (e) {
  
  $(this).parents('tr').find('input[type=text]').val('');
  $(this).parents('tr').find('#grupo_busc2').val('');
  $(this).parents('tr').find('#familia_busc2').html('');
  $(this).parents('tr').find('#subfamilia_busc2').html('');
  $(this).parents('tr').find('#um_busc2').val('');

  buscar_articulos(0);
});

$(document).on('change','#zona_busc',function(){
  var id_zona = $(this).val();
  $('#area_busc').html('');
  $('#ubicacion_busc').html('');
  if(id_zona)
  {
    $.ajax({
      url: $('base').attr('href') + 'evoxajusteunid/cbx_area',
      type: 'POST',
      data: 'id_zona='+id_zona,
      dataType: "json",
      beforeSend: function() {
        //showLoader();
      },
      success: function(response) {
        if (response.code==1) 
        {
          $('#area_busc').html(response.data);
        }
      },
      complete: function() {

      }
    }); 
  }
});

$(document).on('change','#area_busc',function(){
  var id_area = $(this).val();
  $('#ubicacion_busc').html('');
  if(id_area)
  {
    $.ajax({
      url: $('base').attr('href') + 'evoxajusteunid/cbx_ubi',
      type: 'POST',
      data: 'id_area='+id_area,
      dataType: "json",
      beforeSend: function() {

      },
      success: function(response) {
        if (response.code==1) 
        {
          $('#ubicacion_busc').html(response.data);
        }
      },
      complete: function() {

      }
    }); 
  }
});

$(document).on('change','#almacen_busc',function(){
  active_tab = $('div ul#myTab li.active').attr('tabs');
  console.log(active_tab);
  if(active_tab=="xarticulos")
  {
    $('#buscar_arti tbody').html('');
    $('#pagina_data_buscar').html('');
    buscar_articulos(0);
  }
});

$(document).on('click','.open_modal',function(){
  var padre = $(this).parents('td');
  $('#body_modal').html("");
  padre.children('td input').each(function(index,value,){
    var t = $(this);
    var id_tipomov = t.attr('tipo_mov');
    var txt_tipomov = (id_tipomov==18) ? "ingresoxajusteinvent" : "salidaxajusteinvent";
    var cantidad =(id_tipomov==18) ? t.attr('cant'): "-"+t.attr('cant');
    var id_documento = t.val();
    var url_ = $('base').attr('href')+txt_tipomov+"/ver_documento/"+id_documento;
    var btn = "<a href='"+url_+"' class='btn btn-info btn-xs' target='_blank'><i class='fa fa-eye'></i></a>";
    var class_ = (id_tipomov==18) ?  "": "text-danger";

    var txt_insert ="<tr><td><span class='pull-right "+class_+"'>"+cantidad+"</span></td>";
    txt_insert += "<td style='text-align: center;'>"+txt_tipomov+"</td>";
    txt_insert += "<td style='text-align: center;''>"+btn+"</td></tr>";
    console.log(txt_insert);
    $('#body_modal').append(txt_insert); 
  });
});

$(document).on('click','.open_modal2',function(){
  var padre = $(this).parents('td');
  padre.children('td input').each(function(index,value,){
    var t = $(this);
    var id_tipomov = t.attr('tipo_mov');
    var txt_tipomov = (id_tipomov==18) ? "ingresoxajusteinvent" : "salidaxajusteinvent";
    var cantidad =(id_tipomov==18) ? t.attr('cant'): "-"+t.attr('cant');
    var id_documento = t.val();
    var url_ = $('base').attr('href')+txt_tipomov+"/ver_documento/"+id_documento;
    var btn = "<a href='"+url_+"' class='btn btn-info btn-xs' target='_blank'><i class='fa fa-eye'></i></a>";
    var class_ = (id_tipomov==18) ?  "": "text-danger";

    var txt_insert ="<tr><td><span class='pull-left "+class_+"'><b><i>S/.</i></b></span><span class='pull-right "+class_+"'>"+cantidad+"</span></td>";
    txt_insert += "<td style='text-align: center;'>"+txt_tipomov+"</td>";
    txt_insert += "<td style='text-align: center;''>"+btn+"</td></tr>";
    console.log(txt_insert);
    $('#body_modal').append(txt_insert); 
  });
});

$(document).on('click','.buscar_evo',function(){
  buscar_articulos_evoneto();
});

function buscar_articulos_evoneto()
{ 
  if($('#almacen_busc').val())
  {
    var proced = true;
    var active_tab = $('#myTab li.active').attr('tabs');
    var active_tab2 = $('#myTab2 li.active').attr('tabs');

    console.log(active_tab);
    console.log(active_tab2);
    var data = "data="+active_tab;
    
    var id_almacen = $('#almacen_busc').val();
    var id_motivo = $('#motivo_busc').val();
    var null_values = $('#null_values').is(':checked')
    var id_tipomov = $('#tipomov_busc').val();

    if(null_values==true)
    {
      data = data + "&null_values="+null_values;
    }
    data = data + "&id_almacen="+id_almacen;
    if(id_motivo)
    {
      data = data +"&id_motivo="+id_motivo;
    }
    if(id_tipomov)
    {
      data = data +"&id_tipomov="+id_tipomov;
    }

    switch(active_tab2)
    {
      case 'xfechaingreso':
        var fechaingreso_i = $('#f_inicio').val();
        var fechaingreso_h = $('#f_fin').val();

        if(fechaingreso_i)
        {
          data = data + "&fechaingreso_i="+fechaingreso_i;
        }
        if(fechaingreso_h)
        {
          data = data + "&fechaingreso_h="+fechaingreso_h;
        }

      break;
      case 'xfechacreado':
        var fechacreado_i = $('#f_inicio_2').val();
        var fechacreado_h = $('#f_fin_2').val();

        if(fechacreado_i)
        {
          data = data + "&fechacreado_i="+fechacreado_i;
        }
        if(fechacreado_h)
        {
          data = data + "&fechacreado_h="+fechacreado_h;
        }
      break;
    }

    switch(active_tab)
    {
      case 'xgrupos':

        var id_grupo = $('#grupos_busc').val();
        var id_familia = $('#familia_busc').val();
        var id_subfamilia = $('#subfamilia_busc').val();
        var id_zona = $('#zona_busc').val();
        var id_area = $('#area_busc').val();
        var id_ubicacion = $('#ubicacion_busc').val();
        var id_frecuencia =$('#frecuencia_busc').val();

        if(parseInt(id_frecuencia)>0)
        {
           data = data + "&id_frecuencia="+id_frecuencia;
        }
        if(parseInt(id_zona)>0)
        {
           data = data + "&id_zona="+id_zona;
        }
        if(parseInt(id_area)>0)
        {
           data = data + "&id_area="+id_area;
        }
        if(parseInt(id_ubicacion)>0)
        {
           data = data + "&id_ubicacion="+id_ubicacion;
        }
        if(parseInt(id_subfamilia)>0)
        {
           data = data + "&id_subfamilia="+id_subfamilia;
        }
        if(parseInt(id_familia)>0)
        {
           data = data + "&id_familia="+id_familia;
        }
        if(parseInt(id_grupo)>0)
        {
           data = data + "&id_grupo="+id_grupo;
        }
      break;

      case 'xarticulos':
        var i = new Array();
        $('table#list_artselected tr.arti_select').each(function(index,value){
          i.push($(this).attr('id_art_sucu'));
        })

        if(i.length>0)
        {
          var i2 = i.join();
        
          data = data + "&id_arti_sucu="+i2;
        }
        else
        {
          alerta('Error!','No ha seleccionado artículos!!','error');
          proced = false;
        }
      break;
    }
    if(proced==true)
    {
      $.ajax({
        url: $('base').attr('href') + 'evocostoajustes/buscar_registros',
        type: 'POST',
        data: data,
        dataType: "json",
        beforeSend: function() 
        {
          $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
        },
        success: function(response) 
        {
          if (response.code==1) 
          {
            $('#filtro').modal('hide');
            var r = response.data;
            var label = [] , ingreso_data = [], salida_data = [];

            $.each(r, function(i, item) {
              if(r[i].hasOwnProperty('18')) { ingreso_data.push(item[18]); } else {ingreso_data.push("0.00");}
              if(r[i].hasOwnProperty('19')) { salida_data.push(item[19]*-1); } else {salida_data.push("0.00");}
              label.push(i);
            });
            
            console.log(label);
            console.log(ingreso_data);
            console.log(salida_data);
            var data_sets = [
                {
                    label: 'Ingreso x Ajuste',
                    data: ingreso_data,
                    backgroundColor: "rgba(55, 160, 225, 0.7)",
                    hoverBackgroundColor: "rgba(55, 160, 225, 0.7)",
                    hoverBorderWidth: 2,
                    hoverBorderColor: 'lightgrey'
                },
                {
                    label: 'Salida x Ajuste',
                    data: salida_data,
                    backgroundColor: "rgba(225, 58, 55, 0.7)",
                    hoverBackgroundColor: "rgba(225, 58, 55, 0.7)",
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
                      stacked: true, 
                      gridLines: { display: false },
                      }],
                    yAxes: [{ 
                      stacked: true, 
                      }],
                  }, // scales
                  legend: {display: true}
              } // options
             }
            );
          }
          else
          {
            alerta('No se encontraron datos! ','Revise sus filtros.','info');
          }
        },
        complete: function() {
          $.LoadingOverlay("hide");
        }
      });
    }
  }
  else
  {
    alerta('Debe Seleccionar ','un almacen!!!','info');
  }
}

$(document).on('click','.buscar_evoneto',function(){
  buscar_articulos_evonetocosto();
});

function buscar_articulos_evonetocosto()
{ 
  if($('#almacen_busc').val())
  {
    var proced = true;
    var active_tab = $('#myTab li.active').attr('tabs');
    var active_tab2 = $('#myTab2 li.active').attr('tabs');

    console.log(active_tab);
    console.log(active_tab2);
    var data = "data="+active_tab;
    
    var id_almacen = $('#almacen_busc').val();
    var id_motivo = $('#motivo_busc').val();
    var null_values = $('#null_values').is(':checked')
    var id_tipomov = $('#tipomov_busc').val();

    if(null_values==true)
    {
      data = data + "&null_values="+null_values;
    }
    data = data + "&id_almacen="+id_almacen;
    if(id_motivo)
    {
      data = data +"&id_motivo="+id_motivo;
    }
    if(id_tipomov)
    {
      data = data +"&id_tipomov="+id_tipomov;
    }

    switch(active_tab2)
    {
      case 'xfechaingreso':
        var fechaingreso_i = $('#f_inicio').val();
        var fechaingreso_h = $('#f_fin').val();

        if(fechaingreso_i)
        {
          data = data + "&fechaingreso_i="+fechaingreso_i;
        }
        if(fechaingreso_h)
        {
          data = data + "&fechaingreso_h="+fechaingreso_h;
        }

      break;
      case 'xfechacreado':
        var fechacreado_i = $('#f_inicio_2').val();
        var fechacreado_h = $('#f_fin_2').val();

        if(fechacreado_i)
        {
          data = data + "&fechacreado_i="+fechacreado_i;
        }
        if(fechacreado_h)
        {
          data = data + "&fechacreado_h="+fechacreado_h;
        }
      break;
    }

    switch(active_tab)
    {
      case 'xgrupos':

        var id_grupo = $('#grupos_busc').val();
        var id_familia = $('#familia_busc').val();
        var id_subfamilia = $('#subfamilia_busc').val();
        var id_zona = $('#zona_busc').val();
        var id_area = $('#area_busc').val();
        var id_ubicacion = $('#ubicacion_busc').val();
        var id_frecuencia =$('#frecuencia_busc').val();

        if(parseInt(id_frecuencia)>0)
        {
           data = data + "&id_frecuencia="+id_frecuencia;
        }
        if(parseInt(id_zona)>0)
        {
           data = data + "&id_zona="+id_zona;
        }
        if(parseInt(id_area)>0)
        {
           data = data + "&id_area="+id_area;
        }
        if(parseInt(id_ubicacion)>0)
        {
           data = data + "&id_ubicacion="+id_ubicacion;
        }
        if(parseInt(id_subfamilia)>0)
        {
           data = data + "&id_subfamilia="+id_subfamilia;
        }
        if(parseInt(id_familia)>0)
        {
           data = data + "&id_familia="+id_familia;
        }
        if(parseInt(id_grupo)>0)
        {
           data = data + "&id_grupo="+id_grupo;
        }
      break;

      case 'xarticulos':
        var i = new Array();
        $('table#list_artselected tr.arti_select').each(function(index,value){
          i.push($(this).attr('id_art_sucu'));
        })

        if(i.length>0)
        {
          var i2 = i.join();
        
          data = data + "&id_arti_sucu="+i2;
        }
        else
        {
          alerta('Error!','No ha seleccionado artículos!!','error');
          proced = false;
        }
      break;
    }
    if(proced==true)
    {
      $.ajax({
        url: $('base').attr('href') + 'evocostonetoajustes/buscar_registros',
        type: 'POST',
        data: data,
        dataType: "json",
        beforeSend: function() 
        {
          $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
        },
        success: function(response) 
        {
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
          else
          {
            alerta('No se encontraron datos! ','Revise sus filtros.','info');
          }
        },
        complete: function() {
          $.LoadingOverlay("hide");
        }
      });
    }
  }
  else
  {
    alerta('Debe Seleccionar ','un almacen!!!','info');
  }
}