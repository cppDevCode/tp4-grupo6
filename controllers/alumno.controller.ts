import { AlumnoModel } from '../models/alumno.model'
import { Request, Response } from 'express'
import fs from 'fs/promises'

export class AlumnoController {
  private readonly HTTP_OK: number = 200
  private readonly HTTP_SERVER_ERROR: number = 500

  public getAlumnos = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
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
}
