$( document ).ready(function() {
  $('#form_save_personalacargo').validate({
    rules: 
    {
      dni: { required:true},
      nombres: {required:true},
      apellidos: {required:true}
    },
    messages: 
    {
      dni: { required:"Ingresar" },
      nombres: { required:"Nombres" },
      apellidos: { required:"Apellidos" }
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
      else {}
    },
    submitHandler: function() {
      $.ajax({
        url: $('base').attr('href') + 'personal/save_personalcargo',
        type: 'POST',
        data: $('#form_save_personalacargo').serialize(),
        dataType: "json",
        beforeSend: function() {
          //showLoader();
        },
        success: function(response) {
          if (response.code==1) {
            var tipo = $('#myTab li.active').attr('tabs');
            var idp = $('#id_personal').val();

            var url = "";

          url = $('base').attr('href') +'personal/edit/'+idp+'/'+tipo;
            window.location.href = url;
          }
        }
      });
    }
  }); 
});
var id_personal = $('#id_personal').val();

$(document).on('click','.editahorario',function(){
  var chkd = $(this).is(':checked');
  //var id_sucu = $(this).parents('div.col-sm-6').prop('id').substring(13,$(this).parents('div.col-sm-6').prop('id').length);
  var id_sucu = $(this).parents('div.col-sm-6.padr').attr('idsucu');
  console.log(id_sucu);
  var puede_edit = (chkd==true) ? 1 : null;
  var id_personalgestiontiempo = $(this).parents('div.padr').attr('id_personalgestiontiempo');
  var tipo = $(this).attr('tipo');
  var param = 'tipo='+tipo+'&id_sucursal='+id_sucu+'&puede_edit='+puede_edit+'&id_personalgestiontiempo='+id_personalgestiontiempo+'&id_personal='+id_personal;
  save_config(param);
});

$(document).on('change','.area_pos',function () {
  var id_areapos = $(this).val();
  console.log(id_areapos);
  var $this = $(this);
  if(id_areapos)
  {
    var id_sucu = $(this).parents('div.col-sm-6.padr').attr('idsucu');
    console.log(id_sucu);
    var id_personalgestiontiempo = $this.parents('div.padr').attr('id_personalgestiontiempo');
    var param = 'id_sucursal='+id_sucu+'&id_areaposicion='+id_areapos+'&id_personalgestiontiempo='+id_personalgestiontiempo+'&id_personal='+id_personal+'&tipo=areapos';
    save_config(param);
  }
});

$(document).on('change','.pos',function () {
  var id_pos = $(this).val();
  console.log(id_pos);
  var $this = $(this);
  if(id_pos)
  {
    var id_personalgestiontiempo = $this.parents('div.padr').attr('id_personalgestiontiempo');
    var param = 'id_posicion='+id_pos+'&id_personalgestiontiempo='+id_personalgestiontiempo+'&id_personal='+id_personal+'&tipo=pos';
    save_config(param);
  }
});

function save_config(param,overlay=true)
{
  $.ajax({
    url: $('base').attr('href') + 'personal/config_gestiontiempo',
    type: 'POST',
    data: param,
    dataType: "json",
    beforeSend: function() {
      if(overlay)
        $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
    },
    success: function(response) {
      if (response.code==1) {
        if(overlay)
          window.location.reload();
      }
    },
    complete: function() {
        //hideLoader();
    }
  });
}

$(function () {
  $( "#dni" ).autocomplete({
    params: { 
      'id_personalsucursal': function() { return $('#id_penlsucursal').val(); },
      'va': function() { return 'dni';}
    },
    type:'POST',
    serviceUrl: $('base').attr('href')+"personal/get_infopersonalacargo",
    onSelect: function (suggestion) 
    {
      var padre = $('#form_save_personalacargo');
      padre.find('.id_personal').val(suggestion.id_personal);
      $('#apellidos').val(suggestion.apellidos);
      $('#nombres').val(suggestion.nombres);
    }
  });

  $( "#nombres" ).autocomplete({
      params: {
        'id_personalsucursal': function() { return $('#id_penlsucursal').val(); },
        'va': function() { return 'nombres';}
    },
      //appendTo: autondni,
      type:'POST',
      serviceUrl: $('base').attr('href')+"personal/get_infopersonalacargo",
      onSelect: function (suggestion) 
      {
        var padre = $('#form_save_personalacargo');
        padre.find('.id_personal').val(suggestion.id_personal);
        $('#apellidos').val(suggestion.apellidos);
        $('#nombres').val(suggestion.nombres);
        $('#dni').val(suggestion.dni);
      }
  });/**/

  $( "#apellidos" ).autocomplete({
      params: {
        'id_personalsucursal': function() { return $('#id_penlsucursal').val(); },
        'va': function() { return 'apellidos';}
    },
      //appendTo: autondni,
      type:'POST',
      serviceUrl: $('base').attr('href')+"personal/get_infopersonalacargo",
      onSelect: function (suggestion) 
      {
        var padre = $('#form_save_personalacargo');
        padre.find('.id_personal').val(suggestion.id_personal);
        $('#apellidos').val(suggestion.apellidos);
        $('#nombres').val(suggestion.nombres);
        $('#dni').val(suggestion.dni);
      }
  });
});

$(document).on('click', '.delete_personalacargo', function (e)
{
  e.preventDefault();
  var idpersonalacargo = parseInt($(this).parents('tr').attr('idpersonalacargo'));
  if(idpersonalacargo>0)
  {
    swal({
      title: 'Estas Seguro?',
      text: "De Eliminar este Personal",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, estoy seguro!'
    }).then(function(isConfirm) {
      if (isConfirm) {     
        $.ajax({
          url: $('base').attr('href') + 'personal/delete_personalacargo',
          type: 'POST',
          data: 'id_personalacargo='+idpersonalacargo,
          dataType: "json",
          beforeSend: function() {
              //showLoader();
          },
          success: function(response) {
            if (response.code==1) {
              var tipo = $('#myTab li.active').attr('tabs');
              var idp = $('#id_personal').val();
              var url = "";

              //url = $('base').attr('href') +'personal/edit/'+idp+'/'+tipo;
              //window.location.href = url;
              window.location.reload();             
            }
          },
          complete: function() {
              //hideLoader();
          }
        });
      }
    });
  }
});

$(document).on('click', '.add_personalacargo', function (e)
{
  limp_todo('form_save_personalacargo');
  var idtbsucursal = $(this).parents('div.tbsucu').attr('id');
  console.log(idtbsucursal);
  var idpersonalsucursal = idtbsucursal.substring(8,idtbsucursal.length);
  console.log(idpersonalsucursal);
  $('#id_penlsucursal').val(idpersonalsucursal);
});

$(document).on('change','.es_supervisor',function () {
  var es_supervisor = $(this).val();
  var $this = $(this);

  if(es_supervisor)
  {
    var id_sucu = $(this).parents('div.col-sm-6.padr').attr('idsucu');
    var id_personalgestiontiempo = $this.parents('div.padr').attr('id_personalgestiontiempo');
    var param = 'id_sucursal='+id_sucu+'&id_personalgestiontiempo='+id_personalgestiontiempo+'&id_personal='+id_personal;
    save_config(param);
  }
});