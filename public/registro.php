<?php
$fec = Date('d-m-Y H:i:s');
$fec_n = Date('Y-m-d');
?>
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
<div class="modal fade modal-dialog-centered" id="hacer_registro" tabindex="-1" role="document" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h4 class="modal-title" style="color: black;">Formulario</h4>
      </div>
      <div class="modal-body" style="color: black;">
        <div class="container-fluid">
            <form class="form-horizontal" id="form_nuevoingreso" name="formnuevoingreso" role="form">
              <div class="form-group">
                <label for="codigo" class="control-label col-md-3 col-sm-3 col-xs-12">Fecha: </label>
                <div class="col-md-6 col-sm-6 col-xs-12">
                  <input type="" name="fecha_hoy" id="fecha_hoy" class="form-control-sm" readonly="" value="<?php echo $fec; ?>">
                </div>
              </div>

              <div class="form-group">
                <label for="docu_usu" class="control-label col-md-3 col-sm-3 col-xs-12">DNI: </label>
                <div class="col-md-6 col-sm-6 col-xs-12">
                  <input type="" class="form-control-sm" name="docu_usu" id="docu_usu" aria-describedby="docu_usu" placeholder="DOCU">
                </div>
              </div>

              <div class="form-group">
                <label for="nombres" class="control-label col-md-3 col-sm-3 col-xs-12">Nombres: </label>
                <div class="col-md-6 col-sm-6 col-xs-12">
                  <input type="" class="form-control-sm" name="nombres" id="nombres" aria-describedby="nombres" placeholder="Nombres">
                </div>
              </div>

              <div class="form-group">
                <label for="nombres" class="control-label col-md-3 col-sm-3 col-xs-12">Apellido: </label>
                <div class="col-md-6 col-sm-6 col-xs-12">
                  <input type="" class="form-control-sm" name="apellidos" id="apellidos" aria-describedby="apellidos" placeholder="Apellidos">
                </div>
              </div>

              <div class="form-group">
                <label for="clave" class="control-label col-md-3 col-sm-3 col-xs-12">Clave: </label>
                <div class="col-md-6 col-sm-6 col-xs-12">
                  <input type="" class="form-control-sm" name="clave" id="clave" aria-describedby="clave" placeholder="Clave">
                </div>
              </div>

              <div class="form-group">
                <label for="fecha_naci" class="control-label col-md-3 col-sm-3 col-xs-12">Fecha de Nacimiento: </label>
                <div class="col-md-6 col-sm-6 col-xs-12">
                  <input type="" name="fecha_naci" id="fecha_naci" class="form-control-sm" value="<?php echo $fec_n; ?>" placeholder="YYYY/mm/dd" >
                </div>
              </div>

              <div class="form-group">
                <label for="dni" class="control-label col-md-3 col-sm-3 col-xs-12">Correo: </label>
                <div class="col-md-6 col-sm-6 col-xs-12">
                  <input type="" class="form-control-sm" name="correo" id="correo" aria-describedby="correo" placeholder="micorreo@gmail.com">
                </div>
              </div>
              <!-- /.form-group -->

              <div class="clearfix"><p>&nbsp;</p></div>
              <div class="btn-toolbar" style="margin-right: 3%;">
                  <div class="btn-group pull-right">
                      <button type="button" class="btn btn-success registrar_datos btn-submit btn-sm">
                        <span class="hide-on-phones"></span>Guardar</button>
                  </div>
                  <div class="btn-group pull-right">
                      <button type="button" class="btn btn-success btn-submit btn-sm">
                        <span class="hide-on-phones"></span>Cancelar</button>
                  </div>
              </div>
              <!-- /.btn-toolbar -->
            </form>
        </div>
      </div>
      <div class="modal-footer"></div>
    </div>
  </div>
</div>