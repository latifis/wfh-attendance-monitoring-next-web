'use client';

import { useState, useEffect } from 'react';
import { Table, Image, Spin, Space, Button, Modal, Input, App } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import api from '@/lib/api';
import { ProtectedRoute } from '@/components/ProtectedRoute';

interface Attendance {
    id: string;
    employeeName: string;
    employeeCode: string;
    department: string;
    position: string;
    attendanceDate: string;
    checkInTime: string;
    note: string;
    photoPath: string;
}

export default function AdminAttendancesPage() {
    const [attendances, setAttendances] = useState<Attendance[]>([]);
    const [loading, setLoading] = useState(true);
    const [photoUrl, setPhotoUrl] = useState<string>('');
    const [photoModalVisible, setPhotoModalVisible] = useState(false);
    const { message } = App.useApp();

    const fetchAttendances = async () => {
        setLoading(true);
        try {
            const response = await api.get('/attendances');
            const attendanceList = Array.isArray(response.data) ? response.data : response.data.data || [];
            const data = attendanceList.map((item: any) => ({
                id: item.id,
                employeeName: item.employee?.user?.name || 'N/A',
                employeeCode: item.employee?.employeeCode || 'N/A',
                department: item.employee?.department || 'N/A',
                position: item.employee?.position || 'N/A',
                attendanceDate: item.attendanceDate
                    ? new Date(item.attendanceDate).toLocaleDateString()
                    : 'N/A',
                checkInTime: item.checkInTime
                    ? new Date(item.checkInTime).toLocaleTimeString()
                    : '-',
                note: item.note || '-',
                photoPath: item.photoPath,
            }));
            setAttendances(data);
        } catch (error: any) {
            message.error('Failed to fetch attendances');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendances();
    }, []);

    const handleViewPhoto = (photoPath: string) => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        setPhotoUrl(`${apiUrl}/${photoPath}`);
        setPhotoModalVisible(true);
    };

    const columns = [
        { title: 'Employee Name', dataIndex: 'employeeName', key: 'employeeName' },
        { title: 'Employee Code', dataIndex: 'employeeCode', key: 'employeeCode' },
        { title: 'Department', dataIndex: 'department', key: 'department' },
        { title: 'Position', dataIndex: 'position', key: 'position' },
        { title: 'Date', dataIndex: 'attendanceDate', key: 'attendanceDate' },
        { title: 'Check-in Time', dataIndex: 'checkInTime', key: 'checkInTime' },
        { title: 'Note', dataIndex: 'note', key: 'note' },
        {
            title: 'Photo',
            key: 'photo',
            render: (_: any, record: Attendance) => (
                <Button
                    type="primary"
                    size="small"
                    icon={<EyeOutlined />}
                    onClick={() => handleViewPhoto(record.photoPath)}
                >
                    View
                </Button>
            ),
        },
    ];

    return (
        <ProtectedRoute requiredRole="ADMIN">
            <div>
                <h1>Attendances</h1>

                <Spin spinning={loading}>
                    <Table
                        columns={columns}
                        dataSource={attendances}
                        rowKey="id"
                        pagination={{ pageSize: 10 }}
                        scroll={{ x: 1200 }}
                    />
                </Spin>

                <Modal
                    title="Check-in Photo"
                    open={photoModalVisible}
                    onCancel={() => setPhotoModalVisible(false)}
                    footer={null}
                    centered
                >
                    <div style={{ textAlign: 'center' }}>
                        <Image
                            src={photoUrl}
                            alt="Check-in photo"
                            style={{ maxHeight: '500px', maxWidth: '100%' }}
                        />
                    </div>
                </Modal>
            </div>
        </ProtectedRoute>
    );
}
