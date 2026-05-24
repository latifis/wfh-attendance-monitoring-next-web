'use client';

import { useState, useEffect } from 'react';
import { Table, Image, Spin, Button, Modal, App } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import api from '@/lib/api';
import { ProtectedRoute } from '@/components/ProtectedRoute';

interface AttendanceHistory {
    id: string;
    attendanceDate: string;
    checkInTime: string;
    note: string;
    photoPath: string;
}

export default function EmployeeHistoryPage() {
    const [attendances, setAttendances] = useState<AttendanceHistory[]>([]);
    const [loading, setLoading] = useState(true);
    const [photoUrl, setPhotoUrl] = useState<string>('');
    const [photoModalVisible, setPhotoModalVisible] = useState(false);
    const { message } = App.useApp();

    const fetchAttendances = async () => {
        setLoading(true);
        try {
            const response = await api.get('/attendances/my');
            const attendanceList = Array.isArray(response.data) ? response.data : response.data.data || [];
            const data = attendanceList.map((item: any) => ({
                id: item.id,
                attendanceDate: new Date(item.attendanceDate).toLocaleDateString(),
                checkInTime: new Date(item.checkInTime).toLocaleTimeString(),
                note: item.note || '-',
                photoPath: item.photoPath,
            }));
            setAttendances(data.sort((a: any, b: any) => new Date(b.attendanceDate).getTime() - new Date(a.attendanceDate).getTime()));
        } catch (error: any) {
            message.error('Failed to fetch attendance history');
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
        {
            title: 'Date',
            dataIndex: 'attendanceDate',
            key: 'attendanceDate',
            sorter: (a: any, b: any) =>
                new Date(a.attendanceDate).getTime() - new Date(b.attendanceDate).getTime(),
        },
        { title: 'Check-in Time', dataIndex: 'checkInTime', key: 'checkInTime' },
        { title: 'Note', dataIndex: 'note', key: 'note' },
        {
            title: 'Photo',
            key: 'photo',
            render: (_: any, record: AttendanceHistory) => (
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
        <ProtectedRoute requiredRole="EMPLOYEE">
            <div>
                <h1>Attendance History</h1>

                <Spin spinning={loading}>
                    <Table
                        columns={columns}
                        dataSource={attendances}
                        rowKey="id"
                        pagination={{ pageSize: 10 }}
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
