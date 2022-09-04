<template>
    <nav class="navbar p-0 navbar-expand-md navbar-dark">
        <div class="container">
            <a class="navbar-brand" href="#">V-Demo</a>

            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbar"
                aria-controls="navbar" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbar">
                <div class="navbar-nav me-auto">
                    <router-link active-class="active" class="nav-item nav-link" :to="{ name: 'Home' }">Home
                    </router-link>
                    <router-link active-class="active" class="nav-item nav-link" :to="{ name: 'About' }">About
                    </router-link>
                </div>
                <div class="navbar-nav navbar-right">
                    <a class="nav-item nav-link" href="index.html">Welcome, {{ user?.displayname }}</a>
                </div>
            </div>
        </div>
    </nav>

    <router-view></router-view>

    <footer class="fixed-bottom" id="alert-container">
        <!-- alerts here see global.ts -->
    </footer>

    <div id="blocker">
        <div class="h-100 d-flex align-items-center justify-content-center">
            <div class="spinner-grow text-secondary align-middle" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import './assets/css/style.css';
import { defineComponent } from 'vue';
import * as pinia from 'pinia';
import global from './services/global';
import store from './store';

export default defineComponent({
    name: 'App',
    components: {},
    computed: {
        ...pinia.mapState(store.useUserStore, ["user"]),
    },
    async created() {
        await store.useUserStore().loginUser();
    },
    watch: {
        // call again the method if the route changes
        '$route': global.clearAlerts
    }
});
</script>

<style>
#blocker {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    color: gray;
    background-color: none;
    background-color: rgba(241, 232, 232, 0.05);
    z-index: 999;
    font-size: 20pt;
    display: none;
}

.alert-danger {
    border-width: 1px 0 0 8px;
    border-color: rgb(172, 0, 0);
}

.alert-success {
    border-width: 1px 0 0 8px;
    border-color: green;
}
</style>
