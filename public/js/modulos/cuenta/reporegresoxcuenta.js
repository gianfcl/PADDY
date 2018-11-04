$( document ).ready(function() {

  $(function () {
    $('#datet1').datetimepicker({
      format: 'DD-MM-YYYY',
      locale: moment.locale('es')
    });
  });


  $('#datet2').datetimepicker({
    format: 'DD-MM-YYYY',
    locale: moment.locale('es'),
    useCurrent: false
  });

});

$(document).on('click', '.buscar', function () {
  
  var fecha_i =$('#f_inicio').val();
  var fecha_f =$('#f_fin').val();
  var tmov = $('#tmov_sele').val();
  var cuenta_s = $('#cuentaegreso_sele').val();
  var cuenta_l = $('#cuentallegada_sele').val();
  var personal = $('#pers_busc').val();

  var c = 0;
  var i = new Array();
  $('table#lista_provselected tr.prov').each(function(index,value){
    c++;
    i.push($(this).attr('id_prov'));
  })
  var proveedor = (!isNaN(parseInt(c)) && i.length>0) ? i.join() : null;

  var c = 0;
  var i = new Array();
  $('table#list_perselected tr.pers').each(function(index,value){
    c++;
    i.push($(this).attr('id_pers'));
  })
  var personal = (!isNaN(parseInt(c)) && i.length>0) ? i.join() : null;

  var tdoc = $('#tdoc_sele').val();
  var data = "";
  if(fecha_i)
  {
    data = data + '&fecha_i='+fecha_i;
  }
  if(fecha_f)
  {
    data = data + '&fecha_f='+fecha_f;
  }

  if(cuenta_s)
  {
    data = data + '&cuenta_salida='+cuenta_s;
  }
  if(cuenta_l)
  {
    data = data + '&cuenta_llegada='+cuenta_l;
  }
  if(tmov)
  {
    data = data + '&tmov='+tmov;
  }
  if(personal)
  {
    data = data + '&personal='+personal;
  }
  if(proveedor)
  {
    data = data + '&proveedor='+proveedor;
  }
  if(tdoc)
  {
    data = data + '&tdoc='+tdoc;
  }
  $.ajax({
    url: $('base').attr('href') + 'reporegresoxcuenta/buscar_registros',
    type: 'POST',
    data: data,
    dataType: "json",
    beforeSend: function() {
      $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});  
    },
    success: function(response) {
      if (response.code==1) 
      {                      
        $('#bodyindex').html(response.data);
        $('#filtro').modal('hide');          
      }
      else
      {
        alerta('Error','Hubo un error al intentar obtener los datos','error');
      }
    },
    complete: function() {
      
      $.LoadingOverlay("hide");
    }
  });
});

$("#datet1").on("dp.change", function (e) {
  $('#datet2').data("DateTimePicker").minDate(e.date);
});
$("#datet2").on("dp.change", function (e) {
  $('#datet1').data("DateTimePicker").maxDate(e.date);
});

$(document).on('click','.limpiar',function(){
  $('#filtro select').val('-1');
  $('#filtro .selectpicker').selectpicker('refresh');
  $('#filtro input[type="text"]').val('');
});

$(document).on('click', '.buscar_prov', function (e) {
  var page = 0;
  buscar_proveedor(page);
});

function buscar_proveedor(page)
{
  var nombres_com = $('tr#filtroprovee input.nombres_com').val(); 
  var razon_soc = $('tr#filtroprovee input.razon_soc').val();
  var ruc_dni = $('tr#filtroprovee input.ruc_dni').val();
  var i = new Array();
  var c = 0
  $('table#lista_provselected tr.prov').each(function(index,value){
    c++;
    i.push($(this).attr('id_prov'));
  })
  var i2 = (!isNaN(parseInt(c)) && i.length>0) ? i.join() : null;
  var temp = "page="+page;
  if(nombres_com.trim().length)
  {
    temp=temp+'&nombres_com='+nombres_com;
  }

  if(razon_soc.trim().length)
  {
    temp=temp+'&razon_soc='+razon_soc;
  }

  if(ruc_dni.trim().length)
  {
    temp=temp+'&ruc_dni='+ruc_dni;
  }
  if(i2)
  {
    temp=temp +'&w_not='+i2;
  }
  //console.log(temp);  
  $.ajax({
      url: $('base').attr('href') + 'reporegresoxcuenta/buscar_proveedor',
      type: 'POST',
      data: temp,
      dataType: "json",
      beforeSend: function() {
        $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
      },
      success: function(response) {
          if (response.code==1) {
            $('#buscar_provee tbody').html(response.data.rta);
            $('#paginacion_datap').html(response.data.paginacion);
          }
      },
      complete: function() {
        $.LoadingOverlay("hide");
      }
  });      
}

$(document).on('click','#filtroprovee .filtrar_prov',function(){
  buscar_proveedor(0);
});

$(document).on('click','.limpiarfiltro_prov',function(){
  $('#filtroprovee input[type="text"]').val('');
  buscar_proveedor(0);
});

$(document).on('click', '#paginacion_datap li.paginate_button', function (e) {  
  var page = $(this).find('a').attr('tabindex');
  buscar_proveedor(page);
});

$(document).on('click', '#paginacion_datap a.paginate_button', function (e) {  
  var page = $(this).attr('tabindex');
  buscar_proveedor(page);
});

$(document).on('click','.agre_provee',function(){
  var id_prov = $(this).parents('tr').attr('idproveedor');

  $.ajax({
      url: $('base').attr('href') + 'reporegresoxcuenta/add_filtro_prov',
      type: 'POST',
      data: 'id_prov='+id_prov,
      dataType: "json",
      beforeSend: function() {
        $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
      },
      success: function(response) {
        if (response.code==1) 
        {
          var r = response.data;
          //var i = ver_maxindice() +1;
          var id = r.id;
          var n_c = r.n_comercial;
          var r_z = r.raz_social; 
          var t_p = r.t_persona;
          var doc = r.ruc_dni;

          var text = armartd(id,n_c,r_z,t_p,doc);

          $('#lista_provselected tbody .default').remove();
          $('#lista_provselected tbody').append(text);
          buscar_proveedor(0);
        }
      },
      complete: function() {
        $.LoadingOverlay("hide");
      }
  });
});

function ver_maxindice()
{
  var c = 0;
  $('table#lista_provselected tr.prov').each(function(index,value){
    c++;
  })
  return parseInt(c);
}

function armartd(id,n_c,r_z,t_p,doc)
{
  var td1 = "<tr class='prov' id_prov='"+id+"' tipo_p='"+t_p+"'>";
  var td2 = "<td>"+n_c+"</td>";
  var td3 = "<td>"+r_z+"</td>";
  var td4 = "<td>"+doc+"</td>";
  var td5 = "<td><a class='btn btn-danger btn-xs delete_prov'><i aria-hidden='true' class='fa fa-trash'></i> Borrar</a></td></tr>";
  text = td1+td2+td3+td4+td5;
  return text;
}


$(document).on('click','.delete_prov',function(){
  $(this).parents('tr.prov').remove();
  buscar_proveedor(0);
});

$(document).on('click','.buscar_pers',function(){

});

$(document).on('change','#area_sele',function(){
  var id = $(this).val();
  $.ajax({
    url: $('base').attr('href') + 'reporegresoxcuenta/get_opt_puesto',
    type: 'POST',
    data: 'id='+id,
    dataType: "json",
    beforeSend: function() {
      $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
    },
    success: function(response) {
      if (response.code==1) 
      {
        $('#puesto_sele').html(response.data);
      }
    },
    complete: function() {
      $.LoadingOverlay("hide");
    }
  });
});

$(document).on('change','#puesto_sele',function(){
  var id = $(this).val();
  $.ajax({
    url: $('base').attr('href') + 'reporegresoxcuenta/get_opt_personal',
    type: 'POST',
    data: 'id='+id,
    dataType: "json",
    beforeSend: function() {
      $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
    },
    success: function(response) {
      if (response.code==1) 
      {
        $('#personal_sele').html(response.data);
      }
    },
    complete: function() {
      $.LoadingOverlay("hide");
    }
  });
});

$(document).on('click','.add_personal',function(){
  var id = $('#personal_sele').val();
  if(id)
  {
    $.ajax({
      url: $('base').attr('href') + 'reporegresoxcuenta/get_persona',
      type: 'POST',
      data: 'id='+id,
      dataType: "json",
      beforeSend: function() {
        $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
      },
      success: function(response) {
        if (response.code==1) 
        {
          $('#area_sele').val('');
          $('#puesto_sele').html('');
          $('#personal_sele').html('');
          var r = response.data;
          var id = r.id;
          var n = r.persona;
          var a_p = r.areapuesto;
          var p = r.puesto;
          var text = armartd2(id,n,a_p,p);
          $('#list_perselected tbody .default').remove();
          $('#list_perselected tbody').append(text);
        }
      },
      complete: function() {
        $.LoadingOverlay("hide");
      }
    });
  }
  else
  {
    alerta('Debe Seleccionar','un personal!!!','error');
  }
});

function armartd2(id,n,a_p,p)
{
  var td1 = "<tr class='pers' id_pers='"+id+"' >";
  var td2 = "<td>"+a_p+"</td>";
  var td3 = "<td>"+p+"</td>";
  var td4 = "<td>"+n+"</td>";
  var td5 = "<td><a class='btn btn-danger btn-xs delete_personal'><i aria-hidden='true' class='fa fa-trash'></i> Borrar</a></td></tr>";
  text = td1+td2+td3+td4+td5;
  return text;
}

$(document).on('click','.delete_personal',function(){
  $(this).parents('tr').remove();
});