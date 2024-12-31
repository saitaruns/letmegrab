import React from 'react';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SubmitHandler } from "react-hook-form"
import ProductFilterForm, { FilterFormSchemaType, FormSchema } from '@/components/product-filter-form';

const createProduct = async (product: FilterFormSchemaType) => {
    const response = await axios.post<FilterFormSchemaType>('http://localhost:4312/api/products', product);
    return response.data;
};

const updateProduct = async ({ id, product }: { id: string; product: FilterFormSchemaType }) => {
    const response = await axios.put<FilterFormSchemaType>(`http://localhost:4312/api/products/${id}`, product);
    return response.data;
};

interface ProductFormProps {
    id?: string;
}

const ProductForm: React.FC<ProductFormProps> = ({ id }) => {
    const queryClient = useQueryClient();

    const createMutation = useMutation<FilterFormSchemaType, Error, FilterFormSchemaType>({
        mutationFn: createProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });

    const updateMutation = useMutation<FilterFormSchemaType, Error, { id: string; product: FilterFormSchemaType }>({
        mutationFn: updateProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });

    const onSubmit: SubmitHandler<FilterFormSchemaType> = (data) => {
        if (id) {
            updateMutation.mutate({ id, product: data });
        } else {
            createMutation.mutate(data);
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">{id ? 'Edit Product' : 'Add Product'}</h1>
            <ProductFilterForm
                id={id}
                onSubmit={onSubmit}
                submitText={id ? 'Update Product' : 'Add Product'}
                schema={FormSchema}
            />
        </div>
    );
};

export default ProductForm;