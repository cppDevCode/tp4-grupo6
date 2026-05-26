import { AlumnoModel } from '../models/alumno.model'
import { NumerosMagicos } from '../util/numeros-magicos'
import { Request, Response } from 'express'
import fs from 'fs/promises'

export class AlumnoController extends NumerosMagicos{
  

  public getAlumnos = async (req: Request, res: Response): Promise<Response> => {
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
    const { legajo } = req.params
    try {
      const { nombre, apellido, email, modificacion, isActive } = req.body
      const data = await fs.readFile('./data/alumnos.json', 'utf8') // espera a leer
      const alumnos: any[] = JSON.parse(data)
      const alumnoIndex = alumnos.findIndex((alumno) => alumno.legajo === Number(legajo)) //tipo numero, por el indice devolvido
      if (alumnoIndex === -1) {
        return res.status(this.HTTP_NOT_FOUND).json({ msg: `Alumno (Legajo: ${legajo})  no encontrado` })
      }

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

      if (nombre) {
        alumnoModificado.setNombre(nombre)
      }
      if (apellido) {
        alumnoModificado.setApellido(apellido)
      }
      if (email) {
        alumnoModificado.setEmail(email)
      }
      if (isActive !== undefined) {
        alumnoModificado.setActivo(isActive)
      }
      alumnoModificado.setFechaModificacion(new Date()) //fecha actual

      const alumnoFinal = alumnoModificado.getAllAttributes()
      alumnos[alumnoIndex] = alumnoFinal //reemplaza el alumno que tiene ese indice
      await fs.writeFile('./data/alumnos.json', JSON.stringify(alumnos, null, 2), 'utf8') //espera a escrirbir

      return res.status(this.HTTP_CREATED).json({ msg: 'Alumno modificado correctamente' })
    } catch (error) {
      return res.status(this.HTTP_SERVER_ERROR).json({ msg: `Error al modificar el alumno (legajo: ${legajo})` })
    }
  }

  public putAlumno = async (req: Request, res: Response) => {
    try {
      const { legajo } = req.params
      const { nombre, apellido, email, isActive } = req.body
      const data: string = await fs.readFile('./data/alumnos.json', 'utf-8')
      const alumnos: any[] = JSON.parse(data)
      const alumnoIndex = alumnos.findIndex((alumno) => alumno.legajo === Number(legajo))

      if (alumnoIndex === -1) {
        return res
          .status(this.HTTP_NOT_FOUND)
          .json({ msg: `No se ha encontrado el alumno con legajo ${legajo}` })
      }

      const alumnoEncontrado: AlumnoModel = new AlumnoModel(
        alumnos[alumnoIndex].nombre,
        alumnos[alumnoIndex].apellido,
        alumnos[alumnoIndex].email,
        alumnos[alumnoIndex].legajo,
        alumnos[alumnoIndex].fechaAlta,
        alumnos[alumnoIndex].modificacion,
        alumnos[alumnoIndex].isActive
      )
      const fechaActual = new Date()
      alumnoEncontrado.setNombre(nombre)
      alumnoEncontrado.setApellido(apellido)
      alumnoEncontrado.setEmail(email)
      alumnoEncontrado.setActivo(isActive)
      alumnoEncontrado.setFechaModificacion(fechaActual)

      alumnos[alumnoIndex] = alumnoEncontrado.getAllAttributes()
      alumnos[alumnoIndex].fechaModificacion = fechaActual.toISOString().split('T')[0]
      await fs.writeFile('./data/alumnos.json', JSON.stringify(alumnos, null, 2), 'utf-8')

      return res.status(this.HTTP_CREATED).json({
        msg: `Alumno legajo ${legajo} modificado correctamente`,
        alumno: alumnoEncontrado.getAllAttributes()
      })
    } catch (error) {
      console.error('Error al modificar el alumno:', error)
      res
        .status(this.HTTP_SERVER_ERROR)
        .json({ error: 'Error interno del servidor. No se pudo actualizar el alumno' })
    }
  }
}
