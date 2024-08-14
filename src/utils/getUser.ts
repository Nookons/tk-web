import {IEmployer} from "../types/Employer";
import {doc, getDoc} from "firebase/firestore";
import {db} from "../firebase";
import {message} from "antd";

export const getUser = (id: number | undefined) => {
    let employer: IEmployer | undefined = undefined;

    const fetchEmployees = async () => {
        if (id) {
            try {
                const employerRef = doc(db, "employers", id.toString());
                const docSnap = await getDoc(employerRef);

                if (docSnap.exists()) {
                    employer = docSnap.data() as IEmployer
                } else {
                    // docSnap.data() will be undefined in this case
                    console.log("No such document!");
                }
            } catch (err) {
                message.error('Failed to fetch employees');
            }
        }
    };

    fetchEmployees();

    return employer
};