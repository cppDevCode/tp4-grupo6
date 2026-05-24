import { Router } from 'express'
import { AlumnoController } from '../controllers/alumno.controller'
import { validarAlumno } from '../middlewares/alumno.validacion-middleware'

const rutas = Router()
const alumnoController = new AlumnoController()

rutas.get('/', alumnoController.getAlumnos)
rutas.patch('/:legajo', validarAlumno, alumnoController.patchAlumno)
rutas.put('/:legajo', validarAlumno, alumnoController.putAlumno)
rutas.delete('/:legajo', alumnoController.deleteAlumno)

export default rutas
