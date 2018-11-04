$( document ).ready(function() {

  jQuery.validator.setDefaults({
    debug: true,
    success: "valid",
    ignore: ""
  });

  $(function() {
    $('input#fecha_vencimiento').daterangepicker({
      singleDatePicker: true,
      showDropdowns: true,
      locale : moment.locale('es'),
      format: 'DD-MM-YYYY',
      minDate: moment()
    });
  });

  $(function() {
    $('input#fechalimite_busc').daterangepicker({
      singleDatePicker: true,
      showDropdowns: true,
      locale : moment.locale('es'),
      format: 'DD-MM-YYYY',
    });
  });

  $('input#fecha_vencimiento').on('show.daterangepicker', function(ev, picker) {
    $('.dropdown-menu').css('z-index',99999);
  });
  $(document)
  .one('focus.autoExpand', 'textarea.autoExpand', function(){
      var savedValue = this.value;
      this.value = '';
      this.baseScrollHeight = this.scrollHeight;
      this.value = savedValue;
  })
  .on('input.autoExpand', 'textarea.autoExpand', function(){
      var minRows = this.getAttribute('data-min-rows')|0, rows;
      this.rows = minRows;
      rows = Math.ceil((this.scrollHeight - this.baseScrollHeight) / 17);
      this.rows = minRows + rows;
  });

  $('#form_save_listadopendientes').validate({
    rules:
    {
      estatus:
      {
        required: true
      },
      usuario_responsable:
      {
        required: true
      },
      puntoseguimiento:
      {
        required: true
      },
      prioridad:
      {
        required: true
      }   
    },
    messages: 
    {
      estatus:
      {
        required : ""
      },
      usuario_responsable:
      {
        required: "Responsable"
      },
      puntoseguimiento:
      {
        required: "Falta"
      },
      prioridad:
      {
        required: "Prioridad"
      }
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
        url: $('base').attr('href') + 'listadopendientes/rewrite_eadpuntos_segui',
        type: 'POST',
        data: $('#form_save_listadopendientes').serialize(),
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
            }
        },
        complete: function() {
          $('#editlistadopendientes').modal('hide');
          buscar_listadopendientess(0);
          $.LoadingOverlay("hide");
          alerta('Bien hecho!', 'Cambios guardados correctamente.', 'success');
          limpiarform();

        }
      });
    }
  });

  $('#form_save_subtareas').validate({

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
      error.insertAfter(element.parent()); 
    },
    submitHandler: function() {
      $.ajax({
        url: $('base').attr('href') + 'listadopendientes/save_subtareas',
        type: 'POST',
        data: $('#form_save_subtareas').serialize(),
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
            }
        },
        complete: function() {
          $('#agregar_subtareas').modal('hide');
          $.LoadingOverlay("hide");
          alerta('Bien hecho!', 'Datos guardados correctamente.', 'success');
          limpiar_form_subtareas();
        }
      });
    }
  });
});

$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
  $('#eadequipo_busc').val('');
  $('#responsable_busc').html('');
  $('#tarea_busc').html('');
  $('#prioridad_busc').html('');
  $('#categoria_busc').html('');
  $('#estatus_busc').html('');
  $('#fechalimite_busc').html('');
  $('#prioridad_busc').selectpicker({title: 'No Hay datos'});
  $('#prioridad_busc').selectpicker('render');
  $('#estatus_busc').selectpicker({title: 'No Hay datos'});
  $('#estatus_busc').selectpicker('render');

  $('#prioridad_busc').selectpicker('refresh');
  $('#estatus_busc').selectpicker('refresh');
  $('#eadequip').text('');
  buscar_listadopendientess(0);
});

$(document).on('click', '.btn_limpiar', function (e) {
  limpiarform();
  $('#editlistadopendientes').modal('hide');
});

function limpiarform()
{
  $('#id_eadacta_puntoseguimiento').val('');
  $('#estado').html('');
  $('#usuario_responsable').html('');
  $('#puntoseguimiento').val('');
  $('#prioridad').html('');
  $('#categoria').html('');
  $('#fecha_vencimiento').val('');
}

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  buscar_listadopendientess(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_listadopendientess(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;
  buscar_listadopendientess(page);
});

function buscar_listadopendientess(page)
{
  var id_eadequipo = $('#eadequipo_busc').val();
  var usuario_responsable = $('#responsable_busc').val();
  var puntoseguimiento = $('#tarea_busc').val();
  var prioridad = $('#prioridad_busc').val();
  console.log(prioridad);
  var categoria = $('#categoria_busc').val();
  var estatus = $('#estatus_busc').val();
  var fecha_vencimiento = $('#fechalimite_busc').val();
  var temp = "page="+page;

  if(parseInt(id_eadequipo)>0)
  {
    temp=temp+'&id_eadequipo='+id_eadequipo;
  }
  if(parseInt(usuario_responsable)>0)
  {
    temp=temp+'&usuario_responsable='+usuario_responsable;
  }
  if(puntoseguimiento.trim())
  {
    temp=temp+'&puntoseguimiento='+puntoseguimiento;
  }
  if(parseInt(prioridad)>0)
  {
    temp=temp+'&prioridad='+prioridad;
  }
  if(parseInt(categoria)>0)
  {
    temp=temp+'&categoria='+categoria;
  }
  if(parseInt(estatus)>0)
  {
    temp=temp+'&estatus='+estatus;
  }
  if(fecha_vencimiento.trim())
  {
    temp=temp+'&fecha_vencimiento='+fecha_vencimiento;
  }

  $.ajax({
      url: $('base').attr('href') + 'listadopendientes/buscar_pendientes',
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
  var ideadactapuntoseguimiento = $(this).parents('tr').attr('ideadactapuntoseguimiento');
  $.ajax({
      url: $('base').attr('href') + 'listadopendientes/edit',
      type: 'POST',
      data: 'id_eadacta_puntoseguimiento='+ideadactapuntoseguimiento,
      dataType: "json",
      beforeSend: function() {
        $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
      },
      success: function(response) {
          if (response.code>=1) {
            var r = response.data;
            $('#id_eadacta_puntoseguimiento').val(r.d3);
            $('#estado').html(r.c2);
            $('#usuario_responsable').html(r.c1);
            $('#puntoseguimiento').val(r.d4);
            $('#prioridad').html(r.c3);
            $('#categoria').html(r.c4);
            $('#fecha_vencimiento').val(r.d2);
          }
      },
      complete: function() {
        $.LoadingOverlay("hide");
      }
  });
});

$(document).on('click','.ver_comentario',function(e){
  limpiar_modal_comentario();
  var id_puntoseguimiento = $(this).parents('tr').attr('ideadactapuntoseguimiento');
  console.log(id_puntoseguimiento);
  $('#id_puntoseguimiento_coment').val(id_puntoseguimiento);
  var coment = $(this).parents('td').find('input[type="hidden"]').val();
  if(coment){
    $('#coment_ptosegui').val(coment);
  }
});

$(document).on('click','.add_coment_ptosegui', function(e){
  var coment_modal = $('#coment_ptosegui').val();
  var id_punto_s =  $('#id_puntoseguimiento_coment').val();
  $.ajax({
      url: $('base').attr('href') + 'listadopendientes/rewrite_eadpuntos_segui',
      type: 'POST',
      data: 'id_eadacta_puntoseguimiento='+id_punto_s+'&comentario='+coment_modal,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
          if (response.code==1) {
            $('#view_comentario').modal('hide');
            limpiar_modal_comentario();
            buscar_listadopendientess(0);
          }
      },
      complete: function() {
        alerta('Bien Hecho!', 'Observacion guardada correctamente!!.', 'success');
      }
  });
});

function limpiar_modal_comentario(){
  $('#id_puntoseguimiento_coment').val('');
  $('#coment_ptosegui').val('');
}

$(document).on('click','.close_modal', function(e){
  $('#view_comentario').modal('hide');
  limpiar_modal_comentario();
});

$(document).on('click', '.buscar_eadquipo', function(){
  var id_eadequipo = $('#eadequipo_busc').val();
  if(id_eadequipo){
    $.ajax({
      url: $('base').attr('href') + 'listadopendientes/get_cont_busc',
      type: 'POST',
      data: 'id_eadequipo='+id_eadequipo,
      dataType: "json",
      beforeSend: function() {
        $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
      },
      success: function(response) {
          if (response.code.c1==1) {
            var eadeqipo = $('#eadequipo_busc option:selected').text();
            console.log(eadeqipo);
            $('#eadequip').text(eadeqipo);
            var r = response.data;
            $('#responsable_busc').html(r.c1)
            $('#prioridad_busc').html(r.c3)
            $('#categoria_busc').html(r.c4)
            $('#estatus_busc').html(r.c2)

            $('#prioridad_busc').selectpicker({title: 'Seleccione Prioridad'});
            $('#prioridad_busc').selectpicker('render');
            $('#estatus_busc').selectpicker({title: 'Seleccione un estado'});
            $('#estatus_busc').selectpicker('render');

            $('#prioridad_busc').selectpicker('refresh');
            $('#estatus_busc').selectpicker('refresh');

            if(response.code.c2==2)
            {
              $('#datatable-buttons .buscar').trigger('click');
            }

          }
      },
      complete: function() {
        $('#buscar').modal('hide');
        $.LoadingOverlay("hide");
      }
    });
  }
});

$(document).on('click', '.show_subtareas', function (e) {
  limpiar_form_subtareas();
  var indice = parseInt($(this).parents('tr').attr('ideadactapuntoseguimiento'));
  var count = 0;
  $('#id_pendiente').val(indice);

  $.ajax({
    url: $('base').attr('href') + 'listadopendientes/get_subtareas',
    type: 'POST',
    data: 'id_eadacta_puntoseguimiento='+indice,
    dataType: "json",
    beforeSend: function() {
      $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
    },
    success: function(response) {
      if (response.code==1) {
        $('#cont_checkbox').html('');
        for (var i in response.data) {
          var id_subtarea = response.data[i].id_eadacta_puntoseguimiento_subtarea;
          var subtarea = response.data[i].subtarea;
          var hecho = response.data[i].hecho;

          var div = "<div class='col-md-12 col-sm-12 col-xs-12 text-center form-inline'>";
          var c_div = "</div>";
          var a = "&nbsp<a class='btn btn-danger btn-xs delete_this2'><i class='fa fa-trash-o'></i></a>";
          var checked = "";
          if(parseInt(hecho) == 1){
            checked="checked";
          }
          var chkbox = "<input type='checkbox' "+checked+" value='1' id='chk_subtarea_"+id_subtarea+"' name='chk_subtarea["+id_subtarea+"]' class='form-control' >"
          var input_text = "&nbsp&nbsp<input type='text' required class='form-control' id='text_subtarea_"+id_subtarea+"' name='text_subtarea["+id_subtarea+"]' value='"+subtarea+"'>";
          console.log(input_text);
          var final_element = div+chkbox+input_text+a+c_div;
          $('#cont_checkbox').append(final_element);
        }
        actualizar_subtareas();
      }
    },
    complete: function() {
      $.LoadingOverlay("hide");
    }
  });
});

$(document).on('click', '.add_subtarea', function (e) {
  add_subtarea();
});

$(document).on('click', '.delete_this2', function (e) {
  var ubi = $(this).closest('div');
  if(ubi.hasClass('generic') === false)
  {
    console.log("entro");
    var id_text = ubi.find('input[type=text]').attr('id');
    var id_f = id_text.substring(14,id_text.length);
    swal({
    title : "¿Estás Seguro?'",
    text: 'Se borrará completamente.',
    type: 'warning',
    confirmButtonText: 'Si!',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    }).then(function () {
      ubi.remove();
      $.ajax({
        url: $('base').attr('href') + 'listadopendientes/delete_subtarea',
        type: 'POST',
        data: 'id_eadacta_puntoseguimiento_subtarea='+id_f,
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            if (response.code==1) {
              actualizar_subtareas();
            }
        },
        complete: function() {
            
        }
      });
    });
  }
  else
  {
    swal({
    title : "¿Estás Seguro?'",
    text: 'Se borrará completamente.',
    type: 'warning',
    confirmButtonText: 'Si!',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    }).then(function () {
      ubi.remove();
      actualizar_subtareas();
    });
  }
});

function getMaxOfArray(numArray) {
  return Math.max.apply(null, numArray);
}

function limpiar_form_subtareas() {
  $('#cont_checkbox').html('');
  $('#id_pendiente').val('');
  $('#t_complete').text('');
  $('#t_total').text('');
}

$(document).on('click', '.limpiar_form_subtareas', function (e) {
  $('#agregar_subtareas').modal('hide');
  limpiar_form_subtareas();
});

function actualizar_form_subtareas() {
  $('#cont_checkbox').html('');
  var indice = $('#id_pendiente').val();
  $.ajax({
    url: $('base').attr('href') + 'listadopendientes/get_subtareas',
    type: 'POST',
    data: 'id_eadacta_puntoseguimiento='+indice,
    dataType: "json",
    beforeSend: function() {
        //showLoader();
    },
    success: function(response) {
      if (response.code==1) {
        $('#cont_checkbox').html('');
        for (var i in response.data) {
          var id_subtarea = response.data[i].id_eadacta_puntoseguimiento_subtarea;
          var subtarea = response.data[i].subtarea;
          var hecho = response.data[i].hecho;
  
          var div = "<div class='col-md-12 col-sm-12 col-xs-12 text-center form-inline'>";
          var c_div = "</div>";
          var a = "&nbsp<a class='btn btn-danger btn-xs delete_this2'><i class='fa fa-trash-o'></i></a>";
          var checked = "";
          if(parseInt(hecho) == 1){
            checked="checked";
          }
          var chkbox = "<input type='checkbox' "+checked+" value='1' id='chk_subtarea_"+id_subtarea+"' name='chk_subtarea["+id_subtarea+"]' class='form-control' >"
          var input_text = "&nbsp&nbsp<input type='text' required class='form-control' id='text_subtarea_"+id_subtarea+"' name='text_subtarea["+id_subtarea+"]' value='"+subtarea+"'>";
          var final_element = div+chkbox+input_text+a+c_div;
          $('#cont_checkbox').append(final_element);
        }
        actualizar_subtareas();
      }
    },
    complete: function() {
    }
  });
}

function actualizar_subtareas() {
  var n_t = 0;
  var n_c = 0;

  $('#cont_checkbox div input[type="checkbox"]').each(function(index,value){
    n_t++;
    if($(this).is(':checked'))
    {
      n_c++;
    }
  })
  $('#t_complete').text(n_c);
  $('#t_total').text(n_t);
}

$(document).keypress(function(e) {
  if(e.which == 13) {
    if($('#agregar_subtareas').css('display') == 'block'){
      add_subtarea();
    } 
  }
});

function add_subtarea()
{
  var i = new Array();
  var c = 0;
  var count = 0;
  $('div#cont_checkbox div.generic input[type=text]').each(function(index,value){
    i[c] = parseInt($(this).attr('id').substring(16,$(this).attr('id').length));
    c++;
    count++;
  })

  var div = "<div class='col-md-12 col-sm-12 col-xs-12 text-center generic form-inline'>";
  var c_div = "</div>";
  var a = "&nbsp<a class='btn btn-danger btn-xs delete_this2'><i class='fa fa-trash-o'></i></a>";
  if(count>0)
  {
    var max_n = getMaxOfArray(i)+1;
    var chkbox = "<input type='checkbox' value='1' id='chk_subtarea_g_"+max_n+"' name='chk_subtarea[g_"+max_n+"]' class='form-control'>"
    var input_text = "&nbsp&nbsp<input type='text' required class='form-control' id='text_subtarea_g_"+max_n+"' name='text_subtarea[g_"+max_n+"]'>"
  }
  else
  {
    var chkbox = "<input type='checkbox' value='1' id='chk_subtarea_g_1' class='form-control' name='chk_subtarea[g_1]'>";
    var input_text = "&nbsp&nbsp<input type='text' required class='form-control' id='text_subtarea_g_1' name='text_subtarea[g_1]'>"
  }

  var final_element = div+chkbox+input_text+a+c_div;
  $('#cont_checkbox').append(final_element);
  actualizar_subtareas();
}

function escapeHtml(text) {
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

function fix_paddingr_modal(id_modal)
{
  $('#editlistadopendientes').on('hidden.bs.modal', function (e) {
  $('body.nav-md').css('padding-right','0px');
  })

  $('#editlistadopendientes').on('shown.bs.modal', function (e) {
    $('body.nav-md').css('padding-right','0px');
  })
}

//20/09

$(document).on('click','.ver_adjuntos',function(){
  var id_pendiente = $(this).parents('tr').attr('ideadactapuntoseguimiento');
  $('#id_pendiente2').val(id_pendiente);
  $.ajax({
    url: $('base').attr('href') + 'listadopendientes/get_files',
    type: 'POST',
    data: 'id_eadacta_puntoseguimiento='+id_pendiente,
    dataType: "json",
    beforeSend: function() {
      $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
    },
    success: function(response) {
      if (response.code==1) 
      {
        $('#view_adjuntos #bodyindex_files').html(response.data);
      }
      else
      {
        alerta('Error!','Hubo un error al momento de obtener los datos.','error');
      }
    },
    complete: function() {
      $.LoadingOverlay("hide");
    }
  });
});

///

$(document).on('submit','#idFrmFile',function(ev){
  ev.preventDefault();
  var inputFile = $(this).find('input[type="file"]');
  var fileToUpload = inputFile[0].files[0];
  if(fileToUpload)
  {
    var uriAction = $(this).attr('action');
    var formData = new FormData();
    var id_pendiente = $('#view_adjuntos #id_pendiente2').val();
    formData.append("file_upload",fileToUpload);
    formData.append('id_pendiente',id_pendiente);

    $.ajax({
      url: uriAction,
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      beforeSend: function(){
        $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
      },
      success: function(response){
        if(response.code == 1)
        {
          alerta('Archivo','Subido correctamente!!!.','success');
          buscar_files(id_pendiente);
          inputFile.val('');
        }
        else
        {
          alerta('Error','Hubo un error al subir el archivo.','Error');
        }
      },
      complete: function(){
        $.LoadingOverlay("hide");
      }
    });
  }
  else
  {
    alerta('Error!','Seleccione un Archivo','error');
  }
});

function buscar_files(id_pendiente)
{
  $.ajax({
    url: $('base').attr('href') + 'listadopendientes/get_files',
    type: 'POST',
    data: 'id_eadacta_puntoseguimiento='+id_pendiente,
    dataType: "json",
    beforeSend: function() {
      $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
    },
    success: function(response) {
      if (response.code==1) 
      {
        $('#view_adjuntos #bodyindex_files').html(response.data);
      }
      else
      {
        alerta('Error!','Hubo un error al momento de obtener los datos.','error');
      }
    },
    complete: function() {
      $.LoadingOverlay("hide");
    }
  });
}

$(document).on('click','.delete_file',function(){
  var id_file = $(this).parents('tr').attr('id_files');
  var id_pendiente = $('#view_adjuntos #id_pendiente2').val();

  $.ajax({
    url: $('base').attr('href') + 'listadopendientes/delete_file',
    type: 'POST',
    data: 'id_file='+id_file,
    dataType: "json",
    beforeSend: function() {
      $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
    },
    success: function(response) {
      if (response.code==1) 
      {
        alerta('Archivo Borrado!','correctamente.','success');
        buscar_files(id_pendiente);
      }
      else
      {
        alerta('Error!','Hubo un error al momento de eliminar el archivo.','error');
      }
    },
    complete: function() {
      $.LoadingOverlay("hide");
    }
  });
});

$(document).on('click','#btn_limpiarbuscar',function(){
  $('#buscar').modal('hide');
});
