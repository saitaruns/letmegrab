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
import ProductFilterForm, { FilterFormSchema, FilterFormSchemaType } from '@/components/product-filter-form';
import { SubmitHandler } from 'react-hook-form';
import Statistics from './Statistics';

const fetchProducts = async (page: number, limit: number, filters: FilterFormSchemaType) => {
  const response = await axios.get('http://localhost:4312/api/products', {
    params: { page, limit, ...filters },
  });
  return response.data;
};

const ProductList: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [filters, setFilters] = useState<FilterFormSchemaType>({});
  const [isStatisticsVisible, setIsStatisticsVisible] = useState<boolean>(true);

  const queryClient = useQueryClient();

  const { data: products = [], isFetching, isError } = useQuery({
    queryKey: ['products', page, limit, filters],
    queryFn: () => fetchProducts(page, limit, filters),
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

  if (isFetching) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching products</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 shadow-md p-5">Product List</h1>
      <div className='w-11/12 mx-auto p-4 space-y-3'>
        <Button
          variant={"ghost"}
          className='flex items-center justify-between w-full'
          onClick={() => setIsStatisticsVisible(!isStatisticsVisible)}>
          <h2 className='text-xl font-bold'>Statistics</h2>
          {isStatisticsVisible ? <ChevronUp /> : <ChevronDown />}
        </Button>
        {isStatisticsVisible && <Statistics />}
      </div>
      <div className='flex gap-2 w-11/12 mx-auto p-4'>
        <div className='space-y-3 w-3/12 pr-6'>
          <h2 className='text-xl font-bold'>Filters</h2>
          <ProductFilterForm
            defaultValues={filters}
            onSubmit={onSubmit}
            schema={FilterFormSchema}
            submitText='Apply Filters'
          />
        </div>
        <div className='flex-1 space-y-3'>
          <div className='flex justify-between'>
            <div>
              <ProductDialog>
                <Button>New Product</Button>
              </ProductDialog>
            </div>
            <div className="flex space-x-2">
              <Button
                variant={"ghost"}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1}>
                Previous
              </Button>
              <Button
                variant={"ghost"}
                onClick={() => setPage((prev) => prev + 1)}>Next</Button>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Category ID</TableHead>
                <TableHead>Material IDs</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product: FilterFormSchemaType & { product_id: number }) => (
                <TableRow key={product.product_id}>
                  <TableCell>{product.SKU}</TableCell>
                  <TableCell>{product.product_name}</TableCell>
                  <TableCell>{product.category_id}</TableCell>
                  <TableCell>{product.material_ids?.join(', ')}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>
                    <ProductDialog id={product.product_id.toString()}>
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
    </div>
  );
};

export default ProductList;