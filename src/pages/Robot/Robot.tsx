import React, {useMemo} from 'react';
import {useLocation} from "react-router-dom";

const Robot = () => {
    const location = useLocation();
    const id = useMemo(() => new URLSearchParams(location.search).get('id'), [location.search]);

    return (
        <div>
            {id}
        </div>
    );
};

export default Robot;