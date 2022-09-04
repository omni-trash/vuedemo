import * as models from './models';

function validateProduct(product: models.Product): string[] {
    const errors: string[] = [];

    if (product.amount < 10) {
        errors.push('amount must be 10 or more');
    }

    if (product.amount > 200) {
        errors.push('amount cannot be more than 200');
    }

    if (!product.name){
        errors.push('the product has no name');
    }

    if (!product.color){
        errors.push('the product has no color');
    }

    return errors;
}


export default {
    validateProduct
}
