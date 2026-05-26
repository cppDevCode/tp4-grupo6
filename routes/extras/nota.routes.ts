import { Router } from 'express'
import { NotaController } from '../../controllers/nota.controller'
import { NotaValidacionMiddleware } from '../../middlewares/nota.validacion-middleware'


const rutasNota = Router()
const notaController = new NotaController()
const notaValidacion = new NotaValidacionMiddleware()

rutasNota.get('/', notaController.getNotas)
rutasNota.get('/:legajo', notaController.getNotasXLegajo)
rutasNota.post('/', notaValidacion.validarNota ,notaController.postNota)

export default rutasNota
