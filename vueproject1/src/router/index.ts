import { createRouter, createWebHistory, RouteComponent } from 'vue-router';
import Home from '../views/Home.vue';
import About from '../views/About.vue';
import Kontrakt from '../views/Kontrakt.vue';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/About',
        name: 'About',
        component: About
    },
    {
        path: '/Kontrakt/:id',
        name: 'Kontrakt',
        component: Kontrakt,
        props(route: any) {
            // Invalid prop: type check failed for prop "id". Expected Number with value 10, got String with value "10
            const props = {...route.params};
            props.id = +props.id;
            return props;
        }
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

export default router;
