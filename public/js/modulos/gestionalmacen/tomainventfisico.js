$( document ).ready(function() {

  

});

function buscar()
{
  var id_al = parseInt($('#id_almacen').val());
  var idtipo = $('ul#myTab li.active a').attr('id'); //console.log(idtipo);
  idtipo = idtipo.replace("-tab","");

  var id_g = parseInt($('#id_grupo').val());
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
  
  var url = $('#linkmodulo').attr('url');
  
  id_g = (id_g>0) ? (id_g) : ("-");
  id_f = (id_f>0) ? (id_f) : ("-");
  id_s = (id_s>0) ? (id_s) : ("-");

  id_z = (id_z>0) ? (id_z) : ("-");
  id_ar = (id_ar>0) ? (id_ar) : ("-");
  id_ub = (id_ub>0) ? (id_ub) : ("-");
  idfrecu = (idfrecu>0) ? (idfrecu) : ("-");  
  var txt_titulo = $('#txt_titulo').val();

  switch(idtipo)
  {
    case '1':
      var id_tomainventfisico = $('#id_tomainventfisico').val();
      var temp = 'id_tomainventfisico='+id_tomainventfisico+'&txt_titulo='+txt_titulo+'&tipofiltro='+idtipo+'&id_almacen='+id_al+'&estado=2&id_tipomovimiento='+$('#id_tipomovimiento').val();

      if(id_z!="-" || id_g!="-" || idfrecu!="-")
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
        console.log(temp);
        console.log(url);
        save_tomainventfisico(url,temp);
        window.location.href = url+'/add/'+id_al+'/'+idtipo+'/'+id_z+'/'+id_ar+'/'+id_ub+'/'+id_g+'/'+id_f+'/'+id_s+'/'+idfrecu+'/'+es_inr+'/'+es_r +'/'+es_sub+'/'+ge_sub+'/-';
      } else
      {
        alerta('No Busco', 'Tiene que seleccionar', 'error'); 
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

      url = '/add/'+id_al+'/'+idtipo+'/'+id_z+'/'+id_ar+'/'+id_ub+'/'+id_g+'/'+id_f+'/'+id_s+'/'+idfrecu+'/'+es_inr+'/'+es_r +'/'+es_sub+'/'+ge_sub;
      var temp = 'tipofiltro='+idtipo+'&id_almacen='+id_al+'&estado=1&id_tipomovimiento='+$('#id_tipomovimiento').val();
      if($('div#tab_content2 div.bootstrap-tagsinput span.tag').length)
      { 
        url = url+'/1'
        temp = temp+'&id_arti='+get_joinids();
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