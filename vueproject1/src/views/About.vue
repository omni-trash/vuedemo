<template>
    <header id="header" class="mb-0">
        <div class="container">
            <div class="d-md-flex">
                <h1><span class="bi-gear-fill" aria-hidden="true"></span> About <small class="text-muted">me</small></h1>
            </div>
        </div>
    </header>
    
    <div class="container mt-3">
        <p class="lead">
            Welcome to my site.
        </p>

        <p>
            I'm currently unavailable, during some mordor quests.
        </p>

        <p>
            Build {{ buildDate }}
        </p>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'About',
    components: {},
    computed: {
        buildDate: (): string => process.env.VUE_APP_BUILD_DATE,
    }
});
</script>
