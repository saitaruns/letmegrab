import axios from "axios";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface Category {
    category_id: number;
    category_name: string;
}

export interface Material {
    material_id: number;
    material_name: string;
}

export const fetchCategories = async () => {
    const response = await axios.get<Category[]>('http://localhost:4312/api/categories');
    return response.data;
}

export const fetchMaterials = async () => {
    const response = await axios.get<Material[]>('http://localhost:4312/api/materials');
    return response.data;
}