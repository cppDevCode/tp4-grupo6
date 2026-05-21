import { PersonaModel } from './persona.model'

export class AlumnoModel extends PersonaModel {
  private legajo: number
  private fechaAlta: Date
  private modificacion: Date
  private isActive: Boolean

  constructor(
    nombre: string,
    apellido: string,
    email: string,
    legajo: number,
    fechaAlta: Date,
    modificacion: Date,
    activo: Boolean
  ) {
    super(nombre, apellido, email)
    this.legajo = legajo
    this.fechaAlta = fechaAlta
    this.modificacion = modificacion
    this.isActive = activo
  }

  public getAlumno(): AlumnoModel {
    return this
  }

  public getLegajo(): number {
    return this.legajo
  }

  public getFechaAlta(): Date {
    return this.fechaAlta
  }

  public getFechaModificacion(): Date {
    return this.modificacion
  }

  public getActivo(): Boolean {
    return this.isActive
  }

  public setLegajo(legajo: number): void {
    this.legajo = legajo
  }

  public setFechaAlta(fecha: Date): void {
    this.fechaAlta = fecha
  }

  public setFechaModificacion(fecha: Date): void {
    this.modificacion = fecha
  }

  public setActivo(activo: Boolean): void {
    this.isActive = activo
  }

  public setAlumno(alumno: AlumnoModel): void {
    this.nombre = alumno.nombre
    this.email = alumno.email
    this.apellido = alumno.apellido
    this.legajo = alumno.legajo
    this.fechaAlta = alumno.fechaAlta
    this.modificacion = alumno.modificacion
    this.isActive = alumno.isActive
  }

  public getAllAttributes(): object {
    return {
      nombre: this.nombre,
      email: this.email,
      apellido: this.apellido,
      legajo: this.legajo,
      fechaAlta: this.fechaAlta,
      modificacion: this.modificacion,
      isActive: this.isActive
    }
  }
}
