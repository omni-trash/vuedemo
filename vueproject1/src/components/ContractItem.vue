<template>
    <div v-if="contract" class="row align-items-center">
        <div class="col-md">
            <div>
                <label class="form-label">Id</label>
                <div>
                    <router-link :to="{ name: 'Kontrakt', params: { id: contract.id } }">{{ contract.id }}
                    </router-link>
                </div>
            </div>
        </div>
        <div class="col-md">
            <div>
                <label class="form-label">Date</label>
                <div>{{ $utils.formatDate(contract.expires) }}</div>
            </div>
        </div>
        <div class="col-md">
            <div>
                <label class="form-label">Firma</label>
                <div>{{ contract.company }}</div>
            </div>
        </div>
        <div class="col-md">
            <div>
                <label class="form-label">Name</label>
                <div>{{ contract.name }}</div>
            </div>
        </div>
        <div class="col-md">
            <div>
                <label class="form-label">Ort</label>
                <div>{{ contract.city }}</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import * as models from '../services/models';

export default defineComponent({
    props: {
        contract: Object as PropType<models.Contract>
    }    
});
</script>
