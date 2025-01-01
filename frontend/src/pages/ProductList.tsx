import React, { useState } from 'react';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ChevronDown, ChevronUp, Edit2, Trash } from 'lucide-react';
import { ProductDialog } from '@/components/product-dialog';
import ProductFilterForm, { FilterFormSchemaType } from '@/components/product-filter-form';
import { SubmitHandler } from 'react-hook-form';
import Statistics from './Statistics';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

interface Product {
  product_id: number;
  SKU: string;
  product_name: string;
  category: {
    category_id: number;
    category_name: string
  };
  materials: {
    material_id: number;
    material_name: string;
  }[];
  price: number;
}

const fetchProducts = async (page: number, limit: number, filters: FilterFormSchemaType) => {
  const response = await axios.get('http://localhost:4312/api/products', {
    params: {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      page, limit, ...Object.fromEntries(Object.entries(filters).filter(([_, value]) => value))
    },
  });
  return response.data;
};

const ProductList: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [filters, setFilters] = useState<FilterFormSchemaType>({
    product_name: '',
    category_id: null,
    material_ids: [],
  });
  const [isStatisticsVisible, setIsStatisticsVisible] = useState<boolean>(true);

  const queryClient = useQueryClient();

  const { data, isFetching } = useQuery({
    queryKey: ['products', page, limit, filters],
    queryFn: () => fetchProducts(page, limit, filters),
    staleTime: 5 * 60 * 1000,
  });

  const deleteMutation = useMutation({
    mutationKey: ['deleteProduct'],
    mutationFn: (id: number) => axios.delete(`http://localhost:4312/api/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['products', page, limit, filters],
      });
    },
  });

  const onSubmit: SubmitHandler<FilterFormSchemaType> = (data) => {
    setFilters(data);
    setPage(1);
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const products = data?.data || []
  const total = data?.total || 0

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 shadow-md p-5">Product List</h1>
      <div className='flex gap-2 w-full md:w-11/12 flex-col md:flex-row mx-auto p-4'>
        <div className='space-y-3 md:w-3/12 md:pr-6 border-b-2 md:border-b-0 pb-4 md:pb-0'>
          <h2 className='text-xl font-bold'>Filters</h2>
          <ProductFilterForm
            defaultValues={filters}
            onSubmit={onSubmit}
          />
        </div>
        <div className='flex-1 space-y-3 pt-4 md:pt-0'>
          <div className='flex justify-between'>
            <div>
              <ProductDialog>
                <Button>New</Button>
              </ProductDialog>
            </div>
            <div className="flex space-x-2">
              <Button
                variant={"ghost"}
                disabled={isFetching || page === 1}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))} >
                Previous
              </Button>
              <Button
                variant={"ghost"}
                onClick={() => setPage((prev) => prev + 1)}
                disabled={isFetching || page * limit >= total}
              >Next</Button>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Materials</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {
                isFetching ? Array.from({ length: limit }).map((_, index) => (
                  <TableRow key={index}>
                    {[...Array(
                      6
                    )].map(() => (
                      <TableCell>
                        <Skeleton className='h-7' />
                      </TableCell>
                    ))}
                  </TableRow>
                )) :
                  products?.map((product: Product) => (
                    <TableRow key={product.product_id}>
                      <TableCell className='w-1/6'>{product.SKU}</TableCell>
                      <TableCell className='w-1/6'>{product.product_name}</TableCell>
                      <TableCell className='w-1/6 text-xs' >
                        <Badge variant={'outline'}>{product.category.category_name}</Badge>
                      </TableCell>
                      <TableCell className='w-1/6 text-xs'>{product.materials.map(
                        (material) => (
                          <Badge key={material.material_id}
                            variant={'outline'}
                            className='m-0.5'>{material.material_name}</Badge>
                        )
                      )}</TableCell>
                      <TableCell className='w-1/6'>{product.price}</TableCell>
                      <TableCell className='w-1/6'>
                        <ProductDialog id={String(product.product_id)}>
                          <Button variant={"ghost"} size={"icon"}>
                            <Edit2 />
                          </Button>
                        </ProductDialog>
                        <Button variant={"ghost"} size={"icon"} onClick={() => handleDelete(product.product_id)}>
                          <Trash />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <Separator className='w-full md:w-11/12 mx-auto' />
      <div className='w-full md:w-11/12 mx-auto p-4 space-y-3'>
        <Button
          variant={"ghost"}
          className='flex items-center justify-between w-full'
          onClick={() => setIsStatisticsVisible(!isStatisticsVisible)}>
          <h2 className='text-xl font-bold'>Statistics</h2>
          {isStatisticsVisible ? <ChevronUp /> : <ChevronDown />}
        </Button>
        {isStatisticsVisible && <Statistics />}
      </div>
    </div>
  );
};

export default ProductList;