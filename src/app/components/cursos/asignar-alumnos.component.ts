import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Alumno } from 'src/app/models/alumno';
import { Curso } from 'src/app/models/curso';
import { AlumnoService } from 'src/app/services/alumno.service';
import { CursoService } from 'src/app/services/curso.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-asignar-alumnos',
  templateUrl: './asignar-alumnos.component.html',
  styleUrls: ['./asignar-alumnos.component.css']
})
export class AsignarAlumnosComponent implements OnInit {

  curso: Curso;
  alumnosAsignar: Alumno[] = [];
  alumnos: Alumno[] = [];
  displayedColumns: string[] = ['nombre', 'apellido', 'seleccion'];
  displayedAlumnosColumns: string[] = ['id', 'nombre', 'apellido', 'email','eliminar'];
  tabIndex: number = 0;
 
  seleccion: SelectionModel<Alumno> = new SelectionModel<Alumno>(true, []);

  dataSource: MatTableDataSource<Alumno>;
  //injectar el componente hijo del front, para customizarlo
  @ViewChild(MatPaginator, {static:true}) paginator: MatPaginator;
  pageSizeOptions:number[]=[3,5,10,20,50];
  
  constructor(
    private route: ActivatedRoute,
    private cursoService: CursoService,
    private alumnoService: AlumnoService) {

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id: number = +params.get('id');
      this.cursoService.ver(id).subscribe(c => {
        this.curso = c;
        this.alumnos = this.curso.alumnos;
        this.initPaginator();
      });
    });
  }

  private initPaginator():void{
    this.dataSource= new MatTableDataSource<Alumno>(this.alumnos);
    this.dataSource.paginator= this.paginator;
    this.paginator._intl.itemsPerPageLabel='Registros por pagina';
  }
  
  public filtrar(nombre: string): void {
    nombre = nombre !== undefined ? nombre.trim() : '';
    //falta validar si fue seleccionado antes del nuevo keyup
    if (nombre !== '') {
      this.alumnoService.filtrarPorNombre(nombre)
        .subscribe(alumnos => this.alumnosAsignar = alumnos.filter(a => {
          let filtrar = true;
          this.alumnos.forEach(ca => {
            if (a.id === ca.id) {
              filtrar = false;
            }
          });
          return filtrar;
        }));
    }
  }

  public chekedAll(): boolean {
    const seleccionados = this.seleccion.selected.length;
    const numAlumnos = this.alumnosAsignar.length;
    return (seleccionados === numAlumnos);
  }

  public checkUncheckAll(): void {
    this.chekedAll() ? this.seleccion.clear() : this.alumnosAsignar.forEach(a => this.seleccion.select(a));
  }

  public asignar(): void {
    console.log('alumnos seleccionados->' + this.seleccion.selected);
    this.cursoService.asignarAlumnos(this.curso, this.seleccion.selected)
      .subscribe(c => {
        this.tabIndex = 2;
        Swal.fire('Asignados', `Alumnos asignados con exito al curso ${this.curso.nombre}`, 'success');
        this.alumnos = this.alumnos.concat(this.seleccion.selected);
        this.initPaginator();
        this.alumnosAsignar = [];
        this.seleccion.clear();
      },
        e => {
          if (e.status === 500) {
            const mensaje = e.message;
            this.seleccion.clear();
            if (mensaje.indexOf('org.springframework.dao.DataIntegrityViolationException')) {
              Swal.fire('Cuidado: ', `El alumno ya esta asignado a otro curso.`, 'error');
            }
          }
        });
  }

  public eliminarAlumno(alumno: Alumno): void{
    Swal.fire({
      title: 'Cuidado:',
      width: 400,
      text: `¿Seguro que quieres eliminar a ${alumno.nombre}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cursoService.eliminarAlumno(this.curso, alumno)
        .subscribe(curso =>{
          this.alumnos = this.alumnos.filter(a=> a.id!==alumno.id);
          this.initPaginator();
          Swal.fire('Eliminado: ', `Alumno ${alumno.nombre} eliminado correctamente del curso ${curso.nombre}.`, 'success');
        });
      }
    });   
  }

}
