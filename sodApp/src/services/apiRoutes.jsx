const API_BASE_URL = 'http://localhost:3000/api'

const apiClientes = {
    //!GET
    todosClientes: '/clientes',
    clienteID: (id) =>  `/clientes/${id}`,

    //!POST
    crearCliente: '/clientes',

    //! DELETE
    eliminarCliente: (id) => `/clientes/${id}`,

    //!PUT
    editarCliente: (id) => `/clientes/${id}`,

    //!PATCH
    modificarEstado: (id) => `/clientes/${id}/estado`
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

const apiBarrios = {
    //!GET
    todosBarrios: '/barrios',
}

const apiUsuarios = {
    //!GET
    todosUsuarios: '/users',

    //!POST
    userActivo: '/login'
}

const apiEstado = {
    //!GET
    todosEstados: '/estado',
}

export default { API_BASE_URL, apiClientes, apiZonas, apiDias, apiProducto, apiBarrios, apiUsuarios, apiEstado };