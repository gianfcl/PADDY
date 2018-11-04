$( document ).ready(function() {

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

    $('#form_save_caja').validate({
      rules:
      {
        caja: {
          required:true, 
          minlength: 2,
          remote: {
            url: $('base').attr('href') + 'caja/validar_caja',
            type: "post",
            data: {
              caja: function() { return $( "#caja" ).val(); },
              id_caja: function() { return $( "#id_caja" ).val(); }
            }
          }
        },
        abreviatura:{required:true}
      },
      messages: 
      {
        caja: {required:"caja", minlength: "Más de 2 Letras", remote: "Ya existe" },
        abreviatura:{required:"Ingresar"}
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
          url: $('base').attr('href') + 'caja/save_caja',
          type: 'POST',
          data: $('#form_save_caja').serialize(),
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

              buscar_cajas(page);
            }
            else
            {
              if($('#caja').parents('.form-group').attr('class')=="form-group")
              {
                $('#caja').parents('.form-group').addClass('has-error');
              }
              
              if($('#caja-error').length>0)
              {
                $('#caja-error').html(response.message);
              }
              else
              {
                $('#caja').parents('.col-md-6').append("<span id='caja-error' class='help-block'>"+response.message+"</span>");
              }
            }
          },
          complete: function(response) {
            var id_caja = parseInt($('#id_caja').val());
            id_caja = (id_caja>0) ? (id_caja) : ("0");
            var text = (id_caja=="0") ? ("Guardo!") : ("Edito!");
            if(response.code == 0)
            {
              text = response.message;
            }
            alerta(text, 'Este Caja se '+text+'.', 'success');
            limp_todo('form_save_caja');
            $('#editcaja').modal('hide');
          }
        });
      }
    });
});

$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
});

$(document).on('click', '.add_caja', function (e)
{
  limp_todo('form_save_caja');
  $('#rtadocumentos').html('');
  $('#ocultaedit').removeClass('collapse');
  $('#configuracion-tabs').closest('li').addClass('hidden');
  $("a#caja-tabs").click();
  $('#namesucu').html('');
});

$(document).on('click', '.btn_limpiar', function (e) {
  limp_todo('form_save_caja');
  $('#editcaja').modal('hide');
  $('#namesucu').html('');
});

$(document).on('click', '#paginacion_datax li.paginate_button', function (e) {
  var page = $(this).find('a').attr('tabindex');
  buscar_cajas(page);
});

$(document).on('click', '#paginacion_datax a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_cajas(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_cajas(page);
});

function buscar_cajas(page)
{  
  var temp = "page="+page;
  var caja_busc = $('#caja_busc').val();
  var abreviatura_busc = $('#abreviatura_busc').val();

  if(caja_busc.trim().length)
  {
    temp=temp+'&caja_busc='+caja_busc;
  }

  if(abreviatura_busc.trim().length)
  {
    temp=temp+'&abreviatura_busc='+abreviatura_busc;
  }

  $.ajax({
    url: $('base').attr('href') + 'caja/buscar_cajas',
    type: 'POST',
    data: temp,
    dataType: "json",
    beforeSend: function() {
      //showLoader();
    },
    success: function(response) {
      if (response.code==1) {
        $('#datatable-buttons tbody#bodyindex').html(response.data.rta);
        $('#paginacion_data').html(response.data.paginacion);
      }
    },
    complete: function() {
      //hideLoader();
    }
  });
}

$(document).on('click', '.edit', function (e) {
  limp_todo('form_save_caja');
  $('#configuracion-tabs').closest('li').removeClass('hidden');
  var idcaja = $(this).parents('tr').attr('idcaja');
  $.ajax({
    url: $('base').attr('href') + 'caja/edit',
    type: 'POST',
    data: 'id_caja='+idcaja,
    dataType: "json",
    beforeSend: function() {
      limp_todo('form_save_caja');
    },
    success: function(response) {
      if (response.code==1) {
        $('#id_caja').val(response.data.id_caja);
        $('#caja').val(response.data.caja);
        $('#abreviatura').val(response.data.abreviatura);

        $('#estado label').removeClass('active');
        $('#estado input').prop('checked', false);

        var num = response.data.estado;
        $('#estado #estado_'+num).prop('checked', true);
        $('#estado #estado_'+num).parent('label').addClass('active');

        var valorcheck = "";
        $.each( response.data.chekmod, function( index, value ){
          valorcheck = (value==0) ? (false) : (true); console.log('index->'+index+' value->'+value);
          $('#chekmod'+index).prop('checked', valorcheck);
        });
        
        $('#check_docu').html(response.data.hidden);

        $('#rtadocumentos').html(response.data.htmconf);
        $('#namesucu').html(response.data.caja);

        $('div#tab_content2 #tagsinput').html(response.data.html)
      }
    },
    complete: function() {
      //hideLoader();
    }
  });
});

$(document).on('click', '.delete', function (e) {
  e.preventDefault();
  var idcaja = $(this).parents('tr').attr('idcaja');
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var nomb = "caja";

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
        url: $('base').attr('href') + 'caja/save_caja',
        type: 'POST',
        data: 'id_caja='+idcaja+'&estado=0',
        dataType: "json",
        beforeSend: function() {
          //showLoader();
        },
        success: function(response) {
          if (response.code==1) {              
            buscar_cajas(page);
          }
        },
        complete: function() {
          var text = "Elimino!";
          alerta(text, 'Esta '+nomb+' se '+text+'.', 'success');
          limp_todo('form_save_caja');
        }
      });
    }
  });    
});

$('#modcaja input[type="checkbox"]').on('change', function() {
  console.log("entra");
  if($(this).is(":checked"))  {
    $('#form_save_caja #check_docu').append("<input id='moneda"+$(this).val()+"' type='hidden' value='"+$(this).val()+"' name='moneda["+$(this).val()+"]' />");
  }
  else {
    $("#moneda"+$(this).val()).remove();
  }
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
      url: $('base').attr('href') + 'caja/guarda_usuario',
      type: 'POST',
      data: 'id_caja='+$('#id_caja').val()+'&id_usuario='+id,
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
  var idcaja = parseInt($('#id_caja').val()); //alert(idcaja);
  idcaja = (idcaja>0) ? (idcaja) : (0);
  if(idcaja>0)
  {
    var usuario_busc = $('#usuario_busc').val();

    var temp = "page="+page+'&id_caja='+idcaja;
    if($('div#tab_content2 div.bootstrap-tagsinput span.tag').length)
    {
      temp = temp+'&id_usu='+get_joinids();
    }

    if(usuario_busc.trim().length)
    {
      temp=temp+'&usuario_busc='+usuario_busc;
    }
    
    $.ajax({
      url: $('base').attr('href') + 'caja/todo_los_usuarios',
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
      url: $('base').attr('href') + 'caja/delete_usuario',
      type: 'POST',
      data: 'id_caja_det='+iddet,
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