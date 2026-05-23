import express, { Application, Request, Response, NextFunction } from 'express'
import { NumerosMagicos } from '../util/numeros-magicos'
import cors from 'cors'
import dotenv from 'dotenv'
import alumnoRoutes from '../routes/alumno.routes'
import rutasNota from '../routes/extras/nota.routes'

dotenv.config()

class Server extends NumerosMagicos{
  private app: Application
  private port: string | number  

  constructor() {
    super()
    this.app = express()
    this.port = process.env.PORT || this.PUERTO_DEFECTO
    this.middleware()
    this.rutas()
  }

  private middleware(): void {
    this.app.use(cors())
    this.app.use(express.json()); //leo y modifico JSONs
  }

  private rutas(): void {
    this.app.use('/notas', rutasNota)
    this.app.use('/alumnos', alumnoRoutes)    
    /*
    this.app.use('/materias', require('../routes/extra/materia.routes'));
    this.app.use('/notas', require('../routes/extra/nota.routes'));
    this.app.use('/profesores', require('../routes/extra/profesor.routes'));
    */

    // manejo de errores
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      return res.status(this.HTTP_BAD_REQUEST).json({ msg: 'Error.' })
    })
    this.app.use(
      (err: Error, req: Request, res: Response, next: NextFunction) => {
        console.error(err.stack)
        return res.status(this.HTTP_NOT_FOUND).json({ msg: 'Error. Pagina no encontrada' })
      }
    )
    this.app.use(
      (err: Error, req: Request, res: Response, next: NextFunction) => {
        console.error(err.stack)
        return res.status(this.HTTP_SERVER_ERROR).json({ msg: 'Internal Server Error' })
      }
    )
  }

  public listen(): void {
    this.app.listen(this.port, () => {
      console.log(`La API esta escuchando en el puerto: ${this.port}`)
    })
  }
}

export default Server
