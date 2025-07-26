import React from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

const NursesPage: React.FC = () => {
  return (
    <div>
      <Title level={2}>จัดการพยาบาล</Title>
      <p>หน้าจัดการข้อมูลพยาบาล (อยู่ระหว่างการพัฒนา)</p>
    </div>
  );
};

export default NursesPage;