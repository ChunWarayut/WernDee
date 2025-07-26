import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Layout as AntLayout,
  Menu,
  Avatar,
  Dropdown,
  Typography,
  Space,
  MenuProps,
} from 'antd';
import {
  DashboardOutlined,
  TeamOutlined,
  CalendarOutlined,
  FileTextOutlined,
  LogoutOutlined,
  UserOutlined,
  MedicineBoxOutlined,
} from '@ant-design/icons';
import { RootState } from '../../store/store';
import { logout } from '../../store/slices/authSlice';

const { Header, Sider, Content } = AntLayout;
const { Title, Text } = Typography;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    dispatch(logout() as any);
    navigate('/login');
  };

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'แดชบอร์ด',
    },
    {
      key: '/nurses',
      icon: <TeamOutlined />,
      label: 'จัดการพยาบาล',
    },
    {
      key: '/schedule',
      icon: <CalendarOutlined />,
      label: 'ตารางเวร',
    },
    {
      key: '/requests',
      icon: <FileTextOutlined />,
      label: 'คำขอ',
    },
  ];

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'ข้อมูลส่วนตัว',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'ออกจากระบบ',
      onClick: handleLogout,
    },
  ];

  const handleMenuClick = (item: any) => {
    navigate(item.key);
  };

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div style={{ 
          height: 64, 
          margin: 16, 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start'
        }}>
          <MedicineBoxOutlined style={{ fontSize: 24, color: '#1890ff' }} />
          {!collapsed && (
            <Title level={4} style={{ color: 'white', margin: '0 0 0 8px' }}>
              WernDee
            </Title>
          )}
        </div>
        
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>
      
      <AntLayout style={{ marginLeft: collapsed ? 80 : 200 }}>
        <Header style={{ 
          padding: '0 24px', 
          background: '#fff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 1px 4px rgba(0,21,41,.08)'
        }}>
          <div>
            <Text strong style={{ fontSize: '16px' }}>
              สวัสดี, {user?.nurse?.first_name} {user?.nurse?.last_name}
            </Text>
            <Text type="secondary" style={{ marginLeft: 8 }}>
              ({user?.role === 'ADMIN' ? 'ผู้ดูแลระบบ' : 'พยาบาล'})
            </Text>
          </div>
          
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Space style={{ cursor: 'pointer' }}>
              <Avatar icon={<UserOutlined />} />
              <Text>{user?.username}</Text>
            </Space>
          </Dropdown>
        </Header>
        
        <Content style={{
          margin: '24px',
          padding: '24px',
          background: '#fff',
          borderRadius: '8px',
          minHeight: 'calc(100vh - 112px)',
        }}>
          {children}
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;