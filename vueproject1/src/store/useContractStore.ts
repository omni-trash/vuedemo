import * as pinia from 'pinia';
import apihub from '../services/apihub';
import global from '../services/global';
import * as models from '../services/models';

interface State {
    contractFilter: string;
    contracts: models.Contract[];    
}

function buildSearch(items: any[]): void {
    items?.forEach(item => {
        item._searchUpper = Object.values(item).join("|").toUpperCase();
    })
}

// cache contracts for 1 min
const cacheExpiresMS: number = 60 * 1000;
let nextUpdateMS: number = 0;

export default pinia.defineStore("contracts", {
    // data
    state: (): State => ({
        contractFilter: "",
        contracts: [],
    }),
    // computed
    getters: {
        filteredContracts(): models.Contract[] {
            if (!this.contractFilter) {
                return this.contracts;
            }

            const searchUpper: string = this.contractFilter.toUpperCase(); 
            return this.contracts.filter(item => (item as any)._searchUpper.indexOf(searchUpper) > -1);
        },
    },
    // methods
    actions: {
        loadLocalStorage() {
            this.contractFilter = localStorage.getItem("contractFilter") ?? "";
        },
        saveLocalStorage() {
            localStorage.setItem("contractFilter", this.contractFilter);
        },
        async loadContracts(force: boolean = false) {
            if (!force && nextUpdateMS > Date.now()) {
                return;
            }

            nextUpdateMS = Date.now() + cacheExpiresMS;

            await apihub.contracts().then(contracts => {
                buildSearch(contracts);
                this.contracts = contracts;
            }).catch((error) => {
                this.contracts = [];
                global.alertError(error);
            });
        },
        async ensureContract(contractId: number): Promise<models.Contract | null> {
            let contract: models.Contract | null = this.contracts.filter(item => item.id == contractId)[0] ?? null;

            if (!contract) {
                await this.loadContracts(true);
                contract = this.contracts.filter(item => item.id == contractId)[0] ?? null;
            }

            return contract;
        }
    }
});
