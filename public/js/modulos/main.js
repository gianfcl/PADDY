function limpform(form)
{
  $('#'+form+' input').each(function (index, value){
    if($(this).attr('type')=="text")
    {
      if($(this).parents('.form-group').attr('class')=="form-group has-error")
      {
        $(this).parents('.form-group').removeClass('has-error');
      }
      $(this).val('');
    }

    id = $(this).attr('id');
    if($('#'+id+'-error').length>0)
    {
      $('#'+id+'-error').html('');
    }
  });

  $('#'+form+' select').each(function (index, value){
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
  });

  var validatore = $('#'+form).validate();
  validatore.resetForm();
}

function limpformas(form)
{
  $('#'+form+' input').each(function (index, value){
    if($(this).attr('type')=="text")
    {
      if($(this).parents('.form-group').attr('class')=="form-group has-error")
      {
        $(this).parents('.form-group').removeClass('has-error');
      }
      $(this).val('');
    }

    if($(this).attr('type')=="hidden"){
      $(this).val('');
    }

    id = $(this).attr('id');
    if($('#'+id+'-error').length>0)
    {
      $('#'+id+'-error').html('');
    }
  });

  var validatore = $('#'+form).validate();
  validatore.resetForm();
}

function alerta(titulo, descripcion, tipo, valor = false)
{
  swal({
    title: titulo,
    text: descripcion,
    type: tipo,
    allowOutsideClick: valor
  });
}

function limpcheckform(form, diverror)
{
  $('#'+form+' input').each(function (index, value){
    if($(this).attr('type')=="checkbox")
    {
      if($(this).parents('.form-group').attr('class')=="form-group has-error")
      {
        $(this).parents('.form-group').removeClass('has-error');
      }
      id = $(this).attr('id');
      if($('#'+id+'-error').length>0)
      {
        $('#'+id+'-error').html('');
      }
      $(this).prop('checked', false);
    }

    if($(this).attr('type')=="hidden"){
      $(this).val('');
    }
    
  });

  if($('#'+diverror).length>0)
  {
    $('#'+diverror).html('');
  }
}

function limp_todo(form, diverror)
{
  $('#'+form+' input').each(function (index, value){
    if($(this).attr('type')=="checkbox")
    {
      if($(this).parents('.form-group').attr('class')=="form-group has-error")
      {
        $(this).parents('.form-group').removeClass('has-error');
      }
      id = $(this).attr('id');
      if($('#'+id+'-error').length>0)
      {
        $('#'+id+'-error').html('');
      }
      $(this).prop('checked', false);
    }
    
    if($(this).attr('type')=="text")
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

    if($(this).attr('type')=="hidden"){
      $(this).val('');
    }    
  });

  $('#'+form+' select').each(function (index, value){
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
  });

  if($('#'+diverror).length>0)
  {
    $('#'+diverror).html('');
  }

  $('#'+form+' textarea').each(function (index, value){
    $(this).val('');
  });

  var valimp = $( "form#"+form ).validate();
  valimp.resetForm();
}
function justNumbers(e)
{
    var keynum = window.event ? window.event.keyCode : e.which;
    if ((keynum == 8) || (keynum == 46))
        return true;         
    return /\d/.test(String.fromCharCode(keynum));
}

function showLoader(id="")
{
  if(id.length)
  {
    var btn = $('#saveb').button('loading');
  }  
}

function hideLoader(id="")
{
  if(id.length)
  {
    var btn = $('#saveb').button('loading');
    btn.button('reset');
  }  
}

$(document).on('click', '.nav_menu ul.nav li a.menarea', function (e) {
  var pageini = $(this).attr('pageini');
  var idmenuarea = parseInt($(this).attr('idmenuarea'));
  if(idmenuarea>0)
  {
    $.ajax({
      url: $('base').attr('href') + 'usuarios/editmenuarea',
      type: 'POST',
      data: 'idmenuarea='+idmenuarea,
      dataType: "json",
      beforeSend: function() {
        //showLoader();
      },
      success: function(response) {
        if (response.code==1) {
          window.location.href = $('base').attr('href') +pageini;
        }
      },
      complete: function() {
        //hideLoader();
      }
    });
  }
});

function abrirnmodal(val,div)
{
  if(val)
  {
    $('#'+div).modal({show: "'"+val+"'", backdrop: 'static'});
  }
  else
  {
    $('button.close').click();
  }  
}

function ifrome()
{
  var idform = "-";
  if(jQuery.type($('.select2_multiple').select2("val")) == "null"){}
  else
  {
    idform = $('.select2_multiple').select2("val");
    idform = idform.join('_');
  }
  return idform;
}

//Llega dd-mm-YY convierte YYYY-mm-dd
function datetoing(fec)
{
  var fec = fec.split("-");
  var fe_in = new Date(fec[2], fec[1] - 1, fec[0]);
  return moment(fe_in).format("YYYY-MM-DD");
}

function isSession(temp) {
  return $.ajax({
    type: "POST",
    url: $('base').attr('href') + 'clientes/traercont',
    data: {temp},
    dataType: "json",
    success: function(response) {
      if (response.code==1) {
        $('#div_celu').html(response.data.cell);
        $('#div_tel').html(response.data.tele);
      }
    },
    async: false,
    error: function() {
      alert("Error occured")
    }
  });
}

function primerdia_mes(mes) {
  console.log(mes);
  var date = new Date(), y = date.getFullYear();
  console.log(y);
  var firstDay = new Date(y, mes, 1);

  firstDay = moment(firstDay);

  return firstDay;
}

function ultimodia_mes(mes) {
  var date = new Date(), y = date.getFullYear();
  var lastDay = new Date(y, mes + 1, 0);
  lastDay = moment(lastDay);
  return lastDay;
}

function escapeHtml(text) 
{
  //console.log(text);
  var map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };

  return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}