import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import AppRouter from "./components/AppRoutes";
import MyHeader from "./components/Header/Header";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import {
    AliwangwangOutlined,
    FileOutlined, GlobalOutlined, RobotOutlined, ScheduleOutlined,
    TeamOutlined,
    UserOutlined
} from "@ant-design/icons";
import {
    EMPLOYER_ROUTE,
    HOME_ROUTE,
    ROBOT_INSPECTION_ROUTE,
    SHIELDS_SCREEN_ROUTE,
    WORK_STATION_TASKS_ROUTE
} from "./utils/consts";
import Link from "antd/es/typography/Link";
import { useAppDispatch, useAppSelector } from "./hooks/storeHooks";
import { fetchRobots } from "./store/reducers/Robots";
import SignIn from "./pages/SignIn/SignIn";
import { fetchEmployers } from "./store/reducers/Employers";

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = {
    key: React.Key;
    icon?: React.ReactNode;
    children?: MenuItem[];
    label: React.ReactNode;
};

const getItem = (
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[]
): MenuItem => ({
    key,
    icon,
    children,
    label,
});

const App = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const employers = useAppSelector(state => state.employers.items);
    const [collapsed, setCollapsed] = useState(false);

    const isCurrentUser = useAppSelector(state => state.currentUser.status)

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    useEffect(() => {
        dispatch(fetchRobots());
        dispatch(fetchEmployers());
    }, [dispatch]);

    const handleMenuClick = (key: string) => {
        switch (key) {
            case 'home':
                navigate(HOME_ROUTE);
                break;
            case 'ws-tasks':
                navigate(WORK_STATION_TASKS_ROUTE);
                break;
            case 'robots-inspection':
                navigate(ROBOT_INSPECTION_ROUTE);
                break;
            case 'shields':
                navigate(SHIELDS_SCREEN_ROUTE);
                break;
            default:
                break;
        }
    };

    const handleEmployerClick = (id: string) => {
        navigate(`${EMPLOYER_ROUTE}?id=${id}`);
    };

    const items: MenuItem[] = [
        getItem(<Link onClick={() => handleMenuClick('home')}>Home</Link>, 'home', <GlobalOutlined />),
        getItem(<Link onClick={() => handleMenuClick('robots-inspection')}>Robots Inspection</Link>, 'robots-inspection', <RobotOutlined />),
        getItem(<Link onClick={() => handleMenuClick('ws-tasks')}>WS Tasks</Link>, 'ws-tasks', <AliwangwangOutlined />),
        getItem(
            'Employers',
            'sub1',
            <TeamOutlined />,
            employers.map(employer =>
                getItem(
                    <Link onClick={() => handleEmployerClick(employer.id.toString())}>{employer.firstName} {employer.lastName}</Link>,
                    employer.id,
                    <UserOutlined />
                )
            )
        ),
        getItem(<Link onClick={() => handleMenuClick('shields')}>Shields</Link>, 'shields', <ScheduleOutlined />),
        getItem(<Link onClick={() => handleMenuClick('files')}>Files</Link>, 'files', <FileOutlined />)
    ];

    if (!isCurrentUser) {
        return <SignIn />;
    }

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
                <div className="demo-logo-vertical" />
                <Menu theme="dark" defaultSelectedKeys={['home']} mode="inline" items={items} />
            </Sider>
            <Layout>
                <MyHeader />
                <Content style={{ margin: '0 16px' }}>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>TEMP_001</Breadcrumb.Item>
                        <Breadcrumb.Item>Home</Breadcrumb.Item>
                    </Breadcrumb>
                    <div
                        style={{
                            padding: 24,
                            minHeight: 360,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        <AppRouter />
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    TK Web ©{new Date().getFullYear()} Created by Nookon
                </Footer>
            </Layout>
        </Layout>
    );
};

export default App;
