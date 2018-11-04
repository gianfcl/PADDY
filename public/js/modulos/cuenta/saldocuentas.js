$(document).ready(function(){
	$("#buscarsaldo").modal("show");
});

$(document).on('click', '.buscar', function () {
var moneda_busc = ($('#moneda_busc').val()) ? $('#moneda_busc').val().join() : " ";
var tipocue = ($('#tipocue').val()) ? $('#tipocue').val().join() : null;
var estarje = ($('#estarje').val()) ? $('#estarje').val().join() : null;
var param = 'moneda_busc='+moneda_busc;
param+= '&tipocue='+tipocue;
if (tipocue == 'Efectivo') {
  param += '&es_efectivo='+1;
}else if (tipocue=='Bancario') {
  var id_provbanco = $('#bancos').val();
  if (id_provbanco) {
  param += '&id_provbanco='+id_provbanco;  
  }
}
if (estarje=='SI') {
var tip_tarje = (parseInt($("#tip_tarje").val())) ? parseInt($("#tip_tarje").val()) : null;
param += '&id_tarjeta='+tip_tarje;
}
console.log(param);
$.ajax({
    url: $('base').attr('href') + 'saldocuentas/get_saldocuentas',
    type: 'POST',
    data: param,
    dataType: "json",
    beforeSend: function() {
      $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
    },
    success: function(response) {
      if (response.code==1) {
        $("#bodyindex").html(response.data);
      }
      else
      {
        limpiarform();
      }
    },
    complete: function() {
      $.LoadingOverlay("hide");
      $('#buscarsaldo').modal("hide");
    }
  });
});

$(document).on('change','select#tipocue',function(){ 
   var t= $(this).val();
   var temp = [];
   var moneda_busc = $('#moneda_busc').val();
   temp=temp+'&moneda_busc='+moneda_busc;
  if (t=='Bancario'){
    $('#banco').removeAttr('hidden');
    $('#tarjeta_es').removeAttr('hidden');
    $('#cuen_esht').removeAttr('hidden');
    $('#cuen_es').removeAttr('hidden');
    $('#tar_es').removeAttr('hidden');
    $('#tar_esht').removeAttr('hidden');
  }else if(t==null){$('#banco').attr("hidden",'hidden');}
  if (t=='Efectivo'){
    $('#tarjeta_es').attr("hidden",'hidden');
   	$('#banco').attr("hidden",'hidden');
    $('#cuen_esht').attr("hidden",'hidden');
    $('#cuen_es').attr("hidden",'hidden');
    $('#tar_es').attr("hidden",'hidden');
    $('#tar_esht').attr("hidden",'hidden');
   	var es_efectivo = 1;
    temp=temp+'&es_efectivo='+es_efectivo;   
   }else{}
   //console.log(temp);
   if (moneda_busc && !es_efectivo) {    
   $.ajax({
      url: $('base').attr('href') + 'saldocuentas/buscar_bancos',
      type: 'POST',
      data: temp,
      dataType: "json",
      beforeSend: function() {
      },
      success: function(response) {
        if (response.code==1){
          $("#bancos").html(response.data);
        }
      },
      complete: function() {
      }
    });   	
   }
});

$(document).on('change','select#estarje',function(){ 
  var t= $(this).val();
  if (t=='SI'){
  $('#tarjeta').removeAttr('hidden');
  }else{
    $('#tarjeta').attr("hidden",'hidden');
  }
});