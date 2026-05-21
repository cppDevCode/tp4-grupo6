const validarAlumno = (req, res, next) => {
  const { nombre, apellido, mail, isActive } = req.body

  const error = []
  if (nombre === '' || nombre === undefined || typeof nombre !== 'string') {
    error.push('Ingrese un nombre valido')
  }
  if (apellido === '' || apellido === undefined || typeof apellido !== 'string') {
    error.push('Ingrese un apellido valido')
  }
  if (mail === '' || mail === undefined || typeof mail !== 'string') {
    error.push('Ingrese un mail valido')
  }
  if (isActive === undefined || typeof isActive !== 'boolean') {
    error.push('Ingrese un estado valido: verdadero o falso')
  }

  if (error.length > 0) {
    return res.status(400).json({ msg: 'Datos inválidos: ', error })
  }

  next()
}

module.exports = { validarAlumno }
