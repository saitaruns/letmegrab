import React from 'react';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SubmitHandler } from "react-hook-form"
import ProductMainForm, { FormSchemaType } from '@/components/product-main-form';

const createProduct = async (product: FormSchemaType) => {
    const response = await axios.post<FormSchemaType>('http://localhost:4312/api/products', product);
    return response.data;
};

const updateProduct = async ({ id, product }: { id: string; product: FormSchemaType }) => {
    const response = await axios.put<FormSchemaType>(`http://localhost:4312/api/products/${id}`, product);
    return response.data;
};

interface ProductFormProps {
    id?: string;
    closeDialog: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
    id,
    closeDialog
}) => {
    const queryClient = useQueryClient();

    const createMutation = useMutation<FormSchemaType, Error, FormSchemaType>({
        mutationFn: createProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });

    const updateMutation = useMutation<FormSchemaType, Error, { id: string; product: FormSchemaType }>({
        mutationFn: updateProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });

    const onSubmit: SubmitHandler<FormSchemaType> = (data) => {
        if (id) {
            updateMutation.mutate({ id, product: data });
        } else {
            createMutation.mutate(data);
        }
        closeDialog();
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">{id ? 'Edit Product' : 'Add Product'}</h1>
            <ProductMainForm
                id={id}
                onSubmit={onSubmit}
                submitText={id ? 'Update Product' : 'Add Product'}
            />
        </div>
    );
};

export default ProductForm;