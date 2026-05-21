import express, { Application, Request, Response, NextFunction } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import alumnoRoutes from '../routes/alumno.routes'

dotenv.config()

class Server {
  private app: Application
  private port: string | number

  constructor() {
    this.app = express()
    this.port = process.env.PORT || 3000
    this.middleware()
    this.rutas()
  }

  private middleware(): void {
    this.app.use(cors())
    // Si usas JSON, puedes agregar:
    // this.app.use(express.json());
  }

  private rutas(): void {
    this.app.use('/alumnos', alumnoRoutes)
    /*
    this.app.use('/materias', require('../routes/extra/materia.routes'));
    this.app.use('/notas', require('../routes/extra/nota.routes'));
    this.app.use('/profesores', require('../routes/extra/profesor.routes'));
    */

    // manejo de errores
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      return res.status(400).json({ msg: 'Error.' })
    })
    this.app.use(
      (err: Error, req: Request, res: Response, next: NextFunction) => {
        console.error(err.stack)
        return res.status(404).json({ msg: 'Error. Pagina no encontrada' })
      }
    )
    this.app.use(
      (err: Error, req: Request, res: Response, next: NextFunction) => {
        console.error(err.stack)
        return res.status(500).json({ msg: 'Internal Server Error' })
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
