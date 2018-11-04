/*@Violeta Damjanová*/
$( document ).ready(function() {

  jQuery.validator.setDefaults({
    debug: true,
    success: "valid",
    ignore: ""
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

  $('#form_save_rolxequipo').validate({
    rules:
    {
      rol:
      {
        required:true,
        remote: {
          url: $('base').attr('href') + 'eadequipo/validar_rolesxequipo',
          type: "post",
          data: {
            rol: function() { return $( "#rol" ).val(); },
            id_eadequipo_roles: function() { return $('#id_eadequipo_roles').val(); },
            id_eadequipo: function() { return $( "#id_eadequipo_modal" ).val(); },
          }
        }
      },
    },
    messages: 
    {
      rol:
      {
        required:"Rol",
        remote : "Ya existe"
      },
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
          url: $('base').attr('href') + 'eadequipo/save_rolxequipo',
          type: 'POST',
          data: $('#form_save_rolxequipo').serialize(),
          dataType: "json",
          beforeSend: function() {
            $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
          },
          success: function(response) {
            if(response.code==1)
            {
              var id_eadequipo_roles = parseInt($('#id_eadequipo_roles').val());
              id_eadequipo_roles = (id_eadequipo_roles>0) ? (id_eadequipo_roles) : ("0");
              var text = (id_eadequipo_roles=="0") ? ("Agregó!") : ("Edito!");
              swal({
                title : text,
                text: 'Este Rol se '+text+'.',
                type: 'success',
                confirmButtonText: 'Listo!',
              }).then(function () {
                location.reload();
              });
            }
            else
            {
              alerta('Hubo un error','al momento de guardar los datos.','error');
            }
          },
          complete: function() {
            $.LoadingOverlay("hide");
          }
      });
    }
  });

  $('#form_save_addestadoxequipo').validate({
    rules:
    {
      estadoxequipo:
      {
        required:true,
        remote: {
          url: $('base').attr('href') + 'eadequipo/validar_estadoxequipo',
          type: "post",
          data: {
            estadoxequipo: function() { return $( "#estadoxequipo" ).val(); },
            id_eadequipo_estado: function() { return $('#id_eadequipo_estado').val(); },
            id_eadequipo: function() { return $( "#id_eadequipo2" ).val(); },
          }
        }
      },
      n_orden_estado:
      {
        required: true,
        remote: {
          url: $('base').attr('href') + 'eadequipo/validar_orden_estadoxequipo',
          type: "post",
          data: {
            n_orden: function() { return $( "#n_orden_estado" ).val(); },
            id_eadequipo_estado: function() { return $('#id_eadequipo_estado').val(); },
            id_eadequipo: function() { return $( "#id_eadequipo2" ).val(); },
          }
        }
      }
    },
    messages: 
    {
      estadoxequipo:
      {
        required:"Estado",
        remote : "Ya existe"
      },
      n_orden_estado:
      {
        required:"N° de orden",
        remote : "Ya existe"
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
        url: $('base').attr('href') + 'eadequipo/save_estadoxequipo',
        type: 'POST',
        data: $('#form_save_addestadoxequipo').serialize(),
        dataType: "json",
        beforeSend: function() {
          $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
        },
        success: function(response) {
          if(response.code==1)
          {
            var id_eadequipo_estado = parseInt($('#id_eadequipo_estado').val());
            id_eadequipo_estado = (id_eadequipo_estado>0) ? (id_eadequipo_estado) : ("0");
            var text = (id_eadequipo_estado=="0") ? ("Agregó!") : ("Edito!");
            swal({
              title : text,
              text: 'Este estado se '+text+'.',
              type: 'success',
              confirmButtonText: 'Listo!',
            }).then(function () {
              location.reload();
            });
          }
          else
          {
            alerta('Hubo un error','al momento de guardar los datos.','error');
          }
        },
        complete: function() {
          $.LoadingOverlay("hide");
        }
      });
    }
  });

  $('#form_save_addprioridadxequipo').validate({
    rules:
    {
      prioridadxequipo:
      {
        required:true,
        remote: {
          url: $('base').attr('href') + 'eadequipo/validar_prioridadxequipo',
          type: "post",
          data: {
            prioridadxequipo: function() { return $( "#prioridadxequipo" ).val(); },
            id_eadequipo_prioridad: function() { return $('#id_eadequipo_prioridad').val(); },
            id_eadequipo: function() { return $( "#id_eadequipo3" ).val(); },
          }
        }
      },
      n_orden_prioridad:
      {
        required: true,
        remote: {
          url: $('base').attr('href') + 'eadequipo/validar_orden_prioridadxequipo',
          type: "post",
          data: {
            n_orden: function() { return $( "#n_orden_prioridad" ).val(); },
            id_eadequipo_prioridad: function() { return $('#id_eadequipo_prioridad').val(); },
            id_eadequipo: function() { return $( "#id_eadequipo3" ).val(); },
          }
        }
      }
    },
    messages: 
    {
      prioridadxequipo:
      {
        required:"Prioridad",
        remote : "Ya existe"
      },
      n_orden_prioridad:
      {
        required:"N° de orden",
        remote : "Ya existe"
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
        url: $('base').attr('href') + 'eadequipo/save_prioridadxequipo',
        type: 'POST',
        data: $('#form_save_addprioridadxequipo').serialize(),
        dataType: "json",
        beforeSend: function() {
          $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
        },
        success: function(response) {
          if(response.code)
          {
            var id_eadequipo_prioridad = parseInt($('#id_eadequipo_prioridad').val());
            id_eadequipo_prioridad = (id_eadequipo_prioridad>0) ? (id_eadequipo_prioridad) : ("0");
            var text = (id_eadequipo_prioridad=="0") ? ("Agregó!") : ("Edito!");
            swal({
              title : text,
              text: 'Esta prioridad se '+text+'.',
              type: 'success',
              confirmButtonText: 'Listo!',
            }).then(function () {
              location.reload();
            });
          }
          else
          {
            alerta('Hubo un error','al momento de guardar los datos.','error');
          }
        },
        complete: function() {
          $.LoadingOverlay("hide");
        }
      });
    }
  });

  $('#form_save_categoriaxequipo').validate({
    rules:
    {
      name_categoriaxequipo:
      {
        required:true,
        remote: {
          url: $('base').attr('href') + 'eadequipo/validar_name_categoriaxequipo',
          type: "post",
          data: {
            categoriaxequipo: function() { return $( "#name_categoriaxequipo" ).val(); },
            id_eadequipo_categoria: function() { return $('#id_eadequipo_categoria').val(); },
            id_eadequipo: function() { return $( "#id_eadequipo4" ).val(); },
          }
        }
      },
      color_categoriaxequipo:
      {
        required: true/*
        remote: {
          url: $('base').attr('href') + 'eadequipo/validar_color_categoriaxequipo',
          type: "post",
          data: {
            color: function() { return $( "#color_categoriaxequipo" ).val(); },
            id_eadequipo_categoria: function() { return $('#id_eadequipo_categoria').val(); },
            id_eadequipo: function() { return $( "#id_eadequipo4" ).val(); },
          }
        }*/
      }
    },
    messages: 
    {
      name_categoriaxequipo:
      {
        required:"Categoria",
        remote : "Ya existe"
      },
      color_categoriaxequipo:
      {
        required:"Color"/*,
        remote : "Ya existe"*/
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
      error.insertAfter(element.parents('.input-group')); 
    },
    submitHandler: function() {
      $.ajax({
        url: $('base').attr('href') + 'eadequipo/save_categoriaxequipo',
        type: 'POST',
        data: $('#form_save_categoriaxequipo').serialize(),
        dataType: "json",
        beforeSend: function() {
          $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
        },
        success: function(response) {
          if(response.code==1)
          {
            var id_eadequipo_categoria = parseInt($('#id_eadequipo_categoria').val());
            id_eadequipo_categoria = (id_eadequipo_categoria>0) ? (id_eadequipo_categoria) : ("0");
            var text = (id_eadequipo_categoria=="0") ? ("Agregó!") : ("Edito!");
            swal({
              title : text,
              text: 'Esta categoria se '+text+'.',
              type: 'success',
              confirmButtonText: 'Listo!',
            }).then(function () {
              location.reload();
            });
          }
          else
          {
            alerta('Hubo un error','al momento de guardar los datos.','error');
          }
        },
        complete: function() {
          $.LoadingOverlay("hide");
        }
      });
    }
  });

  $('#form_save_addcat_indixequipo').validate({
    rules:
    {
      categoriaindi:
      {
        required:true,
        remote: {
          url: $('base').attr('href') + 'eadequipo/validar_catindixequipo',
          type: "post",
          data: {
            categoriaindi: function() { return $( "#categoriaindi" ).val(); },
            id_eadequipo_catindi: function() { return $('#id_eadequipo_catindi').val(); },
            id_eadequipo: function() { return $( "#id_eadequipo5" ).val(); },
          }
        }
      }
    },
    messages: 
    {
      categoriaindi:
      {
        required:"Campo Obligatorio",
        remote : "Ya existe"
      },
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
        url: $('base').attr('href') + 'eadequipo/save_catindixequipo',
        type: 'POST',
        data: $('#form_save_addcat_indixequipo').serialize(),
        dataType: "json",
        beforeSend: function() {
          $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
        },
        success: function(response) {
          if(response.code==1)
          {
            var id_eadequipo_indicadores = parseInt($('#id_eadequipo_indicadores').val());
            id_eadequipo_indicadores = (id_eadequipo_indicadores>0) ? (id_eadequipo_indicadores) : ("0");
            var text = (id_eadequipo_indicadores=="0") ? ("Agregó!") : ("Edito!");
            
            swal({
              title : text,
              text: 'Esta Categoría de Indicador se '+text+'.',
              type: 'success',
              confirmButtonText: 'Listo!',
            }).then(function () {
              location.reload();
            });
          }
          else
          {
            alerta('Hubo un error','al momento de guardar los datos.','error');
          }
        },
        complete: function() {
          $.LoadingOverlay("hide");
        }
      });
    }
  });

  $('#form_save_addindicadorxequipo').validate({
    rules:
    {
      indicadorxequipo:
      {
        required:true,
        remote: {
          url: $('base').attr('href') + 'eadequipo/validar_indicadorxequipo',
          type: "post",
          data: {
            indicadorxequipo: function() { return $( "#indicadorxequipo" ).val(); },
            id_eadequipo_catindi: function() { return $( "#sele_catindi" ).val(); },
            id_eadequipo_indicadores: function() { return $('#id_eadequipo_indicadores').val(); },
            id_eadequipo: function() { return $( "#id_eadequipo6" ).val(); },
          }
        }
      },
      id_eadequipo_catindi:
      {
        required:true,
      }
    },
    messages: 
    {
      indicadorxequipo:
      {
        required:"Campo Obligatorio",
        remote : "Ya existe"
      },
      id_eadequipo_catindi:
      {
        required:"Seleccione"
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
        url: $('base').attr('href') + 'eadequipo/save_indicadorxequipo',
        type: 'POST',
        data: $('#form_save_addindicadorxequipo').serialize(),
        dataType: "json",
        beforeSend: function() {
          $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
        },
        success: function(response) {
          if(response.code==1)
          {
            var id_eadequipo_indicadores = parseInt($('#id_eadequipo_indicadores').val());
            id_eadequipo_indicadores = (id_eadequipo_indicadores>0) ? (id_eadequipo_indicadores) : ("0");
            var text = (id_eadequipo_indicadores=="0") ? ("Agregó!") : ("Edito!");
            
            swal({
              title : text,
              text: 'Este Indicador se '+text+'.',
              type: 'success',
              confirmButtonText: 'Listo!',
            }).then(function () {
              location.reload();
            });
          }
          else
          {
            alerta('Hubo un error','al momento de guardar los datos.','error');
          }
        },
        complete: function() {
          $.LoadingOverlay("hide");
        }
      });
    }
  });

  $('#form_save_subcat').validate({
    rules:
    {
      subcat:
      {
        required:true,
        remote: {
          url: $('base').attr('href') + 'eadequipo/validar_subcat',
          type: "post",
          data: {
            id_eadequipo_categoria: function() { return $( "#addsubcategoria #id_eadequipo_categoria" ).val(); },
            id_subcat: function() { return $( "#id_subcat" ).val(); },
            subcat: function() { return $('#subcat').val(); },
          }
        }
      }
    },
    messages: 
    {
      subcat:
      {
        required:"Campo Obligatorio",
        remote : "Ya existe"
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
      error.insertAfter(element); 
    },
    submitHandler: function() {
      $.ajax({
        url: $('base').attr('href') + 'eadequipo/save_subcat',
        type: 'POST',
        data: $('#form_save_subcat').serialize(),
        dataType: "json",
        beforeSend: function() {
          $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
        },
        success: function(response) {
          if(response.code==1)
          {
            var id_subcat = parseInt($('#addsubcategoria #id_subcat').val());
            id_subcat = (id_subcat>0) ? (id_subcat) : ("0");
            var text = (id_subcat=="0") ? ("Agregó!") : ("Edito!");
            
            swal({
              title : text,
              text: 'Esta Subcategoría se '+text+'.',
              type: 'success',
              confirmButtonText: 'Listo!',
            }).then(function () {
              $('#addsubcategoria').modal('hide');
              fix_paddingr_modal('addsubcategoria');
              limpiar_modalsubcat();
              get_subcatxcat(0);
            });
          }
          else
          {
            alerta('Hubo un error','al momento de guardar los datos.','error');
          }
        },
        complete: function() {
          $.LoadingOverlay("hide");
        }
      });
    }
  });

  $(function() {
    var color = $('#color_categoriaxequipo').val();
    $('#colop').colorpicker({
      format: "hex",
    });
  });

});

function limpiarform()
{
  $('#id_eadequipo_roles').val('');
  $('#descripcion').val('');
  $('#estadoxequipo_div label').removeClass('active');
  $('#estadoxequipo_div input').prop('checked',false);
  $('#estado_1').parent().addClass('active');
  $('#estado_1').prop('checked',true);
  $('input[name="es_visible"]').prop('checked',true);
  $('input[name="es_unico"]').prop('checked',false);
  $('#rol').val('');
  remove_error('form_save_rolxequipo');
}

function limpiarform2()
{
  $('#id_eadequipo_prioridad').val('');
  $('#prioridadxequipo_div input').parent().removeClass('active');
  $('#prioridadxequipo_1').parent().addClass('active');
  $('#prioridadxequipo_1').prop('checked',true);
  $('#prioridadxequipo').val('');
  $('#n_orden_prioridad').val('');
  $('input[name="muestra_kanban"]').prop('checked',true);
  remove_error('form_save_addprioridadxequipo');
}

function limpiarform3()
{
  $('#id_eadequipo_estado').val('');
  $('#estadoxequipo_div input').parent().removeClass('active');
  $('#estadoxequipo_div #estadoxequipo_1').parent().addClass('active');
  $('#estadoxequipo_div #estadoxequipo_1').prop('checked',true);
  $('#estadoxequipo').val('');
  $('#n_orden_estado').val('');
  $('#limite_datosxequipo').val('');
  $('#limite_diasxequipo').val('');
  $('input[name="opcion_busc_s"]').prop('checked', false);
  $('#addestadoxequipo #conf_listap_0').prop('checked',true);
  remove_error('form_save_addestadoxequipo');
}

function limpiarform4()
{
  $('#id_eadequipo_categoria').val('');
  $('#categoriaxequipo_div input').parent().removeClass('active');
  $('#categoriaxequipo_estado_1').parent().addClass('active');
  $('#categoriaxequipo_estado_1').prop('checked',true);
  $('#name_categoriaxequipo').val('');
  $('#color_categoriaxequipo').val('');
  $('span.input-group-addon').find('i').css("background-color", "#000000" );
  remove_error('form_save_categoriaxequipo');
}

function limpiarform5()
{
  $('#id_eadequipo_catindi').val('');
  $('#addcat_indixequipo #estado label').removeClass('active');
  $('#addcat_indixequipo #estado #estado_1').prop('checked',true);
  $('#addcat_indixequipo #estado #estado_1').parent().addClass('active');
  $('#categoriaindi').val('');
}

function limpiarform6()
{
  $('#id_eadequipo_indicadores').val('');
  $('#addindicadoresxequipo #estado label').removeClass('active');
  $('#addindicadoresxequipo #estado #estado_1').prop('checked',true);
  $('#addindicadoresxequipo #estado #estado_1').parent().addClass('active');
  $('#indicadorxequipo').val('');
  $('#sele_catindi').val('');
}


$(document).on('click', '.addrolxequipo', function (e) {
  limpiarform();
  var id_eadequipo = $('#id_eadequipo').val();
  $('#id_eadequipo_modal').val(id_eadequipo);
});

$(document).on('click', '.del_rol', function (e) {
  e.preventDefault();
  var id_eadequipo_roles = $(this).parents('tr').attr('id_eadequipo_roles');
  var id_eadequipo = $('#id_eadequipo').val();
  var nomb = "Rol";
  swal({
    title: 'Estas Seguro?',
    text: "De Eliminar a este "+nomb,
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, estoy seguro!'
  }).then(function(isConfirm) {
    if (isConfirm) {     
      $.ajax({
        url: $('base').attr('href') + 'eadequipo/save_rolxequipo',
        type: 'POST',
        data: 'id_eadequipo_roles='+id_eadequipo_roles+'&id_eadequipo_modal='+id_eadequipo+'&estado=0',
        dataType: "json",
        beforeSend: function() {
          $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
        },
        success: function(response) {
          
        },
        complete: function() {
          var text = "Elimino!";
          $.LoadingOverlay("hide");
          swal({
            title : text,
            text: 'Este rol se '+text+'.',
            type: 'success',
            confirmButtonText: 'Listo!',
          }).then(function () {
            location.reload();
          });
        }
      });
    }
  });   
});

$(document).on('click', '.edit', function (e) {
  e.preventDefault();
  limpiarform();
  var id_eadequipo_roles = $(this).parents('tr').attr('id_eadequipo_roles');;

  $.ajax({
    url: $('base').attr('href') + 'eadequipo/edit_rolesxequipo',
    type: 'POST',
    data: 'id_eadequipo_roles='+id_eadequipo_roles,
    dataType: "json",
    beforeSend: function() {
      $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
    },
    success: function(response) {
      if (response.code==1) {
        var id_eadequipo = $('#id_eadequipo').val();
        $('#id_eadequipo_modal').val(id_eadequipo);
        $('#id_eadequipo_roles').val(response.data.id_eadequipo_roles);
        $('#rol').val(response.data.rol);
        $('#descripcion').val(response.data.descripcion);

        $('#estado label').removeClass('active');
        $('#estado input').prop('checked', false);
        if(parseInt(response.data.es_unico)>0){
          $('input[name=es_unico]').prop('checked',true);
        }

        var num = response.data.estado;
        $('#estado #estado_'+num).prop('checked', true);
        $('#estado #estado_'+num).parent('label').addClass('active');
      }
      else
      {
        alerta('Hubo un error','al momento de obtener los datos.','error');
      }
    },
    complete: function() {
      $.LoadingOverlay("hide");
    }
  }); 
});   

function remove_error(form){
  $('form#'+(form.toString())+' div.form-group').each(function(indice, elemento) {
    if($(this).attr('class')=="form-group has-error"){
      $(this).removeClass("has-error");
      $(this).find("span.help-block").remove();
    }
  }); 
}

$(document).on('click', '.addestadoxequipo', function (e) {
  limpiarform3();
  var id_eadequipo = $('#id_eadequipo').val();
  $('#id_eadequipo2').val(id_eadequipo);
});

$(document).on('click', '.edit_estadoxequipo', function (e) {
  e.preventDefault();
  limpiarform3();
  var id_eadequipo_estado = $(this).parents('tr').attr('id_eadequipo_estado');

  $.ajax({
    url: $('base').attr('href') + 'eadequipo/edit_estadoxequipo',
    type: 'POST',
    data: 'id_eadequipo_estado='+id_eadequipo_estado,
    dataType: "json",
    beforeSend: function() {
      $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
    },
    success: function(response) {
      if (response.code==1) {
        var id_eadequipo = $('#id_eadequipo').val();
        $('#id_eadequipo2').val(id_eadequipo);
        $('#id_eadequipo_estado').val(response.data.id_eadequipo_estado);
        $('#estadoxequipo').val(response.data.estadoxequipo);
        $('#n_orden_estado').val(response.data.n_orden);
        $('#limite_datosxequipo').val(response.data.limite_datos);
        $('#limite_diasxequipo').val(response.data.limite_dias);

        $('#estadoxequipo_div label').removeClass('active');
        $('#estadoxequipo_div input').prop('checked', false);
        $('input[name="es_visible"]').prop('checked', false);

        var num = response.data.estado;
        $('#estadoxequipo_div #estadoxequipo_'+num).prop('checked', true);
        $('#estadoxequipo_div #estadoxequipo_'+num).parent('label').addClass('active');
        var mostrar = parseInt(response.data.es_visible);
        if(mostrar === 1)
        {
          $('input[name="es_visible"]').prop('checked', true);
        }
        var opcion_busc = parseInt(response.data.opcion_busc_s);
        $('#opcion_busc_s_'+opcion_busc).prop('checked',true);  

        var sele_listap = response.data.selected_listadopendientes;
        var sele_listap = (!sele_listap) ? 0 : sele_listap;

        $('#addestadoxequipo #conf_listap_'+sele_listap).prop('checked',true);

      }
    },
    complete: function() {
      $.LoadingOverlay("hide");
    }
  }); 
}); 

$(document).on('click', '.del_estadoxequipo', function (e) {
  e.preventDefault();
  var id_eadequipo_estado = $(this).parents('tr').attr('id_eadequipo_estado');
  var id_eadequipo = $('#id_eadequipo2').val();
  var nomb = "estado";
  swal({
    title: 'Estas Seguro?',
    text: "De Eliminar a este "+nomb,
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, estoy seguro!'
  }).then(function(isConfirm) {
    if (isConfirm) {     
      $.ajax({
        url: $('base').attr('href') + 'eadequipo/save_estadoxequipo',
        type: 'POST',
        data: 'id_eadequipo_estado='+id_eadequipo_estado+'&id_eadequipo2='+id_eadequipo+'&estadoxequipo_estado=0',
        dataType: "json",
        beforeSend: function() {
          $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
        },
        success: function(response) {
          
        },
        complete: function() {
          var text = "Elimino!";
          $.LoadingOverlay("hide");
          swal({
            title : text,
            text: 'Este estado se '+text+'.',
            type: 'success',
            confirmButtonText: 'Listo!',
          }).then(function () {
            location.reload();
          });
        }
      });
    }
  });   
});

$(document).on('click', '.addprioridadxequipo', function (e) {
  limpiarform2();
  var id_eadequipo = $('#id_eadequipo').val();
  $('#id_eadequipo3').val(id_eadequipo);
});

$(document).on('click', '.edit_prioridadxequipo', function (e) {
  e.preventDefault();
  limpiarform2();
  var id_eadequipo_prioridad = $(this).parents('tr').attr('id_eadequipo_prioridad');

  $.ajax({
    url: $('base').attr('href') + 'eadequipo/edit_prioridadxequipo',
    type: 'POST',
    data: 'id_eadequipo_prioridad='+id_eadequipo_prioridad,
    dataType: "json",
    beforeSend: function() {
      $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
    },
    success: function(response) {
      if (response.code==1) {
        var id_eadequipo = $('#id_eadequipo').val();
        $('#id_eadequipo3').val(id_eadequipo);
        $('#id_eadequipo_prioridad').val(response.data.id_eadequipo_prioridad);
        $('#prioridadxequipo').val(response.data.prioridadxequipo);
        $('#n_orden_prioridad').val(response.data.n_orden);

        $('#prioridadxequipo_div label').removeClass('active');
        $('#prioridadxequipo_div input').prop('checked', false);
        
        var num = response.data.estado;
        $('#prioridadxequipo_div #prioridadxequipo_'+num).prop('checked', true);
        $('#prioridadxequipo_div #prioridadxequipo_'+num).parent('label').addClass('active');

        var muestra_kanban = response.data.muestra_kanban;
        var chckdmk = (muestra_kanban==1) ? true : false;
        
        $('input[name="muestra_kanban"]').prop('checked',chckdmk);
      }
    },
    complete: function() {
      $.LoadingOverlay("hide");
    }
  }); 
});

$(document).on('click', '.del_prioridadxequipo', function (e) {
  e.preventDefault();
  var id_eadequipo_prioridad = $(this).parents('tr').attr('id_eadequipo_prioridad');
  var id_eadequipo = $('#id_eadequipo3').val();
  var nomb = "prioridad";
  swal({
    title: 'Estas Seguro?',
    text: "De Eliminar a este "+nomb,
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, estoy seguro!'
  }).then(function(isConfirm) {
    if (isConfirm) {     
      $.ajax({
        url: $('base').attr('href') + 'eadequipo/save_prioridadxequipo',
        type: 'POST',
        data: 'id_eadequipo_prioridad='+id_eadequipo_prioridad+'&id_eadequipo3='+id_eadequipo+'&prioridadxequipo_estado=0',
        dataType: "json",
        beforeSend: function() {
          $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
        },
        success: function(response) {
          
        },
        complete: function() {
          var text = "Elimino!";
          $.LoadingOverlay("hide");
          swal({
            title : text,
            text: 'Esta prioridad se '+text+'.',
            type: 'success',
            confirmButtonText: 'Listo!',
          }).then(function () {
            location.reload();
          });
        }
      });
    }
  });   
});

$(document).on('click', '.btn_limpiar1', function (e) {
  limpiarform();
  $('#addrolxequipo').modal('hide');
});

$(document).on('click', '.btn_limpiar2', function (e) {
  limpiarform2();
  $('#addprioridadxequipo').modal('hide');
});

$(document).on('click', '.btn_limpiar3', function (e) {
  limpiarform3();
  $('#addestadoxequipo').modal('hide');
});

$(document).on('click', '.btn_limpiar4', function (e) {
  limpiarform4();
  $('#addcategoriaxequipo').modal('hide');
});

$(document).on('click', '.btn_limpiar5', function (e) {
  limpiarform5();
  $('#addcat_indixequipo').modal('hide');
});

$(document).on('click', '.btn_limpiar6', function (e) {
  limpiarform6();
  $('#addindicadoresxequipo').modal('hide');
});


$(document).on('click', '.addcategoriaxequipo', function (e) {
  limpiarform4();
  var id_eadequipo = $('#id_eadequipo').val();
  $('#id_eadequipo4').val(id_eadequipo);
});

$(document).on('click', '.edit_categoriaxequipo', function (e) {
  e.preventDefault();
  limpiarform4();
  var id_eadequipo_categoria = $(this).parents('tr').attr('id_eadequipo_categoria');

  $.ajax({
    url: $('base').attr('href') + 'eadequipo/edit_categoriaxequipo',
    type: 'POST',
    data: 'id_eadequipo_categoria='+id_eadequipo_categoria,
    dataType: "json",
    beforeSend: function() {
      $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
    },
    success: function(response) {
      if (response.code==1) {
        var id_eadequipo = $('#id_eadequipo').val();
        $('#id_eadequipo4').val(id_eadequipo);
        $('#form_save_categoriaxequipo #id_eadequipo_categoria').val(response.data.id_eadequipo_categoria);
        $('#form_save_categoriaxequipo #name_categoriaxequipo').val(response.data.categoriaxequipo);
        $('#form_save_categoriaxequipo #color_categoriaxequipo').val(response.data.color);

        $('#categoriaxequipo_div label').removeClass('active');
        $('#categoriaxequipo_div input').prop('checked', false);
        
        var num = response.data.estado;
        $('#categoriaxequipo_div #categoriaxequipo_estado_'+num).prop('checked', true);
        $('#categoriaxequipo_div #categoriaxequipo_estado_'+num).parent('label').addClass('active');
        $('span.input-group-addon').find('i').css("background-color", response.data.color );
      }
    },
    complete: function() {
      $.LoadingOverlay("hide");
    }
  }); 
});

$(document).on('click', '.del_categoriaxequipo', function (e) {
  e.preventDefault();
  var id_eadequipo_categoria = $(this).parents('tr').attr('id_eadequipo_categoria');
  var id_eadequipo = $('#id_eadequipo4').val();
  var nomb = "Categoria";
  swal({
    title: 'Estas Seguro?',
    text: "De Eliminar a esta "+nomb,
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, estoy seguro!'
  }).then(function(isConfirm) {
    if (isConfirm) {     
      $.ajax({
        url: $('base').attr('href') + 'eadequipo/save_categoriaxequipo',
        type: 'POST',
        data: 'id_eadequipo_categoria='+id_eadequipo_categoria+'&id_eadequipo4='+id_eadequipo+'&categoriaxequipo_estado=0',
        dataType: "json",
        beforeSend: function() {
          $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
        },
        success: function(response) {
          
        },
        complete: function() {
          var text = "Elimino!";
          
          $.LoadingOverlay("hide");
          swal({
            title : text,
            text: 'Esta categoria se '+text+'.',
            type: 'success',
            confirmButtonText: 'Listo!',
          }).then(function () {
             
            location.reload();
          });
        }
      });
    }
  });   
});

$(document).on('click', '.addindicadoresxequipo', function (e) {
  limpiarform6();
  var id_eadequipo = $('#id_eadequipo').val();
  $('#id_eadequipo6').val(id_eadequipo);
});

$(document).on('click', '.edit_indicadorxequipo', function (e) {
  e.preventDefault();
  limpiarform6();
  var id_eadequipo_indicadores = $(this).parents('tr').attr('id_eadequipo_indicadores');

  $.ajax({
    url: $('base').attr('href') + 'eadequipo/edit_indicadorxequipo',
    type: 'POST',
    data: 'id_eadequipo_indicadores='+id_eadequipo_indicadores,
    dataType: "json",
    beforeSend: function() {
      $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
    },
    success: function(response) {
      if (response.code==1) {
        var id_eadequipo = $('#id_eadequipo').val();
        $('#id_eadequipo6').val(id_eadequipo);

        $('#id_eadequipo_indicadores').val(response.data.id_eadequipo_indicadores);
        $('#addindicadoresxequipo #estado label').removeClass('active');
        $('#addindicadoresxequipo #estado input').prop('checked', false);
        
        var num = response.data.estado;
        $('#addindicadoresxequipo #estado #estado_'+num).prop('checked', true);
        $('#addindicadoresxequipo #estado #estado_'+num).parent('label').addClass('active');

        $('#indicadorxequipo').val(response.data.indicadorxequipo);
        $('#sele_catindi').val(response.data.id_eadequipo_catindi);
      }
    },
    complete: function() {
      $.LoadingOverlay("hide");
    }
  }); 
});

$(document).on('click', '.del_indicadorxequipo', function (e) {
  e.preventDefault();
  var id_eadequipo_indicadores = $(this).parents('tr').attr('id_eadequipo_indicadores');
  var id_eadequipo = $('#id_eadequipo').val();
  var nomb = "Indicador";
  swal({
    title: 'Estas Seguro?',
    text: "De Eliminar a este "+nomb,
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, estoy seguro!'
  }).then(function(isConfirm) {
    if (isConfirm) {     
      $.ajax({
        url: $('base').attr('href') + 'eadequipo/save_indicadorxequipo',
        type: 'POST',
        data: 'id_eadequipo_indicadores='+id_eadequipo_indicadores+'&id_eadequipo='+id_eadequipo+'&estado=0',
        dataType: "json",
        beforeSend: function() {
          $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
        },
        success: function(response) {
          
        },
        complete: function() {
          var text = "Elimino!";
          $.LoadingOverlay("hide");
          swal({
            title : text,
            text: 'Este Indicador se '+text+'.',
            type: 'success',
            confirmButtonText: 'Listo!',
          }).then(function () {
            $.LoadingOverlay("hide"); 
            location.reload();
          });
        }
      });
    }
  });   
});

$(document).on('click','.addcat_indixequipo',function(){
  $('#addcat_indixequipo #myModalLabel').text('Crear nueva Categoría de Indicador');
  var id_eadequipo = $('#id_eadequipo').val();
  $('#id_eadequipo5').val(id_eadequipo);
  limpiarform5();
});

$(document).on('click', '.edit_cat_indixequipo', function (e) {
  e.preventDefault();
  limpiarform5();
  $('#addcat_indixequipo #myModalLabel').text('Editar Categoria de Indicador');
  var id_eadequipo_catindi = $(this).parents('tr').attr('id_eadequipo_catindi');

  $.ajax({
    url: $('base').attr('href') + 'eadequipo/edit_cat_indixequipo',
    type: 'POST',
    data: 'id_eadequipo_catindi='+id_eadequipo_catindi,
    dataType: "json",
    beforeSend: function() {
      $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
    },
    success: function(response) {
      if (response.code==1) {
        var id_eadequipo = $('#id_eadequipo').val();
        $('#id_eadequipo5').val(id_eadequipo);
        $('#id_eadequipo_catindi').val(response.data.id_eadequipo_catindi);
        $('#categoriaindi').val(response.data.categoriaindi);

        $('#addcat_indixequipo #estado label').removeClass('active');
        $('#addcat_indixequipo #estado input').prop('checked', false);
        
        var num = response.data.estado;
        $('#addcat_indixequipo #estado #estado_'+num).prop('checked', true);
        $('#addcat_indixequipo #estado #estado_'+num).parent('label').addClass('active');
      }
    },
    complete: function() {
      $.LoadingOverlay("hide");
    }
  }); 
});

$(document).on('click', '.del_cat_indixequipo', function (e) {
  e.preventDefault();
  var id_eadequipo_catindi = $(this).parents('tr').attr('id_eadequipo_catindi');
  var id_eadequipo = $('#id_eadequipo').val();
  var nomb = "Cat. Indicador";
  swal({
    title: 'Estas Seguro?',
    text: "De Eliminar a esta "+nomb,
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, estoy seguro!'
  }).then(function(isConfirm) {
    if (isConfirm) {     
      $.ajax({
        url: $('base').attr('href') + 'eadequipo/save_catindixequipo',
        type: 'POST',
        data: 'id_eadequipo_catindi='+id_eadequipo_catindi+'&id_eadequipo='+id_eadequipo+'&estado=0',
        dataType: "json",
        beforeSend: function() {
          $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
        },
        success: function(response) {
          
        },
        complete: function() {
          var text = "Elimino!";
          $.LoadingOverlay("hide");
          swal({
            title : text,
            text: 'Esta Cat. Indicador se '+text+'.',
            type: 'success',
            confirmButtonText: 'Listo!',
          }).then(function () {
            $.LoadingOverlay("hide"); 
            location.reload();
          });
        }
      });
    }
  });   
});

$(document).on('click','.show_subcat',function(){
  $('#bandeja_subcat #subc_busc').val('');
  $('#bandeja_subcat #estado_busc').val('');
  var id_categoria  = $(this).parents('tr').attr('id_eadequipo_categoria');

  $.ajax({
    url: $('base').attr('href') + 'eadequipo/get_subcatxcat',
    type: 'POST',
    data: 'id_eadequipo_categoria='+id_categoria+'&page=0',
    dataType: "json",
    beforeSend: function() {
      $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
    },
    success: function(response) {
      if (response.code==1) {
        $('#bandeja_subcat #id_eadequipo_categoria').val(id_categoria);
        $('#bandeja_subcat #subcat_body').html(response.data.rta);
        $('#bandeja_subcat #paginacion_data').html(response.data.paginacion);
      }
      else
      {
        alerta('Hubo un error','al momento de obtener los datos.','error');
      }
    },
    complete: function() {
      $.LoadingOverlay("hide");
    }
  });
});

$('#addsubcategoria').on('show.bs.modal', function (e) {
  $('#bandeja_subcat').modal('hide');
  fix_paddingr_modal('bandeja_subcat');
})

$('#addsubcategoria').on('hidden.bs.modal', function (e) {
  fix_paddingr_modal('addsubcategoria');
  $('#bandeja_subcat').modal('show');
})

function fix_paddingr_modal(id_modal)
{
  $('#'+id_modal).on('hidden.bs.modal', function (e) {
  $('body.nav-md').css('padding-right','0px');
  })

  $('#'+id_modal).on('shown.bs.modal', function (e) {
    $('body.nav-md').css('padding-right','0px');
  })
}

$(document).on('click','.addsubcat',function(){
  var id_categoria = $('#bandeja_subcat #id_eadequipo_categoria').val();
  $('#addsubcategoria #myModalLabel').text('Crear Subcategoría');
  $('#addsubcategoria #id_eadequipo_categoria').val(id_categoria);
});

function get_subcatxcat (page){
  var id_categoria = $('#bandeja_subcat #id_eadequipo_categoria').val();
  var temp = "page="+page+"&id_eadequipo_categoria="+id_categoria;
  var estado = $('#bandeja_subcat #estado_busc').val();
  var subcat = $('#bandeja_subcat #subc_busc').val();

  if(parseInt(estado)>-1)
  {
    temp = temp + "&estado="+estado;
  }
  if(subcat.trim())
  {
    temp = temp + "&subcat="+subcat;
  }

  $.ajax({
    url: $('base').attr('href') + 'eadequipo/get_subcatxcat',
    type: 'POST',
    data: temp,
    dataType: "json",
    beforeSend: function() {
      $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
    },
    success: function(response) {
      if (response.code==1) {
        $('#bandeja_subcat #id_eadequipo_categoria').val(id_categoria);
        $('#bandeja_subcat #subcat_body').html(response.data.rta);
        $('#bandeja_subcat #paginacion_data').html(response.data.paginacion);
      }
      else
      {
        alerta('Hubo un error','al momento de obtener los datos.','error');
      }
    },
    complete: function() {
      $.LoadingOverlay("hide");
    }
  });
}

function limpiar_modalsubcat()
{
  $('#addsubcategoria #id_eadequipo_categoria').val('');
  $('#addsubcategoria #id_subcat').val('');
  $('#addsubcategoria #subcat').val('');

  $('#addsubcategoria #estado label').removeClass('active');
  $('#addsubcategoria #estado input').prop('checked',false);

  $('#addsubcategoria #estado #estado_1').prop('checked',true);
  $('#addsubcategoria #estado #estado_1').parent().addClass('active');  
}

$(document).on('click','.buscar_subc',function(){
  get_subcatxcat(0);
});

$(document).on('click','.limpiarfiltro_subc',function(){
  $('#bandeja_subcat #filtro input[type="text"]').val('');
  $('#bandeja_subcat #filtro select').val('-1');
  get_subcatxcat(0);
});

$(document).on('click', '#bandeja_subcat #datatable_paginate li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  get_subcatxcat(page);
});

$(document).on('click', '#bandeja_subcat #datatable_paginate a.paginate_button', function (e) {
  var page = $(this).attr('tabindex');
  get_subcatxcat(page);
});

$(document).on('click','#addsubcategoria .btn_limpiar',function(){
  $('#addsubcategoria').modal('hide');
  limpiar_modalsubcat();
});

$(document).on('click','.edit_subcat',function(){
  var id_subcat = $(this).parents('tr').attr('id_subcat');
  $('#addsubcategoria #myModalLabel').text('Editar Subcategorias');
  $.ajax({
    url: $('base').attr('href') + 'eadequipo/edit_subcat',
    type: 'POST',
    data: 'id_subcat='+id_subcat,
    dataType: "json",
    beforeSend: function() {
      $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
    },
    success: function(response) {
      if (response.code==1) {
        $('#addsubcategoria #estado input').prop('checked',false);
        $('#addsubcategoria #estado label').removeClass('active');

        var r = response.data;
        $('#addsubcategoria #id_subcat').val(r.id_subcat);
        $('#addsubcategoria #subcat').val(r.subcat);
        $('#addsubcategoria #id_eadequipo_categoria').val(r.id_eadequipo_categoria);
        $('#addsubcategoria #estado #estado_'+r.estado).prop('checked',true);
        $('#addsubcategoria #estado #estado_'+r.estado).parent().addClass('active');
      }
      else
      {
        alerta('Hubo un error','al momento de obtener los datos.','error');
      }
    },
    complete: function() {
      $.LoadingOverlay("hide");
    }
  });
});


$(document).on('click', '.del_subcat', function (e) {
  e.preventDefault();
  var id_subcat = $(this).parents('tr').attr('id_subcat');
  var nomb = "Subcategoría";
  swal({
    title: 'Estas Seguro?',
    text: "De Eliminar a esta "+nomb,
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, estoy seguro!'
  }).then(function(isConfirm) {
    if (isConfirm) {     
      $.ajax({
        url: $('base').attr('href') + 'eadequipo/save_subcat',
        type: 'POST',
        data: 'id_subcat='+id_subcat+'&estado=0',
        dataType: "json",
        beforeSend: function() {
          $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
        },
        success: function(response) {
          if(response.code==1)
          {
            var text = "Elimino!";
            $.LoadingOverlay("hide");
            swal({
              title : text,
              text: 'Esta Subcategoría '+text+'.',
              type: 'success',
              confirmButtonText: 'Listo!',
            }).then(function () {
                var page = $('#bandeja_subcat #datatable_paginate a').attr('tabindex');
                get_subcatxcat(page);
            });
          }
          else
          {
            alerta('Hubo un error','al momento de guardar los datos.','error');
          }
        },
        complete: function() {
          $.LoadingOverlay("hide"); 
        }
      });
    }
  });   
});