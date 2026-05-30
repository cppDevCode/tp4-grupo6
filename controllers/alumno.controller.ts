import { AlumnoModel } from '../models/alumno.model'
import {NotaModel} from '../models/extras/nota.model'
import { NumerosMagicos } from '../util/numeros-magicos'
import { Request, Response } from 'express'
import fs from 'fs/promises'

export class AlumnoController extends NumerosMagicos{
  

  public getAlumnos = async (req: Request, res: Response): Promise<Response> => {
    let codigo: number
    let salida: object

    try {
      const data: string = await fs.readFile('./data/alumnos.json', 'utf8')
      const alumnos: AlumnoModel[] = JSON.parse(data).map((item: any) => new AlumnoModel(item.legajo, item.nombre,item.apellido, item.email, item.fechaAlta, item.modificacion, item.isActive))
      codigo = this.HTTP_OK
      salida = alumnos
    } catch (error) {
      console.log(error)
      codigo = this.HTTP_SERVER_ERROR
      salida = { error: 'No se puedieron obtener los datos de los alumnos' }
    }
    return res.status(codigo).json(salida)
  }

  public getAlumnoById = async (req: Request, res: Response): Promise<Response> => {
    let codigo: number
    let salida: object

    try {
      const data: string = await fs.readFile('./data/alumnos.json', 'utf8')
      const alumnos: AlumnoModel[] = JSON.parse(data)
      const legajo = Number(req.params.legajo)
      const alumno= alumnos.find((a: any) => a.legajo === legajo)

      if (!alumno) {
        console.log(`[404] GET /alumnos/${legajo} - Alumno no encontrado`)
        codigo = this.HTTP_NOT_FOUND
        salida = { error: `No existe el alumno con legajo ${legajo}` }
      } else {
        console.log(`[OK] GET /alumnos/${legajo} - Alumno encontrado`)
        codigo = this.HTTP_OK
        salida = alumno
      }
    } catch (error) {
      console.log('[ERROR] getAlumnoById', error)
      codigo = this.HTTP_SERVER_ERROR
      salida = { error: 'No se pudieron obtener los datos del alumno' }
    }
    return res.status(codigo).json(salida)
  }

  //Mati
  public patchAlumno = async (req: Request, res: Response) => {
    const { legajo } = req.params
    try {
      const { nombre, apellido, email, fechaAlta, modificacion, isActive } = req.body
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

      if (legajo) {
        alumnoModificado.setLegajo(Number(legajo))
      }
      if (nombre) {
        alumnoModificado.setNombre(nombre)
      }
      if (apellido) {
        alumnoModificado.setApellido(apellido)
      }
      if (email) {
        alumnoModificado.setEmail(email)
      }
      if (fechaAlta) {
        alumnoModificado.setFechaAlta(new Date(fechaAlta))
      }
      alumnoModificado.setFechaModificacion(new Date()) //fecha actual
      if (isActive !== undefined) {
        alumnoModificado.setActivo(isActive)
      }

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
  //Mar - Eliminar alumno por legajo

    public deleteAlumno = async (req: Request, res: Response): Promise<Response> => {
      console.log('ENTRO AL DELETE')
      const { legajo } = req.params

    try {
      //leo archivo y parseo datos
      const data: string = await fs.readFile('./data/alumnos.json', 'utf-8')
      const alumnos: AlumnoModel[] = JSON.parse(data)

      //busco indice de alumno
      const alumnoIndex = alumnos.findIndex((alumno: any) => alumno.legajo === Number(legajo))

      //si no lo encuentro, devuelvo error
      if (alumnoIndex === -1) {
        return res
          .status(this.HTTP_NOT_FOUND)
          .json({ error: `No se encontró ningún alumno con el legajo ${legajo}` })
      }

      //guardo alumno y creo array con filter sin el alumno a eliminar 
      const alumnoEliminado = alumnos[alumnoIndex]
      const alumnosActualizados = alumnos.filter((alumno: any) => alumno.legajo !== Number(legajo))

      //escribo nuevo array sin el alumno eliminado
      await fs.writeFile('./data/alumnos.json', JSON.stringify(alumnosActualizados, null, 2), 'utf-8')

      //log de alumno eliminado
      console.log(`[DELETE] Alumno con legajo ${legajo} eliminado correctamente.`)

      //devuelvo respuesta con alumno eliminado
      return res.status(this.HTTP_OK).json({
        msg: `Alumno con legajo ${legajo} eliminado correctamente`,
        alumnoEliminado: alumnoEliminado
      })

    } catch (error) {
      //capturo y logueo error, devuelvo respuesta de error
      console.error('[DELETE] Error al eliminar alumno:', error)
      return res
        .status(this.HTTP_SERVER_ERROR)
        .json({ error: `Error interno del servidor. No se pudo eliminar el alumno con legajo ${legajo}` })
    }
  }

  //Mati
    public obtenerNotasLegajo = async (req: Request, res: Response): Promise<Response> => {
      let codigo: number
      let salida: object
      try{
        const dataNotas:string= await fs.readFile('./data/extras/sys-notas.json', 'utf-8')
        const dataAlumnos: string=await fs.readFile('./data/alumnos.json', 'utf-8')
        const notas: NotaModel []=JSON.parse(dataNotas)
        const alumnos: AlumnoModel[] = JSON.parse(dataAlumnos)
        const legajo = Number (req.params.legajo)
        const alumno=alumnos.find((a: any)=> a.legajo === legajo)
        const notasDeAlumno = notas.filter((a:any)=> a.legajo === legajo)

        if (!alumno) {
          codigo = this.HTTP_NOT_FOUND
          salida = {error: 'No existe el alumno con legajo ${legajo}'}
        }else{
          codigo=this.HTTP_OK
          salida=alumno
          if (notasDeAlumno.length===0){
            codigo=this.HTTP_NOT_FOUND
            salida={msg: 'El alumno no posee notas'}
          } else {
            codigo=this.HTTP_OK
            salida={ alumno, notas: notasDeAlumno }}
          }
        } catch (error) {
          codigo =this.HTTP_SERVER_ERROR
          salida= {error: 'No se pudieron encontrar datos del alumno'}
        } return res.status(codigo).json(salida)
      }
    }
