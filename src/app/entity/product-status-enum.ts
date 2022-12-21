import {SelectItem} from "primeng/api/selectitem";

export enum ProductStatusEnum {
    NEW = 'Nouveau',
    TREND = 'Tendance',
    DISCOUNT = 'Soldé'
}
export class ProductStatus {

    public static options: SelectItem[] = [
        {label: 'Nouveau', value: 'Nouveau'},
        {label: 'Tendance', value: 'Tendance'},
        {label: 'Soldé', value: 'Soldé'},
    ]
    public static display(status: string): string {
        switch (status) {
            case ProductStatusEnum.TREND:
                return 'Tendances';
            case ProductStatusEnum.NEW:
                return 'Nouvautés';
            case ProductStatusEnum.DISCOUNT:
                return 'Articles Soldés';
            default:
                return '';
        }
    }
}
