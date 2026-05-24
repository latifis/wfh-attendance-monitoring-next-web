'use client';

import { useState } from 'react';
import { Form, Input, Button, Card, Spin, App } from 'antd';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { setAuth } from '@/lib/auth';

interface LoginResponse {
    status: string;
    message: string;
    data: {
        accessToken: string;
        user: {
            id: string;
            email: string;
            name: string;
            role: 'ADMIN' | 'EMPLOYEE';
            employeeCode?: string;
            department?: string;
            position?: string;
        };
    };
}

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [form] = Form.useForm();
    const { message } = App.useApp();

    const onFinish = async (values: { email: string; password: string }) => {
        setLoading(true);
        try {
            const response = await api.post<LoginResponse>('/auth/login', {
                email: values.email,
                password: values.password,
            });

            const { accessToken, user } = response.data.data;
            setAuth(accessToken, user);
            message.success('Login successful!');

            // Redirect based on role
            if (user.role === 'ADMIN') {
                router.push('/admin/employees');
            } else {
                router.push('/employee/check-in');
            }
        } catch (error: any) {
            message.error(error.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
            <Card
                title="WFH Attendance Monitoring"
                style={{ width: 400 }}
            >
                <Spin spinning={loading}>
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                    >
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                { required: true, message: 'Please input your email!' },
                                { type: 'email', message: 'Invalid email!' },
                            ]}
                        >
                            <Input type="email" placeholder="Enter your email" />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                            <Input.Password placeholder="Enter your password" />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                block
                                loading={loading}
                            >
                                Login
                            </Button>
                        </Form.Item>
                    </Form>
                </Spin>
            </Card>
        </div>
    );
}
