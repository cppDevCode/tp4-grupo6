import { PersonaModel } from '../persona.model'

export class ProfesorModel extends PersonaModel {
  private dni: number
  private cargo: string
  private fechaAlta: string
  private modificacion: string
  private materias: string[]
  private isActive: boolean

  constructor(
    nombre: string,
    apellido: string,
    email: string,
    dni: number,
    cargo: string,
    isActive: boolean,
    materias: string[],
    fechaAlta: string = new Date().toISOString().split('T')[0],
    modificacion: string = new Date().toISOString().split('T')[0]
  ) {
    super(nombre, apellido, email)
    this.dni = dni
    this.cargo = cargo
    this.fechaAlta = fechaAlta
    this.modificacion = modificacion
    this.isActive = isActive
    this.materias = materias
  }

  //dni
  setDni(dni: number): void {
    this.dni = dni
  }

  getDni(): number {
    return this.dni
  }

  //cargo
  setCargo(cargo: string): void {
    this.cargo = cargo
  }

  getCargo(): string {
    return this.cargo
  }

  //fechaAlta
  setFechaAlta(fechaAlta: string): void {
    this.fechaAlta = fechaAlta
  }

  getFechaAlta(): string {
    return this.fechaAlta
  }

  //modificacion
  setModificacion(modificacion: string): void {
    this.modificacion = modificacion
  }

  getModificacion(): string {
    return this.modificacion
  }

  //isActive
  setIsActive(isActive: boolean): void {
    this.isActive = isActive
  }

  getIsActive(): boolean {
    return this.isActive
  }

  //materias
  setMaterias(materias: string[]): void {
    this.materias = materias
  }

  getMaterias(): string[] {
    return this.materias
  }

  setProfesor(profesor: ProfesorModel): void {
    this.nombre = profesor.getNombre()
    this.apellido = profesor.getApellido()
    this.email = profesor.getEmail()
    this.dni = profesor.getDni()
    this.cargo = profesor.getCargo()
    this.fechaAlta = profesor.getFechaAlta()
    this.modificacion = profesor.getModificacion()
    this.materias = profesor.getMaterias()
  }

  public getAllAttributes(): object {
    return {
      ...super.getAllAttributes(),
      dni: this.dni,
      cargo: this.cargo,
      fechaAlta: this.fechaAlta,
      modificacion: this.modificacion,
      materias: this.materias
    }
  }
}
