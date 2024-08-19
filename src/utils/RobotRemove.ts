import {IRobot} from "../types/Robot";
import { doc, deleteDoc } from "firebase/firestore";
import {db} from "../firebase";

export const onRobotRemove = async (robot: IRobot) => {
    await deleteDoc(doc(db, "robotInspections", robot.robot_id));
}