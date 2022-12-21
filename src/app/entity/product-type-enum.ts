import {SelectItem} from "primeng/api/selectitem";

export enum ProductTypeEnum {
    TOPS='hauts',
    PANTS='pantallons&Leggings',
    SKIRTS='jupes',
    SHOES='chaussures&bottes',
    VARIOUS='divers'

}
export class ProductType {

    public static options: SelectItem[] = [
        {label: 'Hauts', value: 'hauts'},
        {label: 'Pantallons & Leggings', value: 'pantallons&Leggings'},
        {label: 'Jupes', value: 'jupes'},
        {label: 'Chaussures & Bottes', value: 'chaussures&bottes'},
        {label: 'Divers', value: 'divers'},
    ]
}
