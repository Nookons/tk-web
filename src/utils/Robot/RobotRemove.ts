import { doc, deleteDoc } from "firebase/firestore";
import {db} from "../../firebase";

export const onRobotRemove = async (robotId: string) => {
    await deleteDoc(doc(db, "robots", robotId));
}