import axios from 'axios';
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { z } from "zod"
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
import { Category, fetchCategories, fetchMaterials, Material } from '@/lib/utils';

export const FilterFormSchema = z.object({
    product_name: z.string().optional(),
    category_id: z.number().nullable().optional(),
    material_ids: z.array(z.number()).optional(),
});

export type FilterFormSchemaType = z.infer<typeof FilterFormSchema>;

const ProductFilterForm = ({
    id,
    defaultValues,
    onSubmit,
}: {
    id?: string;
    defaultValues?: FilterFormSchemaType;
    onSubmit: SubmitHandler<FilterFormSchemaType>;
}) => {
    const queryClient = useQueryClient();

    const form = useForm<FilterFormSchemaType>({
        resolver: zodResolver(FilterFormSchema),
        defaultValues
    });

    const { handleSubmit } = form;

    const { data: categories = [] } = useQuery<Category[]>({
        queryKey: ['categories'],
        queryFn: fetchCategories,
        placeholderData: keepPreviousData,
        staleTime: 5 * 60 * 1000,
    });

    const { data: materials = [] } = useQuery<Material[]>({
        queryKey: ['materials'],
        queryFn: fetchMaterials,
        placeholderData: keepPreviousData,
        staleTime: 5 * 60 * 1000,
    });

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:4312/api/products/${id}`);
            queryClient.invalidateQueries({ queryKey: ['products'] });
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const clearForm = () => form.reset({
        product_name: '',
        category_id: null,
        material_ids: [],
    })

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {[
                    { name: 'product_name', label: 'Product Name', type: 'text', placeholder: 'Product Name' },
                ].map(({ name, label, type, placeholder }) => (
                    <FormField
                        key={name}
                        control={form.control}
                        name={name as keyof FilterFormSchemaType}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{label}</FormLabel>
                                <FormControl>
                                    <Input
                                        type={type}
                                        placeholder={placeholder}
                                        {...field}
                                        value={String(field.value)}
                                        defaultValue={""}
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
                <FormField
                    control={form.control}
                    name="category_id"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select
                                onValueChange={(value) => field.onChange(Number(value))}
                                defaultValue={String(field.value)}
                                {...field}
                                value={String(field.value)}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue
                                            defaultValue={String(field.value)}
                                            placeholder="Select a category" />
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
                                            value={String(category_id)}>
                                            {category_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="material_ids"
                    render={({ field }) => (
                        <FormItem className='flex flex-col'>
                            <FormLabel>Materials</FormLabel>
                            <FormControl>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <div className='p-1 border-dashed border rounded flex items-center gap-1'>
                                            <Button variant="outline" className='flex-1'>Select</Button>
                                            {field.value &&
                                                field.value.length > 0 && <span className='ml-2'>{field.value.length} selected</span>}
                                        </div>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        className='w-64 h-64 overflow-y-auto'
                                    >
                                        <DropdownMenuLabel>Materials</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        {materials?.map((material) => (
                                            <DropdownMenuCheckboxItem
                                                key={material.material_id}
                                                checked={field.value?.includes(material.material_id)}
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
                />
                <div className='flex justify-end gap-2'>
                    <Button onClick={clearForm} variant={'ghost'}>Clear</Button>
                    <Button type="submit">
                        Filter
                    </Button>
                    {id && <Button type="button" variant="destructive" onClick={handleDelete}>Delete</Button>}
                </div>
            </form>
        </Form>
    );
};

export default ProductFilterForm;