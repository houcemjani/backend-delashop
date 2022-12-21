import {SelectItem} from "primeng/api/selectitem";

export enum ProductCategoryEnum {

    MALE = 'homme',
    FEMALE = 'femme',
    KIDS = 'enfant',
    ACCECSSORY = 'accessoire'

}

export class ProductCategory {

    public static options: SelectItem[] = [
        {label: 'Homme', value: 'homme'},
        {label: 'Femme', value: 'femme'},
        {label: 'Enfant', value: 'enfant'},
        {label: 'Accessoire', value: 'accessoire'},
    ]

    public static display(category: string): string {
        switch (category) {
            case ProductCategoryEnum.FEMALE:
                return 'Femmes';
            case ProductCategoryEnum.MALE:
                return 'Hommes';
            case ProductCategoryEnum.KIDS:
                return 'Entants';
            case ProductCategoryEnum.ACCECSSORY:
                return 'Accessoires';
            default:
                return '';
        }
    }

}

