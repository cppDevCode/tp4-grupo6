export class NotaModel {
    private id: number
    private idMateria: string
    private nota: number
    private legajo: number
    private fecha: Date

    constructor ( id: number, legajo: number, idMateria: string, nota: number, fecha: Date) {
        this.id = id
        this.idMateria = idMateria
        this.nota = nota
        this.fecha = fecha
        this.legajo = legajo
    }

    public getId ():number {
        return this.id
    }

    public getIdMateria () : string {
        return this.idMateria
    }

    public getNota () : number {
        return this.nota
    }

    public getFecha (): Date {
        return this.fecha
    }

    public getLegajo (): number {
        return this.legajo
    }

    public setLegajo (legajoNuevo:number):void {
        this.legajo = legajoNuevo
    }

    public setId (idNuevo:number):void {
        this.id = idNuevo
    }

    public setIdMateria (idMateria: string):void {
        this.idMateria = idMateria
    }

    public setNota (nota: number):void {
        this.nota = nota
    }

    public setFecha (fecha: Date):void {
        this.fecha = fecha
    }

    public getAll (): NotaModel {
        return this
    }    
}