<?php
  $menu_padre = (isset($mostrar['menu_padre']) && strlen(trim($mostrar['menu_padre']))>0) ? ($mostrar['menu_padre']) : ("");
  $nombre_modulo = (isset($mostrar['menu']) && strlen(trim($mostrar['menu']))>0) ? ($mostrar['menu']) : ("");
  $icon_modulo = (isset($mostrar['icon']) && strlen(trim($mostrar['icon']))>0) ? ($mostrar['icon']) : ("");
  $url_modulo = (isset($mostrar['url']) && strlen(trim($mostrar['url']))>0) ? ( ($mostrar['url']=="index") ? ("") :($mostrar['url']) ) : ("");  
  $mod_title = (isset($mod_title) && strlen(trim($mod_title))>0) ? ($mod_title) : ("");
?>
<!-- page content -->
      <div class="right_col" role="main">
        <div class="">
          <div class="page-title">
            <div class="title_left">
              <h3></h3>
            </div>
          </div>
          <div class="clearfix"></div>
          <div class="row">
            <div class="col-md-12 col-sm-12 col-xs-12">
              <div class="x_panel">
                <div class="x_title">
                  <h3><i class="fa <?php echo $icon_modulo; ?>"></i> <?php echo $nombre_modulo;?> <small>Mantenimiento</small></h3>
                  <ul class="nav navbar-right panel_toolbox">
                    <li><a class="collapse-link"><i class="fa fa-chevron-up"></i></a>
                    </li>
                    <li class="dropdown">
                      <a href="javascript:void(0);" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"><i class="fa fa-wrench"></i></a>                      
                    </li>
                    <li><a class="close-link"><i class="fa fa-close"></i></a>
                    </li>
                  </ul>
                  <div class="clearfix"></div>
                </div>

                <div class="clearfix"></div>
                <div class="row x_title1">
                  <div class="col-md-6 col-sm-6 col-xs-12"><h2><?php echo $mod_title;?></h2></div>
                  <div class="col-md-6 col-sm-6 col-xs-12">
                    <div class="btn-group pull-right"><a class="btn btn-primary add_activofijo btn-sm" data-toggle="modal" data-target="#editactivofijo" href="javascript:void(0);"><i class="fa fa-file"></i> Nuevo</a></div> 
                  <div class="clearfix"></div>
                  </div>
                </div>

                <div class="row">
                  <div class="x_content">
                    <div class="row">
                      <div class="col-md-12 col-sm-12 col-xs-12">
                        <p class="text-muted font-13 m-b-30"></p>
                        <div class="table-responsive">
                          <table id="datatable-buttons" class="table table-striped table-bordered dt-responsive nowrap dataTable no-footer dtr-inline">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Descripción</th>
                            <th>marcaaf</th>
                            <th>Número de Serie</th>
                            <th>grupoaf</th>
                            <th>familiaaf</th>
                            <th>Sub familiaaf</th>
                            <th></th>
                           </tr>
                            <tr id="filtro">
                              <td></td>
                              <td>
                                <input id="descripcion_busc" type="text" class="form-control" aria-describedby="descripción" placeholder="Descripción">
                              </td>
                              <td>
                                <input id="marcaaf_index" type="text" class="form-control" aria-describedby="marcaf" placeholder="marcaaf ">
                              </td>
                              <td>
                                <input id="nro_serie_index" type="text" class="form-control" aria-describedby="nro_serie" placeholder="Número de Serie">
                              </td>
                              <td>
                                <select id="idgrupoaf" class="form-control">
                                    <?php
                                      if (!empty($all_grupoaf)) {
                                        echo $all_grupoaf;
                                      }
                                    ?>
                                    
                                </select>
                              </td>
                              <td>
                                <select id="idfamil" class="form-control">
                                    <option value="">familiaaf</option>
                                </select>
                                </td>
                              <td>

                                <select id="idsubfa" class="form-control">
                                    <option value="">Subfamiliaaf</option>
                                </select>                      
                              </td>

                              <td>
                                <a href="javascript:void(0);" class="btn btn-default buscar btn-sm"> <i class="fa fa-search"></i></a> <a href="javascript:void(0);" class="btn btn-default btn-sm limpiarfiltro"><i class="fa fa-refresh"></i></a>
                              </td>
                          </tr>
                        </thead>
                        <tbody id="bodyindex">
  <?php if(isset($rta)) { echo $rta; } ?>                          
                            </tbody>
                          </table>
                        <div class="table-responsive">
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-12">
                        <div class="btn-group pull-right" id="paginacion_data">
                          <?php if(isset($paginacion)) {echo $paginacion;} ?>                        
                        </div> 
                      </div>
                    </div> 
                  </div>
                </div>
              </div>
            </div>
      </div>
      <!-- /page content -->
<?php if(isset($modal)) {echo $modal;} ?>      