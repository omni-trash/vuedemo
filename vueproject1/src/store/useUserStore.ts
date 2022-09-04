import * as pinia from 'pinia';
import apihub from '../services/apihub';
import global from '../services/global';
import * as models from '../services/models';

interface State {
    user: models.User | null
}

export default pinia.defineStore("user", {
    // data
    state: (): State => ({
        user: null
    }),
    // computed
    getters: {
    },
    // methods
    actions: {
        async loginUser() {
            await apihub.loggedinuser().then(user => {
                this.user = user;
            }).catch((error) => {
                this.user = null;
                global.alertError(error);
            });
        },
    }
});
