import { useState, useEffect } from "react";
import { IRobot } from "../../types/Robot";
import { doc, onSnapshot, DocumentSnapshot } from "firebase/firestore";
import { db } from "../../firebase";

export const useFetchRobot = (id: string | null) => {
    const [robot, setRobot] = useState<IRobot | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id === null) {
            setRobot(null);
            setLoading(false);
            return;
        }

        const unsub = onSnapshot(doc(db, "robots", id), (doc: DocumentSnapshot) => {
            if (doc.exists()) {
                setRobot(doc.data() as IRobot);
            } else {
                setRobot(null);
                setError('Robot not found');
            }
            setLoading(false);
        }, (err) => {
            setError(err.message);
            setLoading(false);
        });

        return () => unsub();
    }, [id]);

    return { robot, loading, error };
};
