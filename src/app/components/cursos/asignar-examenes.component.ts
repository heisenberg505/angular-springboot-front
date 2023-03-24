import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Curso } from 'src/app/models/curso';
import { Examen } from 'src/app/models/examen';
import { CursoService } from 'src/app/services/curso.service';
import { ExamenService } from 'src/app/services/examen.service';
import {map, flatMap} from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-asignar-examenes',
  templateUrl: './asignar-examenes.component.html',
  styleUrls: ['./asignar-examenes.component.css']
})
export class AsignarExamenesComponent implements OnInit {

  curso: Curso;
  autocompleteControl = new FormControl();
  examenesFiltrados: Examen[]=[];
  examenesAsignar: Examen[]=[];
  examenes:Examen[]=[];

  dataSource: MatTableDataSource<Examen>;

  displayedColumns= ['nombre','asignatura','eliminar'];
  displayedExamenesColumns=['id','nombre','asignaturas','eliminar'];
  tabIndex: number=0;
//injectar el componente hijo del front, para customizarlo
  @ViewChild(MatPaginator, {static:true}) paginator: MatPaginator;
  pageSizeOptions:number[]=[3,5,10,20,50];

  constructor( 
    private route: ActivatedRoute,
    private router: Router,
    private cursoService: CursoService,
    private examenService: ExamenService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params=>{
      const id:number = +params.get('id');
      this.cursoService.ver(id).subscribe(c => {
        this.curso =c;
        this.examenes = this.curso.examenes;
        this.initPaginator();
      });
    });

    this.autocompleteControl.valueChanges.pipe(
       //mepear, mostrar objeto como texto o solo texto
      map(valor=> typeof valor === 'string'? valor: valor.nombre), 
      //cambiar flujo de susbribe al de examen
      flatMap(valor=> valor? this.examenService.filtrarPorNombre(valor): [])
    ).subscribe(examenes => this.examenesFiltrados=examenes);
  }

  private initPaginator():void{
    this.dataSource= new MatTableDataSource<Examen>(this.examenes);
    this.dataSource.paginator= this.paginator;
    this.paginator._intl.itemsPerPageLabel='Registros por pagina';
  }
  //converter, para seleccionar el objeto como texto
  public mostrarNombre(examen?: Examen): string{
    return examen? examen.nombre: '';
  }

  public seleccionarExamen(event: MatAutocompleteSelectedEvent): void {
    const examen = event.option.value as Examen;
    if (!this.existe(examen.id)) {
      this.examenesAsignar = this.examenesAsignar.concat(examen);
      console.log('examenes asignados->' + this.examenesAsignar);      
    }else {
      Swal.fire('Error:',`El examen ${examen.nombre} ya existe en el curso`,'error');
    }
    //reiniciar el autocomplete
      this.autocompleteControl.setValue('');
      event.option.deselect();
      event.option.focus();
  }

  private existe(id: number): boolean{
    let existe=false;
    this.examenesAsignar.concat(this.examenes)
    .forEach(e=>{
      if(id===e.id){
        existe=true;
      }
    });
    return existe;
  }

  public eliminarDeAsignacion(examen: Examen):void{
    this.examenesAsignar= this.examenesAsignar
    .filter(e=> examen.id!==e.id); 
  }

  public asignar(): void{
    console.log('asignar examenes: '+ this.examenesAsignar);
    this.cursoService.asignarExamenes(this.curso, this.examenesAsignar)
    .subscribe(curso=>{
      this.examenes= this.examenes.concat(this.examenesAsignar);
      this.initPaginator();
      this.examenesAsignar=[];     
      Swal.fire('Exito:',`Examen asignado con exito al curso: ${curso.nombre}`,'success');
      this.tabIndex=2;
    });
  }

  public eliminarExamenDelCurso(examen: Examen):void{
    Swal.fire({
      title: 'Cuidado:',
      width: 400,
      text: `¿Seguro que quieres eliminar a ${examen.nombre}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cursoService.eliminarExamen(this.curso, examen)
        .subscribe(curso =>{
          this.examenes = this.examenes.filter(e=> e.id!==examen.id);
          this.initPaginator();
          Swal.fire('Eliminado: ', `Examen ${examen.nombre} eliminado correctamente del curso ${curso.nombre}.`, 'success');
        });
      }
    });     
  }
}
