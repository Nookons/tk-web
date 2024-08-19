import {arrayRemove, doc, updateDoc} from "firebase/firestore";
import {db} from "../../firebase";

export const onRobotRemoveNote = async (note: any, robot_id: string) => {
    if (!robot_id) {
        return false;
    }

    const robotRef = doc(db, "robots", robot_id);
    await updateDoc(robotRef, {
        robot_notes: arrayRemove(note)
    });
}