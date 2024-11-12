import { useState } from 'react';
import { Table, Button, Modal, List, Spin, Alert } from 'antd';
import useFetchZonas from '../../routes/fetchs/fetchZonas';
import useFetchBarrios from '../../routes/fetchs/fetchBarrios'; // Importa el hook para obtener barrios

const ZonasTable = () => {
  const [visible, setVisible] = useState(false);
  const [barriosFiltrados, setBarriosFiltrados] = useState([]);
  const [selectedZona, setSelectedZona] = useState('');
  const { zonas, loading: loadingZonas, error: errorZonas } = useFetchZonas();
  const { barrios, loading: loadingBarrios, error: errorBarrios } = useFetchBarrios();

  const showModal = (idZona, nombreZona) => {
    setSelectedZona(nombreZona);

    // Filtrar barrios según la zona seleccionada
    const barriosZona = barrios.filter(barrio => barrio.idZona === idZona);
    setBarriosFiltrados(barriosZona);
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const columns = [
    {
      title: 'Zona',
      dataIndex: 'nombreZona',
      key: 'nombreZona',
    },
    {
      title: 'Acción',
      key: 'action',
      render: (text, record) => (
        <Button type="primary" onClick={() => showModal(record.idZona, record.nombreZona)}>
          Ver Barrios
        </Button>
      ),
    },
  ];

  if (loadingZonas || loadingBarrios) return <Spin tip="Cargando zonas y barrios..." />;
  if (errorZonas || errorBarrios) return <Alert message="Error al cargar zonas o barrios" type="error" />;

  return (
    <>
      <h1>Zonas</h1>
      <Table columns={columns} dataSource={zonas} rowKey="idZona" pagination={{ pageSize: 5 }}  />

      <Modal
        title={`Barrios en la Zona ${selectedZona}`}
        visible={visible}
        onCancel={handleCancel}
        footer={null}
      >
        <List
          bordered
          dataSource={barriosFiltrados}
          renderItem={(barrio) => <List.Item>{barrio.nombreBarrio}</List.Item>}
        />
      </Modal>
    </>
  );
};

export default ZonasTable;
