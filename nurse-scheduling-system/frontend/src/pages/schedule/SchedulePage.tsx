import React from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

const SchedulePage: React.FC = () => {
  return (
    <div>
      <Title level={2}>ตารางเวร</Title>
      <p>หน้าจัดการตารางเวร (อยู่ระหว่างการพัฒนา)</p>
    </div>
  );
};

export default SchedulePage;