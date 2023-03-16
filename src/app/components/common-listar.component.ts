import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import Swal from 'sweetalert2';
import { Generic } from '../models/generic';
import { CommonService } from '../services/common.service';

export abstract class CommonListarComponent<E extends Generic, S extends CommonService<E>> 
implements OnInit {
  
  //sin modificador de acceso por default es publid
  titulo : string;
  lista : E[];
  protected nombreModel: string;

  totalRegistros= 0;
  paginaActual= 0;
  totalPorPagina= 4;
  pageSizeOptions: number[]= [5, 10, 25, 100];

  //injectar el pomponente hijo, para customizarlo
  @ViewChild(MatPaginator) paginator:MatPaginator;

  constructor(protected service: S) { }

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
      this.lista= pageable.content as E[];
      this.totalRegistros= pageable.totalElements as number;
      this.paginator._intl.itemsPerPageLabel='Registros por pagina:';
    });
  }
  public eliminar(e: E):void{
    Swal.fire({
      title: 'Cuidado:',
      width: 400,
      text: `¿Seguro que quieres eliminar a ${e.nombre}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
          this.service.eliminar(e.id).subscribe(()=>{
          //funciona sin paginacion
         // this.alumnos = this.alumnos.filter(a => a!== alumno);
         this.calcularPaginacion();
          Swal.fire('Eliminado:',`${this.nombreModel} ${e.nombre} eliminado con exito.`, 'success');
        });
      }
    });
  }
}
