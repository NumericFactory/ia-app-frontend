export interface PlanModel {
    id?: number;
    title: string;
    slug?: string;
    description?: string;
    imageUrl?: string;
    isVisible: boolean;
    isFeatured: boolean;
    isPlan: boolean;
    price?: number;
    duration?: number;
    order?: number;
}