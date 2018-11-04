$( document ).ready(function() {

  $('#fecha_ingreso').datetimepicker({
    format: 'DD-MM-YYYY',
    minDate: moment(),
    locale: moment.locale("es")
  });
});

function buscar()
{
  var id_al = $('#id_almacen').val();
  var id_tomainventfisico = $('#id_tomainventfisico').val();
  var idtipo = $('ul#myTab li.active a').attr('id'); //console.log(idtipo);
  idtipo = idtipo.replace("-tab","");

  var fec = $('#fecha_ingreso').val();
  var idope = parseInt($('#id_operario').val());
  var id_g = parseInt($('#id_grupo').val()); //alert(id_g)
  var id_f = parseInt($('#id_familia').val());
  var id_s = parseInt($('#id_subfamilia').val());

  var es_inr = "-";
  var es_r = "-";
  var es_sub = "-";
  var ge_sub = "-";

  var id_z = parseInt($('#id_zona').val());
  var id_ar = parseInt($('#id_area').val());
  var id_ub = parseInt($('#id_ubicacion').val());
  var idfrecu = parseInt($('#id_frecu').val());

  var txt_titulo = $('#txt_titulo').val();

  var ids = "-";
  var url = "";

  if(id_al>0 && fec.trim().length && idope>0)
  {
    //Estado 0 Programación
    fe_in = datetoing(fec);
    var temp = 'id_tomainventfisico='+id_tomainventfisico+'&txt_titulo='+txt_titulo+'&tipofiltro='+idtipo+'&id_almacen='+id_al+'&fecha_ingreso='+fe_in+'&estado=2&id_tipomovimiento='+$('#id_tipomovimiento').val()+'&id_operario='+idope;
    
    switch(idtipo)
    {
      case '1':
        if(id_z>0 || id_g>0 || idfrecu>0)
        {
          if($('#esinsumoreceta').is(":checked"))  {
            es_inr = 1;
            temp = temp+'&filtro_es_insumo_receta='+es_inr;
          }
          if($('#es_receta').is(":checked"))  {
            es_r = 1;
            temp = temp+'&filtro_es_receta='+es_r;
          }
          if($('#es_subproducto').is(":checked"))  {
            es_sub = 1;
            temp = temp+'&filtro_es_sub_producto='+es_sub;
          }
          if($('#generasubsubproducto').is(":checked"))  {
            ge_sub = 1;
            temp = temp+'&filtro_genera_sub_producto='+ge_sub;
          }

          if(id_z>0)
          {
            temp = temp+'&id_zona='+id_z;
            if(id_ar>0)
            {
              temp = temp+'&id_area='+id_ar;
              if(id_ub>0)
              {
                temp = temp+'&id_ubicacion='+id_ub;
              }
            }
          }

          if(id_g>0)
          {
            temp = temp+'&id_grupo='+id_g; //alert(temp)
            if(id_f>0)
            {
              temp = temp+'&id_familia='+id_f;
              if(id_s>0)
              {
                temp = temp+'&id_subfamilia='+id_s;
              }
            }
          }

          if(idfrecu>0)
          {
            temp = temp+'&id_frecu='+idfrecu;
          }

          id_g = (id_g>0) ? (id_g) : ("-");
          id_f = (id_f>0) ? (id_f) : ("-");
          id_s = (id_s>0) ? (id_s) : ("-");

          id_z = (id_z>0) ? (id_z) : ("-");
          id_ar = (id_ar>0) ? (id_ar) : ("-");
          id_ub = (id_ub>0) ? (id_ub) : ("-");
          idfrecu = (idfrecu>0) ? (idfrecu) : ("-");

          url = '/ver/'+id_al+'/'+idtipo+'/'+id_z+'/'+id_ar+'/'+id_ub+'/'+id_g+'/'+id_f+'/'+id_s+'/'+idfrecu+'/'+es_inr+'/'+es_r +'/'+es_sub+'/'+ge_sub+'/'+ids;

          save_tomainventfisico(url,temp);
        }
        else
        {
          alerta('No Creó', 'Tiene que seleccionar', 'error');
        }          

      break;

      case '2':
        id_g = "-";
        id_f = "-";
        id_s = "-";

        id_z = "-";
        id_ar = "-";
        id_ub = "-";
        idfrecu = "-";
        url = '/ver/'+id_al+'/'+idtipo+'/'+id_z+'/'+id_ar+'/'+id_ub+'/'+id_g+'/'+id_f+'/'+id_s+'/'+idfrecu+'/'+es_inr+'/'+es_r +'/'+es_sub+'/'+ge_sub;
        if($('div#tab_content2 div.bootstrap-tagsinput span.tag').length)
        {
          temp = temp+'&id_arti='+get_joinids();
          url = url+'/1';
          save_tomainventfisico(url,temp);
        }
        else
        {
          alerta('No Guardo', 'Tiene que seleccionar', 'error');
        }
      break;

      default:
      break;
    }
  }  
  else
  {
    alerta('Error', 'Tiene que seleccionar', 'error');
  }
}

$(document).on('click', '.editar', function (e) {
  var id = $(this).parents('tr').attr('iddocumento');
  $.ajax({
    url: $('base').attr('href') + 'revtomainventfisico/editar',
    type: 'POST',
    data: 'id_tomainventfisico='+id,
    dataType: "json",
    beforeSend: function() {
      $("#bodyindex").LoadingOverlay("show", {image : "", fontawesome : "fa fa-spinner fa-spin"});
    },
    success: function(response) {
      if (response.code==1) {
        if(response.data.estado==2)
        {
          limpiando();
          $('div#tab_content2 #tagsinput').html('');
          abrirnmodal(true,'edittomainventfisico');
          $('#myTab a#'+response.data.tipofiltro+'-tab').tab('show');
          $('#id_almacen').val(response.data.filtro_almacen);
          $('#subti').html(response.data.almacen);
          $('#id_operario').val(response.data.id_operario);
          $('#fecha_ingreso').val(response.data.fecha_ingreso);
          $('#id_tomainventfisico').val(response.data.id_tomainventfisico);
          $('#id_zona').val(response.data.id_zona);
          $('#id_area').html(response.data.all_area);
          $('#id_ubicacion').html(response.data.all_ubi);
          $('#txt_titulo').val(response.data.txt_titulo);
          $('#id_grupo').val(response.data.filtro_grupo);
          $('#id_familia').html(response.data.all_fam);
          $('#id_subfamilia').html(response.data.all_subfam);

          var va = parseInt(response.data.filtro_es_insumo_receta);
          va = va==1 ? true : false;
          $('#esinsumoreceta').prop('checked', va);

          va = parseInt(response.data.filtro_es_receta);
          va = va==1 ? true : false;
          $('#es_receta').prop('checked', va);

          va = parseInt(response.data.filtro_es_sub_producto);
          va = va==1 ? true : false;
          $('#es_subproducto').prop('checked', va);

          va = parseInt(response.data.filtro_genera_sub_producto);
          va = va==1 ? true : false;
          $('#generasubsubproducto').prop('checked', va);


          $('#id_frecu').val(response.data.filtro_id_frecuenciainventfisico);
          var inhtml = response.data.id_art;
          var id = response.data.id;
          var no = response.data.no;

          var clas = "";
          var desc = ""
          var html = "";

          for (var x in id) {
            clas = (x%2 == 1) ? ('success') : ('primary');
            desc = no[x]; //alert(desc)
            html += "<span class='tag label label-"+clas+"' id='"+id[x]+"'>"+desc+"<span data-role='remove' class='delarti'></span></span>";
          }
          $('div#tab_content2 #tagsinput').html(html)
          buscar_articulos(0);
        }
        else
        {
          buscarbandeja(0);
          alerta('error','No Pudo Editar','No es Programado');
        }
          
      }
    },
    complete: function() {
      $("#bodyindex").LoadingOverlay("hide");
    }
  });
});