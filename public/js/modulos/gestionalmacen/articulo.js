$( document ).ready(function() {

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

    $('#form_save_articulo').validate({
        rules:
        {          
          descripcion: {required:true, minlength: 2},
          id_marca: { required:true },
          marca:{
            required:true,
            remote: {
              url: $('base').attr('href') + 'articulo/validar_articulo',
              type: "post",
              data: {
                descripcion: function() { return $( "#descripcion" ).val(); },
                id_marca: function() { return $( "#id_marca" ).val(); },
                id_articulo: function() { return $('#id_articulo').val(); }
              }
            }
          },
          id_grupo: { required:true },
          id_familia: { required:true },
          id_unidadmedida_base: {required:true}
        },
        messages: 
        {          
          descripcion: { required:"Ingresar Descripción", minlength: "Más de 2 Letras" },
          marca:{required:true, remote: "Ya existe" },
          id_marca: { required:"Buscar y Seleccionar"},
          id_grupo: { required:"Seleccionar Grupo" },
          id_familia: { required:"Seleccionar Familia" },
          id_unidadmedida_base: { required:"Buscar y Seleccionar" }
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
            if(element.parent('.col-md-6').length) { error.insertAfter(element.parent()); }
        },
        submitHandler: function() {
            $.ajax({
                url: $('base').attr('href') + 'articulo/save_articulo',
                type: 'POST',
                data: $('#form_save_articulo').serialize(),
                dataType: "json",
                beforeSend: function() {
                    //showLoader();
                },
                success: function(response) {
                    if (response.code==1) {
                        var page = 0;
                        var idart = parseInt($('#id_articulo').val());
                        idart = (idart>0) ? (idart) : (0);
                        if(idart>0)
                        {
                          if($('#paginacion_data ul.pagination li.active a').length>0)
                          {
                            page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');
                          }
                        }
                        else
                        {
                          $('#codigo_busc').val(response.data.id);
                        }

                        buscar_articulos(page);                        
                        $('#editarticulo').modal('hide'); 
                    }                    
                },
                complete: function() {
                    var id_articulo = parseInt($('#id_articulo').val());
                    id_articulo = (id_articulo>0) ? (id_articulo) : ("0");
                    var text = (id_articulo=="0") ? ("Guardo!") : ("Edito!");
                    var text2 = text;
                    var marca = $('#marca').val();
                    marca = parseInt(marca.trim().length);
                    if(marca==0 && id_articulo!="0")
                    {
                      text2 = text+' Pero no la Marca';
                    }
                    alerta(text, 'Este Artículo se '+text2+'.', 'success');
                    limpiar();
                }
            });/**/
        }
    });

    $("#id_grupo").select2({
      placeholder: "Seleccione Grupo",
      allowClear: true,
      width: 'resolve'
    });
    var $eventSelect = $("#id_grupo");
     
    $eventSelect.on("select2:open", function (e) { console.log("select2:open", e); });
    
    $eventSelect.on("select2:close", function (e) {  
      if($('#id_grupo-error').length>0) {
        $('#id_grupo-error').html("Seleccione Grupo");
      }
      $("#id_familia").html("").trigger("change"); 
    });
    
    $eventSelect.on("select2:select", function (e) { 
      if($('#id_grupo-error').length>0) { $('#id_grupo-error').html(""); }
      console.log(e.params.data.id);
      console.log(e.params.data.text);

      $.ajax({
        url: $('base').attr('href') + 'familia/combox_familia',
        type: 'POST',
        data: 'id_grupo='+e.params.data.id,
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            if (response.code==1) {
              $("#id_familia").html("").trigger("change");
              $("#id_familia").html(response.data).trigger("change");
              if($('#id_familia-error').parents('.col-md-6').attr('class')=="col-md-6 col-sm-6 col-xs-12 has-error")
              {
                $('#id_familia-error').parents('.col-md-6').removeClass('has-error');
              }
              
              if($('#id_familia-error').length>0)
              {
                $('#id_familia-error').html("");    
                $('#id_familia-error').parents('.form-group').removeClass('has-error');
              }
            }
        },
        complete: function() {
            //hideLoader();
        }
      });
    });
    
    $eventSelect.on("select2:unselect", function (e) { console.log("select2:Saliste"); });
     
    $eventSelect.on("change", function (e) { console.log("Seleccione"); });

    $("#id_familia").select2({
      placeholder: "Seleccione Familia",
      allowClear: true,
      width: 'resolve'
    });

    var $eventfamilia = $("#id_familia");
     
    $eventfamilia.on("select2:open", function (e) { console.log("select2:open", e); });
    $eventfamilia.on("select2:close", function (e) {  if($('#id_familia-error').length>0) { $('#id_familia-error').html("Seleccione Familia");}  });
    $eventfamilia.on("select2:select", function (e) {
      if($('#id_familia-error').length>0) { $('#id_familia-error').html(""); }
      $.ajax({
        url: $('base').attr('href') + 'subfamilia/combox_subfamilia',
        type: 'POST',
        data: 'id_familia='+e.params.data.id,
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            if (response.code==1) {
              $("#id_subfamilia").html("").trigger("change");
              $("#id_subfamilia").html(response.data).trigger("change");
              if($('#id_subfamilia-error').parents('.col-md-6').attr('class')=="col-md-6 col-sm-6 col-xs-12 has-error")
              {
                $('#id_subfamilia-error').parents('.col-md-6').removeClass('has-error');
              }
              
              if($('#id_subfamilia-error').length>0)
              {
                $('#id_subfamilia-error').html("");    
                $('#id_subfamilia-error').parents('.form-group').removeClass('has-error');
              }
            }
        },
        complete: function() {
            //hideLoader();
        }
      });
    });

    $eventfamilia.on("select2:unselect", function (e) { console.log("select2:Saliste"); });
     
    $eventfamilia.on("change", function (e) { console.log("Seleccione"); });

    $("#id_subfamilia").select2({
      placeholder: "Seleccione Sub Familia",
      allowClear: true,
      width: 'resolve'
    });

    var $eventsubfamilia = $("#id_subfamilia");
     
    $eventsubfamilia.on("select2:open", function (e) { console.log("select2:open", e); });
    $eventsubfamilia.on("select2:close", function (e) {  if($('#id_subfamilia-error').length>0) { $('#id_subfamilia-error').html("Seleccione Sub Familia");}  });
    $eventsubfamilia.on("select2:select", function (e) { if($('#id_subfamilia-error').length>0) { $('#id_subfamilia-error').html(""); } });
    $eventsubfamilia.on("select2:unselect", function (e) { console.log("select2:Saliste"); });
     
    $eventsubfamilia.on("change", function (e) { console.log("Seleccione"); });

    var tip_pers = "";
    $("#tip_persona label").click(function(){
      tip_pers = $('#tipo_persn').val();
    });
});

$(function () {
    $( "#marca" ).autocomplete({
    serviceUrl: $('base').attr('href')+"marca/get_marca",
    minChars: 2,
    onSelect: function (suggestion) {
      //alert('You selected: ' + suggestion.value + ', ' + suggestion.data);
      $('#id_marca').val(suggestion.id_marca);
      if($('#id_marca-error').length>0)
      {
        if($('#id_marca-error').attr('class')=="help-block")
        {
          $('#id_marca-error').remove();
        }
      }
    }
  });

  $( "#unidad_medida" ).autocomplete({
    serviceUrl: $('base').attr('href')+"unidadmedida/get_unidadmedida",
    onSelect: function (suggestion) {
      //alert('You selected: ' + suggestion.value + ', ' + suggestion.data);
      $('#id_unidadmedida_base').val(suggestion.id_unidadmedida);
      if($('#id_unidadmedida_base-error').length>0)
      {
        if($('#id_unidadmedida_base-error').attr('class')=="help-block")
        {
          $('#id_unidadmedida_base-error').remove();
        }
      }
    }
  });

});

$(document).on('click', '#datatable-buttons .limpiarfiltro', function (e) {
  var id = $(this).parents('tr').attr('id');
  $('#'+id).find('input[type=text]').val('');
  var page = 0;

  buscar_articulos(page);
});

$(document).on('click', '.btn_cancel', function (e) {
  limpiar();
  $('#editarticulo').modal('hide');    
});

$(document).on('hidden.bs.modal', '#editarticulo', function (e)
{
  limpiar();
});

$(document).on('click', '.add_articulo', function (e)
{
    limpiar();
});

function limpiar()
{
  $('#descripcion').val("");

  $('#estado label').removeClass('active');
  $('#estado input').prop('checked', false);
  
  $('#estado #estado_1').prop('checked', true);
  $('#estado #estado_1').parent('label').addClass('active');

  
  $("#id_familia").html("").trigger("change"); 
  $("#id_subfamilia").html("").trigger("change");
  $("#marca").val("");
  $("#id_marca").val("");
  $("#unidad_medida").val("");
  $("#id_unidadmedida_base").val("");
  $('#id_articulo').val("");
  $('#codigo_barras').val("");

  if($('#descripcion').parents('.form-group').attr('class')=="form-group has-error")
  {
    $('#descripcion').parents('.form-group').removeClass('has-error');
  }
  
  if($('#descripcion-error').length>0)
  {
    $('#id_familia-error').html("");
    $('#id_subfamilia-error').html("");
  }

  if($('#id_marca').parents('.form-group').attr('class')=="form-group has-error")
  {
    $('#id_marca').parents('.form-group').removeClass('has-error');
  }
  
  if($('#id_marca-error').length>0)
  {
    $('#id_marca-error').html("");
  }

  if($('#id_unidadmedida_base').parents('.form-group').attr('class')=="form-group has-error")
  {
    $('#id_unidadmedida_base').parents('.form-group').removeClass('has-error');
  }

  if($('#id_unidadmedida_base-error').length>0)
  {
    $('#id_unidadmedida_base-error').html("");
  }

  if($('#id_familia-error').parents('.col-md-6').attr('class')=="col-md-6 col-sm-6 col-xs-12 has-error")
  {
    $('#id_familia-error').parents('.col-md-6').removeClass('has-error');
  }
  
  if($('#id_familia-error').length>0)
  {
    $('#id_familia-error').html("");    
    $('#id_familia-error').parents('.form-group').removeClass('has-error');
  }

  if($('#id_subfamilia-error').parents('.col-md-6').attr('class')=="col-md-6 col-sm-6 col-xs-12 has-error")
  {
    $('#id_subfamilia-error').parents('.col-md-6').removeClass('has-error');
  }
  
  if($('#id_subfamilia-error').length>0)
  {
    $('#id_subfamilia-error').html("");    
    $('#id_subfamilia-error').parents('.form-group').removeClass('has-error');
  }

  if($('#id_grupo').parents('.col-md-6').attr('class')=="col-md-6 col-sm-6 col-xs-12 has-error")
  {
    $('#id_grupo').parents('.col-md-6').removeClass('has-error');
  }
  
  if($('#id_grupo-error').length>0)
  {
    $('#id_grupo-error').html("");
    $('#id_grupo-error').parents('.form-group').removeClass('has-error');
  }

  $('#estado label').removeClass('active');
  $('#estado input').prop('checked', false);
  
  $('#estado #estado_1').prop('checked', true);
  $('#estado #estado_1').parent('label').addClass('active');

  var validatore = $( "#form_save_articulo" ).validate();
  validatore.resetForm();
}

$(document).on('click', '#datatable_paginate li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');

  buscar_articulos(page);
});

$(document).on('click', '#datatable_paginate a.paginate_button', function (e) {  
  var page = $(this).attr('tabindex');

  buscar_articulos(page);
});

$(document).on('click', '#datatable-buttons .buscar', function (e) {
  var page = 0;

  buscar_articulos(page);
});

function buscar_articulos(page)
{
    var codigo_busc = $('#codigo_busc').val();
    var descripcion_busc = $('#descripcion_busc').val();
    var marca_busc = $('#marca_busc').val();
    var inid_med_base_busc = $('#inid_med_base_busc').val();
    var grupo_busc = $('#grupo_busc').val();
    var familia_busc = $('#familia_busc').val();
    var subfamilia_busc = $('#subfamilia_busc').val();
    var estado_busc = $('#estado_busc').val();
    var temp = "page="+page;
    if(estado_busc.trim().length)
    {
    temp=temp+'&estado_busc='+estado_busc;
    }
    if(codigo_busc.trim().length)
    {
    temp=temp+'&codigo_busc='+codigo_busc;
    }

    if(descripcion_busc.trim().length)
    {
    temp=temp+'&descripcion_busc='+descripcion_busc;
    }
    if(marca_busc.trim().length)
    {
    temp=temp+'&marca_busc='+marca_busc;
    }

    if(inid_med_base_busc.trim().length)
    {
    temp=temp+'&inid_med_base_busc='+inid_med_base_busc;
    }

    if(grupo_busc.trim().length)
    {
    temp=temp+'&grupo_busc='+grupo_busc;
    }

    if(familia_busc.trim().length)
    {
    temp=temp+'&familia_busc='+familia_busc;
    }

    if(subfamilia_busc.trim().length)
    {
    temp=temp+'&subfamilia_busc='+subfamilia_busc;
    }
    
    $.ajax({
      url: $('base').attr('href') + 'articulo/buscar_articulos',
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
  var idarticulo = $(this).parents('tr').attr('idarticulo');
  $.ajax({
      url: $('base').attr('href') + 'articulo/edit_articulo',
      type: 'POST',
      data: 'id_articulo='+idarticulo,
      dataType: "json",
      beforeSend: function() {
          //showLoader();
      },
      success: function(response) {
          if (response.code==1) {
            $('#descripcion').val(response.data.descripcion);
            $('#id_articulo').val(response.data.id_articulo);
            $('#id_marca').val(response.data.id_marca);
            $('#marca').val(response.data.marca);
            $('#id_grupo').val(response.data.id_grupo);
            //$('#id_familia').val(response.data.id_familia);
            $('#unidad_medida').val(response.data.unidad_medida);
            $('#codigo_barras').val(response.data.codigo_barras);
            $('#id_unidadmedida_base').val(response.data.id_unidadmedida_base);
            $('select#id_grupo').val(response.data.id_grupo);
            $('select#id_grupo').trigger('change.select2');

            var id_familia = parseInt(response.data.id_familia);
            if(id_familia>0)
            {
              $('#id_familia').html(response.data.familia);
              $('select#id_familia').val(response.data.id_familia);
              $('select#id_familia').trigger('change.select2');
            }

            var id_subfamilia = parseInt(response.data.id_subfamilia);
            if(id_subfamilia>0)
            {
              $('#id_subfamilia').html(response.data.subfamilia);
              $('select#id_subfamilia').val(response.data.id_subfamilia);
              $('select#id_subfamilia').trigger('change.select2');
            }
            //$('#id_articulo').parents('.col-md-6').find('.select2').val(response.data.id_articulo).trigger("change.select2");

            //$('select#id_familia').val(response.data.id_familia); // Change the value or make some change to the internal state
            //$('select#id_familia').trigger('change.select2'); // Notify only Select2 of changes

            $('#estado label').removeClass('active');
            $('#estado input').prop('checked', false);

            var num = response.data.estado;
            $('#estado #estado_'+num).prop('checked', true);
            $('#estado #estado_'+num).parent('label').addClass('active');
          }
      },
      complete: function() {
          //hideLoader();
      }
  });
});

$(document).on('click', '.delete', function (e) {
  e.preventDefault();
  var nomb = "Artículo!";
  var idarticulo = $(this).parents('tr').attr('idarticulo');
  var page = $('#paginacion_data ul.pagination li.active a').attr('tabindex');

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
        url: $('base').attr('href') + 'articulo/delete',
        type: 'POST',
        data: 'id_articulo='+idarticulo,
        dataType: "json",
        beforeSend: function() {
            //showLoader();
        },
        success: function(response) {
            if (response.code==1) {
              buscar_articulos(page);
            }
        },
        complete: function() {
          var text = "Elimino!";
          alerta(text, 'Este '+nomb+' se '+text+'.', 'success');
        }
      });
    }
  });    
});

$(document).on('click', '#tip_persona label', function (e) {
  var padre = $(this);
  var tip_persona = padre.find('input').val();
  
  $('#lbl_rsocialprov').parents('.form-group').show();
  if(tip_persona == "1")
  {    
    $('#form-add-pj').removeClass('collapse');
    $('#form-add-pn').addClass('collapse');
  }
  else
  {
    $('#form-add-pj').addClass('collapse');
    $('#form-add-pn').removeClass('collapse');
  }

  limpiar();
});

$(document).on('click', '.addsucu', function (e) {
  var idarticulo = $(this).parents('tr').attr('idarticulo');
  $.ajax({
    url: $('base').attr('href') + 'articulo/addsucu',
    type: 'POST',
    data: 'id_articulo='+idarticulo,
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
        buscar_articulos(page);
      }
    },
    complete: function() {
        //hideLoader();
    }
  });
});

$(document).on('focusout', '#marca', function (e) {
  var padre = $(this);
  var marca = padre.val();
  var haymarca = parseInt(marca.trim().length);
  haymarca = (haymarca>0) ? (haymarca) : (0);
  if(haymarca==0) 
  {
    $('#id_marca').val('');
  }
});