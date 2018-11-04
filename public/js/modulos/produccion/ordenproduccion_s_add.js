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
      id_operario:{required:true},
      cantidad:{regex:true}
    },
    messages: 
    {
      id_art_sucursal: {required:"Agregar Artículo"},
      fecha_ingreso:{ date: "Fecha Invalida" },
      id_operario:{required:"Seleccione"}
    },      

    highlight: function(element) { //console.log($(element).attr('class'));     
    },
    unhighlight: function(element) {

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
      var cpu = parseFloat($('.copu').val());
      if(cpu>0)
      {
        var canti = parseFloat($('#cantidad').val());
        canti = (canti>0) ? (canti) : (0);
        var idalma = parseInt($('table#alma_partida tbody tr td select#id_salida').val());
        idalma = (idalma>0) ? (idalma) : (0);

        var stock = parseFloat($('table#alma_partida tbody tr td.stock input.sto_'+idalma).val());
        var i = 0;
        var cantidad = 0;
        var id = "";
        var text = "";

        $('.checkalm').each(function (index, value){
          padre = $(this);
          cantidad = parseInt(padre.val()); //console.log(cantidad);
          id = padre.attr('id');

          if(id == "id_salida") { cantidad = $('#id_salida').val(); };  
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
        var text_error = (i>0) ? ("Almacén de Producción.") : ("");
        var sumprec = 0;
        var preci = 0;
        var iden = "";

        $('.catsubprod').each(function (index, value){
          padre = $(this);
          cantidad = padre.val(); //console.log(cantidad);

          if(validnum(cantidad) == 0)
          {
            $(this).addClass('erroinput');
          }
          else
          {
            $(this).removeClass('erroinput');
            sumprec = sumprec + parseFloat(cantidad);
          }
        });

        if(sumprec==0)
        {
          text_error = (i>0) ? (text_error) :("Ingresar Cantidad Producción"); 
          i++;
        }
        
        i = parseInt(i);
        if(i>0)
        {
          alerta('Seleccionar', text_error, 'error');
        }
        else
        {
          $.ajax({
            url: $('base').attr('href') + 'ordenenproduccion/save_produccionsubproducto',
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
            complete: function(response) {}
          });          
        }
        $('#cantidad').removeClass('erroinput');          
      }
      else
      {
        alerta('Verificar!', 'El Precio Unitario debe ser Mayor a 0', 'error');
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

function limpcarga(tipo)
{
  $('table#'+tipo+' tbody tr td.cp_u span').html('0.00');
  $('table#'+tipo+' tbody tr td.cp_t span').html('0.00');
}

$(document).on('change', '#id_llegada', function (e) {
  var padre = $(this);
  var ialm = parseInt(padre.val());

  if(ialm>0)
  {
    var cant = parseFloat($('#cantidad').val()); //console.log('cant->'+cant);

    var co_u = parseFloat(padre.closest('td').find('input.copu').val());
    var c_t = (co_u*cant>0) ? (co_u*cant) : ("0.00");
    c_t = (c_t>0) ? (c_t.toFixed(2)) : (c_t);

    padre.closest('tr').find('td.cp_t span').html(c_t);

    $(this).removeClass('erroinput');
  }
  else
  {
    limpcarga('alma_llegada');
    padre.closest('td.almace').find('input.copu').val('0.00');
    padre.closest('td.almace').find('input.impu').val('0.00');
  }

});

$(document).on('focusout', '#cantidad', function (e) {
  var cant = parseFloat($(this).val());
  var ialm = parseInt($('#id_salida').val());
  var copu = parseFloat($('.copu').val());

  copu = (copu!=0) ? (copu) : (0);

  var copt = ((copu*cant)!=0) ? (copu*cant) : (0);

  $('#alma_partida tbody tr td.cp_u').html(copu.toFixed(6));
  //$('#alma_partida tbody tr td.cp_t').html(copt.toFixed(6));
  $('#alma_partida tbody tr td.almace input.can_ti').val(cant);

  $('#alma_variante tbody tr td.cp_u span').html(copu.toFixed(6));
  $('#alma_variante tbody tr td.cp_t span').html(copt.toFixed(2));
  $('#costos_ts tbody tr.totales td.ct_md span').html(copt.toFixed(2));

  if(ialm>0)
  {
    var sto = parseFloat($('#alma_partida tbody tr td.stock input.sto_'+ialm).val());
    sto = (sto>0) ? (sto) : (0);
    valores();
    if(sto>=cant)
    {
      $(this).removeClass('erroinput');
    }
    else
    {
      $(this).addClass('erroinput');
      //alerta('Error!','Verificar el Stock','error');
    }
  }

});

function validnum(exp)
{
  var valor = 0;
  if (exp <= 0) {  }
  else {
    if($.isNumeric(exp)) { 
      valor = 1;
    }
  }
  return parseInt(valor);
}

function valores() {
  var sum = 0;
  var i_d_a = 0;
  var cant_ = 0;
  var vali_d = 0;
  var sum_p = 0;
  var cp_p = 0;

  var ct_act = parseFloat($('#ct_act').val());

  $('#alma_llegada tbody tr').each(function (index, value){
    padre = $(this);
    ids = parseInt(padre.attr('id')); 

    if(ids>0) 
    {
      i_d_a = parseInt(padre.find('td.almace select.almaingreso').val());
      cant_ = parseFloat(padre.find('td.canti input.catsubprod').val());
      vali_d = validnum(cant_);
      if(i_d_a>0 && vali_d>0)
      {
        fu = padre.find('td.arti input.fu_'+ids).val();
        cp_p = padre.find('td.arti input.cpun_'+ids).val();
        sum = sum + cant_*fu;
        sum_p = sum_p + cant_*cp_p;
      }
    }
  });

  sum = (sum>0) ? (sum.toFixed(2)) : ("0.00");
  sum_p = (sum_p>0) ? (sum_p.toFixed(2)) : ("0.00");

  $('#totalf').html(sum);
  $('#total').html(sum_p);

  var cantotal = $('#cantidad').val();
  var i_d_a = 0;
  var cant_ = 0;
  var vali_d = 0;
  var porct = "";
  var subt = "";
  var sumsubt = 0;
  var cantcu = 0;

  var cantact = 0;
  var subtact = 0;

  var ids = 0;
  var fu = 0;
  var cpu = parseFloat($('.copu').val());
  cpu = (cpu>0) ? (cpu) : (0);
  cantotal = (validnum(cantotal)) ? (cantotal*cpu) : (0);

  $('#alma_llegada tbody tr').each(function (index, value){
    padre = $(this);
    ids = parseInt(padre.attr('id'));

    if(ids>0) 
    {
      i_d_a = parseInt(padre.find('td.almace select.almaingreso').val());
      cant_ = parseInt(padre.find('td.canti input.catsubprod').val());
      vali_d = validnum(cant_);
      porct = "0.00";
      subt = "0.00";
      cantcu = "0.00";
      cp_p = "0.00";

      if(i_d_a>0 && vali_d>0)
      {
        fu = padre.find('td.arti input.fu_'+ids).val();
        cp_p = padre.find('td.arti input.cpun_'+ids).val();
        porct = (sum==0) ? (0) : ((cant_*fu)/sum);

        subt = (sum==0) ? (0) : ((cantotal*cant_*fu)/sum);

        subt = (subt==0) ? (0) : (subt);
        cantcu = (cant_!=0 && sum!=0) ? ((cantotal*fu)/(sum)) : (0);
        subtact = (sum==0) ? (0) : ((ct_act*cant_*fu)/sum);

        cantact = (cant_!=0 && sum!=0) ? ((ct_act*fu)/(sum)) : (0);
        padre.find('td.arti input.cuact_'+ids).val(cantact);
      }

      subt = parseFloat(subt);
      sumsubt = subt+sumsubt;
      porct = (validnum(porct)) ? (porct*100) : (0);
      porct = (porct!=0) ? (porct.toFixed(2)) : ('0.00');
      padre.find('td.factorporc span').html(porct);
      
      subt = (subt>0) ? (subt.toFixed(6)) : ("0.00");
      //padre.find('td.cp_t span').html(subt.toFixed(2));
      $('#costos_ts tbody tr#'+ids+' td.cp_t span').html(subt);
      padre.find('td.arti input.cpun_'+ids).val(cantcu);
      cantcu = (cantcu>0) ? (cantcu.toFixed(6)) : (cantcu);
      cantact = parseFloat(cantact);
      cantact = (cantact>0) ? (cantact.toFixed(6)) : ("0.00");
      subtact = (subtact>0) ? (subtact.toFixed(2)) : ("0.00");

      $('#costos_ts tbody tr#'+ids+' td.ct_acti span').html(subtact);
      $('#costos_us tbody tr#'+ids+' td.cu_acti span').html(cantact);
      var tpon_tot = parseFloat(subtact)+parseFloat(subt);
      var upon_tot = parseFloat(cantact)+parseFloat(cantcu);
      $('#costos_ts tbody tr#'+ids+' td.pon_tot span').html(tpon_tot.toFixed(2));
      $('#costos_us tbody tr#'+ids+' td.pon_tot span').html(upon_tot.toFixed(2));

      var tot_co_ts = 0;
      $('#costos_ts tbody tr td.pon_tot span').each(function (index, value){
        tot_co_ts = tot_co_ts + parseFloat($(this).html());
      });

      tot_co_ts = (tot_co_ts>0) ? (tot_co_ts.toFixed(2)) : ("0.00");
      $('#costos_ts tbody tr.totales td.tot_co_ts span').html(tot_co_ts);

      //padre.find('td.cp_u span').html(cantcu);
      $('#costos_us tbody tr#'+ids+' td.cp_u span').html(cantcu);

      sumsubt = (sumsubt==0) ? (0) : (sumsubt);
      $('#total').html(sumsubt.toFixed(2));
    }

  });
}

$(document).on('focusout', '.catsubprod', function (e) {

  var padre = $(this);
  var cant = padre.val(); //alerta('cantidad->'+cant);
  var valid = validnum(cant);
  var cantotal = $('.copu').val();

  if(valid) {
    var id = $(this).closest('tr').attr('id');
    var ialm = parseInt($('table#alma_llegada tr#'+id+' td.almace select.almaingreso').val());
    var validal = validnum(ialm);
    if(validal>0)
    {
      var c_u = parseFloat($('table#alma_llegada tr#'+id+' td.almace input.c_u_'+ialm).val()); 
      //alerta('costo_u->'+c_u);
      var old = parseFloat($('table#alma_llegada tr#'+id+' td.cp_t span').html());
      var tot = parseFloat($('b#total').html());

      $('table#alma_llegada tr#'+id+' td.arti input.cpun_'+id).val(c_u);

      var fu = parseFloat($('table#alma_llegada tr#'+id+' td.arti input.fu_'+id).val()); 
      //alerta('factoru->'+fu);
      var ft = cant*fu; 

      ft = (validnum(ft)) ? (ft.toFixed(2)) : ("0.00");

      $('table#alma_llegada tr#'+id+' td.factort span').html(ft);

      valores();
      padre.removeClass('erroinput');
    }
    else
    {
      $('table#costos_us tr#'+id+' td.cp_u span').html('0.00');
      $('table#costos_ts tr#'+id+' td.cp_t span').html('0.00');      
    }      

  }
  else {
    alerta('Error', 'Ingresar # Mayor a 0', 'error');
    padre.addClass('erroinput');
  }  

});

$(document).on('change', '.almapartida', function (e) {
  var ialm = parseInt($(this).val());
  var id = $(this).closest('tr').attr('id');
  var cant = parseInt($('#cantidad').val());
  var valorlote = parseFloat($('#valorlote').val());
  valorlote = (valorlote>0) ? (valorlote) : (0);
  if(ialm>0)
  {
    var ca_nti = parseFloat($('tr#'+id+' td.arti input.canti_'+id).val()); //console.log('can_nti->'+ca_nti);
    var c_u = parseFloat($('tr#'+id+' td.almace input.c_u_'+ialm).val());  //console.log('co_u->'+co_u);
    var old = parseFloat($('tr#'+id+' td.cp_t span').html());
    var tot = parseFloat($('b#total').html());

    $('tr#'+id+' td.arti input.cpun_'+id).val(c_u);

    ca_nti = parseFloat(ca_nti*(cant/valorlote));
    c_t = parseFloat(ca_nti*c_u);

    tot = tot + c_t - old;    

    ca_nti = (ca_nti>0) ? (ca_nti.toFixed(2)) : ("0.00");
    c_u = (c_u>0) ? (c_u.toFixed(6)) : ("0.00");
    c_t = (c_t>0) ? (c_t.toFixed(6)) : ("0.00");
    tot = (tot>0) ? (tot.toFixed(6)) : ("0.00");
    
    $('tr#'+id+' td.canti span').html(ca_nti);
    $('#costos_us tr#'+id+' td.cp_u span').html(c_u);
    $('#costos_ts tr#'+id+' td.cp_t span').html(c_t);
    $('b#total').html(tot);

    $(this).removeClass('erroinput');

    var cost_u = 0;
    var ca_ti = 0;
    var sum = 0;
    var padre = "";
    var ids = 0;

    $('#alma_partida tbody tr').each(function (index, value){
      padre = $(this);
      ids = parseInt(padre.attr('id'));

      if(ids>0) 
      { 
        ca_ti = padre.find('td.arti input.canti_'+ids).val();
        cost_u = padre.find('td.arti input.cpun_'+ids).val(); //console.log(ca_ti+'*'+cost_u);
        sum = sum + (ca_ti*(cant/valorlote))*cost_u;
      }
    });

    $('table#alma_llegada tbody tr td.almace input.copu').val(sum);
    sum = parseFloat(sum);
    var sum1 = (sum>0) ? (sum.toFixed(6)) : ("0.00");
    var sum2 = parseFloat(sum*(cant/valorlote));
    sum2 = (sum2>0) ? (sum2.toFixed(6)) : ("0.00");

    //$('table#costos_us tbody tr td.cp_u span').html(sum1);
    //$('table#costos_ts tbody tr td.cp_t span').html(sum2);

  }
  else
  {
    $('tr#'+id+' td.canti span').html('0.00');
    $('#costos_us tr#'+id+' td.cp_u span').html('0.00');
    $('#costos_ts tr#'+id+' td.cp_t span').html('0.00');

    var sum = 0;
    var canti = 0;
    $('#alma_partida tbody tr').each(function (index, value){
      padre = $(this);
      ids = parseInt(padre.attr('id'));

      if(ids>0 && id != ids) 
      { 
        ca_ti = padre.find('td.arti input.canti_'+ids).val();
        cost_u = padre.find('td.arti input.cpun_'+ids).val(); console.log(ca_ti+'*'+cost_u);
        sum = sum + (ca_ti*(cant/valorlote))*cost_u; console.log(sum);
      }
    });

    sum = (sum>0) ? (sum.toFixed(6)) : ("0.00");

    $('b#total').html(sum);

    $(this).addClass('erroinput');
    $('tr#'+id+' td.arti input.cpun_'+id).val('');
    $('table#alma_llegada tbody tr td.cp_t span').html(sum);
  }
});

$(document).on('change', '#id_salida', function (e) {
  var padre = $(this);
  var ialm = parseInt(padre.val());

  if(ialm>0)
  {
    var cp_u = padre.closest('tr').find('td.stock input.c_ppu_'+ialm).val();
    var sto = padre.closest('tr').find('td.stock input.sto_'+ialm).val(); console.log(sto);
    cp_u = (validnum(cp_u)==1) ? (cp_u) : (0);
    padre.closest('tr').find('td.almace input.copu').val(cp_u);

    sto = (validnum(sto)==1) ? (sto) : (0);

    var cp_t = cp_u*sto;
    cp_t = (validnum(cp_t)==1) ? (cp_t.toFixed(2)) : ("0.00");

    var canti = $('#cantidad').val();
    var sub_t = cp_u*canti;
    sub_t = (validnum(sub_t)==1) ? (sub_t.toFixed(2)) : ("0.00");

    $('#costos_us tr#'+id+' td.cp_u span').html(cp_u);
    $('#costos_ts tr#'+id+' td.cp_t span').html(cp_t);
    //padre.closest('tr').find('td.cp_u span').html(cp_u);
    //padre.closest('tr').find('td.cp_t span').html(cp_t);
    padre.closest('tr').find('td.stock span').html(sto);

    $('#alma_variante tbody tr td.cp_u span').html(cp_u);
    $('#alma_variante tbody tr td.cp_t span').html(sub_t); 
  }
  else
  {
    $('#costos_us tr#'+id+' td.cp_u span').html('0.00');
    $('#costos_ts tr#'+id+' td.cp_t span').html('0.00');
    padre.closest('tr').find('td.stock span').html('0.00');
    padre.closest('tr').find('td.almace input.copu').val('0.00');

    $('#alma_variante tbody tr td.cp_u span').html('0.00');
    $('#alma_variante tbody tr td.cp_t span').html('0.00');

        
  }
  valores();
});