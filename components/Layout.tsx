'use client';

import { ReactNode, useState, useEffect } from 'react';
import { Layout as AntLayout, Menu, Button, Drawer } from 'antd';
import { LogoutOutlined, MenuOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { logout, getUser, type User } from '@/lib/auth';
import { usePathname } from 'next/navigation';

const { Header, Sider, Content, Footer } = AntLayout;

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isDesktop, setIsDesktop] = useState<boolean>(false);
  const pathname = usePathname();

  // Load client-only auth state after hydration so server and first client render match.
  useEffect(() => {
    const t = setTimeout(() => {
      setMounted(true);
      setUser(getUser());
      setSelectedKeys([pathname]);
    }, 0);
    return () => clearTimeout(t);
  }, [pathname]);

  useEffect(() => {
    if (!mounted) return;
    if (typeof window === 'undefined') return;
    const check = () => setIsDesktop(window.innerWidth >= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [mounted]);

  // Don't show layout on login page
  if (pathname === '/login') {
    return <>{children}</>;
  }

  const adminMenuItems = [
    {
      key: '/admin/employees',
      label: <Link href="/admin/employees">Employees</Link>,
    },
    {
      key: '/admin/attendances',
      label: <Link href="/admin/attendances">Attendances</Link>,
    },
  ];

  const employeeMenuItems = [
    {
      key: '/employee/check-in',
      label: <Link href="/employee/check-in">Check-in</Link>,
    },
    {
      key: '/employee/history',
      label: <Link href="/employee/history">History</Link>,
    },
  ];

  const menuItems = !mounted ? [] : user?.role === 'ADMIN' ? adminMenuItems : employeeMenuItems;

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      {/* Desktop Sidebar */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={200}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          display: collapsed ? 'none' : 'block',
        }}
        className="hidden md:block"
      >
        <div style={{ padding: '16px', textAlign: 'center', color: 'white' }}>
          <h2 style={{ margin: 0, fontSize: '14px' }}>Attendance</h2>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={mounted ? selectedKeys : []}
          items={menuItems}
        />
      </Sider>

      {/* Mobile Drawer */}
      <Drawer
        title="Menu"
        placement="left"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        className="md:hidden"
      >
        <Menu
          mode="vertical"
          selectedKeys={mounted ? selectedKeys : []}
          items={menuItems}
          onClick={() => setDrawerVisible(false)}
        />
      </Drawer>

      <AntLayout style={{ marginLeft: collapsed ? 0 : 200 }}>
        <Header
          style={{
            background: '#fff',
            padding: '0 24px',
            boxShadow: '0 1px 4px rgba(0,0,0,.15)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {mounted && (
              <Button
                type="text"
                icon={<MenuOutlined />}
                onClick={() => {
                  if (isDesktop) setCollapsed(!collapsed);
                  else setDrawerVisible(true);
                }}
                aria-label="Toggle menu"
              />
            )}
            <span>{mounted ? user?.name : ''}</span>
          </div>
          <Button
            type="primary"
            danger
            icon={<LogoutOutlined />}
            onClick={logout}
          >
            Logout
          </Button>
        </Header>
        <Content style={{ margin: '24px' }}>
          {children}
        </Content>
        <Footer style={{ textAlign: 'center', color: '#666' }}>
          WFH Attendance Monitoring System ©2026
        </Footer>
      </AntLayout>
    </AntLayout>
  );
}
