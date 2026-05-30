import { Router } from 'express'
import { AlumnoController } from '../controllers/alumno.controller'
import { validarAlumno } from '../middlewares/alumno.validacion-middleware'
import { NotaValidacionMiddleware} from '../middlewares/nota.validacion-middleware'

const rutas = Router()
const alumnoController = new AlumnoController()
const notaMiddleware = new NotaValidacionMiddleware()

rutas.get('/', alumnoController.getAlumnos)
rutas.get('/:legajo', alumnoController.getAlumnoById)
rutas.patch('/:legajo', validarAlumno, alumnoController.patchAlumno)
rutas.put('/:legajo', validarAlumno, alumnoController.putAlumno)
rutas.delete('/:legajo', alumnoController.deleteAlumno)
rutas.get('/:legajo/notas', alumnoController.obtenerNotasLegajo)

export default rutas
