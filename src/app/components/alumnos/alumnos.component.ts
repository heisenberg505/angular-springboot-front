import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { BASE_ENDPOINT } from '../../config/app';
import { Alumno } from 'src/app/models/alumno';
import { AlumnoService } from 'src/app/services/alumno.service';
import Swal from 'sweetalert2';
import { CommonListarComponent } from '../common-listar.component';

@Component({
  selector: 'app-alumnos',
  templateUrl: './alumnos.component.html',
  styleUrls: ['./alumnos.component.css']
})
export class AlumnosComponent 
extends CommonListarComponent<Alumno, AlumnoService> implements OnInit {

  baseEndPoint = BASE_ENDPOINT+'/alumnos';
  constructor(service: AlumnoService) { 
    super(service);
    this.titulo = 'Listado de Usuarios';
    this.nombreModel ="Alumnos";
  }

}
