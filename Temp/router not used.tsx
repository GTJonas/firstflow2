import React from 'react';
import { useRoutes } from 'react-router-dom';
import DefaultLayout from './layouts/DefaultLayout';
import GuestLayout from './layouts/GuestLayout';
import Login from './views/Login';
import NotFound from './views/NotFound';
import Dashboard from './views/Dashboard.tsx';

const routeConfig = [
    {
        path: '/',
        element: <DefaultLayout />,
        children: [
            {
                index: true,
                element: <Dashboard />,
            },
            // ... other common routes
        ],
    },
    {
        path: '/login',
        element: <GuestLayout />,
        children: [
            {
                index: true,
                element: <Login />,
            },
        ],
    },
    {
        path: '*',
        element: <NotFound />,
    },
];

// Create a common route object for the Dashboard component
const commonDashboardRoute = {
    element: <Dashboard />,
};

// Add the common route object to all the desired paths
const dashboardPaths = ['/class', '/settings', '/all-posts', '/own-posts', '/store-post', '/company', '/test'];

dashboardPaths.forEach(path => {
    routeConfig[0].children.push({
        path: path,
        ...commonDashboardRoute,
    });
});

const AppRouter = () => {
    const element = useRoutes(routeConfig);

    return <>{element}</>;
};

export default AppRouter;