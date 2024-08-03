import React, {useState} from 'react';
import {BrowserRouter, useNavigate} from "react-router-dom";
import AppRouter from "./components/AppRoutes";
import MyHeader from "./components/Header/Header";
import {Breadcrumb, Layout, Menu, MenuProps, theme} from "antd";
import {
    AliwangwangOutlined,
    AndroidOutlined,
    FileOutlined, GlobalOutlined,
    TeamOutlined,
    UserOutlined
} from "@ant-design/icons";
import {EMPLOYER_ROUTE, HOME_ROUTE, WORK_STATION_TASKS_ROUTE} from "./utils/consts";
import Link from "antd/es/typography/Link";

const {Header, Content, Footer, Sider} = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
    } as MenuItem;
}


const App = () => {
    const navigate = useNavigate();

    const [collapsed, setCollapsed] = useState(false);
    const {
        token: {colorBgContainer, borderRadiusLG},
    } = theme.useToken();

    const onMenuItemClick = (event: React.MouseEvent<HTMLElement>) => {
        const type = event.currentTarget.innerText

        console.log(type);

        switch (type.toLocaleLowerCase()) {
            case "home":
                const home_params = new URLSearchParams({})
                navigate(`${HOME_ROUTE}?${home_params.toString()}`)
                break
            case "ws tasks":
                const ws_params = new URLSearchParams({})
                navigate(`${WORK_STATION_TASKS_ROUTE}?${ws_params.toString()}`)
                break
            case "workers":
                const employer_params = new URLSearchParams({})
                navigate(`${WORK_STATION_TASKS_ROUTE}?${employer_params.toString()}`)
                break
            default:
                break
        }
    };

    const employerClick = (event: React.MouseEvent<HTMLElement>) => {
        const type = event.currentTarget.innerText.split(" ");

        const home_params = new URLSearchParams({first_name: type[0], last_name: type[1]});
        navigate(`${EMPLOYER_ROUTE}?${home_params.toString()}`)
    }

    const items: MenuItem[] = [
        getItem(<Link onClick={(event) => onMenuItemClick(event)}>Home</Link>, '22', <GlobalOutlined/>),
        getItem(<Link onClick={(event) => onMenuItemClick(event)}>Robots Inspection</Link>, '1', <AndroidOutlined/>),
        getItem(<Link onClick={(event) => onMenuItemClick(event)}>WS Tasks</Link>, '2', <AliwangwangOutlined/>),
        getItem('Employers', 'sub1', <TeamOutlined/>, [
            getItem(<Link onClick={(event) => employerClick(event)}>DMYTRO DEMBOVSKYI</Link>, '3', <UserOutlined/>),
            getItem(<Link onClick={(event) => employerClick(event)}>SERHII LASHCHUK</Link>, '4', <UserOutlined/>),
            getItem(<Link onClick={(event) => employerClick(event)}>YAROSLAV TROKHYMCHUK</Link>, '5', <UserOutlined/>),
            getItem(<Link onClick={(event) => employerClick(event)}>DMITRII ZABIIAKA</Link>, '6', <UserOutlined/>),
            getItem(<Link onClick={(event) => employerClick(event)}>KOSTIANYN KRYVONIS</Link>, '7', <UserOutlined/>),
            getItem(<Link onClick={(event) => employerClick(event)}>ANTON SIDORENKO</Link>, '8', <UserOutlined/>),
            getItem(<Link onClick={(event) => employerClick(event)}>DMYTRO KOLOMIIETS</Link>, '9', <UserOutlined/>),
            getItem(<Link onClick={(event) => employerClick(event)}>MYKYTA KYRYLOV</Link>, '10', <UserOutlined/>),
            getItem(<Link onClick={(event) => employerClick(event)}>VLADYSLAV LESIUK</Link>, '11', <UserOutlined/>),
            getItem(<Link onClick={(event) => employerClick(event)}>DMYTRO PANKIV</Link>, '12', <UserOutlined/>),
            getItem(<Link onClick={(event) => employerClick(event)}>DENYS KHARYTONCHUK</Link>, '13', <UserOutlined/>),
        ]),
        getItem(<Link onClick={(event) => onMenuItemClick(event)}>Files</Link>, '9', <FileOutlined/>),
    ];

    return (
        <Layout style={{minHeight: '100vh'}}>
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div className="demo-logo-vertical"/>
                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items}/>
            </Sider>
            <Layout>
                <MyHeader/>
                <Content style={{margin: '0 16px'}}>
                    <Breadcrumb style={{margin: '16px 0'}}>
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
                        <AppRouter/>
                    </div>
                </Content>
                <Footer style={{textAlign: 'center'}}>
                    TK Web ©{new Date().getFullYear()} Created by Nookon
                </Footer>
            </Layout>
        </Layout>
    );
};

export default App;