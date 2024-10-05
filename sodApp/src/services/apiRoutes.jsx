const API_BASE_URL = 'http://localhost:3000/api'

const apiClientes = {
    //!GET
    todosClientes: '/clientes',

    //!POST
    crearCliente: '/clientes',

    //! DELETE
    eliminarCliente: (id) => `/clientes/${id}`
}

const apiZonas = {
    //!GET
    todasZonas: '/zonas',
}

const apiDias = {
    //!GET
    todosDias: '/dia',
}

const apiProducto = {
    //!GET
    todosProductos: '/producto',
}

export default { API_BASE_URL, apiClientes, apiZonas, apiDias, apiProducto };