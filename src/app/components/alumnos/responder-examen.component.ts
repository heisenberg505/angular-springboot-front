import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Alumno } from 'src/app/models/alumno';
import { Curso } from 'src/app/models/curso';
import { Examen } from 'src/app/models/examen';
import { Respuesta } from 'src/app/models/respuesta';
import { AlumnoService } from 'src/app/services/alumno.service';
import { CursoService } from 'src/app/services/curso.service';
import { RespuestaService } from 'src/app/services/respuesta.service';
import Swal from 'sweetalert2';
import { ResponderExamenModalComponent } from './responder-examen-modal.component';
import { VerExamenModalComponent } from './ver-examen-modal.component';

@Component({
  selector: 'app-responder-examen',
  templateUrl: './responder-examen.component.html',
  styleUrls: ['./responder-examen.component.css']
})
export class ResponderExamenComponent implements OnInit {
  alumno: Alumno;
  curso: Curso;
  examenes: Examen[] = [];
  displayedExamenesColumns = ['id', 'nombre', 'asignaturas', 'preguntas', 'responder', 'ver','eliminar'];

  dataSource: MatTableDataSource<Examen>;
  //injectar el componente hijo del front, para customizarlo
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  pageSizeOptions: number[] = [3, 5, 10, 20, 50];

  constructor(private route: ActivatedRoute,
    private alumnoService: AlumnoService,
    private cursoService: CursoService,
    private respuestaService: RespuestaService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = +params.get('id');
      this.alumnoService.ver(id).subscribe(alumno => {
        this.alumno = alumno;
        this.cursoService.obtenerCursoByAlumnoId(this.alumno).subscribe(curso => {
          this.curso = curso;
          this.examenes = (curso && curso.examenes) ? curso.examenes : [];
          this.initPaginator();
        });
      });
    });
  }

  private initExamenes(alumno: Alumno): void {
    this.cursoService.obtenerCursoByAlumnoId(this.alumno).subscribe(curso => {      
      this.examenes = (curso && curso.examenes) ? curso.examenes : [];
    });
  }

  private initPaginator(): void {
    this.dataSource = new MatTableDataSource<Examen>(this.examenes);
    this.dataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = 'Registros por pagina';
  }

  public responderExamen(examen: Examen): void {
    const modalRef = this.dialog.open(ResponderExamenModalComponent, {
      width: '500px',
      data: {
        curso: this.curso,
        alumno: this.alumno,
        examen: examen
      }
    });

    modalRef.afterClosed().subscribe((respuestasMap: Map<number, Respuesta>) => {
      //console.log('se envian datos y se cierra modal');
      //console.log(respuestasMap);
      if (respuestasMap) {
        const respuestas: Respuesta[] = Array.from(respuestasMap.values());
        this.respuestaService.crear(respuestas).subscribe(rs => {
          examen.respondido = true;
          Swal.fire('Enviadas:', 'Preguntas enviadas con exito', 'success');
          console.log(rs);
        });
      }
    });
  }

  public verExamen(examen: Examen): void {
    this.respuestaService.obtenerRespuestasPorAlumnoPorExamen(this.alumno, examen)
      .subscribe(rs => {
        const modalRef = this.dialog.open(VerExamenModalComponent, {
            width: '500px',
            data: {
              curso: this.curso,              
              examen: examen,
              respuestas: rs
            }
          });
          console.log(rs);
          modalRef.afterClosed().subscribe(()=>{
            console.log('Modal verExamen cerrado.');
          });
      });
  }

  public eliminarRespuestas(examen: Examen): void{
    Swal.fire({
      title: 'Cuidado:',
      width: 400,
      text: `¿Seguro que quieres eliminar las respuestas del examen ${examen.nombre}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.respuestaService.eliminarRespuestas(this.alumno, examen)
        .subscribe(()=>{
          //cambia el valor de este examen en el front
          examen.respondido = false;
          console.log(examen);
          //no es necesario actualizar los examenes, las respuestas solo sirven en la vista de responder examen
          //this.initExamenes(this.alumno);
          
          Swal.fire('Eliminado: ', `Respuestas del Examen ${examen.nombre} eliminadas correctamente.`, 'success');
        });
      }
    });   
  }
}
