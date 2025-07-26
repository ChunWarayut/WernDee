import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, Card, Statistic, Button, Typography, Space, Timeline } from 'antd';
import {
  TeamOutlined,
  CalendarOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { RootState } from '../../store/store';
import { fetchNurses } from '../../store/slices/nurseSlice';
import { fetchSchedule } from '../../store/slices/scheduleSlice';
import { fetchMyRequests } from '../../store/slices/requestSlice';

const { Title, Text } = Typography;

const DashboardPage: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { nurses } = useSelector((state: RootState) => state.nurses);
  const { assignments, currentMonth } = useSelector((state: RootState) => state.schedules);
  const { myRequests } = useSelector((state: RootState) => state.requests);

  useEffect(() => {
    dispatch(fetchNurses() as any);
    dispatch(fetchSchedule(currentMonth) as any);
    if (user?.nurse?.id) {
      dispatch(fetchMyRequests() as any);
    }
  }, [dispatch, currentMonth, user]);

  const totalNurses = nurses.length;
  const totalSchedules = assignments.length;
  const pendingRequests = myRequests.filter(req => 
    req.status === 'PENDING_PEER_APPROVAL' || req.status === 'PENDING_ADMIN_APPROVAL'
  ).length;

  const myAssignments = assignments.filter(assignment => 
    assignment.nurse.id === user?.nurse?.id
  );

  const recentRequests = myRequests.slice(0, 5);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>แดชบอร์ด</Title>
        <Text type="secondary">
          ภาพรวมของระบบจัดตารางเวรพยาบาล
        </Text>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="จำนวนพยาบาลทั้งหมด"
              value={totalNurses}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="ตารางเวรเดือนนี้"
              value={totalSchedules}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="คำขอที่รอดำเนินการ"
              value={pendingRequests}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="เวรของฉันเดือนนี้"
              value={myAssignments.length}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card 
            title="เวรของฉันในสัปดาห์นี้"
            extra={
              <Button type="primary" icon={<CalendarOutlined />} size="small">
                ดูทั้งหมด
              </Button>
            }
          >
            {myAssignments.length > 0 ? (
              <Timeline
                items={myAssignments.slice(0, 5).map((assignment, index) => ({
                  children: (
                    <div key={index}>
                      <Text strong>
                        {new Date(assignment.date).toLocaleDateString('th-TH')}
                      </Text>
                      <br />
                      <Text>
                        เวร{assignment.shift.name} ({assignment.shift.start_time} - {assignment.shift.end_time})
                      </Text>
                    </div>
                  ),
                  color: index === 0 ? 'green' : 'blue',
                }))}
              />
            ) : (
              <Text type="secondary">ไม่มีเวรในช่วงนี้</Text>
            )}
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card 
            title="คำขอล่าสุด"
            extra={
              <Button type="primary" icon={<PlusOutlined />} size="small">
                สร้างคำขอใหม่
              </Button>
            }
          >
            {recentRequests.length > 0 ? (
              <Timeline
                items={recentRequests.map((request, index) => ({
                  children: (
                    <div key={index}>
                      <Text strong>
                        {request.request_type === 'LEAVE' ? 'ขอลา' : 'แลกเปลี่ยนเวร'}
                      </Text>
                      <br />
                      <Text type="secondary">
                        สถานะ: {
                          request.status === 'PENDING_PEER_APPROVAL' ? 'รอเพื่อนร่วมงานอนุมัติ' :
                          request.status === 'PENDING_ADMIN_APPROVAL' ? 'รอผู้ดูแลอนุมัติ' :
                          request.status === 'APPROVED' ? 'อนุมัติแล้ว' : 'ไม่อนุมัติ'
                        }
                      </Text>
                    </div>
                  ),
                  color: 
                    request.status === 'APPROVED' ? 'green' :
                    request.status === 'REJECTED' ? 'red' : 'blue',
                }))}
              />
            ) : (
              <Text type="secondary">ไม่มีคำขอ</Text>
            )}
          </Card>
        </Col>
      </Row>

      {user?.role === 'ADMIN' && (
        <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
          <Col span={24}>
            <Card title="ดำเนินการด่วน">
              <Space wrap>
                <Button type="primary" icon={<CalendarOutlined />}>
                  สร้างตารางเวรเดือนใหม่
                </Button>
                <Button icon={<TeamOutlined />}>
                  เพิ่มพยาบาลใหม่
                </Button>
                <Button icon={<FileTextOutlined />}>
                  อนุมัติคำขอ
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default DashboardPage;