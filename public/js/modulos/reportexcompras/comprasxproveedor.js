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


  if(path_url[4] == "comprasxproveedor")
  {
    $('.gen_graf').addClass('hidden');    
  }
  
  //Cuando no exista el parametro en la URL de "buscar"(path_url[5]) se debe abrir el modal filtro
  switch (active_tab)
  {
    case 'grupo':
      if(!path_url[5] || (path_url[7]=="-" && path_url[8]=="-" && path_url[9]=="-"))
      {
        $('.open_filtro').trigger('click');
      }
    break;
    case 'familia':
      if(path_url[10]=="-" && path_url[11]=="-" && path_url[12]=="-" && path_url[13]=="-")
      {
        $('.open_filtro').trigger('click');
      }
    break;
    case 'subfamilia':
      if(path_url[14]=="-" && path_url[15]=="-" && path_url[16]=="-" && path_url[17]=="-" && path_url[18]=="-")
      {
        $('.open_filtro').trigger('click');
      }
    break;
    case 'articulo':
      $('#myTab2').removeClass('hidden');

      $('#datet3').datetimepicker({
        format: 'DD-MM-YYYY',
        locale: moment.locale('es'),
        defaultDate: moment().startOf('month')
      });

      $('#datet4').datetimepicker({
        format: 'DD-MM-YYYY',
        locale: moment.locale('es'),
        useCurrent: false,
        defaultDate: moment()
      });

      if(path_url[19]=="-" && path_url[20]=="-" && path_url[21]=="-" && path_url[22]=="-" && path_url[23]=="-" && path_url[24]=="-")
      {
        $('.open_filtro').trigger('click');
      }
    break;
  }

});
  
$(document).on('click', '.buscar', function () {
  var url_metodo = $(this).attr('url_busc');
  var active_tab = $('.tabs_pan ul li.active').attr('tabs');
  var path_url = ($(location).attr('href')).split("/");
  var fecha_i = ($('#f_inicio').val()) ? $('#f_inicio').val() : null;
  console.log(path_url);
  if(fecha_i)
  {
    var fecha_f = ($('#f_fin').val()) ? $('#f_fin').val() : "-";
    var uri = $('base').attr('href') + "comprasxproveedor/"+url_metodo+"/"+active_tab+"/";
    var buscar = false;

    switch(active_tab)
    {
      case 'grupo':

        var g_idgrupo = ($('#grupos_busc').val()) ? $('#grupos_busc').val().join() : "-";
        g_idgrupo= g_idgrupo.replace(/,/g,"-");
        uri = uri+g_idgrupo+"/"+fecha_i+"/"+fecha_f;
        buscar = true;
      break;
      case 'familia':
        var g_idgrupo = path_url[7];
        var g_fini = path_url[8];
        var g_ffin = path_url[9];

        var f_idgrupo = ($('#grupos_busc').val()) ? $('#grupos_busc').val().join() : "-";
        var f_idfamilia = ($('#familia_busc').val()) ? $('#familia_busc').val().join() : "-";
        buscar = (f_idgrupo) ? true : buscar;

        if(buscar)
        {
          f_idfamilia= f_idfamilia.replace(/,/g,"-");
          f_idgrupo= f_idgrupo.replace(/,/g,"-");
          
          uri = uri+g_idgrupo+"/"+g_fini+"/"+g_ffin+"/"+f_idgrupo+"/"+f_idfamilia+"/"+fecha_i+"/"+fecha_f;
        }
        else
        {
          alerta('Seleccione','al menos un Grupo.','error');
        }
        
      break;
      case 'subfamilia':
        var g_idgrupo = path_url[7];
        var g_fini = path_url[8];
        var g_ffin = path_url[9];
        var f_idgrupo = path_url[10];
        var f_idfamilia = path_url[11];
        var f_fini = path_url[12];
        var f_ffin = path_url[13];

        var s_idgrupo = ($('#grupos_busc').val()) ? $('#grupos_busc').val().join() : "-";
        var s_idfamilia = ($('#familia_busc').val()) ? $('#familia_busc').val().join() : "-";
        var s_idsubfamilia = ($('#subfamilia_busc').val()) ? $('#subfamilia_busc').val().join() : "-";
        console.log(s_idgrupo);
        console.log(s_idfamilia);
        console.log(s_idsubfamilia);
        buscar = (s_idgrupo == "-" || s_idfamilia == "-") ? buscar : true;

        if(buscar)
        {
          s_idfamilia= s_idfamilia.replace(/,/g,"-");
          s_idgrupo= s_idgrupo.replace(/,/g,"-");
          s_idsubfamilia= s_idsubfamilia.replace(/,/g,"-");
          
          uri = uri+g_idgrupo+"/"+g_fini+"/"+g_ffin+"/"+f_idgrupo+"/"+f_idfamilia+"/"+f_fini+"/"+f_ffin+"/"+s_idgrupo+"/"+s_idfamilia+"/"+s_idsubfamilia+"/"+fecha_i+"/"+fecha_f;
        }
        else
        {
          if(!s_idgrupo)
          {
            alerta('Seleccione','al menos un Grupo.','error');
          }
          else
          {
            alerta('Seleccione','al menos una Familia.','error');
          }
        }
      break;
      case 'articulo':
        var g_idgrupo = path_url[7];
        var g_fini = path_url[8];
        var g_ffin = path_url[9];
        var f_idgrupo = path_url[10];
        var f_idfamilia = path_url[11];
        var f_fini = path_url[12];
        var f_ffin = path_url[13];
        var s_idgrupo = path_url[14];
        var s_idfamilia = path_url[15];
        var s_idsubfamilia = path_url[16];
        var s_fini = path_url['17'];
        var s_ffin = path_url['18'];


        var active_tab2 = $('ul#myTab2 li.active').attr('tabs');

        console.log(active_tab2);
        switch (active_tab2)
        {
          case 'xgrupos':
            var a_idarticulos  = "-";
            var a_idgrupo = ($('#grupos_busc').val()) ? $('#grupos_busc').val().join() : "-";
            var a_idfamilia = ($('#familia_busc').val()) ? $('#familia_busc').val().join() : "-";
            var a_idsubfamilia = ($('#subfamilia_busc').val()) ? $('#subfamilia_busc').val().join() : "-";
            a_idsubfamilia= (a_idsubfamilia == "-") ? a_idsubfamilia : a_idsubfamilia.replace(/,/g,"-");
            a_idfamilia= (a_idfamilia == "-") ? a_idfamilia : a_idfamilia.replace(/,/g,"-");
            a_idgrupo= (a_idgrupo == "-") ? a_idgrupo : a_idgrupo.replace(/,/g,"-");

            buscar = ($('#familia_busc').val() && $('#grupos_busc').val() && $('#subfamilia_busc').val()) ? true : buscar;

            if(!buscar)
            {
              if(!$('#grupos_busc').val())
              {
                alerta('Seleccione','al menos un Grupo.','error');
              }
              else
              {
                if(!$('#familia_busc').val())
                {
                  alerta('Seleccione','al menos una Familia.','error');
                }
                else
                {
                  alerta('Seleccione','al menos una Subfamilia.','error');
                }
              }
            }

          break;
          case 'xarticulos':
            var fecha_i = ($('#f_inicio2').val()) ? $('#f_inicio2').val() : null;
            var fecha_f = ($('#f_fin2').val()) ? $('#f_fin2').val() : "-";

            var c = 0;
            var a_idgrupo = [];
            var a_idfamilia = [];
            var a_idsubfamilia = [];
            var a_idarticulos = [];

            $('table#list_artselected tr.arti_select').each(function(index,value){
              var t = $(this);
              c++;
              a_idgrupo[t.attr('id_grupo')] = t.attr('id_grupo');
              a_idfamilia[t.attr('id_familia')] = t.attr('id_familia');
              a_idsubfamilia[t.attr('id_subfamilia')] = t.attr('id_subfamilia');
              a_idarticulos[t.attr('id_art_sucu')] = t.attr('id_art_sucu');
            })

            if(c>0)
            {
              a_idgrupo = a_idgrupo.filter(function(n){ return n != undefined }).join(); 
              a_idfamilia = a_idfamilia.filter(function(n){ return n != undefined }).join(); 
              a_idsubfamilia = a_idsubfamilia.filter(function(n){ return n != undefined }).join(); 
              a_idarticulos = a_idarticulos.filter(function(n){ return n != undefined }).join(); 

              a_idgrupo= (a_idgrupo == "-") ? a_idgrupo : a_idgrupo.replace(/,/g,"-");
              a_idfamilia= (a_idfamilia == "-") ? a_idfamilia : a_idfamilia.replace(/,/g,"-");
              a_idsubfamilia= (a_idsubfamilia == "-") ? a_idsubfamilia : a_idsubfamilia.replace(/,/g,"-");
              a_idarticulos= (a_idarticulos == "-") ? a_idarticulos : a_idarticulos.replace(/,/g,"-");
            }
            else
            {
              alerta('Seleccione','al menos un artículo!!','error');
            }

            buscar = (fecha_i) ? true : buscar;
            if(!buscar)
            {
              alerta('Elija','una fecha de Inicio!!','error');
            }
          break;
        }


        uri += g_idgrupo+"/"+g_fini+"/"+g_ffin+"/"+f_idgrupo+"/"+f_idfamilia+"/"+f_fini+"/"+f_ffin+"/"+s_idgrupo+"/"+s_idfamilia+"/"+s_idsubfamilia+"/"+s_fini+"/"+s_ffin+"/";
        uri += a_idgrupo+"/"+a_idfamilia+"/"+a_idsubfamilia+"/"+a_idarticulos+"/"+fecha_i+"/"+fecha_f;

      break;
    }
    
    if(buscar)
    {
      console.log(uri);
      window.location.replace(uri);
    }  
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
    case "grupo":
      $('div.familia').addClass('hidden');
      $('div.subfamilia').addClass('hidden');
    break;
    case "familia":
      $('div.subfamilia').addClass('hidden');
    break;
  }
});

$(document).on('change','#grupos_busc',function(){
  var active_tab = $('.tabs_pan ul li.active').attr('tabs');
  console.log(active_tab);
  if(active_tab !== 'grupo')
  {
    var ids = $(this).val();
    console.log(ids);

    $.ajax({
      url: $('base').attr('href') + 'comprasxarticulo/buscar_famxgrupos',
      type: 'POST',
      data: 'id_grupo='+ids,
      dataType: "json",
      beforeSend: function() {
        $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
      },
      success: function(response) {
        if (response.code==1) 
        {
          console.log(response.data);
          $('#familia_busc').html(response.data);
          $('#subfamilia_busc').html('');
          $('#familia_busc').selectpicker('refresh');
          $('#subfamilia_busc').selectpicker('refresh');
        }
      },
      complete: function() {
        $.LoadingOverlay("hide");
      }
    });
  }
});

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
    url: $('base').attr('href') + 'comprasxarticulo/gen_graph',
    type: 'POST',
    data: param,
    dataType: "json",
    beforeSend: function() {
      $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
    },
    success: function(response) {
      if (response.code==1) 
      {
        console.log(response.data.data);
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
              label: 'Reporte de Compras ',
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

$(document).on('click','#myTab2 li',function(){
  var id_ = $(this).find('a').prop('id');
  if(id_=="txarticulos")
  {
    $(this).parents('div.modal-dialog').removeClass('modal-sm').addClass('modal-lg');

    buscar_articulos(0);
  }
  else
  {
    $(this).parents('div.modal-dialog').removeClass('modal-lg').addClass('modal-sm');
  }
});

function buscar_articulos(page)
{
  var temp = 'page='+page;
  var codigo_busc = $('#codigo_busc2').val();
  var descripcion_busc = $('#descripcion_busc2').val();
  var grupo_busc = $('#grupo_busc2').val();
  var familia_busc = $('#familia_busc2').val();
  var subfamilia_busc = $('#subfamilia_busc2').val();
  var um_busc = $('#um_busc2').val();
  var temp = "page="+page;

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

$(document).on('click','.buscar2',function(){
  buscar_articulos(0);
});

$(document).on('click', '.limpiarfiltro2', function (e) {
  
  $(this).parents('tr').find('input[type=text]').val('');
  $(this).parents('tr').find('#grupo_busc2').val('');
  $(this).parents('tr').find('#familia_busc2').html('');
  $(this).parents('tr').find('#subfamilia_busc2').html('');
  $(this).parents('tr').find('#um_busc2').val('');

  buscar_articulos(0);
});

$(document).on('click', 'li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  buscar_articulos(page);
});

$(document).on('click', 'a.paginate_button', function (e) {  
  var page = $(this).attr('tabindex');
  buscar_articulos(page);
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
