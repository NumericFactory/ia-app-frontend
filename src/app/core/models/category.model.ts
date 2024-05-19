export interface CategoryModel {
    id?: number;
    title: string;
    slug: string;
    description: string;
    order: number;
    count_prompts: number | 0;
    count_done_prompts?: number | 0;
}