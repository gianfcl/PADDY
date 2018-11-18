<?php
$fec = Date('d-m-Y H:i:s');
$fec_n = Date('Y-m-d');
?>
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
  <script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script>
<div class="modal fade" id="hacer_registro_emp" tabindex="-1" role="document" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" data-backdrop="false" aria-hidden="true">&times;</button>
        <h4 class="modal-title" style="color: black;">Formulario</h4>
      </div>
      <div class="modal-body">
        <div class="container-fluid">
            <form class="form-horizontal" id="form_nuevoingreso_emp" name="formnuevoingreso_emp" role="form" style="color: black;">
              <div class="form-group">
                <label for="fecha_hoy_emp" class="control-label col-md-3 col-sm-3 col-xs-12">Fecha Registro: </label>
                <div class="col-md-6 col-sm-6 col-xs-12">
                  <input type="" name="fecha_hoy_emp" id="fecha_hoy_emp" class="form-control-sm" readonly="" value="<?php echo $fec; ?>">
                </div>
              </div>

              <div class="form-group">
                <label for="docu_usu_emp" class="control-label col-md-3 col-sm-3 col-xs-12">RUC: </label>
                <div class="col-md-6 col-sm-6 col-xs-12">
                  <input type="" class="form-control-sm" name="docu_usu_emp" id="docu_usu_emp" aria-describedby="docu_usu_emp" placeholder="RUC">
                </div>
              </div>

              <div class="form-group">
                <label for="nombres_emp" class="control-label col-md-3 col-sm-3 col-xs-12">Nombre: </label>
                <div class="col-md-6 col-sm-6 col-xs-12">
                  <input type="" class="form-control-sm" name="nombres_emp" id="nombres_emp" aria-describedby="nombres_emp" placeholder="Nombres">
                </div>
              </div>

              <div class="form-group">
                <label for="clave_emp" class="control-label col-md-3 col-sm-3 col-xs-12">Clave: </label>
                <div class="col-md-6 col-sm-6 col-xs-12">
                  <input type="" class="form-control-sm" name="clave_emp" id="clave_emp" aria-describedby="clave" placeholder="Clave">
                </div>
              </div>

              <div class="form-group">
                <label for="correo_emp" class="control-label col-md-3 col-sm-3 col-xs-12">Correo: </label>
                <div class="col-md-6 col-sm-6 col-xs-12">
                  <input type="" class="form-control-sm" name="correo_emp" id="correo_emp" aria-describedby="correo_emp" placeholder="micorreo@gmail.com">
                </div>
              </div>
              <!-- /.form-group -->

              <div class="clearfix"><p>&nbsp;</p></div>
              <div class="btn-toolbar" style="margin-right: 3%;">
                  <div class="btn-group pull-right">
                      <button type="button" class="btn btn-success registrar_datos_emp btn-submit btn-sm">
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