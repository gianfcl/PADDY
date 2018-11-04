$( document ).ready(function() {

  jQuery.validator.setDefaults({
    debug: true,
    success: "valid",
    ignore: ""
  });

  $('#buscarfech').validate({
    rules:
    {
      fecha_inicio:{ date: true }
    },
    messages: 
    {
      fecha_inicio:{ date: "Fecha Invalida" }
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
      var fechi = $('#fecha_inicio').val();
      var tittle = fechi;

      if(fechi.trim().length)
      {
        var div = $('#tipobusq').val();
         
        var temp = "fechai="+fechi;
        var fechf = $('#fecha_fin').val();

        var num = parseInt($('#'+div).attr('canti'));

        if(fechf.trim().length)
        {
          temp = temp+"&fechaf="+fechf;
          tittle = tittle+' '.fechf;          
        }

        $('#'+div+'_'+num).attr({'dia2':fechf});
        $('#'+div+'_'+num).attr({'dia1':fechi});
        
        if(num>0)
        {
          $('#'+div+'_'+num).attr({'dia':temp}); //alert(div+' - '+num)
          $('#'+div+'_'+num).attr({'title':tittle});
          cambiacolor(div, num);
        }
        temp = temp+'&page=0';

        buscar_resumen(temp, div);
        $('#buscarfechas').modal('hide');
      }    
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

  $("#datetimepicker6").on("dp.change", function (e) {
    $('#datetimepicker7').data("DateTimePicker").minDate(e.date);
  });

  $("#datetimepicker6").on("dp.show", function (e) {
    $('#datetimepicker7 input').prop( "disabled", false );
  });
  

  $("#datetimepicker7").on("dp.change", function (e) {
    $('#datetimepicker6').data("DateTimePicker").maxDate(e.date);
  });

});

$(document).on('focusout', '#datetimepicker6 input', function (e) {
  var fechi = $(this).val();
  if(fechi.trim().length) {}
  else { $('#datetimepicker7 input').prop( "disabled", true );}
});

$(document).on('click', 'li.paginate_button', function (e) {  
  var temp = "page="+$(this).find('a').attr('tabindex');
  var div = $(this).parents('.tupaginacion').attr('tudiv');

  var fech = $('div#'+div+' button.btn-primary').attr('dia');
  var id = $('div#'+div+' button.btn-primary').attr('id');
  var num = parseInt($('div#'+div).attr('canti'));

  if(fech.trim().length)
  {
    buscar_resumen(temp+"&"+colum+'='+fech, id);
    limp_todo('buscarfechas');
    var num = parseInt($('#'+id).attr('canti'));
    if(num>0)
    $('#'+id+'_'+num).attr({'title':''})
  }  
});

$(document).on('click', 'a.paginate_button', function (e) {  
  var temp = 'page='+$(this).attr('tabindex');

  var div = $(this).parents('.tupaginacion').attr('tudiv');

  var fech = $('div#'+div+' button.btn-primary').attr('dia'); //alert(fech)
  var id = $('div#'+div+' button.btn-primary').attr('id');
  colum = '';
  var ky = parseInt($('div#'+div+' button.btn-primary').attr('ky'));
  var num = parseInt($('div#'+div).attr('canti'));

  if(ky != 5)
    colum = 'fechai=';
  
  if(fech.trim().length)
  {
    buscar_resumen(temp+"&"+colum+fech);
    limp_todo('buscarfechas','');
    var num = parseInt($('#'+id).attr('canti'));
    if(num>0)
    $('#'+id+'_'+num).attr({'title':''})
  }
});

function buscar_resumen(temp)
{
  var pag = "data";
  var tb = "datatable-buttons";
  $('#graph_line').html('');
  $.ajax({
    url: $('base').attr('href') + 'resumendeproduccionop/buscar_fechas',
    type: 'POST',
    data: temp,
    dataType: "json",
    beforeSend: function() {
      $.LoadingOverlay("show", {image : "", fontawesome : "fa fa-spinner fa-spin"});
    },
    success: function(response) {
      if (response.code==1) 
      {
        $('#'+tb+' tbody').html(response.data.rta);
        $('#paginacion_'+pag).html(response.data.paginacion);
      }
    },
    complete: function(response) { $.LoadingOverlay("hide"); }
  });
}
  

$(document).on('click', '.limpiarform', function (e) {
  lip_busqueda('form_busc_kardex');
});

function cambiacolor(id,ky)
{
  $('div#'+id+' button').removeClass('btn-primary');
  $('div#'+id+' button').removeClass('btn-default');
  $('div#'+id+' button').addClass('btn-default');
  var z = parseInt(ky);
  z = (z>0 ) ? (z) : (0);
  if(z>0)
  {
    $('#'+id+'_'+ky).removeClass('btn-default');
    $('#'+id+'_'+ky).addClass('btn-primary');
  }
    
}

$(document).on('click', 'button.busc', function (e) {
  var id = $(this).parents('div.col-md-6').attr('id');
  var ky = $(this).attr('ky'); 

  cambiacolor(id,ky);
  var temp = "page=0";
  var fech = $(this).attr('dia');
  
  var colum = "fechai";


  if(fech.trim().length)
  {
    buscar_resumen(temp+"&"+colum+'='+fech, id);
    //limp_todo('buscarfechas');
    var num = parseInt($('#'+id).attr('canti'));
    if(num>0)
    $('#'+id+'_'+num).attr({'title':''})
  }
});

$(document).on('click', 'button.muestr', function (e) {
  var id = $(this).parents('div.col-md-6').attr('id');
  $('#tipobusq').val(id);
  var fechi = $(this).attr('dia1');
  var fechf = $(this).attr('dia2');
  $('#fecha_inicio').val(fechi);
  $('#fecha_fin').val(fechf);
});

$(document).on('click', 'button.ocultamodal', function (e) {
  $('#buscarart button.close').click();
  /*$('#fecha_inicio').val('');
  $('#fecha_fin').val('');*/
});

$(document).on('click', 'button.btn_limpiar', function (e) {
  var tipobusq = $('#tipobusq').val();
});
