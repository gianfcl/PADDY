
$( document ).ready(function() {

  jQuery.validator.setDefaults({
    debug: true,
    success: "valid",
    ignore: ""
  });

  $('#form_save_pregunta').validate({
    rules:
    {
      tipo_alternativa:{ required:true },
      pregunta:{ required:true, minlength: 2 },       
      orden_pregunta : {
        required:true,
        remote: {
          url: $('base').attr('href') + 'eplantilla/validar_orden_pregunta',
          type: "post",
          data: {
            orden_pregunta: function() { return $( "#orden_pregunta" ).val(); },
            id_eplantilla: function() { return $('#id_eplantilla_modal').val(); },
            id_eplantilla_pregunta: function() { return $('#id_eplantilla_pregunta').val(); }, 
          }
        }
      }
    },
    messages: 
    {
      tipo_alternativa:{
        required:"Dato obligatorio" },
      pregunta:{ required:"Ingresar pregunta", minlength: "Más de 2 Letras" },
      orden_pregunta : {
        required:"Ingrese Orden",
        remote: "Orden ya existente"
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
        url: $('base').attr('href') + 'eplantilla/save_pregunta',
        type: 'POST',
        data: $('#form_save_pregunta').serialize(),
        dataType: "json",
        beforeSend: function() {
            $('.btn-submit').button('loading');
            $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin", zIndex : 999999999});
        },
        success: function(response) {
          if (response.code==1) {

            var tipo_alternativa = $('#tipo_alternativa').val();
            var pregunta = $('#pregunta').val();
            var id_pregunta = parseInt(response.data.id);
            
            var id_o = $('#id_eplantilla_pregunta').val('');
            if(id_o !== 0)
            {
              buscar_preguntas();
            }
            else
            {
              crear_form_pregunta(tipo_alternativa,pregunta,id_pregunta);
            }

            limpiar_modal_pregunta();
            $('#crear_pregunta').modal('hide');

            var id_eplantilla_pregunta = parseInt($('#id_eplantilla_pregunta').val());
            id_eplantilla_pregunta = (id_eplantilla_pregunta>0) ? (id_eplantilla_pregunta) : ("0");
            var text = (id_eplantilla_pregunta=="0") ? ("Guardo!") : ("Edito!");
            alerta(text, 'Esta pregunta se '+text+'.', 'success');
          }
          else
          {
            alerta('Error :(', 'No se pudo guardar.', 'error');
          }
        },
        complete: function() 
        {
          $('.btn-submit').button('reset');
          $.LoadingOverlay("hide");  
        }
      });/**/
    }
  });

  $('#form_save_pregunta_alternativa').validate({
    rules:
    {
      alternativa:{ required:true },
      orden:{ 
        required:true,
        remote: {
          url: $('base').attr('href') + 'eplantilla/validar_orden',
          type: "post",
          data: {
            n_orden: function() { return $( "#orden" ).val(); },
            id_eplantilla_pregunta: function() { return $('#show_bandeja_alt #id_eplantilla_pregunta2').val(); },
            id_pregunta_alternativa: function() { return $('#id_pregunta_alternativa').val(); },
          }
        }
      }       
    },
    messages: 
    {
      alternativa:{
        required:"Dato obligatorio" },
      orden:{ required:"Ingresar Orden",remote:"Ya existe"}
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
        url: $('base').attr('href') + 'eplantilla/save_new_alternativa',
        type: 'POST',
        data: $('#form_save_pregunta_alternativa').serialize(),
        dataType: "json",
        beforeSend: function() {
          $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin", zIndex : 999999999999});
        },
        success: function(response) {
          if (response.code==1) 
          {
            new_id = response.data.id;
            
            
            $('#editpregunta_alternativa').modal('hide');

            var id_eplantilla_pregunta = parseInt($('#id_eplantilla_pregunta').val());
            id_eplantilla_pregunta = (id_eplantilla_pregunta>0) ? (id_eplantilla_pregunta) : ("0");
            var text = (id_eplantilla_pregunta=="0") ? ("Guardo!") : ("Edito!");
            alerta(text, 'Esta pregunta se '+text+'.', 'success');
            limpiar_modal_alter();
          }
          else
          {
            alerta('Error :(', 'No se pudo guardar.', 'error');
          }
        },
        complete: function() {
          get_alternativasxpregunta();
          $.LoadingOverlay("hide"); 
        }
      });/**/
    }
  });

  $('#form_save_fech').validate({
    rules:
    {
      fecha_inicio:{ required:true },
      fecha_fin:{ required:true, minlength: 2 }       
      /*orden_pregunta : {
        required:true,
        remote: {
          url: $('base').attr('href') + 'eplantilla/validar_orden_pregunta',
          type: "post",
          data: {
            orden_pregunta: function() { return $( "#orden_pregunta" ).val(); },
            id_eplantilla: function() { return $('#id_eplantilla_modal').val(); },
            id_eplantilla_pregunta: function() { return $('#id_eplantilla_pregunta').val(); }, 
          }
        }
      }*/
    },
    messages: 
    {
      fecha_inicio:{ required:"Dato obligatorio" },
      fecha_fin:{ required:"Dato obligatorio"}
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
        url: $('base').attr('href') + 'eplantilla/save_fechxpre',
        type: 'POST',
        data: $('#form_save_fech').serialize(),
        dataType: "json",
        beforeSend: function() {
            $('#form_save_fech .btn-submit').button('loading');
            $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin", zIndex : 999999999});
        },
        success: function(response) {
          if (response.code==1) {
            buscar_fech();

            $('#crear_rangofech').modal('hide');
            limpiar_modal_range(); 
            var id_pregunta_fech = parseInt($('#id_pregunta_fech').val());
            id_pregunta_fech = (id_pregunta_fech>0) ? (id_pregunta_fech) : ("0");
            var text = (id_pregunta_fech=="0") ? ("Guardo!") : ("Edito!");
            alerta(text, 'Esta configuración se '+text+'.', 'success');
          }
          else
          {
            alerta('Error :(', 'No se pudo guardar.', 'error');
          }
        },
        complete: function() 
        {
          $('#form_save_fech .btn-submit').button('reset');
          $.LoadingOverlay("hide");  
        }
      });/**/
    }
  });

  $(function() {
    $('#colop1').colorpicker({
      format: "hex",
    });
  });

  $(function() {
    $('#colop2').colorpicker({
      format: "hex",
    });
  });

  $("#colop2").colorpicker().on("showPicker", function (e) {
    $('.colorpicker-visible').css("z-index","9999999999");
  });


  $('#fecha_i').datetimepicker({
    format: 'LT',
    locale: moment.locale('es')
  });

  $('#fecha_f').datetimepicker({
    format: 'LT',
    locale: moment.locale('es'),
    useCurrent: false
  });

  $("#fecha_i").on("dp.change", function (e) {
    $('#fecha_f').data("DateTimePicker").minDate(e.date);
  });

  $("#fecha_f").on("dp.change", function (e) {
    $('#fecha_i').data("DateTimePicker").maxDate(e.date);
  });

});


$(document).on('click', '.crear_pregunta', function (e) {
  limpiar_modal_pregunta();
  var id_eplantilla = $('#id_eplantilla').val();
  $('#id_eplantilla_modal').val(id_eplantilla);
  $('#myModalLabel1').text('Crear pregunta');
});

function limpiar_modal_pregunta()
{
  $('#id_eplantilla_pregunta').val('');
  $('#tipo_alternativa').val('');
  $('#pregunta').val('');
  $('#estado_pregunta').val('1');
  $('#max_caracter').val('');
  $('#es_random').prop('checked',false);
  $('#orden_pregunta').val('');
  $('#color').val('');
  $('span.input-group-addon').find('i').css("background-color", "#000000" );
  remove_error('form_save_pregunta');
  $('#estado #estado_1').prop('checked',true);
  $('#estado #estado_1').parent().addClass('active');
  $('#es_random').closest('div').removeClass('hidden');
  $('#max_caracter').closest('.form-group').removeClass('hidden'); 
}

$(document).on('click', '.edit_pregunta', function (e) {
  $('#myModalLabel1').text('Editar pregunta');
  limpiar_modal_pregunta();
  var id_pregunta = $(this).parents('tr').attr('id_pregunta');

  $.ajax({
    url: $('base').attr('href') + 'eplantilla/edit_pregunta',
    type: 'POST',
    data: 'id_eplantilla_pregunta='+id_pregunta,
    dataType: "json",
    beforeSend: function() {
        //showLoader();
    },
    success: function(response) {
      if (response.code==1) 
      {
        var r = response.data;
        var tipo_alt = r.tipo_alternativa;

        $('#pregunta').val(r.pregunta);
        $('#id_eplantilla_pregunta').val(r.id_eplantilla_pregunta);
        $('#tipo_alternativa').val(r.tipo_alternativa);
        $('#orden_pregunta').val(r.orden_pregunta);
        $('#color').val(r.color);
        $('span.input-group-addon').find('i').css("background-color", response.data.color);

        if(r.es_random==1)
          $('#es_random').prop('checked',true);

        switch(parseInt(tipo_alt))
        {
          case 1:
            $('#max_caracter').closest('.form-group').addClass('hidden');
          break;
          case 2:
            $('#max_caracter').closest('.form-group').addClass('hidden');
          break;
          case 3:
            $('#es_random').closest('div').addClass('hidden');
            $('#max_caracter').val(r.max_caracter);
          break;
          case 4:
            $('#es_random').closest('div').addClass('hidden');
            $('#max_caracter').val(r.max_caracter);
          break;
          case 5:
            $('#max_caracter').closest('.form-group').addClass('hidden');
          break;
        }

        $('#estado input').prop('checked',false);
        $('#estado label').removeClass('active');

        var estado = r.estado.toString();

        $('#estado #estado_'+estado).prop('checked',true);
        $('#estado #estado_'+estado).parent().addClass('active');
      }
      else
      {
        console.log('Error al momento de obtener datos de la BD. Abortando.')
      }
    },
  });
});

function buscar_preguntas()
{
  var id_eplantilla = $('#id_eplantilla').val();

  $.ajax({
    url: $('base').attr('href') + 'eplantilla/buscar_preguntas',
    type: 'POST',
    data : 'id_eplantilla='+id_eplantilla,
    dataType: "json",
    success: function(response) {
      if (response.code==1) 
      {
        $('#bodyindex').html(response.data);
      }
      else
      {
        console.log('Error al momento de obtener datos de la BD. Abortando.')
      }
    },
  });
}

$(document).on('click', '.delete_pregunta', function (e) {
  e.preventDefault();
  var nomb = "pregunta";
  th = $(this);
  var id_pregunta = th.parents('tr').attr('id_pregunta');
  var id_eplantilla = $('#id_eplantilla').val();
  swal({
    title: 'Estas Seguro?',
    text: "De Eliminar esta "+nomb,
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, estoy seguro!'
  }).then(function(isConfirm) {
    if (isConfirm) {    
      $.ajax({
        url: $('base').attr('href') + 'eplantilla/save_pregunta',
        type: 'POST',
        data: 'id_eplantilla_pregunta='+id_pregunta+'&estado=0&id_eplantilla_modal='+id_eplantilla,
        dataType: "json",
        
        success: function(response) {
          if (response.code==1) {              
            buscar_preguntas();
          }
        },
        complete: function() {
          var text = "Elimino!";
          alerta(text, 'Esta '+nomb+' se '+text+'.', 'success');
        }
      });
    }
  }); 
});

function remove_error(form){
  $('form#'+(form.toString())+' div.form-group').each(function(indice, elemento) {
    if($(this).attr('class')=="form-group has-error"){
      $(this).removeClass("has-error");
      $(this).find("span.help-block").remove(); 
      $(this).removeAttr('aria-describedby');
    }
  }); 
}

$(document).on('click', '.edit_this_a', function (e) {
  limpiar_modal_alter();
  $('#myModalLabel3').text('Editar alternativa');
  var id_alternativa = $(this).parents('tr').attr('id_pregunta_alternativa');

  $.ajax({
    url: $('base').attr('href') + 'eplantilla/edit_alternativa',
    type: 'POST',
    data: 'id_pregunta_alternativa='+id_alternativa,
    dataType: "json",
    
    success: function(response) {
      if (response.code==1) 
      {              
        var r = response.data;
        $('#editpregunta_alternativa #id_eplantilla_pregunta2').val(r.id_eplantilla_pregunta);
        $('#editpregunta_alternativa #id_pregunta_alternativa').val(r.id_pregunta_alternativa);
        $('#editpregunta_alternativa  #alternativa').val(r.alternativa);
        $('#editpregunta_alternativa #orden').val(r.orden);
        $('#editpregunta_alternativa #color_alt').val(r.color);
        $('#editpregunta_alternativa span.input-group-addon').find('i').css("background-color", r.color);

        $('#editpregunta_alternativa #estado input').prop('checked', true);
        $('#editpregunta_alternativa #estado label').removeClass('active');

        var num = r.estado;
        $('#editpregunta_alternativa #estado #estado_'+num).prop('checked', true);
        $('#editpregunta_alternativa #estado #estado_'+num).parent('label').addClass('active');
        
        var tipo_a = r.tipo_alternativa;
        switch(parseInt(tipo_a))
        {
          case 2:
            $('#editpregunta_alternativa #valor').closest('.form-group').removeClass('hidden');
            $('#editpregunta_alternativa #valor').val(r.valor);
          break;
        }
      }
    },
    complete: function() {
      
    }
  });
});

$(document).on('click', '.del_this_a', function (e) {
  var t = $(this);
  var id_pregunta_alternativa = t.parents('tr').attr('id_pregunta_alternativa');
  var param = 'id_pregunta_alternativa='+id_pregunta_alternativa+'&estado=0';
  
  swal({
    title: 'Estas Seguro?',
    text: "De Eliminar esta alternativa?",
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, estoy seguro!'
  }).then(function(isConfirm) {
    if (isConfirm) {    
      $.ajax({
        url: $('base').attr('href') + 'eplantilla/save_new_alternativa',
        type: 'POST',
        data: param,
        dataType: "json",
        success: function(response) {
          if (response.code==1) 
          {
            get_alternativasxpregunta();
          }
          else
          {
            console.log('Error al momento de guardar!!!!.Consultar con el Desarrollador!!');
          }
        },
      });
    }
  }); 
});

$(document).on('click', '.new_alter', function (e) {
  limpiar_modal_alter();
  $('#myModalLabel3').text('Agregar alternativa');
  var id_preguntaxbandeja = $('#show_bandeja_alt #id_eplantilla_pregunta2').val();
  $('#editpregunta_alternativa #id_eplantilla_pregunta2').val(id_preguntaxbandeja);

  var tipo_alt = $('#show_bandeja_alt #id_eplantilla_pregunta2').attr('tipo_alt');
  switch(parseInt(tipo_alt))
  {
    case 2:
      $('#valor').closest('.form-group').removeClass('hidden');
    break;
  } 
});

function limpiar_bandeja()
{
  $('#show_bandeja_alt #id_eplantilla_pregunta2').val('');
  $('#bodyindex2').html('');
  $('#valor').closest('.form-group').addClass('hidden');
}

function limpiar_modal_alter()
{
  $('#editpregunta_alternativa #id_eplantilla_pregunta2').val('');
  $('#editpregunta_alternativa #id_pregunta_alternativa').val('');
  $('#editpregunta_alternativa #myModalLabel3').text('');
  $('#editpregunta_alternativa #alternativa').val('');
  $('#editpregunta_alternativa #valor').val('');
  $('#editpregunta_alternativa #orden').val('');
  $('#editpregunta_alternativa #estado estado_1').prop('checked',true);
  $(' #estado estado_1').parent().addClass('active');
  $('#editpregunta_alternativa span.input-group-addon').find('i').css("background-color", "#000000" );
  $('#editpregunta_alternativa #color_alt').val('');
}

$(document).on('change','#tipo_alternativa',function(){
  var id  = $(this).val();
  if(id == 3 || id == 4)
  {
    $('#max_caracter').parents('.form-group').removeClass('hidden');
    $('#es_random').closest('div').addClass('hidden');
  }
  else
  {
    $('#max_caracter').parents('.form-group').addClass('hidden');
    $('#es_random').closest('div').removeClass('hidden');
  }
});

$(document).on('click','.show_bandeja',function()
{
  limpiar_bandeja();
  limpiar_modal_range();
  var id_pregunta = $(this).parents('tr').attr('id_pregunta');

  $.ajax({
    url: $('base').attr('href') + 'eplantilla/get_alternativasxpregunta',
    async: false,
    type: 'POST',
    data: 'id_pregunta='+id_pregunta,
    dataType: "json",
    
    success: function(response) {
      if (response.code==1) 
      {              
        var r=response.data;
        $('#myModalLabel2').html('<text>'+r.p_data.pregunta+'<text>');
        $('#show_bandeja_alt #id_eplantilla_pregunta2').val(r.p_data.id_eplantilla_pregunta);
        $('#bodyindex2').html(r.tbody_data);
        $('#show_bandeja_alt #id_eplantilla_pregunta2').attr('tipo_alt',r.p_data.tipo_alternativa);
      }
    },
  });

  buscar_fech();
});

function get_alternativasxpregunta()
{
  var id_eplantilla_pregunta = $('#show_bandeja_alt #id_eplantilla_pregunta2').val();

  $.ajax({
    url: $('base').attr('href') + 'eplantilla/get_alternativasxpregunta',
    type: 'POST',
    data : 'id_pregunta='+id_eplantilla_pregunta,
    dataType: "json",
    success: function(response) {
      if (response.code==1) 
      {
        $('#bodyindex2').html(response.data.tbody_data);
      }
      else
      {
        console.log('Error al momento de obtener datos de la BD. Abortando.')
      }
    },
  });
}

$(document).on('click','.limpiar_modal_pregunta',function(){
  $('#crear_pregunta').modal('hide');
  limpiar_modal_pregunta();
});

$(document).on('click','.btn_limpiar',function(){
  $('#editpregunta_alternativa').modal('hide');
  limpiar_modal_alter();
});

$(document).on('click','.limpiar_modal_fech',function(){
  $('#crear_rangofech').modal('hide');
  limpiar_modal_range();
});



// --------> crear rango algoritmo <--------  //

$(document).on('click','.new_range',function(){
  limpiar_modal_range();
  $('#myModalLabel_fech').text('Agregar rango');
  var id_pregunta = $('#show_bandeja_alt #id_eplantilla_pregunta2').val();
  $('#id_eplantilla_pregunta_fech').val(id_pregunta);
  var id_dia = $(this).closest('.main_parent').find('table').attr('dia');
  $('#dia_sem').val(id_dia);
});

function limpiar_modal_range()
{
  $('#id_pregunta_fech').val('');
  $('#id_eplantilla_pregunta').val('');
  $('#dia_sem').val('');
  $('#fecha_i').val('');
  $('#fecha_f').val('');
  $('#fecha_f').data("DateTimePicker").minDate(false);
  $('#fecha_f').data("DateTimePicker").maxDate(false);
  $('#fecha_i').data("DateTimePicker").minDate(false);
  $('#fecha_i').data("DateTimePicker").maxDate(false);
  
}

function buscar_fech()
{
  var id_pregunta = $('#show_bandeja_alt #id_eplantilla_pregunta2').val();

  $.ajax({
    url: $('base').attr('href') + 'eplantilla/buscar_fech',
    type: 'POST',
    data : 'id_pregunta='+id_pregunta,
    dataType: "json",
    success: function(response) {
      if (response.code==1) 
      {
        var r = response.data;
        $.each(r, function(i, item) 
        {
            var id = i.toString();
          $('tbody#bd_'+id).html(r[i]);
        }); 
      }
      else
      {
        console.log('Error al momento de obtener datos de la BD. Abortando.')
      }
    },
  });
}

$(document).on('click','.edit_fech',function(){
  var id_fech = $(this).parents('tr').attr('id_fech');
  limpiar_modal_range();
  $('#myModalLabel_fech').text('Editar Rango');
  $.ajax({
    url: $('base').attr('href') + 'eplantilla/edit_fech',
    type: 'POST',
    data : 'id_pregunta_fech='+id_fech,
    dataType: "json",
    success: function(response) {
      if (response.code==1) 
      {
        var r = response.data;
        $('#id_eplantilla_pregunta_fech').val(r.id_eplantilla_pregunta)
        $('#id_pregunta_fech').val(r.id_pregunta_fech)
        $('#dia_sem').val(r.dia_sem)

        $('#fecha_f').data("DateTimePicker").date(r.hora_f);
        $('#fecha_i').data("DateTimePicker").date(r.hora_i);
      }
      else
      {
        console.log('Error al momento de obtener datos de la BD. Abortando.')
      }
    },
  });
});

$(document).on('click','.delete_fech',function(){
  var id_fech = $(this).parents('tr').attr('id_fech');

  swal({
    title: 'Estas Seguro?',
    text: "De Eliminar esta configuración?",
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, estoy seguro!'
  }).then(function(isConfirm) {
    if (isConfirm) {    
      $.ajax({
        url: $('base').attr('href') + 'eplantilla/delete_fech',
        type: 'POST',
        data: 'id_pregunta_fech='+id_fech,
        dataType: "json",
        success: function(response) {
          if (response.code==1) 
          {
            buscar_fech();
          }
          else
          {
            console.log('Error al momento de Eliminar!!!!.Consultar con el Desarrollador!!');
          }
        },
      });
    }
  }); 
});
