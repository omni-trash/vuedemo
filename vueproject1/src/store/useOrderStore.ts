import * as pinia from 'pinia';
import apihub from '../services/apihub';
import global from '../services/global';
import * as models from '../services/models';
import useContractStore from './useContractStore';

interface State {
    contract: models.Contract | null;
    productFilter: string;
    products: models.Product[];
}

function buildSearch(items: any[]): void {
    items?.forEach(item => {
        // search values, not names
        item._searchUpper = Object.values(item).join("|").toUpperCase();
    })
}

export default pinia.defineStore("orders", {
    // data
    state: (): State => ({
        contract: null,
        productFilter: "",
        products: [],
    }),
    // computed
    getters: {
        filteredProducts: (state: State) => {
            return (filter: string): models.Product[]  => {
                if (!filter) {
                    return state.products;
                }

                const searchUpper: string = filter.toUpperCase();        
                return state.products.filter((item: any) => item._searchUpper.indexOf(searchUpper) > -1);
            }
        },
    },
    // methods
    actions: {
        loadLocalStorage() {
            this.productFilter = localStorage.getItem("productFilter") ?? "";
        },
        saveLocalStorage() {
            localStorage.setItem("productFilter", this.productFilter);
        },
        async loadProducts(contractId: number) {
            if (this.contract?.id != contractId) {
                const contractStore = useContractStore();
                this.contract = await contractStore.ensureContract(contractId);
            }

            if (!this.contract) {
                global.alertError(`Kontrakt ${contractId} nicht vorhanden`);
                return;
            }

            await apihub.products().then(products => {
                buildSearch(products);
                this.products = products;
            }).catch(error => {
                this.products = [];
                global.alertError(error);
            });
        },
        async addProduct(newProduct: models.Product) {
            await apihub.addProduct(newProduct).then(() => {
                this.loadProducts(this.contract?.id ?? 0);
            }).catch(error => global.alertError(error));
        },
        async updateProduct(updProduct: models.Product) {
            // remove _searchUpper
            const copy: models.Product = {...updProduct};
            (copy as any)._searchUpper = undefined;

            await apihub.updateProduct(copy).then(() => {
                this.loadProducts(this.contract?.id ?? 0);
            }).catch(error => global.alertError(error));
        }, 
        async deleteProduct(productId: number) {
            await apihub.deleteProduct(productId).then(() => {
                this.loadProducts(this.contract?.id ?? 0);
            }).catch(error => global.alertError(error));
        }
    }
});
