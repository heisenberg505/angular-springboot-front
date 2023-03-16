import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Alumno } from '../models/alumno';

@Injectable({
  providedIn: 'root'
})
export class AlumnoService {

  private http: HttpClient;
  private baseEndPoint = 'http://localhost:8090/api/alumnos';
  private cabeceras: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(http: HttpClient) { this.http = http; }

  public listar(): Observable<Alumno[]>{
    return this.http.get<Alumno[]>(this.baseEndPoint);
  }

  public listarPaginas(page: string, size: string): Observable<any>{
    const params = new HttpParams()
    .set('page', page)
    .set('size', size);
    return this.http.get<any>(`${this.baseEndPoint}/paginar`, {params: params});
  }

  public ver(id: number): Observable<Alumno>{
    return this.http.get<Alumno>(`${this.baseEndPoint}/${id}`);
  }

  public crear(alumno: Alumno): Observable<Alumno>{
    return this.http.post<Alumno>(this.baseEndPoint, alumno, {headers: this.cabeceras});
  }

  public editar(alumno: Alumno): Observable<Alumno>{
    return this.http.put<Alumno>(`${this.baseEndPoint}/${alumno.id}`, alumno, {headers: this.cabeceras});
  }

  public eliminar(id: number): Observable<void>{
    return this.http.delete<void>(`${this.baseEndPoint}/${id}`);
  }
}
