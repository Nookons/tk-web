export interface IRobot_problem {
    component: string[];
    id: number;
    time: number;
    username: string;
    update_time: number;
    note: string;
}

export interface IRobot {
    condition: string;
    robot_id: string;
    note: string;
    photos?: any[];
    update_time: number;
    username?: string;
    problem_component?: IRobot_problem[];
}