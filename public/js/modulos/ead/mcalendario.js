$( document ).ready(function() {

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid",
      ignore: ""
    });

    $.post($('base').attr('href')+'mcalendario/get_sesiones', function(data){
      $('#calendar').fullCalendar({
        header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month,agendaWeek,agendaDay,listWeek'
        },
        defaultView: 'agendaWeek',
        defaultDate: moment(),
        navLinks: true, // can click day/week names to navigate views
        locale: 'es',
        eventLimit: true, // allow "more" link when too many events
        events: $.parseJSON(data)
      })
    });
});

