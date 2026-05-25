import { ProfesorModel } from '../models/extras/profesor.model'
import { Request, Response } from 'express'
import { NumerosMagicos } from '../util/numeros-magicos'
import fs from 'fs/promises'

export class ProfesorController extends NumerosMagicos {
  private async leerProfesores(): Promise<ProfesorModel[]> {
    const data = await fs.readFile('./data/extras/sys-profesores.json', 'utf8')
    return JSON.parse(data).map(
      (item: any) =>
        new ProfesorModel(
          item.nombre,
          item.apellido,
          item.email,
          item.dni,
          item.cargo,
          item.isActive,
          item.materias,
          item.fechaAlta,
          item.modificacion
        )
    )
  }

  public getProfesores = async (req: Request, res: Response): Promise<Response> => {
    try {
      const profesores = await this.leerProfesores()

      if (profesores.length === 0) {
        return res.status(this.HTTP_NOT_FOUND).json({ error: 'No se encontraron profesores' })
      }

      return res.status(this.HTTP_OK).json(profesores)
    } catch (error) {
      console.error(error)
      return res
        .status(this.HTTP_SERVER_ERROR)
        .json({ error: 'Error interno. No se pudieron obtener los datos de los profesores' })
    }
  }

  public getProfesorByDni = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { dni } = req.params

      const profesores = await this.leerProfesores()

      const profesorEncontrado = profesores.find((profesor) => profesor.getDni() === Number(dni))

      if (!profesorEncontrado) {
        return res
          .status(this.HTTP_NOT_FOUND)
          .json({ error: `No se encontro el profesor con DNI ${dni}` })
      }

      return res.status(this.HTTP_OK).json(profesorEncontrado)
    } catch (error) {
      return res
        .status(this.HTTP_SERVER_ERROR)
        .json({ error: 'Error interno. No se pudo obtener el profesor' })
    }
  }
}
