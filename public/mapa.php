
<!DOCTYPE html>
<html>
  <head>
    <title>Simple Map</title>
    <meta name="viewport" content="initial-scale=1.0">
    <meta charset="utf-8">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
    <script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDtdc3szojpiBnmUe3QCrFuHI6KJ2ufdXs&libraries=places"></script>
    <link rel="StyleSheet" href="stylesheets/style.css" type="text/css">
  </head>
  <body>
    <form id="formPoints">
      <input id="point1" class="controls" type="text" placeholder="Elige un punto de partida"><br>
      <input id="point2" class="controls" type="text" placeholder="Elige un destino"><br>
      <input type="button" id="buttonAdd" class="disabled" value="+"><br>
      <!-- <input type="button" id="buttonOptimate" class="disabled" value="Optimizar"> -->
    </form>
    <div id="panel">
<style type="text/css">
    #panel{
      
    }
</style>
      <p>Total Distance: <span id="total"></span></p>
    </div>
    <div id="map"></div>
    <script src="javascripts/map.js"></script>
  </body>
</html>
<!--AIzaSyCGGKKMlvsv5n-Dpk7cyxpqPwxIRyWIG7o --Api de andres
AIzaSyDY1TOXc0sHvJlrEzyPvGSpqzdU3H-9-Uk -- Api de Bryan-->
