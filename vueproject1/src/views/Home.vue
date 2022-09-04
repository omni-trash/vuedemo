<template>
    <header id="header" class="mb-0">
        <div class="container">
            <div class="d-md-flex">
                <h1><span class="bi-gear-fill" aria-hidden="true"></span> Kunden <small
                        class="text-muted">Kontrakte</small></h1>
            </div>
        </div>
    </header>

    <div class="container mt-3">
        <div class="row">
            <div class="col">
                <h2>Kontrakte</h2>
            </div>

            <div class="col input-group ms-auto mb-3" style="max-width: 20rem">
                <input type="text" v-model="contractFilter" class="form-control" placeholder="Filter">
                <button type="button" class="btn text-bg-primary" @click="contractFilter = ''">Clear</button>
            </div>
        </div>

        <div class="table-striped-line">
            <div class="line py-1" v-for="contract in filteredContracts" :key="contract.id">
                <ContractItem :contract="contract"></ContractItem>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ContractItem from '../components/ContractItem.vue';

import * as pinia from 'pinia';
import store from '../store';

export default defineComponent({
    name: 'Home',
    components: {
        ContractItem
    },
    computed: {
        ...pinia.mapState(store.useConctractStore, ["filteredContracts"]),
        ...pinia.mapWritableState(store.useConctractStore, ["contractFilter"]),
    },
    created() {
        this.loadLocalStorage();
        this.loadContracts();
    },
    unmounted() {
        this.saveLocalStorage();
    },
    methods: {
        ...pinia.mapActions(store.useConctractStore, ["loadLocalStorage", "saveLocalStorage", "loadContracts"]),
    },
});
</script>
