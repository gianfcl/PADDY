/*Validar Al Salir del Formulario*/
$( document ).ready(function() {
  $.validator.addMethod("formespn",
    function(value, element) {
      if(value.trim().length)
        return /^(0?[1-9]|[12]\d|3[01])[\.\/\-](0?[1-9]|1[012])[\.\/\-]([12]\d)?(\d\d)$/.test( value );
      else
        return false;
  }, "Ingrese est Formato dd-mm-yyyy");

  $('#desde').datetimepicker({
    sideBySide: true,
    useCurrent: false,
    format: 'DD-MM-YYYY',
    locale: moment.locale("es")
  });

  $('#hasta').datetimepicker({
    sideBySide: true,
    useCurrent: false,
    format: 'DD-MM-YYYY',
    locale: moment.locale("es")
  });

  $("#desde").on("dp.change", function (e) {
    $('#hasta').data("DateTimePicker").minDate(e.date);    
  });

  $('#form_periodo1').validate({
    rules:
    {
      id_periodo: { required:true}
    },
    messages: 
    {
      id_periodo: { required:"Agregar Periodo"}
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
      editipo();      
    }
  });

  $('#form_periodo2').validate({
    rules:
    {
      desde: { formespn:true},
      hasta: { formespn:true}
    },
    messages: 
    {
      desde: { formespn:"Error"},
      hasta: { formespn:"Error"}
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
      editipo();     
    }
  });

  $('#form_save_salidaxconsumointerno').validate({
    rules:
    {
      fecha_ingreso:{ required:true, date: true },
      exist_pedido:{ required:true }
    },
    messages: 
    {
      fecha_ingreso: { required:"Ingresar", number: "Solo #s" },
      exist_pedido:{ required: "" } 
    },    

    highlight: function(element) {
      $(element).closest('.form-group').addClass('has-error');
      if($(element).attr('id')=="exist_pedido") 
      {
        alerta('Verificar!', 'Artículos', 'error');
      }          
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
      var i = valid_exist_pedido();

      if(i==1)
      {
        $.ajax({
          url: $('base').attr('href') + 'salidaxconsumointerno/save_imputaciones',
          type: 'POST',
          data: $('#form_save_salidaxconsumointerno').serialize(),
          dataType: "json",
          beforeSend: function() {
          },
          success: function(response) {
            if (response.code==1) {

            var tipo = $('#myTab li.active').attr('tabs');

            window.location.href = $('base').attr('href') +'salidaxconsumointerno/edit/'+response.data.id+'/'+tipo;
            }
          },
          complete: function() {
          }
        });/**/
      }
      else
      {
        var text = '';
        if(i>0) {
          text = 'Verificar Artículos';
        }
        else
        {
          text = 'Seleccionar Almacén';
        }
        alerta('No Puede Guardar!', text, 'error');
      }        
    }
  });
});

function editipo()
{
  var tip = parseInt($('#tabspad li.active a').attr('tipo'));
  var idsucu = parseInt($('#idsucu').val());
  var subtip = parseInt($('#tabs li.active a').attr('tipo'));
  var periodo = "";
  var que = false;
  var txtque = '';
  
  if(idsucu>0)
  {
    if(subtip>0)
    {
      $('table#lista_articulos tbody tr#'+idsucu+' td.det input.id_subtipo').val(subtip);
      var ids =  new Array();
      switch(subtip) {
        case 1:
          periodo = $('#form_periodo'+subtip+' select#id_periodo').val();
          
          $('#addperiodo').modal('hide');
          break;

        case 2:

          $('#form_periodo2 input.fech').each(function (ii, value){
            ids[ii] = $(this).val(); 
          });
          periodo = ids.join(';');
          $('#addperiodo').modal('hide');
          break;

        case 3:
          var padre = "";
          var va = "";
          var id = "";
          var sum = 0;
          var i = 0;

          $('#form_periodo3 #porcperido tbody tr.avn td.det').each(function (ii, value){
            padre = $(this);
            va = padre.find('input.valor').val();
            id = parseInt(padre.find('input.id').val());
            if(va.trim().length)
            {
              va = parseFloat(va);
              if(va>0)
              {
                if(id>0)
                {
                  ids[i] = id+','+va;
                  i++;
                }              
              }
              else
              {
                va = 0;
                padre.find('input.valor').val('')
              }
            }
            else
            {
              va = 0;
              padre.find('input.valor').val('')
            }
            sum = sum + va;        
          });

          if(sum>0)
          {
            periodo = ids.join(';');
            $('#addperiodo').modal('hide');
          }
          else
          {
            alerta('No Guardo', 'Debe Ingresar algun Peso', 'error');
          }        

          break;

        default:
          break;
      }
      $('table#lista_articulos tbody tr#'+idsucu+' td.det input.periodo').val(periodo);
    }  

    
    if(tip>0)
    {
      var idss = '';
      var textoidss = '';
      
      $('table#lista_articulos tbody tr#'+idsucu+' td.det input.id_tipo').val(tip);

      switch(tip) {
        case 1:
          var idact = parseInt($('#id_actividades').val());
          var idare = $('#id_areacosto').val();
          var idcen = $('#id_centrocosto').val();
          if(idact>0)
          {
            idss = idact+'~'+idare+'~'+idcen;
            que = true;
          }
          else
          {
            txtque = 'Seleccionar Actividad'
          }
                
          break;

        case 2:
          idss = parseInt($('#id_activofijo').val());
          textoidss = $('#activo_fijo').html();
          if(idss>0)
          {
            que = true;
          }
          else
          {
            txtque = 'Seleccionar Activo Fijo'
          }
          break;

        case 3:
          idss = $('#id_ordenproduccion').val();
          textoidss = $('#orden_produccion').html();
          if(idss>0)
          {
            que = true;
          }
          else
          {
            txtque = 'Seleccionar Orden Producción'
          }
          break;

        default:
          break;
      }
      $('table#lista_articulos tbody tr#'+idsucu+' td.det input.idss').val(idss); 
      $('table#lista_articulos tbody tr#'+idsucu+' td.det input.textoidss').val(textoidss);
    }
  }   
  if(que)
  {
    limpiando();
  $('#addperiodo').modal('hide'); 
  }
  else
  {

  }
   
}

function get_joinpvett(div)
{
  var ids =  new Array();
  var i = 0;
  $('#'+div+' tbody tr.ordenes td.pretotal span.pvett b').each(function (index, value){
    ids[i] = $(this).html();
    i++;
  });
  return ids.join(',');
}

$(document).on('click', '#form_periodo3 .guardporc', function (e) {
  editipo();
});

$(document).on('click', '#myTab li.tab a, .breadcrumb li a', function (e) {
    var url = $(this).attr('url');
    window.location.href = url;       
});
/*<---->*/
$(document).on('change', '#id_centrocosto', function (e) {
  
  var idcc = parseInt($(this).val());
  if(idcc>0)
  {
    $.ajax({
    url: $('base').attr('href') + 'areacosto/cbx_areacosto',
    type: 'POST',
    data: 'id_centrocosto='+idcc,
    dataType: "json",
    beforeSend: function() {
    },
    success: function(response) {
      if (response.code==1) {
        $('#id_areacosto').html(response.data);
      }
    },
    complete: function() {
    }
  });
  }
  else
  {
    $('#id_areacosto').html("<option value=''>Seleccionar</option>");
  }
});

$(document).on('change', '#id_areacosto', function (e) {
  var idcc = parseInt($(this).val());
  if(idcc>0)
  {
    $.ajax({
    url: $('base').attr('href') + 'actividades/cbx_actividades',
    type: 'POST',
    data: 'id_areacosto='+idcc,
    dataType: "json",
    beforeSend: function() {
    },
    success: function(response) {
      if (response.code==1) {
        $('#id_actividades').html(response.data);
      }
    },
    complete: function() {
    }
  });
  }
  else
  {
    $('#id_actividades').html("<option value=''>Seleccionar</option>");
  }
});

$(document).on('change', '.ccosto', function (e) {
  var padre = $(this);
  var idcc = parseInt(padre.val());
  if(idcc>0)
  {
    $.ajax({
    url: $('base').attr('href') + 'areacosto/cbx_areacosto',
    type: 'POST',
    data: 'id_centrocosto='+idcc,
    dataType: "json",
    beforeSend: function() {
    },
    success: function(response) {
      if (response.code==1) {
        padre.closest('tr').find('td.tdareacosto select').html(response.data);
      }
    },
    complete: function() {
    }
  });
  }
  else
  {
    padre.closest('tr').find('select.acosto').html("<option value=''>Seleccionar</option>");
  }
});

$(document).on('change', '.acosto', function (e) {
  var padre = $(this);
  var idcc = parseInt(padre.val());
  if(idcc>0)
  {
    $(this).removeClass('erroinput');
  }
  else
  {
    $(this).addClass('erroinput');
  }
});

function mostrartab(tab='', cont='', num='')
{
  $('a#'+tab+num).tab('show');
  $('a#'+tab+num).parents('li').attr({'class':'active'});
  $('div#'+cont+num).addClass('active');
}

function limpiando(argument) {
  //mostrartab('tabspad','tab_contentpad',1);
  //mostrartab('tabs','tab_content',1);
  $('#id_centrocosto').val('');
  $('#id_areacosto').html('');
  $('#id_actividades').html('');

  limp_todo('form_periodo1');
  limp_todo('form_periodo2');

  $('#id_activofijo').val('');
  $('#id_ordenproduccion').val('');

  $('#orden_produccion').html('');
  $('#activo_fijo').html('');
}

$(document).on('click', '.add_periodo', function (e) {
  var padre = $(this).parents('tr');
  var id = parseInt(padre.attr('id'));
  limpiando();
  var idtipo = parseInt(padre.find('td.det input.id_tipo').val());
  var idsubtipo = parseInt(padre.find('td.det input.id_subtipo').val());
  var periodo = padre.find('td.det input.periodo').val();

  if(id>0)
  {
    $('#idsucu').val(id);
    if(idsubtipo>0)
    {
      $( "div#addperiodo form input:text" ).val('');
      $( "div#addperiodo form select#id_periodo" ).val('');
      mostrartab('tabs','tab_content',idsubtipo);

      if(periodo.trim().length)
      {
        switch(idsubtipo)
        {          
          case 1:
            $('#id_periodo').val(periodo);
            break;

          case 2:
            var myarr = periodo.split(";");
            var desde = myarr[0];
            var hasta = myarr[1];
            $('form#form_periodo2 #desde input.fech').val(desde);
            $('form#form_periodo2 #hasta input.fech').val(hasta);            
            break;
          case 3:
            var myarr = periodo.split(";");
            var trozo = new Array();
            var id = 0;
            var fech = "";

            $.each(myarr, function (key, value) {
              trozo = value.split(",");
              id = trozo[0];
              fech = trozo[1];
              $('form#form_periodo3 table#porcperido tbody tr#'+id+' td.det input.valor').val(fech);
            });
            break;
          default:
            break;
        }
      }
    }

    if(idtipo>0)
    {
      mostrartab('tabspad','tab_contentpad',idtipo);

      var textoidss = padre.find('td.det input.textoidss').val();
      var idss = padre.find('td.det input.idss').val();

      switch(idtipo) {
        case 1:
          /*id_actividades~id_area~id_centrocosto*/
          if(idss.trim().length)
          {
            getinfo(idss);
          }        
        break;
        case 2:
          $('#id_activofijo').val(idtipo);
          $('#activo_fijo').html(textoidss);

        break;

        case 3:
          $('#id_ordenproduccion').val(idtipo);
          $('#orden_produccion').html(textoidss);
        break;

        default:
        break;
      }
    }
  }
       
  
});

$(document).on('click', '.saveimpt', function (e) {
  var sum = 0;
  var padre = "";
  var idacost = 0;
  var id_tipo = "";
  var url_modulo = $('#url_modulo').val(); //alert(url_modulo);
  var idss = '';

  var cantreg = parseInt($("form#form_save_"+url_modulo+" table tbody tr.ordenes").length);

  $("form#form_save_"+url_modulo+" table tbody tr.ordenes td.det input.idss").each(function (ii, value){
    idss = $(this).val();
    if(idss.trim().length){ sum++; } //alert(idss);
  });

  if(sum == 0) {
    alerta('Verificar al Menos Uno!', 'Periodo', 'error');
  }
  else {
    var url = $('#url_modulo').attr('href');
    $.ajax({
      url: $('base').attr('href') + 'imputaciones/save_imputaciones',
      type: 'POST',
      data: $('#form_save_'+url_modulo).serialize(),
      dataType: "json",
      beforeSend: function() {
      },
      success: function(response) {
        if (response.code==1) {

        var tipo = $('#myTab li.active').attr('tabs');
        var comp = parseInt(response.data.estimp);
        comp = (comp==4) ? ("/ver_documento/"+response.data.id) : ("/edit/"+response.data.id+'/'+tipo);
        window.location.href = $('base').attr('href') +url_modulo+comp;
        //window.location.href = url+comp;
        }
      },
      complete: function() {
      }
    });
  }
});

function getinfo(id)
{
  $.ajax({
    url: $('base').attr('href') + 'salidaxconsumointerno/getinfoactiv',
    type: 'POST',
    data: 'idactividad='+id,
    dataType: "json",
    beforeSend: function() {
    },
    success: function(response) {
      if (response.code==1) {
        $('#id_centrocosto').val(response.data.cbx_cc);
        $('#id_areacosto').html(response.data.cbx_ar);
        $('#id_actividades').html(response.data.cbx_ac);
      }
    },
    complete: function() {
    }
  });
}

function buscar_docu(page)
{
  var temp = "page="+page;
  var caso = parseInt($('#tabspad li.active a').attr('tipo'));
  $('table#buscar_document tbody').html('');
  $('#paginacion_data').html('');
  if(caso>1)
  {
    temp = temp+"&caso="+caso;
    var ids = "";
    var cod = $('#busca_cod').val();
    var desc = $('#busca_desc').val();
    if(cod.trim().length)
    {
      temp=temp+"&codigo_busc="+cod;
    }
    switch(caso) {
      case 2:
        if(desc.trim().length)
        {
          temp=temp+'&buscar_busc='+desc;
        }
        ids = parseInt($('#id_activofijo').val());
      break;

      case 3:
        if(desc.trim().length)
        {
          temp=temp+'&descripcion_busc='+desc;
        }
        ids = parseInt($('#id_ordenproduccion').val());
      break;

      default:
      break;
    }
    temp = (ids>0) ? (temp+'&ids='+ids) : (temp);
    
    $.ajax({
      url: $('base').attr('href') + 'salidaxconsumointerno/buscar_docu',
      type: 'POST',
      data: temp,
      dataType: "json",
      beforeSend: function() {
        $.LoadingOverlay("show", {image : "", fontawesome : "fa fa-spinner fa-spin"});
      },
      success: function(response) {
        if (response.code==1) {
          $('table#buscar_document tbody').html(response.data.rta);
          $('#paginacion_data').html(response.data.paginacion);
        }
      },
      complete: function() {
        $.LoadingOverlay("hide");
      }
    });
  }
}

$(document).on('click', '.buscar', function (e) {
  buscar_docu(0);
});

$(document).on('click', '.buscaratodocu', function (e) {
  buscar_docu(0);
});

$(document).on('click', '#paginacion_data li.paginate_button', function (e) {
  var page = $(this).find('a').attr('tabindex');
  buscar_docu(page);
});

$(document).on('click', '#paginacion_data a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_docu(page);
});

$(document).on('click', '#filtrodocument .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
});

$(document).on('click', '.adddocument', function (e) {
  var caso = parseInt($('#tabspad li.active a').attr('tipo'));
  var iddocu = parseInt($(this).parents('tr').attr('iddocu'));
  var descri = $(this).parents('tr').find('td.descrip').html();
  $('#buscardoc').modal('hide');
  mostrartab('tabspad','tab_contentpad',caso);
  if(caso>1 && iddocu>0)
  {
    switch(caso) {
      case 2:
        $('#id_activofijo').val(iddocu);
        $('#activo_fijo').html(descri);
      break;

      case 3:
        $('#id_ordenproduccion').val(iddocu);
        $('#orden_produccion').html(descri);
      break;

      default:
      break;
    }
  }
});

function valid_exist_pedido()
{
  var i = 0;
  var cantidad = 0;
  var va = 0;
  var padre = "";
  var no = 0;
  var canti = 0;
  var ialm = 0;
  var sto = 0;
  
  var num = parseInt($('#lista_articulos tbody tr.ordenes td.orden').length);

  if(num>0 && i==0) { va = 1; }
  else {
    if(i>0) { va=2; }
  }

  if(va==1)
  {
    $('#exist_pedido').val('si');
    $('#exist_pedido').parents('.form-group').removeClass('has-error');
  }
  else
  {      
    $('#exist_pedido').val('');
    $('#exist_pedido').parents('.form-group').addClass('has-error');    
  }
  return va;
}