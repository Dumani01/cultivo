# Modelo de datos (DER)

```mermaid
erDiagram
    CATEGORIAS ||--o{ PRODUCTOS : contiene
    PEDIDOS ||--|{ PEDIDO_ITEMS : contiene
    PRODUCTOS ||--o{ PEDIDO_ITEMS : referencia

    CATEGORIAS {
      TEXT slug PK
      TEXT nombre
      TEXT icono
    }
    PRODUCTOS {
      INTEGER id PK
      TEXT slug UK
      TEXT categoria FK
      TEXT nombre
      INTEGER precio
      INTEGER stock
      BOOLEAN regulado
      BOOLEAN activo
    }
    PEDIDOS {
      INTEGER id PK
      TEXT codigo UK
      TEXT idempotencia UK
      TEXT nombre
      TEXT email
      TEXT telefono
      TEXT provincia
      TEXT direccion
      INTEGER subtotal
      TEXT estado
      TEXT estado_pago
    }
    PEDIDO_ITEMS {
      INTEGER id PK
      INTEGER pedido_id FK
      INTEGER producto_id FK
      TEXT nombre
      INTEGER precio
      INTEGER cantidad
      INTEGER subtotal
    }
    NOTAS {
      INTEGER id PK
      TEXT titulo
      TEXT contenido
      TEXT creado_en
    }
```

Las notas son independientes por exigencia del Laboratorio #5. El detalle del pedido conserva el nombre y precio de venta del artículo, evitando que futuros cambios al catálogo alteren los pedidos históricos. Los clientes se agrupan por correo a partir de pedidos y no requieren una tabla adicional en esta versión.
