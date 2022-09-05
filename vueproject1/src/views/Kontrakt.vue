<template>
    <header id="header" class="mb-0">
        <div class="container">
            <div class="d-md-flex">
                <h1><span class="bi-gear-fill" aria-hidden="true"></span> Kontrakt <small
                        class="text-muted">Artikel</small></h1>

                <div class="ms-auto">
                    <button type="button" class="btn text-bg-primary" @click='addNewItemClicked'>Add New Item</button>
                </div>
            </div>
        </div>
    </header>

    <div class="container mt-3" v-if="contract">
        <h2>Kontrakt</h2>

        <div class="table-striped-line mb-5">
            <div class="line">
                <ContractItem :contract="contract"></ContractItem>
            </div>
        </div>

        <div class="row">
            <div class="col">
                <h2>Artikel</h2>
            </div>

            <div class="col input-group ms-auto mb-3" style="max-width: 20rem">
                <input type="text" v-model="productFilter" class="form-control" placeholder="Filter">
                <button type="button" class="btn text-bg-primary" @click="productFilter = ''">Clear</button>
            </div>
        </div>

        <div class="table-striped-line">
            <div class="line" v-for="product in filteredProducts(productFilter)" :key="product.id">
                <ProductItem :product="product"></ProductItem>
            </div>
        </div>
    </div>

    <ProductItemEdit v-if="newProduct" :product="newProduct" @cancel="addNewItemCancel" @ok="addNewItemOk"></ProductItemEdit>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ContractItem from '../components/ContractItem.vue';
import ProductItem from '../components/ProductItem.vue';
import ProductItemEdit from '../components/ProductItemEdit.vue';

import * as pinia from 'pinia';
import store from '../store';
import * as models from '../services/models';

interface Data {
    newProduct: models.Product | null
}

export default defineComponent({
    props: {
        id: Number
    },
    data(): Data {
        return {
            newProduct: null
        }
    },
    components: {
        ContractItem,
        ProductItem,
        ProductItemEdit
    },
    computed: {
        ...pinia.mapState(store.useOrderStore, ["contract", "filteredProducts"]),
        ...pinia.mapWritableState(store.useOrderStore, ["productFilter"]),
    },
    async created() {
        this.loadLocalStorage();
        this.loadProducts(this.id ?? 0);
    },
    unmounted() {
        this.saveLocalStorage();
    },
    methods: {
        ...pinia.mapActions(store.useOrderStore, ["loadLocalStorage", "saveLocalStorage", "loadProducts", "addProduct"]),
        addNewItemClicked() {
            this.newProduct = { amount: 50 } as models.Product;
        },
        addNewItemCancel() {
            this.newProduct = null;
        },
        addNewItemOk(modifiedProduct: models.Product) {
            this.newProduct = null;
            this.addProduct(modifiedProduct);
        }
    },
});
</script>
