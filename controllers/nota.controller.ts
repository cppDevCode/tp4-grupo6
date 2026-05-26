import { NumerosMagicos } from "../util/numeros-magicos";
import { NotaModel } from "../models/extras/nota.model";
import { Request, Response } from 'express'
import fs from 'fs/promises'

export class NotaController extends NumerosMagicos {
    public getNotas = async (req: Request, res: Response): Promise<Response> => {
        let salida: object
        let codigo: number

        try {
            const data: string = await fs.readFile('./data/extras/sys-notas.json','utf-8')
            const notas: NotaModel[] = JSON.parse(data).map((item: any) => new NotaModel(item.id, item.legajo,item.IdMateria, item.nota, item.fecha))
            codigo = this.HTTP_OK
            salida = notas
        } catch (error) {
            codigo = this.HTTP_SERVER_ERROR
            salida = { error: 'No se puedieron obtener los datos de las Notas' }
        }
        return res.status(codigo).json(salida)
    }

    public postNota = async (req: Request, res: Response): Promise<Response> => {
        let salida: object
        let codigo: number
        let objetoNuevo: NotaModel;
        try
        {
            const data: string = await fs.readFile('./data/extras/sys-notas.json', 'utf-8')
            const notas: NotaModel[] = JSON.parse(data).map((item: any) => new NotaModel(item.id, item.legajo,item.IdMateria, item.nota, item.fecha))
            const id:number = notas[notas.length - 1].getId() + 1
            objetoNuevo = new NotaModel(id, req.body.legajo, req.body.idMateria, req.body.nota, req.body.fecha)
            notas.push(objetoNuevo)
            codigo = this.HTTP_CREATED
            salida = notas
            fs.writeFile('./data/extras/sys-notas.json', JSON.stringify(notas))
        } catch (error) {
            codigo = this.HTTP_SERVER_ERROR
            salida = {error:"No se pudo Agregar el registro"}
        }
        return res.status(codigo).json(salida)
    }

    public getNotasXLegajo = async (req: Request, res: Response): Promise<Response> => {
        let { legajo } = req.params
        let salida: object
        let codigo: number
        try {
            const data: string = await fs.readFile('./data/extras/sys-notas.json', 'utf-8')            
            const notas: NotaModel[] = JSON.parse(data).map((item: any) => new NotaModel(item.id, item.legajo,item.IdMateria, item.nota, item.fecha))
            const notasResultado: NotaModel[] = notas.filter(nota =>                 
                nota.getLegajo() === Number(legajo))
            console.log(notasResultado.length)
            if ( notasResultado.length === 0 ){
                codigo = this.HTTP_NOT_FOUND
                salida = {error: `Legajo No encontrado`}
            }
            else {
                codigo = this.HTTP_OK
                salida = notasResultado
            }
        } catch (error) {
            codigo = this.HTTP_SERVER_ERROR
            salida = {error: `Legajo No encontrado`}
        }
        return res.status(codigo).json(salida)
    }
}