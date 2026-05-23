import { Request, Response, NextFunction } from 'express';
import { NumerosMagicos } from '../util/numeros-magicos';

export class NotaValidacionMiddleware extends NumerosMagicos{   
    public validarNota = (req: Request, res: Response, next: NextFunction) => {
        const { legajo, idMateria, nota, fecha } = req.body;
        let errores: string[] = []

        const legajoNum = this.validarNumeroPositivo(legajo);
        if (legajoNum === null) {
            errores.push('legajo debe ser un número positivo');            
        }       
        const notaNum = this.validarNotaRango(nota);
        if (notaNum === null) {
            errores.push('nota debe ser un número entre 0 y 10' );
        }
        if (errores.length > 0) {
            return res.status(this.HTTP_BAD_REQUEST).json({msg:'Datos Invalidos', errores})
        }
        next();
    }

        private validarNumeroPositivo(valor: any): number | null {
        const num = Number(valor);
        if (isNaN(num) || num <= 0) return null;
        return num;
    }

    private validarNotaRango(valor: any): number | null {
        const num = Number(valor);
        if (isNaN(num) || num < 0 || num > 10) return null;
        return num;
    }
    
}