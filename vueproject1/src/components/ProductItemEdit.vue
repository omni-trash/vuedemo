<template>
    <!-- Modal -->
    <Teleport to="body" v-if="product">
        <div class="modal fade" data-bs-backdrop="static" ref="form">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2 class="modal-title">Produkt</h2>
                    </div>

                    <div class="modal-body">
                        <div class="container-fluid">
                            <div class="row my-2">
                                <div class="col-md-4">
                                    <label class="form-label">Menge</label>
                                    <input type="number" class="form-control" v-model="edit.amount">
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label">Name</label>
                                    <input type="text" class="form-control" v-model="edit.name">
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label">Farbe</label>
                                    <input type="text" class="form-control" v-model="edit.color">
                                </div>
                            </div>

                            <div class="row">
                                <div class="col text-danger">
                                    <ul>
                                        <li v-for="error in errors" :key="JSON.stringify(error)">{{ error }}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="modal-footer">
                        <button type="button" @click="$emit('cancel')" class="btn btn-secondary">Abbrechen</button>
                        <button type="button" @click="$emit('ok', edit)" :disabled="errors.length > 0"
                            class="btn btn-primary">Speichern</button>
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import * as models from '../services/models';
import validator from '../services/validator';

declare const bootstrap: any;

interface Data {
    bsModalDialog: any,
    edit: models.Product,
    errors: string[]
}

export default defineComponent({
    props: {
        product: {
            type: Object as PropType<models.Product>,
            required: true,
        },
    },
    data(): Data {
        return {
            bsModalDialog: null,
            // edit a copy, product is readonly
            edit: { ...this.product } as models.Product,
            errors: []
        }
    },
    emits: [
        'cancel',
        'ok'
    ],
    mounted() {
        this.checkForm();
        this.bsModalDialog = new bootstrap.Modal(this.$refs.form);
        this.bsModalDialog.show();
    },
    unmounted() {
        this.bsModalDialog.hide();
        this.bsModalDialog = null;
    },
    beforeUpdate() {
        // validate form values
        this.checkForm();
    },
    methods: {
        checkForm() {
            this.errors = validator.validateProduct(this.edit);
        }
    },
});
</script>
