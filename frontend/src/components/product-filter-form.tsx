import { useEffect } from 'react';
import axios from 'axios';
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { z, ZodSchema } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, SubmitHandler } from "react-hook-form"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export const FormSchema = z.object({
    SKU: z.string().min(1, { message: "SKU is required" }),
    product_name: z.string().min(1, { message: "Product name is required" }),
    category_id: z.number().min(1, { message: "Category ID is required" }),
    material_ids: z.array(z.number()).min(1, { message: "Material IDs are required" }),
    price: z.number().min(0, { message: "Price must be a positive number" }),
});

export const FilterFormSchema = z.object({
    SKU: z.string().optional(),
    product_name: z.string().optional(),
    category_id: z.number().optional(),
    material_ids: z.array(z.number()).optional(),
    price: z.number().optional(),
});

export type FormSchemaType = z.infer<typeof FormSchema>;
export type FilterFormSchemaType = z.infer<typeof FilterFormSchema>;

interface Category {
    category_id: number;
    category_name: string;
}

interface Material {
    material_id: number;
    material_name: string;
}

const fetchCategories = async () => {
    const response = await axios.get<Category[]>('http://localhost:4312/api/categories');
    return response.data;
}

const fetchMaterials = async () => {
    const response = await axios.get<Material[]>('http://localhost:4312/api/materials');
    return response.data;
}

interface ProductFilterFormProps {
    id?: string;
    defaultValues?: FormSchemaType | FilterFormSchemaType;
    onSubmit: SubmitHandler<FormSchemaType | FilterFormSchemaType>;
    submitText?: string;
    schema: ZodSchema;
}

const ProductFilterForm = ({
    id,
    defaultValues,
    onSubmit,
    submitText = 'Confirm',
    schema,
}: ProductFilterFormProps) => {
    const queryClient = useQueryClient();

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues
    });

    const { handleSubmit, setValue } = form;

    const { data: categories = [], isFetching: isCatFetching, isError: isCatError } = useQuery<Category[]>({
        queryKey: ['categories'],
        queryFn: fetchCategories,
        placeholderData: keepPreviousData,
    });

    const { data: materials = [], isFetching: isMatFetching, isError: isMatError } = useQuery<Material[]>({
        queryKey: ['materials'],
        queryFn: fetchMaterials,
        placeholderData: keepPreviousData,
    });

    useEffect(() => {
        if (id) {
            // Fetch product data and set form values
            axios.get<FormSchemaType>(`http://localhost:4312/api/products/get/${id}`).then(response => {
                const product = response.data;
                setValue('SKU', product.SKU);
                setValue('product_name', product.product_name);
                setValue('category_id', product.category_id);
                setValue('material_ids', product.material_ids);
                setValue('price', product.price);
            });
        }
    }, [id, setValue]);

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:4312/api/products/${id}`);
            queryClient.invalidateQueries({ queryKey: ['products'] });
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {[
                    { name: 'SKU', label: 'SKU', type: 'text', placeholder: 'SKU' },
                    { name: 'product_name', label: 'Product Name', type: 'text', placeholder: 'Product Name' },
                    { name: 'price', label: 'Price', type: 'number', placeholder: 'Price' },
                ].map(({ name, label, type, placeholder }) => (
                    <FormField
                        key={name}
                        control={form.control}
                        name={name as keyof FormSchemaType}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{label}</FormLabel>
                                <FormControl>
                                    <Input
                                        type={type}
                                        placeholder={placeholder}
                                        {...field}
                                        value={
                                            typeof field.value !== 'number' ? field?.value?.toString() : field.value
                                        }
                                        onChange={
                                            type === 'number'
                                                ? (e) => field.onChange(Number(e.target.value))
                                                : field.onChange
                                        }
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                ))}
                {
                    !isCatFetching && !isCatError && <FormField
                        control={form.control}
                        name="category_id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select
                                    onValueChange={(value) => field.onChange(Number(value))}
                                    value={field?.value?.toString()}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {categories?.map(({
                                            category_id,
                                            category_name
                                        }: {
                                            category_id: number;
                                            category_name: string;
                                        }) => (
                                            <SelectItem
                                                key={category_id}
                                                value={category_id.toString()}>
                                                {category_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />}
                {
                    !isMatFetching && !isMatError && <FormField
                        control={form.control}
                        name="material_ids"
                        render={({ field }) => (
                            <FormItem className='flex flex-col'>
                                <FormLabel>Materials</FormLabel>
                                <FormControl>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <div className='p-1 border-dashed border rounded flex items-center gap-1'>
                                                <Button variant="outline"
                                                    className='flex-1'
                                                >Select</Button>
                                                {field.value &&
                                                    field.value.length > 0 && <span className='ml-2'>{field?.value?.length} selected</span>}
                                            </div>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                            className='w-64'
                                        >
                                            <DropdownMenuLabel>Materials</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            {materials?.map((material) => (
                                                <DropdownMenuCheckboxItem
                                                    key={material.material_id}
                                                    checked={field?.value?.includes(material.material_id)}
                                                    onCheckedChange={(checked) => {
                                                        if (checked) {
                                                            field.onChange([...(field?.value || []), material.material_id]);
                                                        } else {
                                                            field.onChange(field?.value?.filter((id: number) => id !== material.material_id));
                                                        }
                                                    }}
                                                >
                                                    {material.material_name}
                                                </DropdownMenuCheckboxItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />}
                <div className='flex justify-end gap-2'>
                    <Button type="submit">{submitText}</Button>
                    {id && <Button type="button" variant="destructive" onClick={handleDelete}>Delete</Button>}
                </div>
            </form>
        </Form>
    );
};

export default ProductFilterForm;