$( document ).ready(function() {
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

  $.validator.addMethod("fechaestric", function(value, element) {
    var exp = value; //console.log(value);
    if(exp.trim().length)
      return /^(0?[1-9]|[12]\d|3[01])[\.\/\-](0?[1-9]|1[012])[\.\/\-]([12]\d)?(\d\d)\s(0[0-9]|1[0-2]):[0-5][0-9]\s(AM|am|PM|pm)$/.test(value);
    else
      return false;
    }, "Fecha no válida."
  );

  jQuery.validator.setDefaults({
    debug: true,
    success: "valid",
    ignore: ""
  });

  $('#form_save_eadacta').validate({
    rules:
    {
      comboxequipo:{
        required: true
      },      
      fecha_reunion:{
        required: true,
        fechaestric: true
      }
    },
    messages: 
    {
      comboxequipo: {required: "Seleccione Equipo"},
      fecha_reunion: {
        required: "Ingrese Fecha",
        fechaestric: "Fecha Inválida"
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
      error.insertAfter(element.parent()); 
    },
    submitHandler: function() {
      $.ajax({
        url: $('base').attr('href') + 'eadacta/save_eadacta',
        type: 'POST',
        data: $('#form_save_eadacta').serialize(),
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

            $('#editeadacta').modal('hide');
            fix_paddingr_modal('editeadacta');

            var id_eadacta = parseInt($('#id_eadacta').val());
            id_eadacta = (id_eadacta>0) ? (id_eadacta) : ("0");
            var text = (id_eadacta=="0") ? ("Guardo!") : ("Edito!");
            swal({
              title : text,
              text: 'Esta Acta de Reunión se '+text+'.',
              type: 'success',
              confirmButtonText: 'Listo!',
            })

            buscar_eadactas(page);                      
          }
          else
          {
            alerta('Error','Hubo un error al intentar Guardar los datos','error');
          }
        },
        complete: function() {
          
          $.LoadingOverlay("hide");
        }
      });
    }
  });

  $('#form_save_ptos_seguimiento').validate({
    
    submitHandler: function() {
      $.ajax({
        url: $('base').attr('href') + 'eadacta/save_eadpuntos_segui',
        type: 'POST',
        data: $('#form_save_ptos_seguimiento').serialize(),
        dataType: "json",
        beforeSend: function() {
          $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});   
        },
        success: function(response) {
          if(response.code==1)
          {
            actualizar_form_segui(0);
            swal({
              title : "Guardado!!",
              text: 'Se guardo este punto de seguimiento',
              type: 'success',
              confirmButtonText: 'Listo!',
            });
          }
          else
          {
            alerta('Error','Hubo un error al intentar Guardar los datos','error');
          }
        },
        complete: function() {
          $.LoadingOverlay("hide");
        }
      });
    }
  });

  $('#form_save_asistencia').validate({
    
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
        url: $('base').attr('href') + 'eadacta/save_asistencia',
        type: 'POST',
        data: $('#form_save_asistencia').serialize(),
        dataType: "json",
        beforeSend: function() {
          $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});  
        },
        success: function(response) {
          if (response.code==1) {                      
            swal({
              title : "Guardado!",
              text: 'Asistencia guardada!!.',
              type: 'success',
              confirmButtonText: 'Listo!',
            });                
          }
          else
          {
            alerta('Error','Hubo un error al intentar Guardar los datos','error');
          }
        },
        complete: function() {
          $.LoadingOverlay("hide");
        }
      });
    }
  });

  $('#form_save_agenda').validate({
    
    highlight: function(element) {
      $(element).closest('.form-group').addClass('has-error');       
    },
    unhighlight: function(element) {
      $(element).closest('.form-group').removeClass('has-error');
    },
    errorElement: 'span',
    errorClass: 'help-block',
    submitHandler: function() {
      $.ajax({
        url: $('base').attr('href') + 'eadacta/save_agendas',
        type: 'POST',
        data: $('#form_save_agenda').serialize(),
        dataType: "json",
        beforeSend: function() {
           $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"}); 
        },
        success: function(response) {
          if (response.code>=1) 
          {                      
            swal({
              title : "Guardado!",
              text: 'Los temas se han guardado!!.',
              type: 'success',
              confirmButtonText: 'Listo!',
            });
          }
          else
          {
            alerta('Error','Hubo un error al intentar Guardar los datos','error');
          }
        },
        complete: function() 
        {
          $.LoadingOverlay("hide");  
        }
      });
    }
  });

  $('#form_save_acuerdos').validate({
    
    highlight: function(element) {
      $(element).closest('.form-group').addClass('has-error');       
    },
    unhighlight: function(element) {
      $(element).closest('.form-group').removeClass('has-error');
    },
    errorElement: 'span',
    errorClass: 'help-block',
    submitHandler: function() {
      $.ajax({
        url: $('base').attr('href') + 'eadacta/save_acuerdos',
        type: 'POST',
        data: $('#form_save_acuerdos').serialize(),
        dataType: "json",
        beforeSend: function() {
          $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});  
        },
        success: function(response) {
          if (response.code==1) 
          {                      
            swal({
              title : "Guardado!",
              text: 'Estos acuerdos se han guardado!!.',
              type: 'success',
              confirmButtonText: 'Listo!',
            });                      
          }
          else
          {
            alerta('Error','Hubo un error al intentar Guardar los datos','error');
          }
        },
        complete: function() {
          $.LoadingOverlay("hide");
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
          if (response.code==1) 
          {
            $('#agregar_subtareas').modal('hide');
            alerta('Bien hecho!', 'Datos guardados correctamente.', 'success');
            actualizar_form_segui(0);                  
          }
          else
          {
            alerta('Error','Hubo un error al intentar Guardar los datos','error');
          }
        },
        complete: function() {
          $.LoadingOverlay("hide");
        }
      });
    }
  });
  
  $('#div_fecha_reunion').datetimepicker({
    sideBySide: true,
    useCurrent: false,
    format: 'DD-MM-YYYY HH:mm A',
    locale: moment.locale("es"),
    minDate: moment()
  });

  $(function() {
    $('input#diareunion_busc').daterangepicker({
      singleDatePicker: true,
      showDropdowns: true,
      locale : moment.locale('es'),
      format: 'DD-MM-YYYY',
    });
  });
});
$(document).on('click', 'div#paginacion_data #datatable_paginate li.paginate_button', function (e) {
  var page = $(this).find('a').attr('tabindex');
  buscar_eadactas(page);
});

$(document).on('click', 'div#paginacion_data #datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_eadactas(page);
});
$(document).on('click', '.buscar', function (e) {
  var page = 0;
  buscar_eadactas(page);
});
$(document).on('click', '.btn_limpiar', function (e) {
  $('#editeadacta').modal('hide');
});

function buscar_eadactas(page)
{
  var id_eadequipo = $('#id_comboxequipo').val();
  var diareunion_busc = $('#diareunion_busc').val();
  var temp = "page="+page;
  if(parseInt(id_eadequipo)>0)
  {
    temp=temp+'&id_eadequipo='+id_eadequipo;
  }
  if(diareunion_busc.trim().length>0)
  {
    temp=temp+'&fecha_reunion='+diareunion_busc;
  }
  $.ajax({
    url: $('base').attr('href') + 'eadacta/buscar_eadactasxusuario',
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

$(document).on('click','.limpiarfiltro', function (e) {
  $('#id_comboxequipo').val('');
  $('#diareunion_busc').val('');
  buscar_eadactas(0);
});

$(document).on('click', '.add_eadacta', function (e)
{
  limpiarform();
});

$(document).on('click', '.btn_limpiar', function (e) {
  limpiarform();
  $('#editeadacta').modal('hide');
});

function limpiarform()
{
  $('#id_eadacta').val('0');
  $('#eadacta').val('');
  $('.btn-toolbar1').removeClass('hidden');
  $('ul#myTab').addClass('hidden');
  $('#fecha_reunion').attr('disabled',false);
  $('#comboxequipo').attr('disabled',false);
  $('#members_modal').html('');
  $('tbody#agenda_reunion').html('');
  $('tbody#agendas_pendientes').html('');
  $('tbody#acuerdo_reunion').html('');
  $('tbody#puntos_seguimientos').html('');

  $('ul#myTab li').each(function(index,value){
    $(this).removeClass('active');  
  })
  $('div.tab-content div').each(function(index,value){
    $(this).removeClass('active');  
  })
  $("li[tabs='tab-general']").addClass('active');
  $("div#tab_content1").addClass('active');
}

$(document).on('click', '.add_eadacta', function (e) {
  $('#id_eadacta').val(0);
  var hoy = moment(new Date()).format("DD-MM-YYYY hh:mm A");
  $('#fecha_reunion').val(hoy);
});

$(document).on('click', '.delete', function (e) {
  e.preventDefault();
  var ideadacta = $(this).parents('tr').attr('ideadacta');
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var um_busc = $('#um_busc').val();
  var temp = "page="+page;
  if(um_busc.trim().length)
  {
    temp=temp+'&um_busc='+um_busc;
  }
  var nomb = "eadacta";
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
        url: $('base').attr('href') + 'eadacta/save_eadacta',
        type: 'POST',
        data: 'id_eadacta='+ideadacta+'&estado=0',
        dataType: "json",
        beforeSend: function() {
          $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
        },
        success: function(response) {
          if (response.code==1) {
            var text = "Elimino!";
            alerta(text, 'Esta '+nomb+' se '+text+'.', 'success');
            limpiarform();
            buscar_eadactas(temp);
          }
          else
          {
            alerta('Error!','Nose pudo eliminar!!','Error');
          }
        },
        complete: function() {
          $.LoadingOverlay("hide");
        }
      });
    }
  });
});

$(document).on('click', '.edit_eadacta', function (e) {
  limpiarform();
  var id_eadacta = $(this).parents('tr').attr('ideadacta');
  $('#id_eadacta').val(id_eadacta);
  $('#id_eadacta2').val(id_eadacta);
  $('#id_eadacta3').val(id_eadacta);
  $('#id_eadacta4').val(id_eadacta);
  $('#id_eadacta5').val(id_eadacta);
  
  $('ul#myTab').removeClass('hidden');
 
  $.ajax({
    url: $('base').attr('href') + 'eadacta/edit',
    type: 'POST',
    data: 'id_eadacta='+id_eadacta,
    dataType: "json",
    beforeSend: function() {
      $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"}); 
    },
    success: function(response) {
      if (response.code>0) {
        $('.btn-toolbar1').addClass('hidden');
        $('#fecha_reunion').attr('disabled',true);
        $('#comboxequipo').attr('disabled',true);
        $('#fecha_reunion').val(response.data.eadacta.fecha_reunion);
        $('#comboxequipo').html(response.data.comboxteam);
        $('#members_modal').html(response.data.cuadro_asistencia);
        $('tbody#agenda_reunion').html(response.data.form_agendas);
        $('tbody#agendas_pendientes').html(response.data.form_pendientes);
        $('tbody#acuerdo_reunion').html(response.data.form_acuerdos);
        $('tbody#puntos_seguimientos').html(response.data.form_ptoseguimiento);
        $('div#paginacion_data1').html(response.data.paginacion);
      }
    },
    complete: function() {
      $.LoadingOverlay("hide");  
    }
  });
});

$(document).on('click', '.add_tema', function (e) {
  var id_eadacta = $('#id_eadacta3').val();
  var i = new Array();
  var c = 0;
  $('tbody#agenda_reunion textarea').each(function(index,value){
    i[c] = parseInt($(this).attr('id').substring(12,$(this).attr('id').length));
    console.log(i);
    c++;
  })
  var max_n = getMaxOfArray(i)+1;
  max_n = (isNaN(parseInt(max_n))) ? 1 : max_n;
  console.log(max_n);
  var div1 = "<div class='form-group'><textarea class='form-control autoExpand' required rows='1' id='txta_agenda_"+max_n+"' name='txta["+max_n+"]'></textarea></div>";
  var div2 = "<div class='col-md-3 col-sm-3 col-xs-3'/></div><div class='form-group col-md-8 col-sm-6 col-xs-6'><select class='form-control' id='sele_agenda_"+max_n+"' name='sele["+max_n+"]'></select></div>";
  var div3 = "<div class='form-group'><input type='text' class='form-control text-center' number=true id='txt_agenda_"+i+"' name='txt["+max_n+"]'></div>";
  
  $('#agenda_reunion').append("<tr><td>"+div1+"</td><td>"+div2+"</td><td>"+div3+" </td><td><center><a class='btn btn-danger btn-xs delete_this'><i class='fa fa-trash-o'></i></a></center></td></tr>");

  $.ajax({
    url: $('base').attr('href') + 'eadacta/get_combo_members',
    type: 'POST',
    data: 'id_eadacta='+id_eadacta,
    dataType: "json",
    beforeSend: function() {
      $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
    },
    success: function(response) {
      if (response.code>0) {
        $('#sele_agenda_'+max_n).append(response.data);
      }
    },
    complete: function() {
      $.LoadingOverlay("hide");
    }
  });
});

$(document).on('click', '.add_pendientes', function (e) {
  var id_eadacta = $('#id_eadacta3').val();
  var i = new Array();
  var c = 0;
  var count = 0;
  $('tbody#agendas_pendientes textarea').each(function(index,value){
    var id = ($(this).attr('id').length) ? $(this).attr('id') : 'txta_pendiente_1';
    i[c] = parseInt($(this).attr('id').substring(15,$(this).attr('id').length));
    console.log(id);
    c++;
  })
  var max_n = getMaxOfArray(i)+1;
  max_n = (isNaN(parseInt(max_n))) ? 1 : max_n;

  var div1 = "<div class='form-group'><textarea class='form-control autoExpand' required rows='1' id='txta_pendiente_"+max_n+"' name='txta_pendiente["+max_n+"]'></textarea></div>";
  var div2 = "<div class='col-md-3 col-sm-3 col-xs-3'/></div><div class='form-group col-md-8 col-sm-6 col-xs-6'><select class='form-control' id='sele_pendiente_"+max_n+"' name='sele_pendiente["+max_n+"]'></select></div>";
  var div3 = "<div class='form-group'><input type='text' class='form-control text-center' number=true required id='txt_pendiente_"+i+"' name='txt_pendiente["+max_n+"]'></div>";
  $('#agendas_pendientes').append("<tr><td>"+div1+"</td><td>"+div2+"</td><td>"+div3+"</td><td><center><a class='btn btn-danger btn-xs delete_this'><i class='fa fa-trash-o'></i></a></center></td></tr>");

  $.ajax({
    url: $('base').attr('href') + 'eadacta/get_combo_members',
    type: 'POST',
    data: 'id_eadacta='+id_eadacta,
    dataType: "json",
    beforeSend: function() {
      $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
    },
    success: function(response) {
      if (response.code>0) {
        $('#sele_pendiente_'+max_n).append(response.data);
      }
    },
    complete: function() {
      $.LoadingOverlay("hide");
    }
  });

});

function getMaxOfArray(numArray) {
  return Math.max.apply(null, numArray);
}

$(document).on('click', '.delete_this', function (e) {
  var ubi = $(this).closest('tr');
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
  });
});

$(document).on('click', '.add_acuerdo', function (e) {
  var i = new Array();
  var c = 0;
  var count = 0;
  $('tbody#acuerdo_reunion textarea').each(function(index,value){
    i[c] = parseInt($(this).attr('id').substring(13,$(this).attr('id').length));
    c++;
    count++;
  })
  var max_n = getMaxOfArray(i)+1;
  $('#acuerdo_reunion').append("<tr><td><div class='form-group'><textarea class='form-control autoExpand' required rows='1' id='txta_acuerdo_"+max_n+"' name='txta_acuerdo["+max_n+"]'></textarea></div></td><td><center><a class='btn btn-danger btn-xs delete_this'><i class='fa fa-trash-o'></i></a></center></td></tr>");
});

$(document).on('click', '.add_pto_segui', function (e) {
  var i = new Array();
  var c = 0;
 
  var id_eadacta = $('#id_eadacta5').val();
  $.ajax({
    url: $('base').attr('href') + 'eadacta/multicombos_m_e_c_p',
    type: 'POST',
    data: 'id_eadacta='+id_eadacta,
    dataType: "json",
    beforeSend: function() {
       $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"}); 
    },
    success: function(response) {
      if(response.code>=1){
        var count = 0;
        $('tbody#puntos_seguimientos textarea.generic').each(function(index,value){
          var id = $(this).attr('id');
          console.log(id);
          i[c] = parseInt(id.substring(16,id.length));
          c++;
          count++;
        })

        var max_n =(count == 0) ? 1 : getMaxOfArray(i)+1;
        var td_1 = "<td><div class='form-group form-inline'><textarea style='width: 80%;' class='form-control autoExpand generic' required rows='1' id='txta_puntoseg_g_"+max_n+"' name='txta_puntoseg[g_"+max_n+"]'></textarea><a class='btn btn-warning add_comentario btn-xs pull-right' data-toggle='modal' data-target='#agregar_comentario'><i class='fa fa-file-text-o'></i></a></div></td>";
        var td_2 = "<td><select id='select_puntoseg_g_"+max_n+"' required class='form-control' tabindex='-1' name='select_puntoseg[g_"+max_n+"]'></select></td>";
        var td_3 = "<td><div class='col-md-12 col-sm-12 col-xs-12'><div class='input-group clockpicker' id='dia_limiteg_"+max_n+"'><input type='text' class='form-control' id='txt_dlimite_g_"+max_n+"' name='txt_dlimite[g_"+max_n+"]' placeholder='Fecha'><span class='input-group-addon'><span class='glyphicon glyphicon-time'></span></span></div></div><script type='text/javascript'>$('#dia_limiteg_"+max_n+"').datetimepicker({format: 'DD-MM-YYYY',locale: moment.locale('es'),minDate: moment(),defaultDate: false});$('#dia_limiteg_"+max_n+"').on('dp.show', function(e){$('.dropdown-menu').css('width',400);});</script></td>";
        var td_4 = "<td><select id='select_puntoseg_prio_g_"+max_n+"' class='form-control' required tabindex='-1' name='select_puntoseg_prio[g_"+max_n+"]'></select></td>";
        var td_5 = "<td><select id='select_puntoseg_categoria_g_"+max_n+"' class='form-control' name='select_puntoseg_categoria[g_"+max_n+"]'></select></td>";
        var td_6 = "<td><select id='select_puntoseg_estatus_g_"+max_n+"' class='form-control' required tabindex='-1' name='select_puntoseg_estatus[g_"+max_n+"]'></select></td>";
        var td_8 = "<td></td>"
        var td_7 = "<td><center><a class='btn btn-danger btn-xs delete_this_ps'><i class='fa fa-trash-o'></i></a></center></td>";
        $('#puntos_seguimientos').append("<tr id='id_punto_g_"+max_n+"'>"+td_1+td_2+td_3+td_4+td_5+td_6+td_8+td_7+"</tr>");
        var combo1 = response.data.c1;
        var combo2 = response.data.c2;
        var combo3 = response.data.c3;
        var combo4 = response.data.c4;
        
        $("#select_puntoseg_g_"+max_n).html(combo1);
        $("#select_puntoseg_prio_g_"+max_n).html(combo3);
        $("#select_puntoseg_estatus_g_"+max_n).html(combo2);
        $("#select_puntoseg_categoria_g_"+max_n).html(combo4);
        
      }
      else
      { 
        swal({
          title : 'UPS!!..',
          text: 'No hay miembros registrados :(',
          type: 'error',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#f27474'
        })
      }
    },
    complete: function() {
      $.LoadingOverlay("hide");
    }
  });
});

function limpiar_modal_coment(){
  $('#id_punto_modal').val('');
  $('#coment_ptosegui').val('');
}

$(document).on('click','.add_comentario', function(e){
  limpiar_modal_coment();
  var indice_t = $(this).parents('tr').prop('id');
  var indice_n = indice_t.substring(9,indice_t.length);
  $('#id_punto_modal').val(indice_n);
  console.log(indice_n);
  var coment = $(this).parents('td').find('input[type="hidden"]').val();
  if(coment){
    $('#coment_ptosegui').val(coment);
  }
});

$(document).on('click', '.add_coment_ptosegui', function(e){
  var coment_modal = $('#coment_ptosegui').val();
  var id_punto_s =  $('#id_punto_modal').val();
  var btn_a = $('#id_punto_'+id_punto_s).find('td div a.add_comentario');
  console.log(id_punto_s);
  if(coment_modal.trim())
  {
    if(btn_a.hasClass('btn-warning'))
    {
      btn_a.removeClass('btn-warning').addClass('btn-success');  
    }
  }
  else
  {
    if(btn_a.hasClass('btn-success'))
    {
      btn_a.removeClass('btn-success').addClass('btn-warning');  
    }
  }

  if($('input#comentxpunto_'+id_punto_s).length)
  {
    $('input#comentxpunto_'+id_punto_s).val(coment_modal);
  }
  else
  {
    var new_input = "<input type='hidden' value='"+coment_modal+"' name='comentxpunto["+id_punto_s+"]' id='comentxpunto_"+id_punto_s+"'>";
    btn_a.after(new_input);
  }
  
  $('#agregar_comentario').modal('hide');
  limpiar_modal_coment();
});

function actualizar_form_segui(page)
{
  var id_eadacta = $('#id_eadacta5').val();
  $.ajax({
    url: $('base').attr('href') + 'eadacta/actualizar_form_segui',
    type: 'POST',
    data: 'id_eadacta='+id_eadacta+'&page='+page,
    dataType: "json",
    beforeSend: function() {
      $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
    },
    success: function(response) {
      if (response.code>0) {
        $('tbody#puntos_seguimientos').html(response.data.form_ptoseguimiento);
        $('div#paginacion_data1').html(response.data.paginacion);
      }
    },
    complete: function() {
      $.LoadingOverlay("hide");
    }
  });
}

$(document).on('click', '.delete_this_ps', function (e) {
  var ubi = $(this).closest('tr');
  if(ubi.find('td textarea').hasClass('generic') === false)
  {
    console.log("entro");
    var id = ubi.attr('id').substring(9,ubi.attr('id').length);
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
        url: $('base').attr('href') + 'eadacta/delete_eadpuntos_segui',
        type: 'POST',
        data: 'id_eadacta_puntoseguimiento='+id+'&activo=0',
        dataType: "json",
        beforeSend: function() {
          $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
        },
        success: function(response) {
            if (response.code==1) {
              actualizar_form_segui(0);
            }
        },
        complete: function() {
          $.LoadingOverlay("hide");
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
    });
  }
});

$(document).on('click', '.show_subtareas', function (e) {
  limpiar_form_subtareas();
  var indice_t = $(this).parents('tr').attr('id');
  var indice = indice_t.substring(9,indice_t.length);
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
          $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
        },
        success: function(response) {
          if (response.code==1) {
            actualizar_subtareas();
          }
        },
        complete: function() {
          $.LoadingOverlay("hide");
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
}

function actualizar_subtareas() {
  var n_t = 0;
  var n_c = 0;

  $('#cont_checkbox div input[type="checkbox"]').each(function(index,value){
    console.log("entro");
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

$(document).on('click', 'div#paginacion_data1 #datatable_paginate li.paginate_button', function (e) {
  var page = $(this).find('a').attr('tabindex');
  actualizar_form_segui(page);
});

$(document).on('click', 'div#paginacion_data1 #datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  actualizar_form_segui(page);
});

function fix_paddingr_modal(id_modal)
{
  $('#'+id_modal).on('hidden.bs.modal', function (e) {
  $('body.nav-md').css('padding-right','0px');
  })

  $('#'+id_modal).on('shown.bs.modal', function (e) {
    $('body.nav-md').css('padding-right','0px');
  })
}