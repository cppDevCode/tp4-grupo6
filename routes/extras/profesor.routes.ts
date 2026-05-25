import { Router } from 'express'
import { ProfesorController } from '../../controllers/profesor.controller'
import { validarProfesor } from '../../middlewares/profesor-validacion.middleware'

const rutas = Router()
const profesorController = new ProfesorController()

rutas.get('/', profesorController.getProfesores)

export default rutas
