import { Router } from 'express'
import { ProfesorController } from '../../controllers/profesor.controller'
import { validarProfesor } from '../../middlewares/profesor-validacion.middleware'

const rutas = Router()
const profesorController = new ProfesorController()

rutas.get('/', profesorController.getProfesores)
rutas.get('/:dni', profesorController.getProfesorByDni)
rutas.post('/', validarProfesor, profesorController.postProfesor)
rutas.put('/:dni', validarProfesor, profesorController.putProfesor)
rutas.patch('/:dni', validarProfesor, profesorController.patchProfesor)

export default rutas
