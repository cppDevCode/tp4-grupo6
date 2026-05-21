import { Router } from 'express'
import { AlumnoController } from '../controllers/alumno.controller'

const rutas = Router()
const alumnoController = new AlumnoController()

rutas.get('/', alumnoController.getAlumnos)

export default rutas
