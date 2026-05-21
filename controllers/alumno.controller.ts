import { AlumnoModel } from '../models/alumno.model'
import { Request, Response } from 'express'
import fs from 'fs/promises'

export class AlumnoController {
  private readonly HTTP_OK: number = 200
  private readonly HTTP_SERVER_ERROR: number = 500

  public getAlumnos = async (req: Request,res: Response): Promise<Response> => {
    let codigo: number
    let salida: object

    try {
      const data: string = await fs.readFile('./data/alumnos.json', 'utf8')
      const alumnos: AlumnoModel[] = JSON.parse(data)
      codigo = this.HTTP_OK
      salida = alumnos
    } catch (error) {
      console.log(error)
      codigo = this.HTTP_SERVER_ERROR
      salida = { error: 'No se puedieron obtener los datos de los alumnos' }
    }
    return res.status(codigo).json(salida)
  }

  //Mati
  public patchAlumno = async (req: Request, res: Response) => {
    const {legajo} = req.params
    try{
    const {nombre, apellido, email, modificacion, isActive} = req.body
    const data=await fs.readFile('./data/alumnos.json', 'utf8') // espera a leer
    const alumnos: any[] = JSON.parse(data)
    const alumnoIndex = alumnos.findIndex((alumno) => alumno.legajo === Number(legajo)) //tipo numero, por el indice devolvido
    if (alumnoIndex === -1) {
      return res.status(404).json({ msg: `Alumno (Legajo: ${legajo})  no encontrado` })}
    
    const alumnoEncontrado = alumnos[alumnoIndex]

    const alumnoModificado = new AlumnoModel(
      alumnoEncontrado.legajo,
      alumnoEncontrado.nombre,
      alumnoEncontrado.apellido,
      alumnoEncontrado.email,
      alumnoEncontrado.fechaAlta,
      alumnoEncontrado.fechaModificacion,
      alumnoEncontrado.isActive
    )

    if (nombre) {alumnoModificado.setNombre(nombre)}
    if (apellido) {alumnoModificado.setApellido(apellido)}
    if (email) {alumnoModificado.setEmail(email)}
    if (isActive !== undefined) {alumnoModificado.setActivo(isActive)}
    alumnoModificado.setFechaModificacion(new Date())

    const alumnoFinal = alumnoModificado.getAllAttributes()
    alumnos[alumnoIndex] = alumnoFinal //reemplaza el alumno que tiene ese indice
    await fs.writeFile('./data/alumnos.json', JSON.stringify(alumnos, null, 2), 'utf8') //espera a escrirbir

    return res.status(201).json({ msg: 'Alumno modificado correctamente' })
    } catch (error) {
      return res.status(500).json({ msg: `Error al modificar el alumno (legajo: ${legajo})` })
    }
}
}


