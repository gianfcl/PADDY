$( document ).ready(function() {

  jQuery.validator.setDefaults({
    debug: true,
    success: "valid",
    ignore: ""
  });

  buscar_articulos(0);
  $('#buscarart').modal('show');
  

  $('#form_busc_kardex').validate({
    rules:
    {
      id_art_sucursal: {required:true},
      id_almacen: {required:true}/*,
      fecha_inicio:{ date: true },
      fecha_fin:{ date: true }*/
    },
    messages: 
    {
      id_art_sucursal: {required:"Buscar"},
      id_almacen: {required:"Buscar"}/*,
      fecha_inicio:{ date: "Fecha Invalida" },
      fecha_fin:{ date: "Fecha Invalida" }*/
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
      if(element.parent('.col-md-4').length) 
      { 
        error.insertAfter(element.parent()); 
      }
    },
    submitHandler: function() {
      $('#page').val('0');
      buscar_kardex();      
    }
  });

  $('#datetimepicker6').datetimepicker({
    format: 'DD-MM-YYYY',
    locale: moment.locale("es")
  });

  $('#datetimepicker7').datetimepicker({
    format: 'DD-MM-YYYY',
    locale: moment.locale("es"), 
    useCurrent: false //Important! See issue #1075
  });

  $("#datetimepicker6").on("dp.change", function (e) { console.log(e.date);
    $('#datetimepicker7').data("DateTimePicker").minDate(e.date);
  });

  $("#datetimepicker6").on("dp.show", function (e) {
    $('#datetimepicker7 input').prop( "disabled", false );
  });
  

  $("#datetimepicker7").on("dp.change", function (e) {
    $('#datetimepicker6').data("DateTimePicker").maxDate(e.date);
  });

});

$(document).on('click','#ocu',function(){
    $("#datatable-buttons").hide();
    $("#paginacion_data").hide();
    $(this).hide();
    $("#most").show();
});
$(document).on('click','#most',function(){
    $("#datatable-buttons").show();
    $("#paginacion_data").show();
    $(this).hide();
    $("#ocu").show();
});

$(document).on('click','#grafevo',function(){
  $('#filtro').modal('show');
  $('#kar').css('display','none');
  $('#gra').css('display','inline');
});
$(document).on('click','#gra',function(){
  $.ajax({
    url: $('base').attr('href') + 'kardexarticulo/generar_grafico',
    type: 'POST',
    data: $('#form_busc_kardex').serialize(),
    dataType: "json",
    beforeSend: function() {
      $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
        //showLoader();
    },
    success: function(response) {
      if (response.code==1) 
      {
        var responseajax = response.data;
        if(responseajax)
        {
          var labels = [], data = [];
          for (var i = 0; i < responseajax.labels.length; i++) 
          {
            labels.push(responseajax.labels[i]);
            data.push(responseajax.data[i]);
          }
          var div = $('#myCanvas');
          var graph = new Chart(div,{
            type:'line',
            data:{
              labels: labels,
              datasets:[{
                label: 'Evolución x Stock',
                data: data,
                fill: false,
                pointBackgroundColor: 'rgba(255,150,0,0.5)',
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
                elements: {
                        line: {
                            tension: 0, // disables bezier curves
                        }
                }
            }
          });       
        }

      }
    },
    complete: function(response) {
      $.LoadingOverlay("hide");
      $("#datatable-buttons").hide();
      $("#paginacion_data").hide();
      $("#ocu").hide();
      $("#most").show();
      $('#filtro').modal('hide');
    }
  });
});

$(document).on('focusout', '#datetimepicker6 input', function (e) {
  var fechi = $(this).val();
  if(fechi.trim().length) {}
  else { $('#datetimepicker7 input').prop( "disabled", true );}

});

$(document).on('click', '#buscar_arti .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
  var page = 0;
  buscar_articulos(page);
});

$(document).on('click', '#buscarart li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  buscar_articulos(page);
});

$(document).on('click', '#buscarart a.paginate_button', function (e) {  
  var page = $(this).attr('tabindex');
  buscar_articulos(page);
});

$(document).on('click', '#buscar_arti li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');

  buscar_articulos(page);
});

$(document).on('click', '#buscar_arti a.paginate_button', function (e) {  
  var page = $(this).attr('tabindex');

  buscar_articulos(page);
});

$(document).on('click', '#buscar_arti a.buscar', function (e) {  
  var page = 0;

  buscar_articulos(page);
});

$(document).on('click', '#paginacion_data li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  $('#num_page').val(page); console.log('page-> '+page);
  buscar_kardex();
});

$(document).on('click', '#paginacion_data a.paginate_button', function (e) {  
  var page = $(this).attr('tabindex');
  $('#num_page').val(page); console.log('page-> '+page);
  buscar_kardex();
});
function buscar_kardex()
{
  $.ajax({
        url: $('base').attr('href') + 'kardexarticulo/buscar_kardexarticulo',
        type: 'POST',
        data: $('#form_busc_kardex').serialize(),
        dataType: "json",
        beforeSend: function() {
          $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
            //showLoader();
        },
        success: function(response) {
          if (response.code==1) 
          {
            $('#datatable-buttons tbody#bodyindex').html(response.data.rta);
            $('#paginacion_data').html(response.data.paginacion);
            $('#filtro').modal('hide');
          }
        },
        complete: function(response) {
          $.LoadingOverlay("hide");
        }
      });
}

function buscar_articulos(page)
{
  var codigo_busc = $('#codigo_busc').val();
  var descripcion_busc = $('#descripcion_busc').val();
  var temp = "page="+page;
  if(codigo_busc.trim().length)
  {
    temp=temp+'&codigo_busc='+codigo_busc; console.log(codigo_busc);
  }
  if(descripcion_busc.trim().length)
  {
    temp=temp+'&descripcion_busc='+descripcion_busc; console.log(descripcion_busc);
  }

  $.ajax({
    url: $('base').attr('href') + 'kardexarticulo/buscar_articulos',
    type: 'POST',
    data: temp,
    dataType: "json",
    beforeSend: function() {
      $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
      //showLoader();
    },
    success: function(response) {
      if (response.code==1) {
        $('#buscar_arti tbody').html(response.data.rta);
        $('#pagina_data_buscar').html(response.data.paginacion);
      }
    },
    complete: function() {
      $.LoadingOverlay("hide");
        //hideLoader();
    }
  });      
}

$(document).on('click', '.add_arti', function (e)
{
  var padre = $(this).parents('tr');
  var id_art_sucursal = padre.attr('idartsucursal');
  var id_almacen = parseInt(padre.find('td select#almacen_'+id_art_sucursal).val()); console.log(id_almacen);
  if(id_almacen>0)
  {
    lip_busqueda('form_busc_kardex');    
    var d = new Date().getDate();
    if(d<10){
      d="0"+d;
    }
    var m = new Date().getMonth();
    if(m<10){
      m=m+1;
      m="0"+m;
    }
    var y = new Date().getFullYear();
    var codigo = padre.find('td.codigo').html();
    var descri = padre.find('td.descrip').html();
    var umbase = padre.find('td.um_base').html();
    var almacen = padre.find('td select#almacen_'+id_art_sucursal+' option:selected').text();
    $('#codigo_small').html(codigo);
    $('#descripcion_small').html(descri);
    $('#um_small').html("("+umbase+")");
    $('#id_art_sucursal').val(id_art_sucursal);
    $('#id_almacen').val(id_almacen);
    $('#almacen_h2').html(almacen);
    $('div.x_title h3 small.hidden').removeClass('hidden');
    //console.log('id_art_sucursal->'+id_art_sucursal+' codigo->'+codigo+' descri->'+descri+' id_almacen->'+id_almacen+' almacen->'+almacen);
    /*$('#codigo').html(codigo);
    $('#descrip').html(descri);
    $('#um_base').html(umbase);
    $('#id_art_sucursal').val(id_art_sucursal);
    $('#id_almacen').val(id_almacen);
    $('#almacen').html(almacen);
    */
    $('#buscarart').modal('hide');
    $('#kar').css('display','inline');    
    $('#gra').css('display','none');
    $('#fecha_inicio').val("01-"+m+"-"+y);
    $('#fecha_fin').val(d+"-"+m+"-"+y);
  }
  else
  {
    alerta('No puedo Agregar!', 'Seleccionar Almacén', 'error');
  }
});

$(document).on('click', '.add_articulos', function (e) {
  var page = 0;
  buscar_articulos(page);
});

$(document).on('click', '.limpiarform', function (e) {
  lip_busqueda('form_busc_kardex');
});

function lip_busqueda(form)
{
  $('#'+form+' input').each(function (index, value){
    if($(this).attr('type')=="text" || $(this).attr('type')=="hidden")
    {
      if($(this).parents('.form-group').attr('class')=="form-group has-error")
      {
        $(this).parents('.form-group').removeClass('has-error');
      }

      $(this).val('');

      id = $(this).attr('id');
      if($('#'+id+'-error').length>0)
      {
        $('#'+id+'-error').html('');
      }
    }
  });

  $('#'+form+' label.bordelabel').each(function (index, value){
    $(this).html('');
  });

  //$('#datetimepicker7 input').prop( "disabled", true );
  $('#num_page').val( "0" );

  var validatore = $( '#'+form ).validate();
  validatore.resetForm();
  $('#datatable-buttons tbody#bodyindex').html("<tr><td colspan='11'><h2 class='text-center text-success'>No se hay registro</h2></td></tr>");
  $('#paginacion_data').html('');
}

$(document).on('click', '#datatable-buttons li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  $('#num_page').val(page);
  $('#form_busc_kardex').submit();
});

$(document).on('click', '#datatable-buttons a.paginate_button', function (e) {  
  var page = $(this).attr('tabindex');
  $('#num_page').val(page);
  $('#form_busc_kardex').submit();
});

$(document).on('click', 'a.ver', function (e) {
  var id = parseInt($(this).parents('tr').attr('iddocumento'));
  var tipo = parseInt($(this).parents('tr').attr('titipo'));
  var idkardex = parseInt($(this).parents('tr').attr('idkardex'));
  if(id>0 && tipo>0 && idkardex>0)
  {
    var temp = 'iddoc='+id+'&tipo='+tipo+'&idkardex='+idkardex;
    $.ajax({
      url: $('base').attr('href') + 'kardexarticulo/buscar_detalle',
      type: 'POST',
      data: temp,
      dataType: "json",
      beforeSend: function() {
        $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
        //showLoader();
      },
      success: function(response) {
        if (response.code==1) {
          $('#codi').html(response.data.num_gen);
          $('#ver_fecha_creado').html(response.data.fechamod);
          $('#ver_usuario').html(response.data.usuario);
          $('#ver_tipomov').html(response.data.tipomov);
          $('#verinforeceta #detkardex tbody').html(response.data.html);
          abrirnmodal(true,'verinforeceta');
        }
      },
      complete: function() {
        $.LoadingOverlay("hide");
          //hideLoader();
      }
    });
  }  
});

$('#buscarart').on('show.bs.modal', function (e) {
  $('#filtro').modal('hide');
})

$('#buscarart').on('hidden.bs.modal', function (e) {
  $('#filtro').modal('show');
})