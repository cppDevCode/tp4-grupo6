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
      console.error(error)
      return res
        .status(this.HTTP_SERVER_ERROR)
        .json({ error: 'Error interno. No se pudo obtener el profesor' })
    }
  }

  public postProfesor = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { nombre, apellido, email, dni, cargo, isActive, materias } = req.body
      const profesores = await this.leerProfesores()

      const existeDni = profesores.some((profesor) => profesor.getDni() === Number(dni))

      if (existeDni) {
        return res
          .status(this.HTTP_EXISTING_RESOURCE)
          .json({ error: `Ya existe un profesor con DNI ${dni}` })
      }

      const data = await fs.readFile('./data/extras/sys-materias.json', 'utf-8')
      const materiasDisponibles = JSON.parse(data).map((materia: any) => materia.idMateria)

      const todasExisten = materias.every((materia: string) =>
        materiasDisponibles.includes(materia)
      )

      if (!todasExisten) {
        return res
          .status(this.HTTP_BAD_REQUEST)
          .json({ error: `Alguna de las materias ingresadas no existe` })
      }

      const nuevoProfesor = new ProfesorModel(
        nombre,
        apellido,
        email,
        dni,
        cargo,
        isActive,
        materias
      )

      profesores.push(nuevoProfesor)
      await fs.writeFile(
        './data/extras/sys-profesores.json',
        JSON.stringify(profesores, null, 2),
        'utf-8'
      )
      return res
        .status(this.HTTP_CREATED)
        .json({ msg: 'Profesor creado exitosamente', profesor: nuevoProfesor })
    } catch (error) {
      console.error(error)
      return res
        .status(this.HTTP_SERVER_ERROR)
        .json({ error: 'Error interno. No se pudo crear el profesor' })
    }
  }
  public  putProfesor= async (req: Request, res: Response): Promise<Response> => {
    try{
      const { dni } = req.params
      const { nombre, apellido, email, cargo, isActive, materias } = req.body
      const profesores = await this.leerProfesores()

      const profesorIndex = profesores.findIndex((profesor) => profesor.getDni() === Number(dni))

      if (profesorIndex === -1) {
        return res
          .status(this.HTTP_NOT_FOUND)
          .json({ error: `No se encontro el profesor con DNI ${dni}` })
      }

      //Validación materias
      const data = await fs.readFile('./data/extras/sys-materias.json', 'utf-8')
      const materiasDisponibles = JSON.parse(data).map((materia: any) => materia.idMateria)
      
      const todasExisten = materias.every((materia: string) =>
        materiasDisponibles.includes(materia)
      )

      if (!todasExisten) {
        return res
          .status(this.HTTP_BAD_REQUEST)
          .json({ error: `Alguna de las materias ingresadas no existe` })
      }

      //Reemplazo de campos modificables
      const profesorModificado = profesores[profesorIndex]
      profesorModificado.setNombre(nombre)
      profesorModificado.setApellido(apellido)
      profesorModificado.setEmail(email)
      profesorModificado.setCargo(cargo)
      profesorModificado.setIsActive(isActive)
      profesorModificado.setMaterias(materias)
      profesorModificado.setModificacion(new Date().toISOString().split('T')[0])

      profesores[profesorIndex] = profesorModificado
      await fs.writeFile(
        './data/extras/sys-profesores.json',
        JSON.stringify(
          profesores.map((p) => p.getAllAttributes()),
          null,
          2),
        'utf-8'
      )

      console.log(`[PUT] Profesor con DNI ${dni} actualizado exitosamente`)

      return res
        .status(this.HTTP_OK).json({
          msg: 'Profesor actualizado exitosamente',
          profesor: profesorModificado.getAllAttributes()
        })
    } catch (error) {
      console.error(error)
      return res
        .status(this.HTTP_SERVER_ERROR)
        .json({ error: 'Error interno. No se pudo actualizar el profesor' })
    }
  }   
}
