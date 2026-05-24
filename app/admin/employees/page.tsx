'use client';

import { useState, useEffect } from 'react';
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    Popconfirm,
    Space,
    Select,
    Spin,
    App,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import api from '@/lib/api';
import { ProtectedRoute } from '@/components/ProtectedRoute';

interface Employee {
    id: string;
    name: string;
    email: string;
    employeeCode: string;
    department: string;
    position: string;
    role: string;
    createdAt: string;
}

export default function AdminEmployeesPage() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form] = Form.useForm();
    const { message } = App.useApp();

    const fetchEmployees = async () => {
        setLoading(true);
        try {
            const response = await api.get('/employees');
            const employeeList = Array.isArray(response.data) ? response.data : response.data.data || [];
            // Transform employees to flatten the user object
            const transformed = employeeList.map((emp: any) => ({
                id: emp.id,
                name: emp.user?.name || '',
                email: emp.user?.email || '',
                employeeCode: emp.employeeCode,
                department: emp.department,
                position: emp.position,
                role: emp.user?.role || 'EMPLOYEE',
                createdAt: emp.createdAt,
            }));
            setEmployees(transformed);
        } catch (error: any) {
            message.error('Failed to fetch employees');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleAddClick = () => {
        setEditingId(null);
        form.resetFields();
        setModalVisible(true);
    };

    const handleEdit = (employee: Employee) => {
        setEditingId(employee.id);
        form.setFieldsValue({
            name: employee.name,
            email: employee.email,
            employeeCode: employee.employeeCode,
            department: employee.department,
            position: employee.position,
        });
        setModalVisible(true);
    };

    const handleDelete = async (id: string) => {
        try {
            await api.delete(`/employees/${id}`);
            message.success('Employee deleted successfully');
            fetchEmployees();
        } catch (error: any) {
            message.error(error.response?.data?.message || 'Failed to delete employee');
        }
    };

    const handleSubmit = async (values: any) => {
        try {
            if (editingId) {
                await api.patch(`/employees/${editingId}`, values);
                message.success('Employee updated successfully');
            } else {
                await api.post('/employees', {
                    ...values,
                    password: values.password || 'password123',
                });
                message.success('Employee created successfully');
            }
            setModalVisible(false);
            form.resetFields();
            fetchEmployees();
        } catch (error: any) {
            message.error(error.response?.data?.message || 'Operation failed');
        }
    };

    const columns = [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Employee Code', dataIndex: 'employeeCode', key: 'employeeCode' },
        { title: 'Department', dataIndex: 'department', key: 'department' },
        { title: 'Position', dataIndex: 'position', key: 'position' },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: Employee) => (
                <Space>
                    <Button
                        type="primary"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    >
                        Edit
                    </Button>
                    <Popconfirm
                        title="Delete Employee"
                        description="Are you sure you want to delete this employee?"
                        onConfirm={() => handleDelete(record.id)}
                    >
                        <Button type="primary" danger size="small" icon={<DeleteOutlined />}>
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <ProtectedRoute requiredRole="ADMIN">
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                    <h1>Employees</h1>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleAddClick}
                    >
                        Add Employee
                    </Button>
                </div>

                <Spin spinning={loading}>
                    <Table
                        columns={columns}
                        dataSource={employees}
                        rowKey="id"
                        pagination={{ pageSize: 10 }}
                    />
                </Spin>

                <Modal
                    title={editingId ? 'Edit Employee' : 'Add Employee'}
                    open={modalVisible}
                    onOk={form.submit}
                    onCancel={() => setModalVisible(false)}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                    >
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[{ required: true, message: 'Please input name!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                { required: true, message: 'Please input email!' },
                                { type: 'email', message: 'Invalid email!' },
                            ]}
                        >
                            <Input type="email" />
                        </Form.Item>

                        {!editingId && (
                            <Form.Item
                                label="Password"
                                name="password"
                                rules={[{ required: !editingId, message: 'Please input password!' }]}
                            >
                                <Input.Password placeholder="Default: password123" />
                            </Form.Item>
                        )}

                        <Form.Item
                            label="Employee Code"
                            name="employeeCode"
                            rules={[{ required: true, message: 'Please input employee code!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Department"
                            name="department"
                            rules={[{ required: true, message: 'Please input department!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Position"
                            name="position"
                            rules={[{ required: true, message: 'Please input position!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </ProtectedRoute>
    );
}
