$('.edit').on('ifChanged', function(event){
  $(event.target).trigger('change');
});

$(document).on('change','.edit',function(){
  var t = $(this);
  var estd = t.is(':checked') ? 1 : 0;
  var id = parseInt(t.val())>0 ? t.val() : 0;
  var cv = t.attr('cv');
  if(cv>0)
  {
    var iable = 'id='+id+'&cv='+cv+'&estd='+estd;
    $.ajax({
      url: $('base').attr('href') + 'canalventaxempr/save_config',
      type: 'POST',
      data: iable,
      dataType: "json",
      beforeSend: function() {
        $.LoadingOverlay("show", {image: "", fontawesome : "fa fa-spinner fa-spin"});
      },
      success: function(response) {
        if (response.code==1) {
          t.val(response.data.id);
        }
      },
      complete: function() {
        $.LoadingOverlay("hide");
      }
    });
  }
});