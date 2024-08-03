import {EMPLOYER_ROUTE, HOME_ROUTE, WORK_STATION_TASKS_ROUTE} from "./utils/consts";
import Home from "./pages/Home/Home";
import WorkStationTasks from "./pages/WorkStationTasks/WorkStationTasks";
import Employer from "./pages/Employer/Employer";


interface Route {
    path: string;
    Component: React.ComponentType<any>;
    label: string;
}

type PublicRoutes = Route[];

// routes for users
export const publicRoutes: PublicRoutes = [
    {
        path: HOME_ROUTE,
        Component: Home,
        label: 'Home',
    },
    {
        path: WORK_STATION_TASKS_ROUTE,
        Component: WorkStationTasks,
        label: 'Work Station Tasks',
    },
    {
        path: EMPLOYER_ROUTE,
        Component: Employer,
        label: 'Employer page',
    },
];