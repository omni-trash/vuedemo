<template>
    <div v-if="product" class="row align-items-center">
        <div class="col-md">
            <div>
                <label class="form-label">Id</label>
                <div>{{ product.id }}</div>
            </div>
        </div>
        <div class="col-md">
            <div>
                <label class="form-label">Menge</label>
                <div>{{ product.amount }}</div>
            </div>
        </div>
        <div class="col-md">
            <div>
                <label class="form-label">Name</label>
                <div>{{ product.name }}</div>
            </div>
        </div>
        <div class="col-md">
            <div>
                <label class="form-label">Farbe</label>
                <div>{{ product.color }}</div>
            </div>
        </div>
        <div class="col-md">
            <div>
                <label class="form-label">-</label>
                <div>
                    <button type="button" class="btn btn-small" @click="(editProduct = { ...product } as models.Product)">
                        <span class="bi-pencil-square"></span>
                    </button>
                    <button type="button" class="btn btn-small" @click="deleteProduct(product.id)">
                        <span class="bi-trash"></span>
                    </button>
                </div>
            </div>
        </div>
    </div>

    <ProductItemEdit v-if="editProduct" :product="editProduct" @cancel="editCancel" @ok="editOk"></ProductItemEdit>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import ProductItemEdit from './ProductItemEdit.vue';

import * as pinia from 'pinia';
import store from '../store';
import * as models from '../services/models';

interface Data {
    editProduct: models.Product | null,
}

export default defineComponent({
    props: {
        product: {
            type: Object as PropType<models.Product>,
            required: true,
        }
    },
    components: {
        ProductItemEdit,
    },
    data(): Data {
        return {
            editProduct: null,
        }
    },
    methods: {
        ...pinia.mapActions(store.useOrderStore, ["updateProduct", "deleteProduct"]),
        editCancel() {
            this.editProduct = null;
        },
        editOk(modifiedProduct: models.Product) {
            this.editProduct = null;
            this.updateProduct(modifiedProduct);
        }
    }
});
</script>
