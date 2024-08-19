export interface IRobot_problem {
    component: string[];
    id: number;
    time: number;
    username: string;
    update_time: number;
    note: string;
}

export interface IRobotNote {
    date: number;
    note_id: number;
    body: string;
    username: string;
    user: number;
}

export interface IRobot {
    condition: string;
    robot_id: string;
    note: string;
    photos?: any[];
    update_time: number;
    username?: string;
    problem_component?: IRobot_problem[];
    robot_notes?: IRobotNote[];
}