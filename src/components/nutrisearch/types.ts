// Tipo compartilhado entre a busca (NutriSearch) e o painel de detalhe.
export interface FoodResult {
    id: string;
    name: string;
    brand: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    servingSize?: number | null;
    servingUnit?: string;
    image?: string;
    nutriscore?: string;
}
