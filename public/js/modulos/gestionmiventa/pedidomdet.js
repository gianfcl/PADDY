$(document).on('click', '.ocultargrupo', function (e) {
  var cls = $('#ocultargrupo').attr('class');
  if(cls == "panel-body")
  {
    $('#ocultargrupo').addClass('collapse');
    $('div.ocultargrupo i').attr({'class':'fa fa-chevron-up'});    
  }
  else
  {
    $('#ocultargrupo').removeClass('collapse');
    $('div.ocultargrupo i').attr({'class':'fa fa-chevron-down'});
  }
});

$(document).on('click', '.get_cuentas', function (e) {
  var tis = $(this);
  var id = parseInt(tis.attr('valor'));
  var ti = tis.attr('tipo');

  if(id>0 && ti.trim().length)
  {
    var temp = 'id='+id+'&tipo='+ti;
    var escombo = parseInt(this.attr('escombo'));
    if(escombo>0)
    {
      temp = '&escombo=1'
    }
    
    tis.parent('div.col-xs-12').find('a').removeClass('btn-info');
    tis.addClass('btn-info');
    var nunrow = 0;
    switch(ti) {
      case 'familias':
        $('div#div_familias').html("<h2 class='text-center text-success'>No se hay registro</h2>");
        $('div#div_subfamilias').html("<h2 class='text-center text-success'>No se hay registro</h2>");
        $('div#div_articulos').html("<h2 class='text-center text-success'>No se hay registro</h2>");
        break;

      case 'subfamilias':
        $('div#div_subfamilias').html("<h2 class='text-center text-success'>No se hay registro</h2>");
        $('div#div_articulos').html("<h2 class='text-center text-success'>No se hay registro</h2>");
        break;

      case 'articulos':
        $('div#div_articulos').html("<h2 class='text-center text-success'>No se hay registro</h2>");
        break;

      case 'detalle':
        numrow = parseInt($('tbody#div_detalle tr.ordenes').length);
        break;
      default:
          break;
    }
    $.ajax({    
      url: $('base').attr('href') + 'pedidom/get_cuentas',
      type: 'post',
      data: temp,
      dataType: "json",
      beforeSend: function() {
      },
      success: function(response) {
        if(response.code==1)
        {
          if(ti=="detalle")
          {
            if(numrow>0)
            {
              $('tbody#div_'+ti).append(response.data);
            }
            else
            {
              $('tbody#div_'+ti).html(response.data);
            }
          }
          else
          {
            $('div#div_'+ti).html(response.data);
          }          
        }
      },
      complete: function() {
        //hideLoader();
      }
    });
  }
});

/*Input Cantidad*/
$(document).on('click', '.btn-number', function (e) {
  e.preventDefault();
  
  fieldName = $(this).attr('data-field');
  type      = $(this).attr('data-type');
  var input = $(this).parents('tr').find("td.cant input[name='"+fieldName+"']");
  var currentVal = parseInt(input.val());
  if (!isNaN(currentVal)) {
    if(type == 'minus') {
        
      if(currentVal > input.attr('min')) {
        input.val(currentVal - 1).change();
      } 
      if(parseInt(input.val()) == input.attr('min')) {
        $(this).attr('disabled', true);
      }

    } else if(type == 'plus') {

      if(currentVal < input.attr('max')) {
          input.val(currentVal + 1).change();
      }
      if(parseInt(input.val()) == input.attr('max')) {
          $(this).attr('disabled', true);
      }

    }
  }
});

$(document).on('focusin', '.input-number', function (e) {
  $(this).data('oldValue', $(this).val());
});

$(document).on('change', '.input-number', function (e) {
    
  minValue =  parseInt($(this).attr('min'));
  maxValue =  parseInt($(this).attr('max'));
  valueCurrent = parseInt($(this).val());

  var padre = $(this).parents('tr');
  
  name = $(this).attr('name');
  if(valueCurrent >= minValue) {
    padre.find("td.cant .btn-number[data-type='minus'][data-field='"+name+"']").removeAttr('disabled')
  } else {
    alerta('Lo sentimos','se alcanzó el valor mínimo', 'error');
    $(this).val($(this).data('oldValue'));
  }
  if(valueCurrent <= maxValue) {
    padre.find("td.cant .btn-number[data-type='plus'][data-field='"+name+"']").removeAttr('disabled')
  } else {
    alerta('Lo sentimos','Se alcanzó el valor máximo', 'error');
    $(this).val($(this).data('oldValue'));
  }  
    
});

$(document).on('keydown', '.input-number', function (e) {
  // Allow: backspace, delete, tab, escape, enter and .
  if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 190]) !== -1 ||
     // Allow: Ctrl+A
    (e.keyCode == 65 && e.ctrlKey === true) || 
     // Allow: home, end, left, right
    (e.keyCode >= 35 && e.keyCode <= 39)) {
         // let it happen, don't do anything
         return;
  }
  // Ensure that it is a number and stop the keypress
  if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
    e.preventDefault();
  }
});

/*Fin Input Cantidad*/