$( document ).ready(function() {
  var d = new Date();

  jQuery.validator.setDefaults({
    debug: true,
    success: "valid",
    ignore: ""
  });
  $.validator.addMethod("regex", function(value, element) {
      var exp = value;
      if (exp <= 0) { return false; }
      else {
          if($.isNumeric(exp)){ return true; }
          else{ return false; }
      }
  }, "Solo #s Mayores a 0");

  $('#form_save_movialmacen').validate({
    rules:
    {
      id_art_sucursal: {required:true, number: true},
      fecha_ingreso:{ date: true },
      id_operario:{ required:true},
      cantidad:{regex:true},
      alma_partida:{required:true},
      id_llegada:{required:true}
    },
    messages: 
    {
      id_art_sucursal: {required:"Agregar Artículo"},
      fecha_ingreso:{ date: "Fecha Invalida" },
      id_operario:{ required: "Seleccione"},
      alma_partida:{required:'Seleccione'},
      id_llegada:{required:'Seleccione'}
    },      

    highlight: function(element) { //console.log($(element).attr('class'));
      if($(element).attr('type') == "hidden")
      {
        $(element).closest('.row').addClass('has-error');
      }
      else
      {
        $(element).closest('.form-group').addClass('has-error');
      }
      
    },
    unhighlight: function(element) {
      if($(element).attr('type') == "hidden")
      {
        $(element).closest('.row').removeClass('has-error');
      }
      else
      {
        $(element).closest('.form-group').removeClass('has-error');
      }
    },
    errorElement: 'span',
    errorClass: 'help-block',
    errorPlacement: function(error, element) 
    {
      if(element.parent('.col-md-3').length) 
      { 
        error.insertAfter(element.parent()); 
      }
      else
      {
        error.insertAfter(element);
      }
    },
    submitHandler: function() {
      var i = 0;
      var cantidad = 0;
      var id = "";
      var text = "";
      var ir = "";
      var canti = parseFloat($('#cantidad').val());
      canti = (canti>0) ? (canti) : (0);
      var sto = 0;
      var vari = 0;
      var fac = 0;
      var idd = 0;
      var edi = 0;
      var idal = 0;
      var tip = "";
      var sum = 0;
      if(canti>0)
      {
        var valorlote = parseFloat($('#valorlote').val());

        $('.checkalm').each(function (index, value){
          padre = $(this);
          cantidad = parseInt(padre.val()); 
          id = padre.attr('id');
          //console.log('id_almacen->'+cantidad+' id->'+id);
          if(id == "id_llegada") { cantidad = $('#id_llegada').val(); }
          else
          {
            idd = parseFloat(padre.closest('tr').attr('id'));
            idd = (idd>0) ? (idd) : (0);
            edi = parseFloat($('tr#'+idd+' td.canti').attr('edi'));
            if(edi==1)
            {
              vari = parseFloat($('tr#'+idd+' td.canti input').val());
              tip = 'input';
            }
            else
            {
              vari = parseFloat($('tr#'+idd+' td.canti span').html());
              tip = 'span';
            }            
            vari = (vari>0) ? (vari) : (0);
            fac = parseFloat($('tr#'+idd+' td.arti input.fc_'+idd).val());
            fac = (fac>0) ? (fac) : (0);
            vari = (fac!=0) ? (vari/fac) : (0);
            idal = (parseInt(cantidad)>0) ? (parseInt(cantidad)) : (0);
            //console.log('id_art_sucursal->'+idd+'cant->'+vari+' fac->'+fac);
            sto = parseFloat($('tr#'+idd+' td.stoqui input.stoqui_'+idal).val());
            sto = (sto>0) ? (sto) : (0);

            if(sto>=vari)
            {
              $('tr#'+idd+' td.canti '+tip).removeClass('erroinput');
            }
            else
            {
              $('tr#'+idd+' td.canti '+tip).addClass('erroinput');
              //sum++;              
            }
          }
          cantidad = (cantidad>0) ? (cantidad) : (0);
          //console.log(padre.attr('id')+'<-->'+padre.attr('name')+' <-> '+cantidad);
          if(cantidad == 0)
          {
            $(this).addClass('erroinput');
            i++;
          }
          else
          {
            $(this).removeClass('erroinput');  
          }
        });
        
        if(valorlote>0) {}
        else {i++;}

        if(i>0)
        {
          ir = (valorlote>0) ? ('Seleccionar') : ('Configuración x Sucursal');
          text = (valorlote>0) ? ('Almacén en la Receta.') : ('El lote debe ser Mayor a 0.');

          alerta(ir, text, 'error');
        }
        else
        {
          if(sum>0)
          {
            ir = 'Error!';
            text = 'Stock Insuficiente';

            alerta(ir, text, 'error');
          }
          else
          {
            var save = parseInt($('#cantidad').attr('cuanto'));
            if(save==1)
            {
              $('#cantidad').attr({'cuanto':2});
              var contr = $('#controller').val();
              //$('#saveb').hide();
              $.ajax({
                url: $('base').attr('href') + contr+'/save_produccionreceta',
                type: 'POST',
                data: $('#form_save_movialmacen').serialize(),
                dataType: "json",
                beforeSend: function() {
                  showLoader('saveb');
                },
                success: function(response) {
                  if (response.code==1) 
                  {
                    window.location.href = $('base').attr('href') +response.data.url+'/'+response.data.id;
                  }
                },
                complete: function(response) {
                }
              });
            }              
          }                      
        }
      }
      else
      {
        alerta('Verificar', 'Lote de Producción Mayor a 0', 'error');
      }       

    }
  });

  $('#datetimepicker6').datetimepicker({
    format: 'YYYY-MM-DD',
    locale: moment.locale("es")
  });

});

$(document).on('click', '.limpiarform', function (e) {
  lip_busqueda('form_save_movialmacen');
});

function lip_busqueda(form)
{
  $('#'+form+' input').each(function (index, value){
    if($(this).attr('type')=="text" || $(this).attr('type')=="hidden")
    {
      if($(this).parents('.form-group').attr('class')=="form-group has-error")
      {
        $(this).parents('.form-group').removeClass('has-error');
      }

      $(this).val('');

      id = $(this).attr('id');
      if($('#'+id+'-error').length>0)
      {
        $('#'+id+'-error').html('');
      }
    }
  });

  $('#'+form+' label.bordelabel').each(function (index, value){
    $(this).html('');
  });

  $('#datetimepicker7 input').prop( "disabled", true );
  $('#num_page').val( "0" );

  var validatore = $( '#'+form ).validate();
  validatore.resetForm();
  $('#datatable-buttons tbody#bodyindex').html("<tr><td colspan='11'><h2 class='text-center text-success'>No se hay registro</h2></td></tr>");
  $('#paginacion_data').html('');
}

$(document).on('click', '#datatable-buttons li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  $('#num_page').val(page);
  $('#form_save_movialmacen').submit();
});

$(document).on('click', '#datatable-buttons a.paginate_button', function (e) {  
  var page = $(this).attr('tabindex');
  $('#num_page').val(page);
  $('#form_save_movialmacen').submit();
});

function limpcarga(tipo)
{
  $('table#'+tipo+' tbody tr td.cp_u span').html('0.00');
  $('table#'+tipo+' tbody tr td.cp_t span').html('0.00');
}

$(document).on('change', '#id_llegada', function (e) {
  var padre = $(this);
  /*var ialm = parseInt(padre.val());

  if(ialm>0)
  {
    //var cant = parseFloat($('#cantidad').val()); //console.log('cant->'+cant);

    //var co_u = parseFloat(padre.closest('td').find('input.copu').val());
    //var c_t = (co_u*cant>0) ? (co_u*cant) : ("0.00");
    //c_t = (c_t>0) ? (c_t.toFixed(2)) : (c_t);

    padre.closest('tr').find('td.cp_t span').html(c_t);

    $(this).removeClass('erroinput');
  }
  else
  {
    //limpcarga('alma_llegada');
    //padre.closest('td.almace').find('input.copu').val('0.00');
    //padre.closest('td.almace').find('input.impu').val('0.00');
  }*/

});

$(document).on('focusout', '#cantidad', function (e) {

  var cant = parseFloat($(this).val()); //console.log("Su Cantidad->"+cant);
  var ialm = parseInt($('#id_llegada').val());
  var valorlote = parseFloat($('#valorlote').val());
  valorlote = (valorlote>0) ? (valorlote) : (0); //console.log('Valor Lote->'+valorlote);
  var auxcant = cant;

  /*if(valorlote!=cant)
  {
    $('#valorlote').val(cant);
    valorlote = cant;
  }*/

  var tolemas = valorlote+parseFloat($('#tolerancia_mas').val());
  var tolemenos = valorlote-parseFloat($('#tolerancia_menos').val());
    
  var ca_nn = (cant>0) ? cant.toFixed(2) : "0.00";

  if(ialm>0)
  {
    var c_u = $('table#alma_llegada tbody tr td.almace input.copu').val(); console.log('c_u->'+c_u);
    cant = (cant>=tolemenos && cant<=tolemas) ? (valorlote) : (cant); console.log('New Cant->'+cant);
    var c_t = parseFloat(c_u*(cant/valorlote));
    c_t = (c_t!=0) ? (c_t.toFixed(6)) : ("0.00");

    $('table#alma_llegada tbody tr td.lote span').html(ca_nn);

    var ca_nti = "";
    var co_u = "";
    var co_t = "";
    var sum = 0;
    var id = "";
    var id_a = "";
    var vfi = "";
    var edi = "";
    var frac = "";
    var id_a = "";
    var tolmas = 0;
    var tolmenos = 0;
    var rtatol = 0;
    var evalcant = (auxcant>=tolemenos && auxcant<=tolemas) ? (0) : (1);
    var sto=0;
    var vari = 0;
    var fac = 0;
    var tip = "";

    $('table#alma_partida tbody tr td.canti').each(function (index, value){
      id = $(this).closest('tr').attr('id');
      vfi = $(this).attr('vfi');
      edi = $(this).attr('edi');
      cant = auxcant;

      if(vfi==1)
      {
        if(cant>=tolemenos && cant<=tolemas) {
          cant = valorlote;
        }
      }

      frac = (cant/valorlote);
      id_a = parseInt($('tr#'+id+' td.almace select.almapartida').val());
      id_a = (id_a>0) ? (id_a) : (0);

      if(edi==1)
      {
        ca_nti = parseFloat($('tr#'+id+' td.arti input.oculto_'+id).val());
        if(evalcant==1)
        {
          $('tr#'+id+' td.arti input.oculto_'+id).val(frac*ca_nti);
        }
        tip = 'input';
      }
      else
      {
        ca_nti = $(this).closest('tr').find('td.arti input.canti_'+id).val(); 
        if(evalcant==1)
        {
          $(this).closest('tr').find('td.arti input.canti_'+id).val(frac*ca_nti);
        }
        tip = 'span';
      }      

      co_u = $(this).closest('tr').find('td.almace input.c_u_'+id_a).val();

      ca_nti = (id_a>0) ? (parseFloat(ca_nti*frac)) : (0);
      vari = (ca_nti>0) ? (ca_nti) : (0);
      fac = parseFloat($(this).closest('tr').find('td.arti input.fc_'+id).val());
      fac = (fac>0) ? (fac) : (0);
      vari = (fac!=0) ? (vari/fac) : (0);
      /*ca_nti = (id_a>0) ? (parseFloat(ca_nti*(cant/valorlote))) : (0);*/

      co_t = parseFloat(ca_nti*co_u);
      sto = parseFloat($('tr#'+id+' td.stoqui input.stoqui_'+id_a).val());
      sto = (sto>0) ? (sto) : (0);
      if(sto>=vari)
      {
        $(this).closest('tr').find('td.canti '+tip).removeClass('erroinput');
      }
      else
      {
        $(this).closest('tr').find('td.canti '+tip).addClass('erroinput');
      }
      //console.log('id_art_sucursal->'+id+'ca_nti->'+ca_nti+' sto->'+sto);
      ca_nti2 = (ca_nti!=0) ? (ca_nti.toFixed(2)) : ("0.00");
      co_t2 = (co_t!=0) ? (co_t.toFixed(6)) : ("0.0000000");

      sum = parseFloat(sum) + parseFloat(co_t2);  //console.log('sum->'+sum);

      if(edi==1)
      {
        $(this).find('input').val(ca_nti2);

        tolmenos = parseFloat($(this).closest('tr').find('td.tolerancias input.tolemenos_'+id_a).val());
        tolmenos = ca_nti-parseFloat(tolmenos);
        tolmenos = (tolmenos!=0) ? (tolmenos.toFixed(2)) : ("0.00");
        tolmas = parseFloat($(this).closest('tr').find('td.tolerancias input.tolemas_'+id_a).val());
        tolmas = ca_nti+parseFloat(tolmas);
        tolmas = (tolmas!=0) ? (tolmas.toFixed(2)) : ("0.00");
        rtatol = tolmenos+'--'+tolmas;
      }
      else
      {
        $(this).find('span').html(ca_nti2);
        rtatol = ca_nti2;
      }

      $(this).closest('tr').find('td.tolerancias span').html(rtatol);

      $('tr#'+id+' td.cp_t span').html(co_t2);
    });

    var old_lote = parseInt($('#old_lote').val());

    if($('#lote_nueva').length)
    {
      var lote_nueva = old_lote*cant;
      $('#lote_nueva').val(lote_nueva)
      ca_nn = parseFloat($('#lote_nueva').val());
    }
    if(old_lote==1)
    {
      ca_nn = $('#cantidad').val();
    }

    var sumi = (sum>0) ? (sum.toFixed(6)) : ("0.00");
    $('table#almacen_llegada tbody tr td.ct_ins span').html(sumi);
    $('table#alma_llegada tbody tr td.almace input.ct_ins').val(sum);
    var sum3 = (cant!=0) ? (sum/ca_nn) : (0);
    sum3 = (sum3>0) ? (sum3.toFixed(6)) : ("0.00");
    $('table#almacen_llegada tbody tr td.ct_insu span').html(sum3);
    $('input.cost_tot').each(function (index, value){
      sum = sum + parseFloat($(this).val());
    });

    suu = (ca_nn>0) ? (sum/ca_nn) : ("0.00000000");
    $('table#alma_llegada tbody tr td.almace input.copu').val(suu);
    suu = (suu>0) ? (suu.toFixed(6)) : ("0.00000000");
    sum = (sum>0) ? (sum.toFixed(6)) : ("0.00000000");

    $('table#almacen_llegada tbody tr td.cp_u span').html(suu);
    $('table#almacen_llegada tbody tr td.cp_t span').html(sum);

    cant = parseFloat($(this).val()); //console.log(cant);

    cant = (auxcant>=tolemenos && auxcant<=tolemas) ? (valorlote) : (cant);    

    $('#valorlote').val(cant);
    valorlote = parseFloat($('#valorlote').val());
    //console.log($('#tolerancia_menos').val());
    //console.log($('#tolerancia_mas').val());

    var farr = 1;
    tolemenos = tolemenos*farr;
    tolemenos = valorlote-parseFloat($('#tolerancia_menos').val());
    tolemenos = (tolemenos!=0) ? (tolemenos.toFixed(2)) : ("0.00");
    tolemas = valorlote+parseFloat($('#tolerancia_mas').val());
    tolemas = tolemas*farr;
    tolemas = (tolemas!=0) ? (tolemas.toFixed(2)) : ("0.00");
    $('table#alma_ver tbody tr td.ttme span').html(tolemenos);
    $('table#alma_ver tbody tr td.ttma span').html(tolemas);
    $('b#total').html(sum);
  }

});

$(document).on('change', '.almapartida', function (e) {
  var ialm = parseInt($(this).val());
  var id = $(this).closest('tr').attr('id');
  var cant = parseInt($('#cantidad').val());
  var valorlote = parseFloat($('#valorlote').val());
  valorlote = (valorlote>0) ? (valorlote) : (0);
  var sto = "0.00";
  var edi = parseInt($(this).closest('tr').attr('edi')); //console.log(edi);
  var ca_nti = 0;
  var sum2 = 0
  if(ialm>0)
  {
    if(edi==1)
    {
      ca_nti = parseFloat($('tr#'+id+' td.arti input.oculto_'+id).val()); //console.log('id_'+id);
      $('tr#'+id+' td.canti input#cantii_'+id).val(ca_nti);
    }    
    else
    {
      ca_nti = parseFloat($('tr#'+id+' td.arti input.canti_'+id).val());
    }
    //console.log('ca_nti->'+ca_nti);
    var c_u = parseFloat($('tr#'+id+' td.almace input.c_u_'+ialm).val());  //console.log('co_u->'+co_u);
    var old = parseFloat($('tr#'+id+' td.cp_t span').html());
    var tot = parseFloat($('b#total').html());

    sto = $('tr#'+id+' td.stoqui input.stoqui_'+ialm).val(); //console.log(sto);    

    $('tr#'+id+' td.arti input.cpun_'+id).val(c_u);
    $('tr#'+id+' td.stoqui span').html(sto);

    ca_nti = parseFloat(ca_nti*(cant/valorlote));
    c_t = parseFloat(ca_nti*c_u); //console.log('sub_total'+c_t);

    tot = tot + c_t - old;    

    ca_nti = (ca_nti>0) ? (ca_nti.toFixed(2)) : ("0.00");
    c_u = (c_u>0) ? (c_u.toFixed(6)) : ("0.00");
    c_t = (c_t>0) ? (c_t.toFixed(6)) : ("0.00");
    tot = (tot>0) ? (tot.toFixed(6)) : ("0.00");
    
    $('tr#'+id+' td.canti span').html(ca_nti);
    $('tr#'+id+' td.cp_u span').html(c_u);
    $('tr#'+id+' td.cp_t span').html(c_t);
    $('b#total').html(tot);

    $(this).removeClass('erroinput');

    var cost_u = 0;
    var ca_ti = 0;
    var sum = 0;
    var padre = "";
    var ids = 0;
    var ed_i = 0;

    $('#alma_partida tbody tr').each(function (index, value){
      padre = $(this);
      ids = parseInt(padre.attr('id'));
      id_i = parseInt(padre.attr('edi'));
      if(ids>0) 
      {
        if(id_i==1)
        {
          ca_ti = padre.find('td.canti input#cantii_'+ids).val();
        }
        else
        {
          ca_ti = padre.find('td.arti input.canti_'+ids).val();
        }
        
        cost_u = padre.find('td.arti input.cpun_'+ids).val(); //console.log(ca_ti+'*'+cost_u);
        sum = sum + (ca_ti*(cant/valorlote))*cost_u; 
      }
    });
    //console.log('suma->'+sum);
    $('table#alma_llegada tbody tr td.almace input.copu').val(sum);

    //$('table#almacen_llegada tbody tr td.cp_u span').html(sum2);
    //$('table#almacen_llegada tbody tr td.cp_t span').html(sum1);

  }
  else
  {
    if(edi==1)
    {
      $('tr#'+id+' td.canti input').val('0.00');
    }
    else
    {
      $('tr#'+id+' td.canti span').html('0.00');
    }
    
    $('tr#'+id+' td.cp_u span').html('0.00');
    $('tr#'+id+' td.cp_t span').html('0.00');
    $('tr#'+id+' td.stoqui span').html('0.00');
    var sum = 0;
    var canti = 0;
    var id_i = 0;

    $('#alma_partida tbody tr').each(function (index, value){
      padre = $(this);
      ids = parseInt(padre.attr('id'));
      id_i = parseInt(padre.attr('edi'));
      if(ids>0 && id != ids) 
      {
        if(id_i==1)
        {
          ca_ti = padre.find('td.canti input#cantii_'+ids).val();
        }
        else
        {
          ca_ti = padre.find('td.arti input.canti_'+ids).val();
        }
        cost_u = padre.find('td.arti input.cpun_'+ids).val(); //console.log(ca_ti+'*'+cost_u);
        sum = sum + (ca_ti*(cant/valorlote))*cost_u; //console.log(sum);
      }
    });

    $(this).addClass('erroinput');
    $('tr#'+id+' td.arti input.cpun_'+id).val('');
  }

  if($('#lote_nueva').length)
  {
    cant = parseFloat($('#lote_nueva').val());
  }

  var sumi = (sum>0) ? (sum.toFixed(6)) : ("0.00");
  $('table#almacen_llegada tbody tr td.ct_ins span').html(sumi);
  $('table#alma_llegada tbody tr td.almace input.ct_ins').val(sum);
  var sum3 = (cant!=0) ? (sum/cant) : (0);
  sum3 = (sum3>0) ? (sum3.toFixed(6)) : ("0.00");
  $('table#almacen_llegada tbody tr td.ct_insu span').html(sum3);
  $('input.cost_tot').each(function (index, value){
    sum = sum + parseFloat($(this).val());
  });

  sum2 = (cant!=0) ? (sum/cant) : (0);
  $('table#alma_llegada tbody tr td.almace input.copu').val(sum2);
  sum2 = (sum2>0) ? (sum2.toFixed(6)) : ("0.00");
  sum = (sum>0) ? (sum.toFixed(6)) : ("0.00");

  $('table#almacen_llegada tbody tr td.cp_u span').html(sum2);
  $('b#total').html(sum);
  $('table#almacen_llegada tbody tr td.cp_t span').html(sum);
});

$(document).on('focusout', '.mascanti', function (e) {
  var padre = $(this);
  var ialm = parseInt(padre.closest('tr').find('td.almace select.almapartida').val());
  var ca_nti = parseFloat(padre.val()); //console.log('ca_nti->'+ca_nti);
  var id = padre.closest('tr').attr('id');
  var vapr = parseInt(padre.attr('vapr'));
  var valorlote = parseFloat($('#valorlote').val()); //console.log(valorlote);
  valorlote = (valorlote>0) ? (valorlote) : (0);
  var oculto = parseFloat($('tr#'+id+' td.arti input.oculto_'+id).val());
  var prin = parseInt(padre.attr('prin'));

  if(prin==1)
  {
    var loteexacto = (oculto!=0) ? (valorlote*(ca_nti/oculto)) : (valorlote); //console.log(loteexacto);
    $('#loteexacto').html(loteexacto);
    //loteexacto = (oculto!=0) ? (ca_nti/oculto) : (oculto);
    $('#lote_nueva').val(loteexacto);
  }   

  var vfi = padre.closest('tr').attr('vfi');
  var cant = parseFloat($('#cantidad').val());  

  var frac = (vfi==1) ? (1) : (parseFloat(cant/valorlote));

  var tolemas = oculto+parseFloat(padre.attr('tolemas'));
  tolemas = tolemas*frac;
  var tolemenos = oculto-parseFloat(padre.attr('tolemenos'));
  tolemenos = tolemenos*frac;
  var edi = parseInt(padre.closest('tr').attr('edi'));
  frac = (edi==1) ? (1) : (frac);



  if(ca_nti>0 && ca_nti>=tolemenos && ca_nti<=tolemas && ialm>0)
  {
    var c_u = parseFloat($('tr#'+id+' td.almace input.c_u_'+ialm).val()); //console.log('c_u->'+c_u);
    var old = parseFloat($('tr#'+id+' td.cp_t span').html());
    var tot = parseFloat($('b#total').html());

    $('tr#'+id+' td.arti input.cpun_'+id).val(c_u);

    ca_nti = parseFloat(ca_nti*frac);
    var c_t = parseFloat(ca_nti*c_u);
    //console.log('sub_total'+c_t);

    tot = tot + c_t - old;    

    ca_nti = (ca_nti!=0) ? (ca_nti.toFixed(2)) : ("0.00"); //console.log('ca_nti->'+ca_nti);
    c_u = (c_u!=0) ? (c_u.toFixed(6)) : ("0.00");  //console.log('c_u->'+c_u);
    c_t = (c_t!=0) ? (c_t.toFixed(6)) : ("0.00");
    tot = (tot!=0) ? (tot.toFixed(6)) : ("0.00"); //console.log('tot->'+tot);
    
    padre.closest('tr').find('td.canti span').html(ca_nti);
    padre.closest('tr').find('td.cp_u span').html(c_u);
    padre.closest('tr').find('td.cp_t span').html(c_t);
    padre.closest('tr').find('b#total').html(tot);

    $(this).removeClass('erroinput');

    var cost_u = 0;
    var ca_ti = 0;
    var sum = 0;
    var padre = "";
    var ids = 0;
    var ed_i = 0;
    var fraci = 0;
    
    $('#alma_partida tbody tr').each(function (index, value){
      padre = $(this);
      ids = parseInt(padre.attr('id'));
      id_i = parseInt(padre.attr('edi'));
      if(ids>0) 
      {
        if(id_i==1)
        {
          ca_ti = padre.find('td.canti input#cantii_'+ids).val();
          fraci = 1;
        }
        else
        {
          ca_ti = padre.find('td.arti input.canti_'+ids).val();
          fraci = (cant/valorlote);
        }
        
        cost_u = padre.find('td.arti input.cpun_'+ids).val(); //console.log('id_i->'+id_i+'<-->'+ca_ti+'*'+cost_u);
        sum = sum + ca_ti*fraci*cost_u; 
      }
    });

    if($('#lote_nueva').length)
    {
      cant = parseFloat($('#lote_nueva').val());
    }

    //$('table#alma_llegada tbody tr td.almace input.copu').val(sum);
    var sumi = (sum>0) ? (sum.toFixed(6)) : ("0.00");
    $('table#almacen_llegada tbody tr td.ct_ins span').html(sumi);
    $('table#alma_llegada tbody tr td.almace input.ct_ins').val(sum);
    var sum3 = (cant!=0) ? (sum/cant) : (0);
    sum3 = (sum3>0) ? (sum3.toFixed(6)) : ("0.00");
    $('table#almacen_llegada tbody tr td.ct_insu span').html(sum3);
    $('input.cost_tot').each(function (index, value){
      sum = sum + parseFloat($(this).val());
    });

    var sum2 = (cant!=0) ? (sum/cant) : (0);
    $('table#alma_llegada tbody tr td.almace input.copu').val(sum2);

    sum2 = (sum2>0) ? (sum2.toFixed(6)) : ("0.00");
    sum = (sum>0) ? (sum.toFixed(6)) : ("0.00");

    $('table#almacen_llegada tbody tr td.cp_u span').html(sum2);
    $('b#total').html(sum);
    $('table#almacen_llegada tbody tr td.cp_t span').html(sum);
  }
  else
  {
    $(this).addClass('erroinput');
  }
  //cant = (cant>=tolemenos && cant<=tolemas) ? (valorlote) : (cant);

});