import { useState, useEffect } from 'react';
import { Table, Button, Modal, List } from 'antd';
import zonasData from '../../data/zonas/zonas.json';

const ZonasTable = () => {
    const [zonas, setZonas] = useState([]);
    const [visible, setVisible] = useState(false);
    const [barrios, setBarrios] = useState([]);
    const [selectedZona, setSelectedZona] = useState('');

useEffect(() => {
// Convertir el objeto zonasData en un array de objetos para la tabla
const zonasArray = Object.keys(zonasData).map((zona) => ({
    key: zona,
    zona: zona,
    barrios: zonasData[zona],
}));
setZonas(zonasArray);
}, []);

const showModal = (zona) => {
    setSelectedZona(zona);
    setBarrios(zonasData[zona]);
    setVisible(true);
};

const handleCancel = () => {
    setVisible(false);
};

const columns = [
    {
    title: 'Zona',
    dataIndex: 'zona',
    key: 'zona',
    },
    {
    title: 'Acción',
    key: 'action',
    render: (text, record) => (
        <Button type="primary" onClick={() => showModal(record.zona)}>
        Ver Barrios
        </Button>
    ),
    },
];

return (
    <>
        <Table columns={columns} dataSource={zonas} pagination={false} />

        <Modal
            title={`Barrios en la Zona ${selectedZona}`}
            visible={visible}
            onCancel={handleCancel}
            footer={null}
        >
        <List
            bordered
            dataSource={barrios}
            renderItem={(barrio) => <List.Item>{barrio}</List.Item>}
        />
        </Modal>
    </>
);
};

export default ZonasTable;
