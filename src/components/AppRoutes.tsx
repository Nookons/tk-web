import React from 'react';
import {Route, Routes} from 'react-router-dom'
import {publicRoutes} from "../routes";

interface RouteObject {
    path: string;
    Component: React.ComponentType<any>;
}

type PublicRoutes = RouteObject[];

const AppRouter: React.FC = () => {
    return (
        <Routes>
            {publicRoutes.map(({ path, Component }, index) => (
                <Route key={index} path={path} element={<Component />} />
            ))}
        </Routes>
    );
};

export default AppRouter;