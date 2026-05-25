import { ProfesorModel } from '../models/extras/profesor.model'
import { Request, Response } from 'express'
import { NumerosMagicos } from '../util/numeros-magicos'
import fs from 'fs/promises'

export class ProfesorController extends NumerosMagicos {
  public getProfesores = async (req: Request, res: Response): Promise<Response> => {
    try {
      const data = await fs.readFile('./data/extras/sys-profesores.json', 'utf-8')
      const profesores: ProfesorModel[] = JSON.parse(data).map(
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

      if (profesores.length === 0) {
        return res.status(this.HTTP_NOT_FOUND).json({ error: 'No se encontraron profesores' })
      }

      return res.status(this.HTTP_OK).json(profesores)
    } catch (error) {
      console.error(error)
      return res
        .status(this.HTTP_SERVER_ERROR)
        .json({ error: 'No se pudieron obtener los datos de los profesores' })
    }
  }
}
