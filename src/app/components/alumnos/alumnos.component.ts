import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Alumno } from 'src/app/models/alumno';
import { AlumnoService } from 'src/app/services/alumno.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-alumnos',
  templateUrl: './alumnos.component.html',
  styleUrls: ['./alumnos.component.css']
})
export class AlumnosComponent implements OnInit {

  titulo = 'Listado de Usuarios';
  alumnos : Alumno[];
  totalRegistros= 0;
  paginaActual= 0;
  totalPorPagina= 4;
  pageSizeOptions: number[]= [5, 10, 25, 100];

  //injectar el pomponente hijo, para customizarlo
  @ViewChild(MatPaginator) paginator:MatPaginator;

  constructor(private service: AlumnoService) { }

  ngOnInit(): void {
    this.calcularPaginacion();
  }

  public paginar(event: PageEvent): void{
    this.paginaActual = event.pageIndex;
    this.totalPorPagina = event.pageSize;
    this.calcularPaginacion();
  }

  private calcularPaginacion(){
    this.service.listarPaginas(this.paginaActual.toString(), this.totalPorPagina.toString())
    .subscribe(pageable =>{
      this.alumnos= pageable.content as Alumno[];
      this.totalRegistros= pageable.totalElements as number;
      this.paginator._intl.itemsPerPageLabel='Registros por pagina:';
    });
  }
  public eliminar(alumno: Alumno):void{
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
          this.service.eliminar(alumno.id).subscribe(()=>{
          //funciona sin paginacion
         // this.alumnos = this.alumnos.filter(a => a!== alumno);
         this.calcularPaginacion();
          Swal.fire('Eliminado:',`Alumno ${alumno.nombre} eliminado con exito.`, 'success');
        });
      }
    });
  }
}
