import React from 'react';

import Dashboard from '../views/pages';
import Members from '../views/pages/members';
import Staff from '../views/pages/staff';
import Packages from '../views/pages/packages';
import Schedules from '../views/pages/schedules';
import Equipments from '../views/pages/equipments';
import Designations from '../views/pages/designations';
import Payments from '../views/pages/payments';

const RouteList = [
    {
        path: "/",
        allowed: [0],
        element: <Dashboard />,
    },
    {
        path: "/member",
        allowed: [0],
        element: <Members />,
    },
    {
        path: "/staff",
        allowed: [0],
        element: <Staff />,
    },
    {
        path: "/packages",
        allowed: [0],
        element: <Packages />,
    },
    {
        path: "/schedules",
        allowed: [0],
        element: <Schedules />,
    },
    {
        path: "/equipments",
        allowed: [0],
        element: <Equipments />,
    },
    {
        path: "/designations",
        allowed: [0],
        element: <Designations />,
    },
    {
        path: "/payments",
        allowed: [0],
        element: <Payments />,
    }
];

export default RouteList