$( document ).ready(function() {

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

    $('#form_save_cuenta').validate({
      rules:
      {
        cuenta: {
          required:true, 
          minlength: 2,
          remote: {
            url: $('base').attr('href') + 'cuenta/validar_cuenta',
            type: "post",
            data: {
              cuenta: function() { return $( "#cuenta" ).val(); },
              id_cuenta: function() { return $( "#id_cuenta" ).val(); }
            }
          }
        },
        abreviatura:{required:true},
        id_moneda:{required: true},
        es_efectivo:{required:true}
      },
      messages: 
      {
        cuenta: {required:"Escribir", minlength: "Más de 2 Letras", remote: "Ya existe" },
        abreviatura:{required:"Ingresar"},
        id_moneda: {required: "Seleccione"},
        es_efectivo: {required: "Selecionar"},
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
        var pasa = true;
        var a=$('#es_efectivo').val();
        var b=$('#es_tarjeta').val();
        console.log(a);
        console.log(b);

        if(($('#es_efectivo').val()=='Bancario') && ($('#id_provbanco').val()=='' || $('#n_cuenta').val()=='' || $('#n_cuentaint').val()=='' ))
        {
          pasa=false;
          swal('¡No Puede guardar!','LLene los campos necesarios, banco, cuenta bancaria e interbancaria','error');
        }

        if($('#es_tarjeta').val()=='SI' && !($('#id_tarjeta').val()>0))
        {
          pasa=false;
          swal('¡No Puede guardar!','Seleccione una tarjeta','error');
        }

        if(pasa)
        {       
          $.ajax({
            url: $('base').attr('href') + 'cuenta/save_cuenta',
            type: 'POST',
            data: $('#form_save_cuenta').serialize()+'&tipo='+$('#datatable-buttons').attr('tipo'),
            dataType: "json",
            beforeSend: function() {
                //showLoader();
            },
            success: function(response) {
              if (response.code==1) {
                var page = 0;
                if($('#paginacion_data ul.pagination li.active a').length>0)
                {
                  page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
                }                     

                buscar_cuentas(page);
              }
              else
              {
                if($('#cuenta').parents('.form-group').attr('class')=="form-group")
                {
                  $('#cuenta').parents('.form-group').addClass('has-error');
                }
                
                if($('#cuenta-error').length>0)
                {
                  $('#cuenta-error').html(response.message);
                }
                else
                {
                  $('#cuenta').parents('.col-md-6').append("<span id='cuenta-error' class='help-block'>"+response.message+"</span>");
                }
              }
            },
            complete: function(response) {
              var id_cuenta = parseInt($('#id_cuenta').val());
              id_cuenta = (id_cuenta>0) ? (id_cuenta) : ("0");
              var text = (id_cuenta=="0") ? ("Guardo!") : ("Edito!");
              if(response.code == 0)
              {
                text = response.message;
              }
              alerta(text, 'Este cuenta se '+text+'.', 'success');
              limp_todo('form_save_cuenta');
              $('#editcuenta').modal('hide');
            }
          });
        }
      }
    });
});

$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
});

$(document).on('click', '.add_cuenta', function (e)
{
  //limp_todo('form_save_cuenta');
  $('#rtadocumentos').html('');
  $('#ocultaedit').removeClass('collapse');
  $('#id_moneda').removeAttr('disabled');
  $('#configuracion-tabs').closest('li').addClass('hidden');
  $("a#cuenta-tabs").click();
  $('#namesucu').html('');
  var tipo = parseInt($('#datatable-buttons').attr('tipo'));
  tipo = tipo > 0 ? tipo : 0;
  $('#tipo').val(tipo);
});

$(document).on('click', '.btn_limpiar', function (e) {
  limp_todo('form_save_cuenta');
  $('#editcuenta').modal('hide');
  $('#namesucu').html('');
  var tipo = parseInt($('#datatable-buttons').attr('tipo'));
  tipo = tipo > 0 ? tipo : 0;
  $('#tipo').val(tipo);
});

$(document).on('click', '#paginacion_datax li.paginate_button', function (e) {
  var page = $(this).find('a').attr('tabindex');
  buscar_cuentas(page);
});

$(document).on('click', '#paginacion_datax a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_cuentas(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_cuentas(page);
});

function buscar_cuentas(page)
{  
  var temp = "page="+page;
  var cuenta_busc = $('#cuenta_busc').val();
  var abreviatura_busc = $('#abreviatura_busc').val();
  var tipo = parseInt($('#datatable-buttons').attr('tipo'));
  var mon = $('#id_moneda_busc').val();
  var usu = $('#usua_busc').val();
  var banc = $('#banco_busc').val();
  var tipocu = $('#tipo_cuent').val();
  var tipotar = $('#tipotarjeta_busc').val();
  if(tipo >0) 
  {
    temp = temp+'&tipo='+tipo;
  }

  if(cuenta_busc.trim().length)
  {
    temp=temp+'&cuenta_busc='+cuenta_busc;
  }

  if(abreviatura_busc.trim().length)
  {
    temp=temp+'&abreviatura_busc='+abreviatura_busc;
  }

  if(parseInt(mon)>0)
  {
    temp=temp+'&id_moneda='+mon;
  }

  if(usu.trim().length)
  {
    temp=temp+'&usuario='+usu;
  }
  if(parseInt(tipocu)>-1 && tipocu!=null)
  {
    temp=temp+'&es_efectivo='+tipocu;
  }
  if(banc.trim().length)
  {
    temp=temp+'&banco='+banc;
  }
  if(parseInt(tipotar)>0)
  {
    temp=temp+'&es_tarjeta='+1;
    temp=temp+'&id_tarjeta='+tipotar;
  }
  console.log(temp);
  $.ajax({
    url: $('base').attr('href') + 'cuenta/buscar_cuentas',
    type: 'POST',
    data: temp,
    dataType: "json",
    beforeSend: function() {
      $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
    },
    success: function(response) {
      if (response.code==1) {
        $('#datatable-buttons tbody#bodyindex').html(response.data.rta);
        $('#paginacion_data').html(response.data.paginacion);
      }
    },
    complete: function() {
      $.LoadingOverlay("hide");
    }
  });
}

$(document).on('click', '.edit', function (e) {
  limp_todo('form_save_cuenta');
  $('#configuracion-tabs').closest('li').removeClass('hidden');
  var idcuenta = $(this).parents('tr').attr('idcuenta');
  console.log(idcuenta);
  $.ajax({
    url: $('base').attr('href') + 'cuenta/edit',
    type: 'POST',
    data: 'id_cuenta='+idcuenta,
    dataType: "json",
    beforeSend: function() {
      $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
    },
    success: function(response) {
      if (response.code==1) {
        $('#id_cuenta').val(response.data.id_cuenta);
        $('#tipo').val(response.data.tipo);
        $('#cuenta').val(response.data.cuenta);
        $('#abreviatura').val(response.data.abreviatura);
        $('#id_moneda').val(response.data.id_moneda);
        $('#n_cuenta').val(response.data.n_cuenta);
        $('#n_cuentaint').val(response.data.n_cuentaint);
        var a= response.data.mov;
        if(a==1){
        $('#id_moneda').attr('disabled','disabled');}
        else{
        $('#id_moneda').removeAttr('disabled');
        }

        var es_efectivo = ((parseInt(response.data.es_efectivo))==0 || isNaN(parseInt(response.data.es_efectivo))) ? 0 : response.data.es_efectivo;
        var es_tarjeta = ((parseInt(response.data.es_tarjeta))==0 || isNaN(parseInt(response.data.es_tarjeta))) ? 0 : response.data.es_tarjeta;
        if(es_efectivo)
        {
          console.log(es_efectivo);
          $('#es_efectivo').val('Efectivo');
          $('#id_provbanco').val('');
          $('#n_cuenta').val('');
          $('#n_cuentaint').val('');
          $('#id_tarjeta').val('');
          $('#es_tarjeta').val('NO');
          $('#cuentadiv').addClass('hidden');
          $('#num_cuent').addClass('hidden');
          $('#num_intercuent').addClass('hidden');
          $('#tarje_es').addClass('hidden');
          $('#div_tarj').addClass('hidden');
        }
        else
        {
          console.log(es_efectivo);
          $('#es_efectivo').val('Bancario');
          $('#cuentadiv').removeClass('hidden');
          $('#num_cuent').removeClass('hidden');
          $('#num_intercuent').removeClass('hidden');
          $('#tarje_es').removeClass('hidden');
          $('#id_provbanco').val(response.data.id_provbanco);
          $('#es_tarjeta').val('');
          if(es_tarjeta)
          {
            console.log(es_tarjeta);
            $('#es_tarjeta').val('SI');
            $('#div_tarj').removeClass('hidden');
            $('#id_tarjeta').val(response.data.id_tarjeta);
          }
          else
          {
            $('#es_tarjeta').val('NO');
            $('#id_tarjeta').val('');
          }          
        }

        var movcajaentra = (isNaN(parseInt(response.data.movcajaentra))) ? 0 : response.data.movcajaentra;
        //console.log(movcajaentra);
        if(movcajaentra==1)
        {
          //console.log("entro");
          $('#movcajaentra').prop('checked',true);
        }else{
          $('#movcajaentra').prop('checked',false);
        }
        var movcajasale = (isNaN(parseInt(response.data.movcajasale))) ? 0 : response.data.movcajasale;
        if(movcajasale==1)
        {
          //console.log("entro");
          $('#movcajasale').prop('checked',true);
        }else{
          $('#movcajasale').prop('checked',false);
        }
        $('#estado label').removeClass('active');
        $('#estado input').prop('checked', false);

        var num = response.data.estado;
        $('#estado #estado_'+num).prop('checked', true);
        $('#estado #estado_'+num).parent('label').addClass('active');


        $('#check_docu').html(response.data.hidden);

        $('#rtadocumentos').html('');

        //$('#rtadocumentos').html(response.data.htmconf);
        $('#namesucu').html(response.data.cuenta);

        $('div#tab_content2 #tagsinput').html(response.data.html)
      }
    },
    complete: function() {
      $.LoadingOverlay("hide");
    }
  });
});

$(document).on('click', '.delete', function (e) {
  e.preventDefault();
  var idcuenta = $(this).parents('tr').attr('idcuenta');
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var nomb = "cuenta";

  swal({
    title: 'Estas Seguro?',
    text: "De Eliminar este "+nomb,
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, estoy seguro!'
  }).then(function(isConfirm) {
    if (isConfirm) {     
      $.ajax({
        url: $('base').attr('href') + 'cuenta/save_cuenta',
        type: 'POST',
        data: 'id_cuenta='+idcuenta+'&estado=0',
        dataType: "json",
        beforeSend: function() {
          //showLoader();
        },
        success: function(response) {
          if (response.code==1) {              
            buscar_cuentas(page);
          }
        },
        complete: function() {
          var text = "Elimino!";
          alerta(text, 'Esta '+nomb+' se '+text+'.', 'success');
          limp_todo('form_save_cuenta');
        }
      });
    }
  });    
});

$(document).on('click', '#buscar_usu .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
  var page = 0;

  buscar_usuarios(page);
});

$(document).on('click', '.add_usuarios', function (e) {
  var page = 0;
  var padre = $(this).parents('tr');
  var id = parseInt(padre.attr('idusuario'));
  var iddet = 0;
  var html = "";
  id = (id>0) ? (id) : (0);
  if(id>0)
  {
    var i = parseInt($('div#tab_content2 div.bootstrap-tagsinput span.tag').length)+1;
    var clas = "primary";
    clas = (i%2 == 1) ? ('success') : (clas);
    var desc = padre.find('td.desc').html();
    
    remover_usu(id);
    $.ajax({
      url: $('base').attr('href') + 'cuenta/guarda_usuario',
      type: 'POST',
      data: 'id_cuenta='+$('#id_cuenta').val()+'&id_usuario='+id,
      dataType: "json",
      beforeSend: function() {
        $('#buscar_usu').LoadingOverlay("show", {image : "", fontawesome : "fa fa-spinner fa-spin"});
      },
      success: function(response) {
        if (response.code==1) {
          iddet = response.data.id;
          html = "<span class='tag label label-"+clas+"' iddet='"+iddet+"' id='"+id+"'>"+desc+"<span data-role='remove' class='delusu'></span>";
          $('div#tab_content2 div.bootstrap-tagsinput').append(html);
        }
      },
      complete: function() {
        $('#buscar_usu').LoadingOverlay("hide");
      }
    });
  }
});

$(document).on('click', '#pagina_data_buscar li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  buscar_usuarios(page);
});

$(document).on('click', '#pagina_data_buscar a.paginate_button', function (e) {  
  var page = $(this).attr('tabindex');
  buscar_usuarios(page);
});

$(document).on('click', 'table#buscar_usu a.buscarfiltro', function (e) {  
  buscar_usuarios(0);
});

function buscar_usuarios(page)
{
  var idcuenta = parseInt($('#id_cuenta').val()); //alert(idcuenta);
  idcuenta = (idcuenta>0) ? (idcuenta) : (0);
  if(idcuenta>0)
  {
    var usuario_busc = $('#usuario_busc').val();

    var temp = "page="+page+'&id_cuenta='+idcuenta;
    if($('div#tab_content2 div.bootstrap-tagsinput span.tag').length)
    {
      temp = temp+'&id_usu='+get_joinids();
    }

    if(usuario_busc.trim().length)
    {
      temp=temp+'&usuario_busc='+usuario_busc;
    }
    
    $.ajax({
      url: $('base').attr('href') + 'cuenta/todo_los_usuarios',
      type: 'POST',
      data: temp,
      dataType: "json",
      beforeSend: function() {
        $('#buscar_usu').LoadingOverlay("show", {image : "", fontawesome : "fa fa-spinner fa-spin"});
      },
      success: function(response) {
        if (response.code==1) {
          $('#buscar_usu tbody').html(response.data.rta);
          $('#pagina_data_buscar').html(response.data.paginacion);
        }
      },
      complete: function() {
        $('#buscar_usu').LoadingOverlay("hide");
      }
    });
  }
    
}

$(document).on('click', 'span.delusu', function (e) {
  var id = parseInt($(this).parents('span.tag').attr('id'));
  var iddet = parseInt($(this).parents('span.tag').attr('iddet'));
  if(id>0 && iddet>0)
  {
    $('span#'+id).remove();

    $.ajax({
      url: $('base').attr('href') + 'cuenta/delete_usuario',
      type: 'POST',
      data: 'id_cuenta_det='+iddet,
      dataType: "json",
      beforeSend: function() {
        $('#buscar_usu').LoadingOverlay("show", {image : "", fontawesome : "fa fa-spinner fa-spin"});
      },
      success: function(response) {
        if (response.code==1) {
        }
      },
      complete: function() {
        $('#buscar_usu').LoadingOverlay("hide");
      }
    });
  }
});

$(document).on('click', 'span.delarti', function (e) {
  var id = parseInt($(this).parents('span.tag').attr('id'));
  var iddet = parseInt($(this).parents('span.tag').attr('iddet'));
  if(id>0 && iddet>0)
  {
    $('span#'+id).remove();

    $.ajax({
      url: $('base').attr('href') + 'cuenta/delete_usuario',
      type: 'POST',
      data: 'id_cuenta_det='+iddet,
      dataType: "json",
      beforeSend: function() {
        $('#buscar_usu').LoadingOverlay("show", {image : "", fontawesome : "fa fa-spinner fa-spin"});
      },
      success: function(response) {
        if (response.code==1) {
        }
      },
      complete: function() {
        $('#buscar_usu').LoadingOverlay("hide");
      }
    });
  }
});

function remover_usu(idusu)
{
  if($('#buscar_usu tbody tr#'+idusu).length)
  {
    $('#buscar_usu tr#'+idusu).remove();
    var limite = parseInt($('table#datatable-buttons').attr('limite'));
    limite = (limite>0) ? (limite) : (0);
    if($('#buscar_usu tbody tr td.orden').length) 
    {
      var page = $('div#pagina_data_buscar ul.pagination li.active a.active').attr('tabindex');
      page = (page>0) ? (page) : (0);
      var i = page*limite;
      $('table#buscar_usu tbody tr td.orden').each(function (index, value){
        i++;
        $(this).html(i);
      });
    }
    else
    {
      buscar_usuarios(0);
    }
  }    
}

function get_joinids()
{
  var ids =  new Array();
  var i = 0;
  $('div#tab_content2 div.bootstrap-tagsinput span.tag').each(function (index, value){
    ids[i] = $(this).attr('id');
    i++;
  });
  return ids.join(',');
}

$(document).on('change','#es_efectivo',function(){
  if($(this).val()=='Efectivo')
  {
    $('#id_cuentabancaria').val('');
    $('#cuentadiv').addClass('hidden');
    $('#num_cuent').addClass('hidden');
    $('#num_intercuent').addClass('hidden');
    $('#es_tarjeta').val('NO');
    $('#tarje_es').addClass('hidden');
    $('#div_tarj').addClass('hidden');
    $('#id_provbanco').val('');
    $('#n_cuentaint').val('');
    $('#n_cuenta').val('');
    $('#id_tarjeta').val('');
  }
  else if($(this).val()=='Bancario')
  {
    $('#cuentadiv').removeClass('hidden');
    $('#num_cuent').removeClass('hidden');
    $('#num_intercuent').removeClass('hidden');
    $('#tarje_es').removeClass('hidden');
    $('#es_tarjeta').val('');
    $('#id_tarjeta').val('Seleccione Tarjeta');
  }
});

$(document).on('change','#es_tarjeta',function(){
  if($(this).val()=='SI')
  {
    $('#div_tarj').removeClass('hidden');
    $('#id_tarjeta').val('Seleccione Tarjeta');
  }
  else if($(this).val()=='NO')
  {
    $('#div_tarj').addClass('hidden');
  }
});

$('#configuracion-tabs').click(function(){
  buscar_usuarios(0);
});

$('#movcajaentra').click(function(){
  var valor= $(this).is(':checked') ? 1 : 0;
  var id = $('#id_cuenta').val();
  var campo = 'movcajaentra';
  edit_campo(id,campo,valor);
});

$('#movcajasale').click(function(){
  var valor= $(this).is(':checked') ? 1 : 0;
  var id = $('#id_cuenta').val();
  var campo = 'movcajasale';
  edit_campo(id,campo,valor);
});

function edit_campo(id, campo , valor) 
{
  var param = 'campo='+campo+'&id='+id+'&valor='+valor;
  $.ajax({
    url: $('base').attr('href') + 'cuenta/edit_campo',
    type: 'POST',
    data:  param,
    dataType: "json",
    beforeSend: function() {
      $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
    },
    success: function(response) {
      if (response.code==1) {
      }
    },
    complete: function() {
      $.LoadingOverlay("hide");

    }
  });
}
$(document).on('click', '#datatable-buttons .refresh', function (e) {
  $("#usua_busc").val('');
  $("#id_moneda_busc").val('');
  $("#cuenta_busc").val('');
  $("#abreviatura_busc").val('');
  $("#tipo_cuent").val('');
  $("#tipotarjeta_busc").val('');
  $("#banco_busc").val('');
});