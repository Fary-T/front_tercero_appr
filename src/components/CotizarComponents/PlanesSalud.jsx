
const PlanesSalud = [
    {
        tipo: 'salud',
        title: 'Plan Básico Salud',
        precio: '$20/mes',
        puntos: ['Consultas médicas generales', 'Descuentos en farmacia', 'Red de clínicas locales'],
        cobertura: ['Consultas generales', 'Medicamentos básicos', 'Exámenes de rutina'],
        beneficios: ['Atención médica asequible', 'Ideal para chequeos regulares', 'Red de clínicas locales'],
        ventajas: ['Bajo costo', 'Cobertura nacional', 'Atención inmediata'],
        publico: 'Estudiantes, jóvenes trabajadores, personas con bajo presupuesto',
        popular: false
    },
    {
        tipo: 'salud',
        title: 'Plan Familiar Salud',
        precio: '$45/mes',
        puntos: ['Cobertura familiar completa', 'Atención pediátrica', 'Urgencias 24/7'],
        cobertura: ['Consultas especialistas', 'Medicamentos avanzados', 'Hospitalización básica'],
        beneficios: ['Acceso a médicos especialistas', 'Cobertura en tratamientos comunes', 'Apoyo hospitalario limitado'],
        ventajas: ['Cobertura amplia', 'Ideal para familias pequeñas', 'Red de hospitales asociados'],
        publico: 'Familias jóvenes, trabajadores con cargas familiares, personas con condiciones crónicas',
        popular: true
    },
    {
        tipo: 'salud',
        title: 'Plan Premium Salud',
        precio: '$70/mes',
        puntos: ['Hospitalización incluida', 'Chequeos anuales gratis', 'Atención internacional'],
        cobertura: ['Hospitalización completa', 'Cirugías', 'Atención internacional'],
        beneficios: ['Cobertura total en situaciones médicas graves', 'Atención médica internacional', 'Beneficios VIP'],
        ventajas: ['Red privada de clínicas premium', 'Cobertura global', 'Atención sin límites de uso'],
        publico: 'Empresarios, ejecutivos, viajeros frecuentes, personas con alto riesgo médico',
        popular: false
    }
];

export default PlanesSalud;
