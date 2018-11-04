$( document ).ready(function() {
  jQuery.validator.setDefaults({
    debug: true,
    success: "valid",
    ignore: ""
  });
  
  $('#form_save_sucursal').validate({
    rules:
    {
      nombre_sede: {required:true, minlength: 2 },
      referencia: {required:true, minlength: 2 },
      direccion: {required:true, minlength: 2 },    
      id_departamento: {required:true },
      id_provincia: {required:true },
      id_distrito: {required:true }
    },
    messages: 
    {
      nombre_sede: {required:"Nombre Sede", minlength: "Más de 2 Letras" },
      referencia: {required:"Referencia", minlength: "Más de 2 Letras" },
      direccion: {required:"Dirección", minlength: "Más de 2 Letras" },
      id_departamento: {required:"Departamento" },
      id_provincia: {required:"Provincia" },
      id_distrito: {required:"Distrito" }
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
      $.ajax({
        url: $('base').attr('href') + 'sucursal/save_sucursal',
        type: 'POST',
        data: $('#form_save_sucursal').serialize(),
        dataType: "json",
        beforeSend: function() {
          $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
        },
        success: function(response) {
          if (response.code==1) {
            var page = 0;
            if($('#paginacion_data ul.pagination li.active a').length>0)
            {
              page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
            }                     

            buscar_sucursals(page);
          }
          else
          {
            if($('#sucursal').parents('.form-group').attr('class')=="form-group")
            {
              $('#sucursal').parents('.form-group').addClass('has-error');
            }
            
            if($('#sucursal-error').length>0)
            {
              $('#sucursal-error').html(response.message);
            }
            else
            {
              $('#sucursal').parents('.col-md-6').append("<span id='sucursal-error' class='help-block'>"+response.message+"</span>");
            }
          }
        },
        complete: function(response) {
          $.LoadingOverlay("hide");
          var id_sucursal = parseInt($('#id_sucursal').val());
          id_sucursal = (id_sucursal>0) ? (id_sucursal) : ("0");
          var text = (id_sucursal=="0") ? ("Guardo!") : ("Edito!");
          if(response.code == 0)
          {
            text = response.message;
          }
          alerta(text, 'Esta Sucursal se '+text+'.', 'success');
          limpform('form_save_sucursal');
          $('#editsucursal').modal('hide');
        }
      });
    }
  });

  $('#form_save_sucu_docu').validate({
    rules:
    {
      serie: {required:true, minlength: 1 },
      folio_inicio: {required:true, minlength: 1 },
      folio_fin: {required:true, minlength: 1 }
    },
    messages: 
    {
      serie: {required:"Serie", minlength: "Más de 2 Letras" },
      folio_inicio: {required:"Folio Inicio", minlength: "Más de 2 Letras" },
      folio_fin: {required:"Folio Fin", minlength: "Más de 2 Letras" }
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
      var id_sucutipodocu = parseInt($('#id_sucutipodocu').val());
      var id_tipodocumento = parseInt($('#id_tipodocumento').val());
      var id_sucu = parseInt($('#id_sucursal').val());
      alert(id_tipodocumento+' <--> '+id_sucu)
      if(id_tipodocumento > 0 && id_sucu > 0)
      {
        $.ajax({
          url: $('base').attr('href') + 'sucursal/save_sucu_docu',
          type: 'POST',
          data: $('#form_save_sucu_docu').serialize()+'&id_sucursal='+id_sucu,
          dataType: "json",
          beforeSend: function() {
            $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
          },
          success: function(response) {
            if (response.code==1) {
              if(id_sucutipodocu > 0)
              {
                $('#conttr_'+id_sucutipodocu).html(response.data.rta);
              }
              else
              {
                $('#conttb_'+id_tipodocumento+' tbody').append(response.data.rta);
              }
              $('#reg_facturacion').modal('hide');
            }
          },
          complete: function(response) {
            $.LoadingOverlay("hide");          
          }
        });
      }        
    }
  });


});

$(function () {
  $( "#cliente" ).autocomplete({
    type:'POST',
    serviceUrl: $('base').attr('href')+"clientes/get_all_info_cliente",
    onSelect: function (suggestion) 
    {
      $('#id_cliente').val(suggestion.id_cliente);
      $('#cliente').val(suggestion.value);
      save_sucu('id_cliente='+suggestion.id_cliente+'&id_sucursal='+$('#id_sucursal').val());
      if($('#id_cliente-error').size())
      {
        $('#id_cliente-error').remove();
      }
    }
  });
});

function save_sucu(temp)
{
  $.ajax({
    url: $('base').attr('href') + 'sucursal/save_sucursal',
    type: 'POST',
    data: temp,
    dataType: "json",
    beforeSend: function() {
      $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
    },
    success: function(response) {
      if (response.code==1) {
        
      }
    },
    complete: function(response) {
      $.LoadingOverlay("hide");
    }
  });
}

$(document).on('change', '#id_grupo', function (e) {
  var idgrupo = parseInt($(this).val());
  if(idgrupo>0)
  {
    save_sucu('id_sucursal='+$('#id_sucursal').val()+'&id_grupo='+idgrupo)
  }
});

$(document).on('click', 'input.estado', function (e) {
  var thi = $(this);
  var estado = (thi.is(':checked')) ? (1): (0);
  thi.val(estado);
  estado = parseInt(estado);

  var conttr = thi.parents('table').find('tbody.conttbody tr.conttr');
  var aclass = thi.parents('th').find('a.add_massucu');

  if(estado)
  {
    conttr.removeClass('collapse');
    aclass.removeClass('collapse');
  }
  else
  {
    conttr.addClass('collapse');
    aclass.addClass('collapse');
  }  
});

$(document).on('click', '.add_massucu', function (e) {
  var tis = $(this);
  var viewtipdoc = tis.parents('th').find('span').html();

  $('#viewtipdoc b').html(viewtipdoc);
  $('#contseries .divseries').addClass('collapse');
  $("#contseries input").prop('disabled', true);

  var idtipodoc = tis.parents('table.tablecontipodoc').find('tbody.conttbody tr.conttr td.conttd table.conttb').attr('idtipodocumento');
  $('#id_tipodocumento').val(idtipodoc);

  var tienevar = parseInt(tis.parents('table.tablecontipodoc').find('tbody.conttbody tr.conttr td.conttd table.conttb').attr('tienevar'));
  var primercaracter = (tis.parents('table.tablecontipodoc').find('tbody.conttbody tr.conttr td.conttd table.conttb').attr('primerca'));
  var ceros = (tis.parents('table.tablecontipodoc').find('tbody.conttbody tr.conttr td.conttd table.conttb').attr('ceros'));
  var axu = parseInt(tis.parents('table.tablecontipodoc').find('tbody.conttbody tr.conttr td.conttd table.conttb').attr('axu'));
  console.log('tienevar-->'+tienevar+' axu-->'+axu+' primercaracter-->'+primercaracter+' ceros-->'+ceros);
  
  $('#contseries #divseries_'+axu).removeClass('collapse');
  $('#serie_'+axu).val('');
  $("#serie_"+axu).prop('disabled', false);
  $("#serie_"+axu).removeAttr("disabled");
  $('#primercaracter').val(primercaracter);
  $('#tienevarioscaracteres').val(tienevar);
  $('#ceros').val(ceros);

  if(axu == 2)
  {
    $('#divseries_'+axu+' span#basic-addon1 b.letras').html(primercaracter);
    $('#divseries_'+axu+' span#basic-addon1 b.cerotes').html(ceros);
    $('#divseries_'+axu).attr({'ceros':ceros});
  }
});

$(document).on('click', 'a.btnsave', function (e) {
  //var temp = $('#form_save_sucu_config').serialize();
  $.ajax({
    url: $('base').attr('href') + 'sucursal/save_config_sucu',
    type: 'POST',
    data: $('#form_save_sucu_config').serialize()+'&id_sucursal='+$('#id_sucursal').val(),
    dataType: "json",
    beforeSend: function() {
      $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
    },
    success: function(response) {
      if (response.code==1) {
        $('#editsucursal').modal('hide');
      }
    },
    complete: function(response) {
      $.LoadingOverlay("hide");
    }
  });
});

$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
});

$(document).on('click', '.add_sucursal', function (e)
{
  limpform('form_save_sucursal');
  $('#rtadocumentos').html('');
  $('#ocultaedit').removeClass('collapse');
  $('#configuracion-tabs').closest('li').addClass('hidden');
  $("a#usuario-tabs").click();
  $('#namesucu').html('');
  $('#myTab').addClass('hidden');
});

$(document).on('click', '.btn_limpiar', function (e) {
  limpform('form_save_sucursal');
  $('#editsucursal').modal('hide');
  $('#namesucu').html('');
});

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {
  var page = $(this).find('a').attr('tabindex');
  buscar_sucursals(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_sucursals(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_sucursals(page);
});

function buscar_sucursals(page)
{
  var um_busc = $('#um_busc').val();
  var temp = "page="+page;
  if(um_busc.trim().length)
  {
    temp=temp+'&um_busc='+um_busc;
  }
  $.ajax({
    url: $('base').attr('href') + 'sucursal/buscar_sucursales',
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

$(document).on('change', '#id_departamento', function (e)
{
  var id_departamento = $(this).val();

  $.ajax({
    url: $('base').attr('href') + 'ubigeo/combox_prov',
    type: 'POST',
    data: 'id_departamento='+id_departamento,
    dataType: "json",
    success: function(response) {
      if (response.code == "1") {
        $('#id_provincia').html(response.data);
        $('#id_distrito').html("<option value=''>DISTRITO</option>");
      }
    },
    complete: function() {
        //hideLoader();
    }
  });
});

$(document).on('change', '#id_provincia', function (e)
{
  var id_provincia = $(this).val();

  $.ajax({
    url: $('base').attr('href') + 'ubigeo/combox_dist',
    type: 'POST',
    data: 'id_provincia='+id_provincia,
    dataType: "json",
    success: function(response) {
      if (response.code == "1") {
        $('#id_distrito').html(response.data);
      }
    },
    complete: function() {
      //hideLoader();
    }
  });
});

$(document).on('click', '.edit', function (e) {
  $('#myTab').removeClass('hidden');
  var idsucursal = $(this).parents('tr').attr('idsucursal');
  $('#configuracion-tabs').closest('li').removeClass('hidden');
  $('.editcvs').val(0);
  $('.editcvs').prop('checked',false);
  $('.editcvs').iCheck('update');

  $.ajax({
    url: $('base').attr('href') + 'sucursal/edit',
    type: 'POST',
    data: 'id_sucursal='+idsucursal,
    dataType: "json",
    beforeSend: function() {
      limpform('form_save_sucursal');
      $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
    },
    success: function(response) {
      if (response.code==1) {
        $('#id_sucursal').val(response.data.id_sucursal);
        $('#nombre_sede').val(response.data.nombre_sede);
        $('#referencia').val(response.data.referencia);
        $('#direccion').val(response.data.direccion);
        $('#id_departamento').val(response.data.id_departamento);
        $('#id_provincia').html(response.data.provincia);
        $('#id_distrito').html(response.data.distrito);

        $('#estado label').removeClass('active');
        $('#estado input').prop('checked', false);

        var num = response.data.estado;
        $('#estado #estado_'+num).prop('checked', true);
        $('#estado #estado_'+num).parent('label').addClass('active');

        $('#rtadocumentos').html(response.data.htmconf); 
         $('#prueba').html(response.data.prueba);  //-
        $('#namesucu').html(response.data.nombre_sede);

        $('table#tb_canalventas tbody').html(response.data.htmcanv);
        $('#id_cliente').val(response.data.id_cliente);
        $('#cliente').val(response.data.cliente);
        $('#id_grupo').html(response.data.cbxgrupo);
        var cv = response.data.canalventaxem;
        
        for (idxem in cv) {
          if($('input[cv='+idxem+']').length)
          {
            var chckd = cv[idxem].estado==1 ? true : false;
            
            $('input[cv='+idxem+']').prop('checked',chckd);
            $('input[cv='+idxem+']').parent().iCheck('update');
            $('input[cv='+idxem+']').val(cv[idxem].id);
          }
        }
      }
    },
    complete: function() {
      $.LoadingOverlay("hide");
    }
  });
});

$(document).on('click', '.delete', function (e) {
  e.preventDefault();
  var idsucursal = $(this).parents('tr').attr('idsucursal');
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var nomb = "Sucursal";

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
        url: $('base').attr('href') + 'sucursal/save_sucursal',
        type: 'POST',
        data: 'id_sucursal='+idsucursal+'&estado=0',
        dataType: "json",
        beforeSend: function() {
          $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
        },
        success: function(response) {
          if (response.code==1) {              
            buscar_sucursales(page);
          }
        },
        complete: function() {
          $.LoadingOverlay("hide");
          var text = "Elimino!";
          alerta(text, 'Esta '+nomb+' se '+text+'.', 'success');
          limpform('form_save_sucursal');
        }
      });
    }
  });    
});

$(document).on('focusout', '.seri', function (e) {
  var ceros = $(this).val();
  ceros = addzeros(ceros);
  var padre = $(this).parents('tr');
  
  padre.find('td.serie b.cerotes').html('#'+ceros);
  padre.find('td.serie input.ceros').val(ceros);
});

function addzeros(s) {
  var str = "000";
  var cant = 3-s.length;
  return (cant==0) ? ("") : (str.substring(0, cant));
}

$(document).on('change', '.esta_do', function (e)
{
  var thi = $(this);
  var estado = (thi.is(':checked')) ? ("1"): ("0");
  thi.val(estado);

  var valor = (estado>0) ? (false) : (true);
  var padre = thi.parents('tr');
  padre.find('td.selecc select').prop( "disabled", valor );
});

$(document).on('change', '.idselec', function (e)
{
  var thi = $(this);
  var padre = thi.parents('tr');
  var idcanalventas = parseInt(padre.attr('idcanalventas'));
  var idsucu = parseInt($('#id_sucursal').val());

  if(idcanalventas>0 && idsucu>0)
  {
    $.ajax({
      url: $('base').attr('href') + 'sucursal/canalventa_sucu',
      type: 'POST',
      data: 'id_canalventas='+idcanalventas+'&id_sucursal='+idsucu,
      dataType: "json",
      success: function(response) {
        if (response.code == "1") {
        }
      },
      complete: function() {
        //hideLoader();
      }
    });
  }
});

$(document).on('change', '.estado_check', function (e){
    console.log("okasdasd")

    check = document.getElementById("escompras");
    if (check.checked) {
      $(".agregar_button").show();
     
    }
    else {
      $(".agregar_button").hide();
         
    }
});

$('.editcvs').on('ifChanged', function(event){
  $(event.target).trigger('change');
});

$(document).on('change','.editcvs',function () {
  var idsucu = $('#id_sucursal').val();

  if(idsucu)
  {
    var t = $(this);
    var estd = t.is(':checked') ? 1 : 0;
    var idcvsucu = parseInt(t.val())>0 ? t.val() : 0;
    var cvemp = t.attr('cv'); 
    var iable = 'idcvsucu='+idcvsucu+'&cvemp='+cvemp+'&estd='+estd+'&idsucu='+idsucu;

    $.ajax({
      url: $('base').attr('href') + 'sucursal/save_canalventa',
      type: 'POST',
      data: iable,
      dataType: "json",
      beforeSend: function() {
        $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
      },
      success: function(response) {
        if (response.code==1) {
          t.val(response.data.id);
        }
      },
      complete: function(response) {
        $.LoadingOverlay("hide");
      }
    });
  }
});

$(document).on('click','.editsucutipodocu',function () {
  var tis = $(this);
  var idtipodoc = parseInt(tis.parents('table.conttb').attr('idtipodocumento'));
  var id_sucuti = parseInt(tis.parents('tr').attr('idsucutipodocu'));  
  var viewtipdoc = tis.parents('table.tablecontipodoc').find('thead tr th span').html();
  $('#viewtipdoc b').html(viewtipdoc);

  alert(viewtipdoc+'<-->'+idtipodoc+'<-->'+id_sucuti)

  
  if(idtipodoc > 0 && id_sucuti > 0)
  {
    $('#id_sucutipodocu').val(id_sucuti);
    $('#id_tipodocumento').val(idtipodoc);
    $.ajax({
      url: $('base').attr('href') + 'sucursal/editsucudocu',
      type: 'POST',
      data: 'id_sucutipodocu='+id_sucuti,
      dataType: "json",
      beforeSend: function() {
        $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
      },
      success: function(response) {
        if (response.code==1) {
          //$('#conttr_'+id_sucuti).html(response.data.rta);
          //$('#reg_facturacion').modal('hide');
        }
      },
      complete: function(response) {
        $.LoadingOverlay("hide");
      }
    });
  }
});
