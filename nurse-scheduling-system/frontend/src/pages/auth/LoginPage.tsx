import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { Form, Input, Button, Card, Alert, Typography } from 'antd';
import { UserOutlined, LockOutlined, MedicineBoxOutlined } from '@ant-design/icons';
import { RootState } from '../../store/store';
import { login, clearError } from '../../store/slices/authSlice';

const { Title, Text } = Typography;

const LoginPage: React.FC = () => {
  const dispatch = useDispatch();
  const { user, token, isLoading, error } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const onFinish = (values: { username: string; password: string }) => {
    dispatch(login(values) as any);
  };

  if (token && user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <Card 
        style={{ 
          width: '100%', 
          maxWidth: 400,
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <MedicineBoxOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 16 }} />
          <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
            WernDee
          </Title>
          <Text type="secondary">ระบบจัดตารางเวรพยาบาลอัตโนมัติ</Text>
        </div>

        {error && (
          <Alert
            message="เข้าสู่ระบบไม่สำเร็จ"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
            closable
            onClose={() => dispatch(clearError())}
          />
        )}

        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'กรุณากรอกชื่อผู้ใช้!' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="ชื่อผู้ใช้" 
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'กรุณากรอกรหัสผ่าน!' }]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="รหัสผ่าน" 
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={isLoading}
              style={{ width: '100%' }}
            >
              เข้าสู่ระบบ
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            ข้อมูลทดสอบ: admin / admin123
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;