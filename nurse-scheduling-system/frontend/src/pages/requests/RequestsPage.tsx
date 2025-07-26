import React from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

const RequestsPage: React.FC = () => {
  return (
    <div>
      <Title level={2}>คำขอ</Title>
      <p>หน้าจัดการคำขอลาและแลกเปลี่ยนเวร (อยู่ระหว่างการพัฒนา)</p>
    </div>
  );
};

export default RequestsPage;