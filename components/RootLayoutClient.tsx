'use client';

import { ConfigProvider, App as AntdApp } from 'antd';
import { ReactNode } from 'react';
import { Layout } from '@/components/Layout';

export function RootLayoutClient({ children }: { children: ReactNode }) {
    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#1890ff',
                },
            }}
        >
            <AntdApp>
                <Layout>{children}</Layout>
            </AntdApp>
        </ConfigProvider>
    );
}
