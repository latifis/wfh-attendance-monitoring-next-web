'use client';

import { useState } from 'react';
import {
    Form,
    Button,
    Input,
    Card,
    Spin,
    Upload,
    UploadFile,
    App,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function EmployeeCheckInPage() {
    const [loading, setLoading] = useState(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [form] = Form.useForm();
    const router = useRouter();
    const { message } = App.useApp();

    const handleSubmit = async (values: any) => {
        if (fileList.length === 0) {
            message.error('Please upload a photo');
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('photo', fileList[0].originFileObj as File);
            formData.append('note', values.note || '');

            await api.post('/attendances/check-in', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            message.success('Check-in successful!');
            form.resetFields();
            setFileList([]);
            router.push('/employee/history');
        } catch (error: any) {
            message.error(error.response?.data?.message || 'Check-in failed');
        } finally {
            setLoading(false);
        }
    };

    const handleUploadChange = ({ fileList }: { fileList: UploadFile[] }) => {
        setFileList(fileList);
    };

    return (
        <ProtectedRoute requiredRole="EMPLOYEE">
            <div style={{ maxWidth: 500, margin: '0 auto' }}>
                <Card title="Check-in" style={{ marginTop: 24 }}>
                    <Spin spinning={loading}>
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleSubmit}
                        >
                            <Form.Item
                                label="Photo"
                                required
                            >
                                <Upload
                                    fileList={fileList}
                                    onChange={handleUploadChange}
                                    beforeUpload={() => false}
                                    accept="image/*"
                                    maxCount={1}
                                >
                                    <Button icon={<UploadOutlined />}>
                                        Click to upload photo
                                    </Button>
                                </Upload>
                            </Form.Item>

                            <Form.Item
                                label="Note (Optional)"
                                name="note"
                            >
                                <Input.TextArea rows={4} />
                            </Form.Item>

                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    block
                                    loading={loading}
                                >
                                    Check-in
                                </Button>
                            </Form.Item>
                        </Form>
                    </Spin>
                </Card>
            </div>
        </ProtectedRoute>
    );
}
