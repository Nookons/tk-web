import {
    ADD_SHIFT_ROUTE,
    EMPLOYER_ROUTE,
    HOME_ROUTE,
    ROBOT_INSPECTION_ROUTE, SHIELDS_SCREEN_ROUTE,
    SIGN_IN_ROUTE,
    WORK_STATION_TASKS_ROUTE
} from "./utils/consts";
import Home from "./pages/Home/Home";
import WorkStationTasks from "./pages/WorkStationTasks/WorkStationTasks";
import Employer from "./pages/Employer/Employer";
import RobotsInspection from "./pages/RobotsInspection/RobotsInspection";
import SignIn from "./pages/SignIn/SignIn";
import ShieldsScreen from "./pages/ShieldsScreen/ShieldsScreen";
import AddShifts from "./pages/AddShift/AddShifts";


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
    {
        path: ROBOT_INSPECTION_ROUTE,
        Component: RobotsInspection,
        label: 'Robots Inspection',
    },
    {
        path: SIGN_IN_ROUTE,
        Component: SignIn,
        label: 'SignIn',
    },
    {
        path: SHIELDS_SCREEN_ROUTE,
        Component: ShieldsScreen,
        label: 'Shields Screen',
    },
    {
        path: ADD_SHIFT_ROUTE,
        Component: AddShifts,
        label: 'Add Shifts',
    },
];