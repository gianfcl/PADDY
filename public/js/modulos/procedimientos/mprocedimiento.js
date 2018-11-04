$( document ).ready(function() 
{ 
  $(function() {
    $('#tg_1').bootstrapToggle({
      offstyle:'danger'
    });
  })

  $(document).one('focus.autoExpand', 'textarea.autoExpand', function(){
        var savedValue = this.value;
        this.value = '';
        this.baseScrollHeight = this.scrollHeight;
        this.value = savedValue;
  }).on('input.autoExpand', 'textarea.autoExpand', function(){
    var minRows = this.getAttribute('data-min-rows')|0, rows;
    this.rows = minRows;
    rows = Math.ceil((this.scrollHeight - this.baseScrollHeight) / 17);
    this.rows = minRows + rows;
  });

  jQuery.validator.setDefaults({
    debug: true,
    success: "valid",
    ignore: ""
  });

  $('#form_save_mprocedimiento').validate({
    rules:
    {
      id_prcgrupo:{ required:true },
      titulo:{ 
        required:true,
        remote: {
          url: $('base').attr('href') + 'mprocedimiento/validar_titulo_proc',
          type: "post",
          data: {
            titulo: function() { return $( "#titulo" ).val(); },
            id_prc: function() { return $('#id_prc').val(); }
          }
        }
      },
      cod:{ 
        required:true,
        remote: 
        {
          url: $('base').attr('href') + 'mprocedimiento/validar_cod_proc',
          type: "post",
          data: {
            cod: function() { return $( "#cod" ).val(); },
            id_prc: function() { return $('#id_prc').val(); }
          }
        }
      },
      objetivo:
      { 
        required:true
      }
    },
    messages: 
    {
      id_prcgrupo:{ required:"Campo Obligatorio" },
      titulo:{ required:"Campo Obligatorio",remote:"Ya existe" },
      cod:{ required:"Campo Obligatorio", remote:"Ya Existe" },
      objetivo:{ required:"Campo Obligatorio" }
    },      

    highlight: function(element) {
      $(element).parents('.form-group').addClass('has-error');       
    },
    unhighlight: function(element) {
      $(element).parents('.form-group').removeClass('has-error');
    },
    errorElement: 'span',
    errorClass: 'help-block',
    errorPlacement: function(error, element) 
    {
      error.insertAfter(element.parent()); 
    },
    submitHandler: function() {
      $.ajax({
        url: $('base').attr('href') + 'mprocedimiento/save_proced',
        type: 'POST',
        data: $('#form_save_mprocedimiento').serialize(),
        dataType: "json",
        beforeSend: function() {
          $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
        },
        success: function(response) {
          if (response.code==1) {

            var id_prc = parseInt($('#id_prc').val());
            id_prc = (id_prc>0) ? (id_prc) : ("0");
            var text = (id_prc=="0") ? ("Guardo!") : ("Edito!");
            swal({
              title : text,
              text: 'Este procedimiento se '+text+'.',
              type: 'success',
              confirmButtonText: 'Listo!',
            }).then(function () {
              var page = 0;
              if($('#paginacion_data ul.pagination li.active a').length>0)
              {
                page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
              }                   

              $('#editmprocedimiento').modal('hide');
              limpiar_modal_configt();
              buscar_mprocedimientos(page);  
            });                      
          }
          else
          {
            alerta('Hubo un error!','No se pudo guardar los datos.<br>Consulte con Soporte.','error');
          }
        },
        complete: function() 
        {
          $.LoadingOverlay("hide");  
        }
      });
    }
  });

  $('#form_add_dataresp').validate({
    highlight: function(element) {
      $(element).parents('.form-group').addClass('has-error');       
    },
    unhighlight: function(element) {
      $(element).parents('.form-group').removeClass('has-error');
    },
    errorElement: 'span',
    errorClass: 'help-block',
    errorPlacement: function(error, element) 
    {
      error.insertAfter(element.parent()); 
    },
    submitHandler: function() {
      $.ajax({
        url: $('base').attr('href') + 'mprocedimiento/save_data_cabecera',
        type: 'POST',
        data: $('#form_add_dataresp').serialize(),
        dataType: "json",
        beforeSend: function() {
          $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
        },
        success: function(response) {
          if (response.code==1) {

            var id_prc_data_cabecera = parseInt($('#id_prc_data_cabecera').val());
            id_prc_data_cabecera = (id_prc_data_cabecera>0) ? (id_prc_data_cabecera) : ("0");
            var text = (id_prc_data_cabecera=="0") ? ("Guardo!") : ("Edito!");
            var t_dcabecera = parseInt($('#id_tipodato_cabecera').val());
            var txt_header = "";
            switch(t_dcabecera)
            {
              case 1:
                txt_header = "Alcance";
              break;
              case 2:
                txt_header = "Autoridad y Responsabilidad";
              break;
              case 3:
                txt_header = "Ejecutado por";
              break;
              case 4:
                txt_header = "Redactado por";
              break;
              case 5:
                txt_header = "Revisado por";
              break;
              case 6:
                txt_header = "Aprobado por";
              break;
              case 7:
                txt_header = "Lista de Distribución";
              break;
            }
            swal({
              title : text,
              text: 'Este '+txt_header+' se '+text+'.',
              type: 'success',
              confirmButtonText: 'Listo!',
            }).then(function () {
              var id_prc = parseInt($('#id_prc').val());
              $('#config_t').modal('hide');
              get_header_data(id_prc);  
            });                      
          }
          else
          {
            alerta('Hubo un error!','No se pudo guardar los datos.<br>Consulte con Soporte.','error');
          }
        },
        complete: function() 
        {
          $.LoadingOverlay("hide");  
        }
      });
    }
  });

  $('#form_save_conf_prcop').validate({
    rules:
    {
      titulo:{ 
        required:true,
        remote: {
          url: $('base').attr('href') + 'mprocedimiento/validar_titulo_prcop',
          type: "post",
          data: {
            titulo: function() { return $( "#conf_prcop #titulo_op" ).val(); },
            id_prc: function() { return $('#id_prc').val(); },
            id_prc_poe: function(){ return $('#id_prc_poe').val(); }
          }
        }
      },
      n_orden:{ 
        required:true,
        remote: 
        {
          url: $('base').attr('href') + 'mprocedimiento/validar_orden_prcop',
          type: "post",
          data: {
            n_orden: function() { return $("#conf_prcop #n_orden").val(); },
            id_prc: function() { return $('#id_prc').val(); },
            id_prc_poe: function(){ return $('#id_prc_poe').val(); }
          }
        }
      },
      descripcion:
      { 
        required:true
      }
    },
    messages: 
    {
      titulo:{ required:"Campo Obligatorio",remote:"Ya existe" },
      n_orden:{ required:"Campo Obligatorio", remote:"Ya Existe" },
      descripcion:{ required:"Campo Obligatorio" }
    },      

    highlight: function(element) {
      $(element).parents('.form-group').addClass('has-error');       
    },
    unhighlight: function(element) {
      $(element).parents('.form-group').removeClass('has-error');
    },
    errorElement: 'span',
    errorClass: 'help-block',
    errorPlacement: function(error, element) 
    {
      error.insertAfter(element.parent()); 
    },
    submitHandler: function() {
      $.ajax({
        url: $('base').attr('href') + 'mprocedimiento/save_prcop',
        type: 'POST',
        data: $('#form_save_conf_prcop').serialize(),
        dataType: "json",
        beforeSend: function() {
          $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
        },
        success: function(response) {
          if (response.code==1) {

            var id_prc_poe = parseInt($('#id_prc_poe').val());
            id_prc_poe = (id_prc_poe>0) ? (id_prc_poe) : ("0");
            var text = (id_prc_poe=="0") ? ("Guardo!") : ("Edito!");
            swal({
              title : text,
              text: 'Esta operación se '+text+'.',
              type: 'success',
              confirmButtonText: 'Listo!',
            }).then(function () {
              $('#conf_prcop').modal('hide');
              limpiar_modal_confprcop();
              get_data_prcop();
            });                      
          }
          else
          {
            alerta('Hubo un error!','No se pudo guardar los datos.<br>Consulte con Soporte.','error');
          }
        },
        complete: function() 
        {
          $.LoadingOverlay("hide");  
        }
      });
    }
  });
});

$(document).on('click','.add_procedimiento',function(){
  limpiar_modal_proced();
  remove_error('form_save_mprocedimiento');
  $('ul#myTab').addClass('hidden');
  $('#myModalLabel').text('Crear nuevo procedimiento');
  $('#det_cabecera').addClass('hidden');
});

function limpiar_modal_proced()
{
  $('ul#myTab').removeClass('hidden');
  $('#myModalLabel').text('');
  $('#det_cabecera').removeClass('hidden');

  $('#myTab li').removeClass('active').addClass('tab');
  $('#myTab li[tabs="tab-general"]').removeClass('tab').addClass('active');

  $('div.tab-pane').removeClass('active');
  $('#tab_content1').addClass('active');

  //TAB 1 
  $('#editmprocedimiento .modal-dialog').css("width","40%");
  $('#tab_content1 #estado label').removeClass('active');
  $('#tab_content1 #estado input').prop('checked',false);

  $('#tab_content1 #estado #estado_1').parent().addClass('active');
  $('#tab_content1 #estado #estado_1').prop("checked",true);

  $('#tab_content1 #id_prc').val('');
  $('#tab_content1 #cbo_prcgrupo').val('');
  $('#tab_content1 #titulo').val('');
  $('#tab_content1 #cod').val('');
  $('#tab_content1 #objetivo').val('');

  $('#config_t #id_prc2').val('');
}

function remove_error(form)
{ 
  $('form#'+(form.toString())+' div.form-group').each(function(indice, elemento) 
  {
    if($(this).hasClass('has-error'))
    {
      $(this).removeClass("has-error");
      $(this).find("span.help-block").remove(); 
      $(this).removeAttr('aria-describedby');
    }
  }); 
}

function buscar_mprocedimientos(page)
{
  var prcgrupo_busc = $('#prcgrupo_busc').val();
  var titulo_busc = $('#titulo_busc').val();
  var cod_busc = $('#cod_busc').val();
  var estado_busc = $('#estado_busc').val();

  var temp = "page="+page;

  if(parseInt(prcgrupo_busc)>0)
  {
    temp=temp+'&id_prcgrupo='+prcgrupo_busc;
  }

  if(titulo_busc.trim().length)
  {
    temp=temp+'&titulo='+titulo_busc;
  }
  if(cod_busc.trim().length)
  {
    temp=temp+'&cod='+cod_busc;
  }
  if(parseInt(estado_busc)>-1)
  {
    temp=temp+'&estado='+estado_busc;
  }
  
  $.ajax({
    url: $('base').attr('href') + 'mprocedimiento/buscar_mprocedimientos',
    type: 'POST',
    data: temp,
    dataType: "json",
    beforeSend: function(){
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

$(document).on('click','.buscar',function(){
  var page = 0;
  if($('#paginacion_data ul.pagination li.active a').length>0)
  {
    page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  }                   

  $('#editmprocedimiento').modal('hide');
  buscar_mprocedimientos(page);  
});

$(document).on('click','.limpiarfiltro',function(){
  $('#filtro input[type="text"]').val('');
  $('#filtro select').val('');

  buscar_mprocedimientos(0);
});

$(document).on('click','.delete_mprocedimiento',function(e){
  e.preventDefault();
  var id_prc = $(this).parents('tr').attr('id_prc');
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
  var nomb = "procedimiento";
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
        url: $('base').attr('href') + 'mprocedimiento/save_proced',
        type: 'POST',
        data: 'id_prc='+id_prc+'&estado=0',
        dataType: "json",
        beforeSend: function() {
          $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
        },
        success: function(response) {
            if (response.code==1) 
            {              
              var text = "Elimino!";
              alerta(text, 'Este '+nomb+' se '+text+'.', 'success');
              buscar_mprocedimientos(page);
            }
            else
            {
              alerta('error!','No se pudo Eliminar este registro.','error');
            }
        },
        complete: function() {
          $.LoadingOverlay("hide");  
        }
      });
    }
  });   
});

$(document).on('click','.edit_mprocedimiento',function(){
  limpiar_modal_proced();
  var id_prc = $(this).parents('tr').attr('id_prc');
  $('#myModalLabel').text('Configuración de Cabecera');
  $.ajax({
    url: $('base').attr('href') + 'mprocedimiento/edit',
    type: 'POST',
    data: 'id_prc='+id_prc,
    dataType: "json",
    beforeSend: function() {
      $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
    },
    success: function(response) {
        if (response.code==1) 
        {              
          //MODAL 1ST TAB

          $('#tab_content1 #estado label').removeClass('active');
          $('#tab_content1 #estado input').prop('checked',false);

          var rmd = response.data.main_data;
          var estado = rmd.estado;

          $('#tab_content1 #estado #estado_'+estado).prop('checked',true);
          $('#tab_content1 #estado #estado_'+estado).parent().addClass('active');
          $('#tab_content1 #id_prc').val(rmd.id_prc);
          $('#tab_content1 #cbo_prcgrupo').val(rmd.id_prcgrupo);
          $('#tab_content1 #titulo').val(rmd.titulo);
          $('#tab_content1 #cod').val(rmd.cod);
          $('#tab_content1 #objetivo').val(rmd.objetivo);

          var r = response.data.d_tab1;

          $('#tab_content1 #t_alcance #tbody_alcance').html(r.t_alcance);
          $('#tab_content1 #t_autoridad #tbody_autoridad').html(r.t_autoridad);
          $('#tab_content1 #t_ejecutadox #tbody_ejecutadox').html(r.t_ejecutadox);
          $('#tab_content1 #t_redactadox #tbody_redactadox').html(r.t_redactadox);
          $('#tab_content1 #t_revisadox #tbody_revisadox').html(r.t_revisadox);
          $('#tab_content1 #t_aprobadox #tbody_aprobadox').html(r.t_aprobadox);
          $('#tab_content1 #t_distribucion #tbody_distribucion').html(r.t_distribucion);

          $('#config_t #id_prc2').val(rmd.id_prc);

          //MODAL 2ND TAB

          var r2 = response.data.d_tab2;
          $('#tab_content2 #poe_body').html(r2);

          //MODAL 3RD TAB

          var r3 = response.data.d_tab3;
          $('#tab_content3 #addeddef_body').html(r3);
        }
        else
        {
          alerta('Error!!','Contactar con el area de Soporte','error')
        }
    },
    complete: function() {
      $.LoadingOverlay("hide");  
    }
  });
});

function limpiar_modal_configt()
{
  $('#config_t #id_puesto').html('');
  $('#config_t #id_prc_data_cabecera').val('');
  $('#config_t #id_area_puesto').val('');
  $('#config_t #estado label').removeClass('active');
  $('#config_t #estado input').prop('checked',false);

  $('#config_t #estado #estado_1').prop('checked',true);
  $('#config_t #estado #estado_1').parent().addClass('active');

  $('#config_t #id_tipodato_cabecera').val('');
  $('#config_t #myModalLabel').text('');
  $('#cont_autc').removeClass('hidden');
  $('#cont_select').removeClass('hidden');
  $('#config_t #id_area_puesto').prop('required',false);
  $('#config_t #id_puesto').prop('required',false);
  $('#config_t #id_tipodato_cabecera').val('');

  $('#config_t #cont_autc input').prop('checked',false);
  $('#config_t #cont_autc label').removeClass('active');

  $('#config_t #user_type_1').prop('checked',true);
  $('#config_t #user_type_1').parent().addClass('active');

  $('#config_t #integrantes_autocomplete').val('');
  $('#config_t #id_persona').val('');
  $('#config_t #id_member_group_owner').val('');

  $('#config_t #switch').addClass('hidden');
  $('#config_t #tg_1').prop('checked',false);
}

$(document).on('click','.btn_limpiar',function(){
  $('#editmprocedimiento').modal('hide');
  limpiar_modal_proced();
});

$(document).on('click','.add_alcance',function(){
  limpiar_modal_configt();
  $('#config_t #id_tipodato_cabecera').val('1');
  $('#cont_autc').addClass('hidden');
  $('#config_t #myModalLabel').text('Agregar Alcance');
  $('#config_t #id_area_puesto').prop('required',true);
  $('#config_t #id_puesto').prop('required',true);
});

$(document).on('click','.add_autoridad',function(){
  limpiar_modal_configt();
  $('#config_t #id_tipodato_cabecera').val('2');
  $('#cont_autc').addClass('hidden');
  $('#config_t #myModalLabel').text('Agregar Autoridad');
  $('#config_t #id_area_puesto').prop('required',true);
  $('#config_t #id_puesto').prop('required',true);
});

$(document).on('click','.add_ejecutadox',function(){
  limpiar_modal_configt();
  $('#config_t #id_tipodato_cabecera').val('3');
  $('#config_t #myModalLabel').text('Agregar Configuración');
  $('#config_t #switch').removeClass('hidden');
  $('#tg_1').bootstrapToggle('on')
});

$(document).on('click','.add_redactadox',function(){
  limpiar_modal_configt();
  $('#config_t #id_tipodato_cabecera').val('4');
  $('#cont_select').addClass('hidden');
  $('#config_t #myModalLabel').text('Agregar Configuración');
});

$(document).on('click','.add_revisadox',function(){
  limpiar_modal_configt();
  $('#config_t #id_tipodato_cabecera').val('5');
  $('#cont_select').addClass('hidden');
  $('#config_t #myModalLabel').text('Agregar Configuración');
});

$(document).on('click','.add_aprobadox',function(){
  limpiar_modal_configt();
  $('#config_t #id_tipodato_cabecera').val('6');
  $('#cont_select').addClass('hidden');
  $('#config_t #myModalLabel').text('Agregar Configuración');
});

$(document).on('click','.add_distribucion',function(){
  limpiar_modal_configt();
  $('#config_t #id_tipodato_cabecera').val('7');
  $('#cont_autc').addClass('hidden');
  $('#config_t #myModalLabel').text('Agregar Lista de Distribución');
  $('#config_t #id_area_puesto').prop('required',true);
  $('#config_t #id_puesto').prop('required',true);
});

$(document).on('change','#id_area_puesto',function(){
  id_areapuesto = $(this).val();
  $('#config_t #id_puesto').html('');
  $.ajax({
    async:false,
    url: $('base').attr('href') + 'mprocedimiento/get_cbo_puesto',
    type: 'POST',
    data: 'id_areapuesto='+id_areapuesto,
    dataType: "json",
    beforeSend: function() {
      $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
    },
    success: function(response) {
      if (response.code==1) 
      {              
        $('#config_t #id_puesto').html(response.data);
      }
      else
      {
        alerta('Error!','Error al obtener los datos :( ','error');
      }
    },
    complete: function() {
      $.LoadingOverlay("hide");  
    }
  });
});

$('#config_t').on('show.bs.modal', function (e) {
  $('#editmprocedimiento').modal('hide');
})

$('#config_t').on('hidden.bs.modal', function (e) {
  $('#editmprocedimiento').modal('show');
})

$(document).on('click','.btn_limpiar_configt',function(){
  $('#config_t').modal('hide');
  limpiar_modal_configt();
});

function get_header_data(id_prc)
{
  $.ajax({
    url: $('base').attr('href') + 'mprocedimiento/get_header_data',
    type: 'POST',
    data: 'id_prc='+id_prc,
    dataType: "json",
    beforeSend: function() {
      $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
    },
    success: function(response) {
        if (response.code==1) 
        {              
          var r = response.data;
          $('#tab_content1 #t_alcance #tbody_alcance').html(r.t_alcance);
          $('#tab_content1 #t_autoridad #tbody_autoridad').html(r.t_autoridad);
          $('#tab_content1 #t_ejecutadox #tbody_ejecutadox').html(r.t_ejecutadox);
          $('#tab_content1 #t_redactadox #tbody_redactadox').html(r.t_redactadox);
          $('#tab_content1 #t_revisadox #tbody_revisadox').html(r.t_revisadox);
          $('#tab_content1 #t_aprobadox #tbody_aprobadox').html(r.t_aprobadox);
          $('#tab_content1 #t_distribucion #tbody_distribucion').html(r.t_distribucion);
        }
        else
        {
          alerta('Error!!','Contactar con el area de Soporte','error')
        }
    },
    complete: function() {
      $.LoadingOverlay("hide");  
    }
  });
}

$(document).on('click','.edit_dalcance',function(){
  var tipo_d = $(this).parents('tr').attr('tipo_datac');
  var id_d = $(this).parents('tr').attr('id_datac');
  limpiar_modal_configt();
  $('#config_t #id_tipodato_cabecera').val('1');
  $('#cont_autc').addClass('hidden');
  $('#config_t #myModalLabel').text('Editar Alcance');
  $('#config_t #id_area_puesto').prop('required',true);
  $('#config_t #id_puesto').prop('required',true);

  $.ajax({
    url: $('base').attr('href') + 'mprocedimiento/get_data_config_t',
    type: 'POST',
    data: 'tipo_d='+tipo_d+'&id_d='+id_d,
    dataType: "json",
    beforeSend: function() {
      $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
    },
    success: function(response) {
        if (response.code==1) 
        {              
          var r = response.data;

          $('#config_t #id_prc2').val(r.id_prc);
          $('#config_t #id_tipodato_cabecera').val(r.id_tipodato_cabecera);
          $('#config_t #id_prc_data_cabecera').val(r.id_datac);
          $('#config_t #estado label').removeClass('active');
          $('#config_t #estado input').prop('checked',false);

          var est = r.estado;
          $('#config_t #estado #estado_'+est).prop('checked',true);
          $('#config_t #estado #estado_'+est).parent().addClass('active');

          $('#config_t #id_area_puesto').val(r.id_area_puesto);
          $('#config_t #id_area_puesto').trigger('change');

          $('#config_t #id_puesto').val(r.id_puesto);

        }
        else
        {
          alerta('Error!!','Contactar con el area de Soporte','error')
        }
    },
    complete: function() {
      $.LoadingOverlay("hide");  
    }
  });
});
 
$(document).on('click','.delete_',function(){
  var id_datac = $(this).parents('tr').attr('id_datac');
  var tipo_d = parseInt($(this).parents('tr').attr('tipo_datac'));
  var id_prc = $('#editmprocedimiento #id_prc').val();

  var nomb = "";
  switch(tipo_d)
  {
    case 1:
      nomb = "Alcance";
    break;
    case 2:
      nomb = "Autoridad y Responsabilidad";
    break;
    case 3:
      nomb = "Ejecutado por";
    break;
    case 4:
      nomb = "Redactado por";
    break;
    case 5:
      nomb = "Revisado por";
    break;
    case 6:
      nomb = "Aprobado por";
    break;
    case 7:
      nomb = "Lista de Distribución";
    break;
  }

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
        url: $('base').attr('href') + 'mprocedimiento/save_data_cabecera',
        type: 'POST',
        data: 'id_prc_data_cabecera='+id_datac+'&estado=0&id_tipodato_cabecera='+tipo_d,
        dataType: "json",
        beforeSend: function() {
          $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
        },
        success: function(response) {
            if (response.code==1) 
            {              
              var text = "Elimino!";
              alerta(text, 'Este '+nomb+' se '+text+'.', 'success');
              get_header_data(id_prc); 
            }
            else
            {
              alerta('error!','No se pudo Eliminar este registro.','error');
            }
        },
        complete: function() {
          $.LoadingOverlay("hide");  
        }
      });
    }
  }); 
});

$(document).on('click','.edit_dautoridad',function(){
  var tipo_d = $(this).parents('tr').attr('tipo_datac');
  var id_d = $(this).parents('tr').attr('id_datac');
  limpiar_modal_configt();
  $('#cont_autc').addClass('hidden');
  $('#config_t #myModalLabel').text('Editar Autoridad y Responsabilidad');
  $('#config_t #id_area_puesto').prop('required',true);
  $('#config_t #id_puesto').prop('required',true);

  $.ajax({
    url: $('base').attr('href') + 'mprocedimiento/get_data_config_t',
    type: 'POST',
    data: 'tipo_d='+tipo_d+'&id_d='+id_d,
    dataType: "json",
    beforeSend: function() {
      $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
    },
    success: function(response) 
    {
      if (response.code==1) 
      {              
        var r = response.data;

        $('#config_t #id_prc2').val(r.id_prc);
        $('#config_t #id_tipodato_cabecera').val(r.id_tipodato_cabecera);
        $('#config_t #id_prc_data_cabecera').val(r.id_datac);
        $('#config_t #estado label').removeClass('active');
        $('#config_t #estado input').prop('checked',false);

        var est = r.estado;
        $('#config_t #estado #estado_'+est).prop('checked',true);
        $('#config_t #estado #estado_'+est).parent().addClass('active');

        $('#config_t #id_area_puesto').val(r.id_area_puesto);
        $('#config_t #id_area_puesto').trigger('change');

        $('#config_t #id_puesto').val(r.id_puesto);

      }
      else
      {
        alerta('Error!!','Contactar con el area de Soporte','error')
      }
    },
    complete: function() {
      $.LoadingOverlay("hide");  
    }
  });
});

$(function () {
  $("#integrantes_autocomplete").autocomplete({

    type:'POST',
    serviceUrl: $('base').attr('href')+"mprocedimiento/get_allkind_data",
    dataType : 'JSON',
    params : { 
            tipo_persona: function(){ return parseInt($('#config_t input[name="tipo_persona"]:checked').val());},
            id_prc: function(){ return parseInt($('#config_t input#id_prc2').val());},
            id_tipodato_cabecera: function(){ return parseInt($('#config_t #id_tipodato_cabecera').val())}
            },

    onSelect: function (suggestion)
    {
      switch (parseInt($('input[name="tipo_persona"]:checked').val())) 
      {
        case 1 : 
          $('#integrantes_autocomplete').val(suggestion.value);
          $('#id_member_group_owner').val(suggestion.id_personal);
          $('#id_persona').val(suggestion.id_persona);
          break;

        case 2 : 
          $('#integrantes_autocomplete').val(suggestion.value);
          $('#id_member_group_owner').val(suggestion.data.id_cliente);
          $('#id_persona').val(suggestion.data.id_persona);
          break;

        case 3 : 
          $('#integrantes_autocomplete').val(suggestion.value);
          $('#id_member_group_owner').val(suggestion.data.id_proveedor);
          $('#id_persona').val(suggestion.data.id_persona);
          break;
      }
    }    
  });
});

$(document).on('click','.edit_daprobadox',function(){
  var tipo_d = $(this).parents('tr').attr('tipo_datac');
  var id_d = $(this).parents('tr').attr('id_datac');
  limpiar_modal_configt();
  $('#cont_select').addClass('hidden');
  $('#config_t #myModalLabel').text('Editar Aprobado por: ');

  $.ajax({
    url: $('base').attr('href') + 'mprocedimiento/get_data_config_t',
    type: 'POST',
    data: 'tipo_d='+tipo_d+'&id_d='+id_d,
    dataType: "json",
    beforeSend: function() {
      $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
    },
    success: function(response) 
    {
      if (response.code==1) 
      {              
        var r = response.data;

        $('#config_t #id_prc2').val(r.id_prc);
        $('#config_t #id_tipodato_cabecera').val(r.id_tipodato_cabecera);
        $('#config_t #id_prc_data_cabecera').val(r.id_datac);
        $('#config_t #estado label').removeClass('active');
        $('#config_t #estado input').prop('checked',false);

        var est = r.estado;
        $('#config_t #estado #estado_'+est).prop('checked',true);
        $('#config_t #estado #estado_'+est).parent().addClass('active');

        $('#config_t #cont_autc input').prop('checked',false);
        $('#config_t #cont_autc label').removeClass('active');

        var tp = r.tipo_persona;
        $('#config_t #user_type_'+tp).prop('checked',true);
        $('#config_t #user_type_'+tp).parent().addClass('active');

        $('#config_t #integrantes_autocomplete').val(r.nombre);
        $('#config_t #id_persona').val(r.id_persona);
        $('#config_t #id_member_group_owner').val(r.id_member_group_owner);

      }
      else
      {
        alerta('Error!!','Contactar con el area de Soporte','error')
      }
    },
    complete: function() {
      $.LoadingOverlay("hide");  
    }
  });
});

$(document).on('click','.edit_drevisadox',function(){
  var tipo_d = $(this).parents('tr').attr('tipo_datac');
  var id_d = $(this).parents('tr').attr('id_datac');
  limpiar_modal_configt();
  $('#cont_select').addClass('hidden');
  $('#config_t #myModalLabel').text('Editar Revisado por: ');

  $.ajax({
    url: $('base').attr('href') + 'mprocedimiento/get_data_config_t',
    type: 'POST',
    data: 'tipo_d='+tipo_d+'&id_d='+id_d,
    dataType: "json",
    beforeSend: function() {
      $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
    },
    success: function(response) 
    {
      if (response.code==1) 
      {              
        var r = response.data;

        $('#config_t #id_prc2').val(r.id_prc);
        $('#config_t #id_tipodato_cabecera').val(r.id_tipodato_cabecera);
        $('#config_t #id_prc_data_cabecera').val(r.id_datac);
        $('#config_t #estado label').removeClass('active');
        $('#config_t #estado input').prop('checked',false);

        var est = r.estado;
        $('#config_t #estado #estado_'+est).prop('checked',true);
        $('#config_t #estado #estado_'+est).parent().addClass('active');

        $('#config_t #cont_autc input').prop('checked',false);
        $('#config_t #cont_autc label').removeClass('active');

        var tp = r.tipo_persona;
        $('#config_t #user_type_'+tp).prop('checked',true);
        $('#config_t #user_type_'+tp).parent().addClass('active');

        $('#config_t #integrantes_autocomplete').val(r.nombre);
        $('#config_t #id_persona').val(r.id_persona);
        $('#config_t #id_member_group_owner').val(r.id_member_group_owner);

      }
      else
      {
        alerta('Error!!','Contactar con el area de Soporte','error')
      }
    },
    complete: function() {
      $.LoadingOverlay("hide");  
    }
  });
});

$(document).on('click','.edit_dredactadox',function(){
  var tipo_d = $(this).parents('tr').attr('tipo_datac');
  var id_d = $(this).parents('tr').attr('id_datac');
  limpiar_modal_configt();
  $('#cont_select').addClass('hidden');
  $('#config_t #myModalLabel').text('Editar Redactado por: ');

  $.ajax({
    url: $('base').attr('href') + 'mprocedimiento/get_data_config_t',
    type: 'POST',
    data: 'tipo_d='+tipo_d+'&id_d='+id_d,
    dataType: "json",
    beforeSend: function() {
      $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
    },
    success: function(response) 
    {
      if (response.code==1) 
      {              
        var r = response.data;

        $('#config_t #id_prc2').val(r.id_prc);
        $('#config_t #id_tipodato_cabecera').val(r.id_tipodato_cabecera);
        $('#config_t #id_prc_data_cabecera').val(r.id_datac);
        $('#config_t #estado label').removeClass('active');
        $('#config_t #estado input').prop('checked',false);

        var est = r.estado;
        $('#config_t #estado #estado_'+est).prop('checked',true);
        $('#config_t #estado #estado_'+est).parent().addClass('active');

        $('#config_t #cont_autc input').prop('checked',false);
        $('#config_t #cont_autc label').removeClass('active');

        var tp = r.tipo_persona;
        $('#config_t #user_type_'+tp).prop('checked',true);
        $('#config_t #user_type_'+tp).parent().addClass('active');

        $('#config_t #integrantes_autocomplete').val(r.nombre);
        $('#config_t #id_persona').val(r.id_persona);
        $('#config_t #id_member_group_owner').val(r.id_member_group_owner);

      }
      else
      {
        alerta('Error!!','Contactar con el area de Soporte','error')
      }
    },
    complete: function() {
      $.LoadingOverlay("hide");  
    }
  });
});

$(document).on('change','#tg_1',function(){
  if($(this).is(':checked'))
  {
    $('#config_t #cont_autc').addClass('hidden');
    $('#config_t #cont_select').removeClass('hidden');
  }
  else
  {
    $('#config_t #cont_autc').removeClass('hidden');
    $('#config_t #cont_select').addClass('hidden');
  }
});

$(document).on('click','.edit_dejecutadox',function(){
  var tipo_d = $(this).parents('tr').attr('tipo_datac');
  var id_d = $(this).parents('tr').attr('id_datac');
  limpiar_modal_configt();
  $('#config_t #myModalLabel').text('Editar Ejecutado por: ');

  $.ajax({
    url: $('base').attr('href') + 'mprocedimiento/get_data_config_t',
    type: 'POST',
    data: 'tipo_d='+tipo_d+'&id_d='+id_d,
    dataType: "json",
    beforeSend: function() {
      $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
    },
    success: function(response) 
    {
      if (response.code==1) 
      {              
        var r = response.data;

        $('#config_t #id_prc2').val(r.id_prc);
        $('#config_t #id_tipodato_cabecera').val(r.id_tipodato_cabecera);
        $('#config_t #id_prc_data_cabecera').val(r.id_datac);
        $('#config_t #estado label').removeClass('active');
        $('#config_t #estado input').prop('checked',false);

        var est = r.estado;
        $('#config_t #estado #estado_'+est).prop('checked',true);
        $('#config_t #estado #estado_'+est).parent().addClass('active');

        $('#config_t #switch').removeClass('hidden');

        if(r.hasOwnProperty('tipo_persona'))
        {
          $('#tg_1').bootstrapToggle('off')

          $('#config_t #cont_select').addClass('hidden');
          $('#config_t #cont_autc').removeClass('hidden');

          $('#config_t #cont_autc input').prop('checked',false);
          $('#config_t #cont_autc label').removeClass('active');

          var tp = r.tipo_persona;
          $('#config_t #user_type_'+tp).prop('checked',true);
          $('#config_t #user_type_'+tp).parent().addClass('active');

          $('#config_t #integrantes_autocomplete').val(r.nombre);
          $('#config_t #id_persona').val(r.id_persona);
          $('#config_t #id_member_group_owner').val(r.id_member_group_owner);
        }
        else
        {
          $('#tg_1').bootstrapToggle('on')
          $('#config_t #cont_select').removeClass('hidden');
          $('#config_t #cont_autc').addClass('hidden');

          $('#config_t #id_area_puesto').val(r.id_area_puesto);
          $('#config_t #id_area_puesto').trigger('change');

          $('#config_t #id_puesto').val(r.id_puesto);
        }

      }
      else
      {
        alerta('Error!!','Contactar con el area de Soporte','error')
      }
    },
    complete: function() {
      $.LoadingOverlay("hide");  
    }
  });
});

$(document).on('click','#myTab li',function(){
  n_tb = $(this).attr('tabs').trim();
  switch (n_tb)
  {
    case 'tab-general':
      $('#editmprocedimiento .modal-dialog').css("width","40%");
      $('#myModalLabel').text('Configuración de Cabecera');
    break;
    case 'tab-poe':
      $('#editmprocedimiento .modal-dialog').css("width","70%");
      $('#myModalLabel').text('Procedimiento Operativo Estandar');
    break;
    case 'tab-definiciones':
      $('#editmprocedimiento .modal-dialog').css("width","40%");
      $('#myModalLabel').text('Adjuntar Definiciones');
    break;
  }
});

$(document).on('click','.edit_distribucion',function(){
  var tipo_d = $(this).parents('tr').attr('tipo_datac');
  var id_d = $(this).parents('tr').attr('id_datac');
  limpiar_modal_configt();
  $('#config_t #id_tipodato_cabecera').val('1');
  $('#cont_autc').addClass('hidden');
  $('#config_t #myModalLabel').text('Editar Alcance');
  $('#config_t #id_area_puesto').prop('required',true);
  $('#config_t #id_puesto').prop('required',true);

  $.ajax({
    url: $('base').attr('href') + 'mprocedimiento/get_data_config_t',
    type: 'POST',
    data: 'tipo_d='+tipo_d+'&id_d='+id_d,
    dataType: "json",
    beforeSend: function() {
      $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
    },
    success: function(response) {
        if (response.code==1) 
        {              
          var r = response.data;

          $('#config_t #id_prc2').val(r.id_prc);
          $('#config_t #id_tipodato_cabecera').val(r.id_tipodato_cabecera);
          $('#config_t #id_prc_data_cabecera').val(r.id_datac);
          $('#config_t #estado label').removeClass('active');
          $('#config_t #estado input').prop('checked',false);

          var est = r.estado;
          $('#config_t #estado #estado_'+est).prop('checked',true);
          $('#config_t #estado #estado_'+est).parent().addClass('active');

          $('#config_t #id_area_puesto').val(r.id_area_puesto);
          $('#config_t #id_area_puesto').trigger('change');

          $('#config_t #id_puesto').val(r.id_puesto);

        }
        else
        {
          alerta('Error!!','Contactar con el area de Soporte','error')
        }
    },
    complete: function() {
      $.LoadingOverlay("hide");  
    }
  });
});

///////---------> POE BODY <---------- ////////

$(document).on('click','.add_prcop',function(){
  limpiar_modal_confprcop();
  var id = $('#id_prc').val();
  $('#myModalLabel3').text('Agregar Proc. Op.');
  $('#id_prc3').val(id);
  remove_error('form_save_conf_prcop');
});

function limpiar_modal_confprcop()
{
  $('#conf_prcop #id_prc3').val('');
  $('#conf_prcop #id_prc_poe').val('');
  $('#conf_prcop #estado input').prop('checked',false);
  $('#conf_prcop #estado label').removeClass('active');

  $('#conf_prcop #estado #estado_1').prop('checked',true);
  $('#conf_prcop #estado #estado_1').parent().addClass('active');

  $('#conf_prcop #titulo_op').val('');
  $('#conf_prcop #n_orden').val('');
  $('#conf_prcop #descripcion').val('');
}

function get_data_prcop()
{
  var id_prc = $('#id_prc').val();

  $.ajax({
    url: $('base').attr('href') + 'mprocedimiento/get_data_prcop',
    type: 'POST',
    data: 'id_prc='+id_prc,
    dataType: "json",
    beforeSend: function() {
      $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
    },
    success: function(response) 
    {
      if (response.code==1) 
      {              
        var r = response.data;
        $('#poe_body').html(r);
      }
      else
      {
        alerta('Error!!','Contactar con el area de Soporte','error')
      }
    },
    complete: function() {
      $.LoadingOverlay("hide");  
    }
  });
}

$(document).on('click','.edit_prcop',function(){
  var id_prc_poe = $(this).parents('tr').attr('id_prcop');
  $('#conf_prcop #myModalLabel3').text('Editar Proc. Op.');
  $.ajax({
    url: $('base').attr('href') + 'mprocedimiento/get_one_prcop',
    type: 'POST',
    data: 'id_prc_poe='+id_prc_poe,
    dataType: "json",
    beforeSend: function() {
      $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
    },
    success: function(response) 
    {
      if (response.code==1) 
      {              
        var r = response.data;

        $('#conf_prcop #estado input').prop('checked',false);
        $('#conf_prcop #estado label').removeClass('active');
        var n = r.estado;
        $('#conf_prcop #estado_'+n).prop('checked',true);
        $('#conf_prcop #estado_'+n).parent().addClass('active');

        $('#conf_prcop #id_prc3').val(r.id_prc);
        $('#conf_prcop #id_prc_poe').val(r.id_prc_poe);
        $('#conf_prcop #titulo_op').val(r.titulo);
        $('#conf_prcop #n_orden').val(r.n_orden);
        $('#conf_prcop #descripcion').val(r.descripcion);

      }
      else
      {
        alerta('Error!!','Contactar con el area de Soporte','error')
      }
    },
    complete: function() {
      $.LoadingOverlay("hide");  
    }
  });

});

$(document).on('click','.del_prcop',function(){
  var id_prc_poe = $(this).parents('tr').attr('id_prcop');
  var nomb = "Proc. Op."
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
        url: $('base').attr('href') + 'mprocedimiento/save_prcop',
        type: 'POST',
        data: 'id_prc_poe='+id_prc_poe+'&estado=0',
        dataType: "json",
        beforeSend: function() {
          $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
        },
        success: function(response) {
            if (response.code==1) 
            {              
              var text = "Elimino!";
              alerta(text, 'Este '+nomb+' se '+text+'.', 'success');
              get_data_prcop(); 
            }
            else
            {
              alerta('error!','No se pudo Eliminar este registro.','error');
            }
        },
        complete: function() {
          $.LoadingOverlay("hide");  
        }
      });
    }
  }); 
});

$(document).on('click','.btn_mprcop',function(){
  $('#conf_prcop').modal('hide');
  limpiar_modal_confprcop();
})

$(document).on('click', '.x_panel #datatable_paginate li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  buscar_mprocedimientos(page);
});

$(document).on('click', '.x_panel #datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  buscar_mprocedimientos(page);
});

///////---------> DEFINICIONES BODY <---------- ////////

$(document).on('click','.add_def',function(){
  var page = $('#bandeja_def #paginacion_data ul.pagination li.active a').attr('tabindex');
  get_def_dispxprc(page);
});

function get_def_dispxprc(page)
{
  var param = 'page='+page;
  var id_prc = $('#id_prc').val();
  var pal_busc = $('#pal_busc').val();
  var def_busc = $('#def_busc').val();

  if(parseInt(id_prc)>0)
  {
    param = param + '&id_prc='+id_prc;
  }

  if(pal_busc.trim())
  {
    param = param +'&palabra='+pal_busc;
  }

  if(def_busc.trim())
  {
    param = param +'&definicion='+def_busc;
  }

  $.ajax({
    url: $('base').attr('href') + 'mprocedimiento/get_def_dispxprc',
    type: 'POST',
    data: param,
    dataType: "json",
    beforeSend: function() {
      $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
    },
    success: function(response) {
        if (response.code==1) 
        {              
          $('#bandeja_def #addeddef_body').html(response.data.t_data);

          $('#bandeja_def #paginacion_data').html(response.data.paginacion);
        }
        else
        {
          alerta('error!','No se obtuvieron datos.','error');
        }
    },
    complete: function() {
      $.LoadingOverlay("hide");  
    }
  });
}

$(document).on('click', '#bandeja_def #datatable_paginate li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  get_def_dispxprc(page);
});

$(document).on('click', '#bandeja_def #datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  get_def_dispxprc(page);
});

$(document).on('click','#bandeja_def .buscar_def',function(){
  get_def_dispxprc(0);
});

$(document).on('click','#bandeja_def .limpiarfiltro_def',function(){
 $('#bandeja_def input[type="text"]').val('');
 get_def_dispxprc(0);
});

$(document).on('click','#bandeja_def .add_def',function(){
  var id_definicion = $(this).parents('tr').attr('id_def');
  var id_prc = $('#id_prc').val();

  var param = 'id_prc='+id_prc+'&id_definicion='+id_definicion;
  $.ajax({
    url: $('base').attr('href') + 'mprocedimiento/adddef_toprc',
    type: 'POST',
    data: param,
    dataType: "json",
    beforeSend: function() {
      $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
    },
    success: function(response) {
      if (response.code==1) 
      {              
        alerta('Configuración Guardada!','Exitosamente','success');
        get_defxproc();
        get_def_dispxprc(0);
      }
      else
      {
        alerta('error!','No se pudo Guardar :( .','error');
      }
    },
    complete: function() {
      $.LoadingOverlay("hide");  
    }
  });
});

function get_defxproc()
{
  var id_prc = $('#id_prc').val();

  $.ajax({
    url: $('base').attr('href') + 'mprocedimiento/get_defxpro',
    type: 'POST',
    data: 'id_prc='+id_prc,
    dataType: "json",
    beforeSend: function() {
      $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
    },
    success: function(response) {
      if (response.code==1) 
      {       
        $('#tab_content3 #addeddef_body').html(response.data);
      }
      else
      {
        alerta('error!','No se pudieron Obtener los datos :( .','error');
      }
    },
    complete: function() {
      $.LoadingOverlay("hide");  
    }
  });
}

$(document).on('click','.del_prcdef',function()
{
  var c=$(this).parents('tr').attr('id_prcdef');

  swal({
    title: 'Estas Seguro?',
    text: "De Eliminar esta Configuración?",
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, estoy seguro!'
  }).then(function(isConfirm) {
    if (isConfirm) {     
      $.ajax({
        url: $('base').attr('href') + 'mprocedimiento/delete_defxproc',
        type: 'POST',
        data: 'id_prc_definicion='+c,
        dataType: "json",
        beforeSend: function() {
          $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
        },
        success: function(response) {
          if (response.code==1) 
          {       
            alerta('Hecho!','Se Eliminó esta Configuración!! .','success');
            get_defxproc();
          }
          else
          {
            alerta('error!','La acción no se pudo concretar!','error');
          }
        },
        complete: function() {
          $.LoadingOverlay("hide");  
        }
      });
    }
  }); 
});