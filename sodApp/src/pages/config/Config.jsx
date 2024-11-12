import './config.css';
import { Tabs } from 'antd';
import Zonas from '../zonas/Zonas'
import Usuarios from '../usuarios/Usuarios';
import Barrios from '../barrios/Barrios';
import Productos from '../productos/Productos';

const onChange = (key) => {
  console.log(key);
};

const items = [
  {
    key: '1',
    label: 'Usuarios',
    children: <Usuarios/>,
  },
  {
    key: '2',
    label: 'Zonas',
    children: <Zonas/>,
  },
  {
    key: '3',
    label: 'Barrios',
    children: <Barrios/>,
  },
  {
    key: '4',
    label: 'Productos',
    children: <Productos/>,
  }
];

const Config = () => {
  return (
    <div className="config">
      {/* <h1>Config</h1> */}
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </div>
  );
};

export default Config;
