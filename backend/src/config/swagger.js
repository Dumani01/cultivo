const swaggerJsdoc = require('swagger-jsdoc');
module.exports = swaggerJsdoc({
  definition: {
    openapi: '3.0.3',
    info: { title: 'GrowLab | Laboratorio #5 + eCommerce', version: '1.0.0', description: 'API REST Express, catálogo, pedidos, notas, Claude y panel de administración.' },
    servers: [{ url: '/' }],
    tags: [{ name: 'Notas' }, { name: 'IA' }, { name: 'Tienda' }, { name: 'Administración' }, { name: 'Sistema' }],
    paths: {
      '/api-docs': {get:{tags:['Sistema'],summary:'Abre Swagger UI',responses:{200:{description:'Interfaz HTML de documentación'}}}},
      '/api/health': {get:{tags:['Sistema'],summary:'Estado del backend',responses:{200:{description:'Servicio activo'}}}},
      '/api/openapi.json': {get:{tags:['Sistema'],summary:'Especificación OpenAPI JSON',responses:{200:{description:'Documento OpenAPI'}}}},
      '/api/admin/session': {get:{tags:['Administración'],summary:'Verifica la sesión administrativa',responses:{200:{description:'Sesión activa'},401:{description:'Sesión requerida'}}}},
      '/api/admin/logout': {post:{tags:['Administración'],summary:'Cierra la sesión y elimina cookie',responses:{200:{description:'Sesión terminada'}}}},
      '/api/admin/pedidos': {get:{tags:['Administración'],summary:'Lista pedidos privados',responses:{200:{description:'Pedidos'},401:{description:'No autorizado'}}}},
      '/api/admin/pedidos/{id}': {patch:{tags:['Administración'],summary:'Actualiza estado de pedido y restaura stock si cancela',parameters:[{in:'path',name:'id',required:true,schema:{type:'integer'}}],responses:{200:{description:'Estado actualizado'},409:{description:'Transición inválida'}}}},
      '/api/admin/clientes': {get:{tags:['Administración'],summary:'Lista clientes agregados a partir de pedidos',responses:{200:{description:'Clientes y pedidos'}}}},
      '/api/admin/productos': {get:{tags:['Administración'],summary:'Inventario completo (incluye ocultos)',responses:{200:{description:'Productos'}}},post:{tags:['Administración'],summary:'Crea producto',responses:{201:{description:'Producto creado'},400:{description:'Datos inválidos'}}}},
      '/api/admin/productos/{id}': {patch:{tags:['Administración'],summary:'Edita precio, stock y visibilidad',parameters:[{in:'path',name:'id',required:true,schema:{type:'integer'}}],responses:{200:{description:'Producto actualizado'},404:{description:'No encontrado'}}},delete:{tags:['Administración'],summary:'Archiva producto sin destruir historial',parameters:[{in:'path',name:'id',required:true,schema:{type:'integer'}}],responses:{200:{description:'Producto archivado'}}}},
    },
    components: {
      schemas: {
        NotaNueva: { type: 'object', required: ['titulo', 'contenido'], properties: { titulo: { type: 'string', minLength: 1, maxLength: 100 }, contenido: { type: 'string', minLength: 1, maxLength: 5000 } } },
        Nota: { allOf: [{ $ref: '#/components/schemas/NotaNueva' }, { type: 'object', properties: { id: { type: 'integer' } } }] },
        Pregunta: { type: 'object', required: ['pregunta'], properties: { pregunta: { type: 'string', minLength: 3, maxLength: 2000 } } },
        Producto: { type: 'object', properties: { id: { type: 'integer' }, nombre: { type: 'string' }, precio: { type: 'integer' }, stock: { type: 'integer' }, regulado: { type: 'boolean' } } },
        PedidoNuevo: { type: 'object', required: ['nombre', 'email', 'telefono', 'provincia', 'direccion', 'items'], properties: { nombre: { type: 'string' }, email: { type: 'string', format: 'email' }, telefono: { type: 'string' }, provincia: { type: 'string' }, direccion: { type: 'string' }, items: { type: 'array', items: { type: 'object', properties: { productoId: { type: 'integer' }, cantidad: { type: 'integer' } } } } } },
      },
    },
  },
  apis: [require('path').join(__dirname, '../routes/*.js')],
});
