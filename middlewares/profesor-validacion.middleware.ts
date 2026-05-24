import { Request, Response, NextFunction } from "express";

export const validarProfesor = (req: Request, res: Response, next: NextFunction) => {
  const { nombre, apellido, email, dni, cargo, isActive, materias } = req.body;

  const error = [];

  if (nombre === "" || nombre === undefined || typeof nombre !== "string") {
    error.push("Ingrese un nombre valido");
  }
  if (apellido === "" || apellido === undefined || typeof apellido !== "string") {
    error.push("Ingrese un apellido valido");
  }
  if (email === "" || email === undefined || typeof email !== "string") {
    error.push("Ingrese un mail valido");
  }
  if (dni === undefined || typeof dni !== "number") {
    error.push("Ingrese un dni valido");
  }
  if (cargo === "" || cargo === undefined || typeof cargo !== "string") {
    error.push("Ingrese un cargo valido");
  }
  if (isActive === undefined || typeof isActive !== "boolean") {
    error.push("Ingrese un estado valido: verdadero o falso");
  }
  if (
    !Array.isArray(materias) ||
    materias.length === 0 ||
    materias.some((materia) => typeof materia !== "string")
  ) {
    error.push("Ingrese un array de materias valido");
  }

  if (error.length > 0) {
    return res.status(400).json({ msg: "Datos invalidos", error });
  }

  next();
};
