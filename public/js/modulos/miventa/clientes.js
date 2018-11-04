$( document ).ready(function() {
    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });
    
    $('#form-add-personanat').validate({
    rules:
    {
      dni:
      {
        required:true
      },
      apellidos:
      {
        required:true,
        minlength: 3
      },
      nombres:
      {
        required:true,
        minlength: 3
      }          
    },
    messages: 
    {
      dni:
      {
        required:""
      },
      apellidos:
      {
        required:""
      },
      nombres:
      {
        required:"",
        minlength: ""
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
        if(element.parent('.col-md-5').length) { error.insertAfter(element.parent()); }
        else if(element.parent('.col-md-8').length) { error.insertAfter(element.parent()); }
        else {}         
    },
    submitHandler: function() {
      var id_pedido = parseInt($('#form_detalle input.id_pedido').val());
      var idcliente = parseInt($('#id_cliente').val());
      //alerta('Ok',"lo formamos-->"+orden+'id_sucursal-->'+id_sucursal,'success');
      var html = "";
      var idi = "";
      var nomb = "";
      var cob = "";
      
      if(id_pedido>0)
      {            
        $.ajax({
            url: $('base').attr('href') + 'miventa/save_cliente',
            type: 'POST',
            data: $('#form-add-personanat').serialize()+'&id_pedido='+id_pedido+'&tipo=2',
            dataType: "json",
            beforeSend: function() {
              $.LoadingOverlay("show", {image : "", fontawesome : "fa fa-spinner fa-spin"});
            },
            success: function(response) {
              if (response.code==1) {
                idi = response.data.id;
                nomb = response.data.nomb;
                if(idcliente > 0)
                {
                    $('#div_'+idi+' input').val(nomb);
                }
                else
                {
                    html = '<div class="form-group" idcli="'+idi+'" tb="div_'+idi+'">'+
                                '<label for="busc_cliee" class="control-label col-md-2 col-sm-2 col-xs-12"><a href="javascript:void(0);" class="quitarcliente"><i class="fa fa-remove fa-2x"></i></a></label>'+
                                '<div class="col-md-10 col-sm-10 col-xs-12">'+
                                    '<input id="clix_'+idi+'" type="text" class="form-control" value="'+nomb+'" name="clientx" aria-describedby="hora" placeholder="Cliente 1">'+
                                '</div>'+
                            '</div>';
                    $('#aqui_clientes').append(html);

                    cob = '<li  id="licliente_'+idi+'" class=""><a idclie="'+idi+'" class="cambiarcli" href="javascript:void(0);">'+nomb+'</a></li>';
                    $('.impresion .nuevobuttom ul').append(cob);
                    $('.impresion .nuevobuttom ul li').removeClass('active');
                    $('.impresion .nuevobuttom ul li').eq(0).addClass('active');
                    var newnmb = $('.impresion .nuevobuttom ul li.active a').html();
                    newnmb = (parseInt(newnmb.length) > 12) ? newnmb.substr(0,12)+'...' : newnmb;
                    $('.impresion .nuevobuttom button b').html(newnmb);                    
                }

                $('#clientes').modal('hide');
              }
            },
            complete: function() {
              $.LoadingOverlay("hide");
              $('#form-add-contactos-nat input').prop( {"disabled": true} );
            }
        });
      }
        
    }
  });
});

$(function () {
    function construir (suggest)
    {
        $('#id_persona_natural').val(suggest.id_persona);
        $('#dni_').val(suggest.dni);
        $('#apellidos_').val(suggest.apellidos);
        $('#nombres_').val(suggest.nombres);
        $('#email').val(suggest.email);
        $('#ruc_nat').val('');
        $('#nombre_comercialnat').val();
        var ex = "";
        var va = suggest.va;
        if(va == "dni" || va == "nombres" || va == "apellidos")
        {
            ex = "_";
        }
        else
        {
            ex = (va == 'ruc') ? "_nat" : "";
        }
        $('#'+suggest.va+ex).focus();
        $('#'+suggest.va+ex).value(value);
        $('#gender label').removeClass('active');
        $('#gender input').prop('checked', false);

        var num = suggest.sexo;
        $('#gender #sexo_'+num).prop('checked', true);
        $('#gender #sexo_'+num).parent('label').addClass('active');

        var esj = parseInt(suggest.es_juridica);
        if(esj == 2)
        {
            $('#ruc_nat').val(suggest.ruc);
            $('#nombre_comercialnat').val(suggest.nombre_comercial);
        }
        $('#form-add-personanat input').prop( {"disabled" : true} );

        //cambiarids(1);
    }

    $( "#dni_" ).autocomplete({
        params: { 
            'id_documentoidentidad': function() { return $('input:radio[name=id_documentoidentidad]:checked').val(); },
            'idcli': function() { return 1; },
            'va': function() { return "dni"}
        },
        type:'POST',
        serviceUrl: $('base').attr('href')+"persona/get_infopn",
        onSelect: function (suggest) {
            construir(suggest);
        }
    });

    $( "#apellidos_" ).autocomplete({
        params: { 
            'id_documentoidentidad': function() { return $('input:radio[name=id_documentoidentidad]:checked').val(); },
            'idcli': function() { return 1; },
            'va': function() { return "apellidos"}
        },
        type:'POST',
        serviceUrl: $('base').attr('href')+"persona/get_infopn",
        onSelect: function (suggest) {
            construir(suggest);
        }
    });

    $( "#nombres_" ).autocomplete({
        params: { 
            'id_documentoidentidad': function() { return $('input:radio[name=id_documentoidentidad]:checked').val(); },
            'idcli': function() { return 1; },
            'va': function() { return "nombres"}
        },
        type:'POST',
        serviceUrl: $('base').attr('href')+"persona/get_infopn",
        onSelect: function (suggest) {
            construir(suggest);
        }
    });

    $( "#nombre_comercialnat" ).autocomplete({
        params: { 
            'id_documentoidentidad': function() { return $('input:radio[name=id_documentoidentidad]:checked').val(); },
            'idcli': function() { return 1; },
            'va': function() { return "nombre_comercial"}
        },
        type:'POST',
        serviceUrl: $('base').attr('href')+"persona/get_infopn",
        onSelect: function (suggest) {
            construir(suggest);
        }
    });

    $("#ruc_nat").autocomplete({
        params: { 
            'id_documentoidentidad': function() { return $('input:radio[name=id_documentoidentidad]:checked').val(); },
            'idcli': function() { return 1; },
            'va': function() { return "ruc"}
        },
        type: 'POST',
        serviceUrl: $('base').attr('href') + "persona/get_infopn",
        onSelect: function (suggest) {
            construir(suggest);
        }
    });
    /*<----->*/

});

/*Cliente*/

$(document).on('hidden.bs.modal', '#clientes', function (e)
{
  limpiarclientes();
});


$(document).on('click', '.addclientes', function (e)
{
    $('#id_clientes').val(0);
    $('#id_persona_natural').val(0);
    cambiarids(3);
    var form = "form-add-personanat";
    $('#'+form).find('input[type=text]').val('');
    $('#'+form).find('input[type=hidden]').val('');

    $('#'+form+' div.form-group').removeClass('has-error');
});

function limpiarclientes()
{
    //limp_todo('form-add-pn');
}

$(document).on('change', '#form-add-personanat input:radio[name=id_documentoidentidad]', function (e)
{
  var id = parseInt($(this).val());
  $('#dni_').val('');
  $('#dni_').prop( "disabled", false );
  $('#divdocu input').prop('checked', false);
  $('input#nodocu').prop('checked', true);
  if(id>0)
  {
    var autoge = $('#autoge').val();
    var nombr = autoge+$('input.doc_'+id).val();
    var padre = $('#dni_').closest('.form-group');
    padre.find('label.control-label span').html(nombr+' *');
    $('#dni_').attr({'placeholder':nombr});
  }
});

$(document).on('change', '#form-add-personanat input:radio[name=genera]', function (e)
{
  var id = parseInt($(this).val());
  var va = false;
  if(id>0)
  {
    va = true;
    $.ajax({
      url: $('base').attr('href') + 'persona/dni_genera',
      type: 'POST',
      data: 'id_documentoidentidad='+$('input:radio[name=id_documentoidentidad]:checked').val(),
      dataType: "json",
      success: function(response) {
        if (response.code == "1") {
          $('#dni_').val(response.data);
        }
      },
      complete: function() {
        //hideLoader();
      }
    });
  }
  else
  {
    $('#dni_').val('');
  }
  $('#dni_').prop( "disabled", va );
});

$(document).on('change', '#form-add-personanat #es_juridica', function (e)
{
    if($(this).is(":checked"))
    {
        $('#activeprsonaneg').removeClass('collapse');
    }
    else
    {
        $('#activeprsonaneg').addClass('collapse');
    }
});

$(document).on('click', '#form-add-personanat a.btn_ver', function (e)
{
    var form = "form-add-personanat";
    $('#'+form+' input').prop( {"disabled" : false} );
    var tipo = parseInt($(this).attr('tipo'));
    if(tipo == 1)
    {
        $('#'+form).find('input[type=text]').val('');
        $('#'+form).find('input[type=hidden]').val('');
    }
    cambiarids(tipo);
});

function cambiarids(tipo)
{
    var form = "form-add-personanat";
    var id = "";

    var idn = (parseInt(tipo) == 3) ? "" : "_";
    $('#'+form+' input').each(function (ind, elem){
        if($(elem).attr('type')=="text")
        {
            if($(this).parents('.form-group').attr('class')=="form-group has-error")
            {
                $(this).parents('.form-group').removeClass('has-error');
            }
            id = idn+$(elem).attr('mod'); //alert(id)
            $(elem).attr({'id':id});
        }
    });
}

$(document).on('click', '#form-add-personanat button.btn_save', function (e)
{
    var form = "form-add-personanat";
    $('#'+form+' input').each(function (ind, elem){
       $(elem).prop( {"disabled" : false } );
    });
    //$('#form-add-personanat').submit();
});

$(document).on('click', 'a.quitarcliente', function (e)
{
    var tis = $(tis);
    var idcli = parseInt(tis.parents('div.form-group').attr('idcli'));
    var idped = parseInt($('#form_detalle input.id_pedido').val());
    if(idcli > 0 && idped >0)
    {
        swal({
            title: 'Estas Seguro?',
            text: "De Eliminar este Cliente",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, estoy seguro!'
        }).then((result) => {
            if (result) {
                $.ajax({
                    url: $('base').attr('href') + 'miventa/deletepedidocliente',
                    type: 'POST',
                    data: 'id_cliente'+idcli+'&id_pedido='+idped,
                    dataType: "json",
                    beforeSend: function() {
                        $.LoadingOverlay("show", {image : "", fontawesome : "fa fa-spinner fa-spin"});
                    },
                    success: function(response) {
                        if (response.code==1) {
                            tis.parents('div.form-group').remove();
                            $('.impresion .nuevobuttom ul li#licliente_'+idcli).remove();
                        }
                    },
                    complete: function() {
                        $.LoadingOverlay("hide");
                    }
                });
            }
        });
    }
});

$(document).on('click', 'a.cambiarcli', function (e)
{
    var tis = $(this);
    var newnmb = $(tis).html();
    newnmb = (parseInt(newnmb.length) > 12) ? newnmb.substr(0,12)+'...' : newnmb;
    $('.impresion .nuevobuttom li').removeClass('active');
    $(tis).parents('li').addClass('active');

    $(tis).parents('.impresion .nuevobuttom').find('button b').html(newnmb);
});