// Хук для сохранения смен
import {doc, setDoc} from "firebase/firestore";
import {db} from "../firebase";

export const useSaveShift = () => {
    const saveShift = async (shiftData: any) => {
        try {
            await setDoc(doc(db, 'shifts', `${shiftData.id}`), shiftData);
            return { success: true };
        } catch (err) {
            return { success: false, error: 'Failed to save shift' };
        }
    };

    return { saveShift };
};