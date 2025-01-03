import React from 'react';
import axios from 'axios';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { useQuery } from '@tanstack/react-query';

interface HighestPriceProduct {
    category_id: number;
    _max: {
        price: number;
    };
    category_name: string;
}

interface ProductWithoutMedia {
    product_id: number;
    SKU: string;
    product_name: string;
}

const fetchHighestPriceProducts = async () => {
    const response = await axios.get('http://localhost:4312/api/products/highest-price/category');
    console.log(response.data);
    return response.data;
};

const fetchPriceRangeCount = async () => {
    const response = await axios.get('http://localhost:4312/api/products/price-range-count');
    return response.data;
};

const fetchProductsWithoutMedia = async () => {
    const response = await axios.get('http://localhost:4312/api/products/no-media');
    return response.data;
};

const Statistics: React.FC = () => {
    const { data: highestPriceProducts = [] } = useQuery({
        queryKey: ['highestPriceProducts'],
        queryFn: fetchHighestPriceProducts,
        staleTime: 5 * 60 * 1000,
    }
    );
    const { data: priceRangeCount = {} } = useQuery<Record<string, number>>({
        queryKey: ['priceRangeCount'],
        queryFn: fetchPriceRangeCount,
        staleTime: 5 * 60 * 1000,
    });
    const { data: productsWithoutMedia = [] } = useQuery({
        queryKey: ['productsWithoutMedia'],
        queryFn: fetchProductsWithoutMedia,
        staleTime: 5 * 60 * 1000,
    });

    return (
        <div className='flex gap-5 flex-wrap'>
            {[
                {
                    title: "Category Wise Highest Price of Product",
                    content: highestPriceProducts.map((product: HighestPriceProduct) => (
                        <div key={product.category_id} className="border p-3 rounded-md shadow-sm">
                            <div className='text-2xl font-bold'>{product._max.price}</div>
                            <p className='text-sm'>Category ID: {product.category_id}</p>
                        </div>
                    ))
                },
                {
                    title: "Price Range Wise Product Count",
                    content: Object.entries(priceRangeCount).map(([range, count]) => (
                        <div key={range} className="border p-3 rounded-md shadow-sm flex justify-between">
                            <div className=''>{range}</div>
                            <div>{count}</div>
                        </div>
                    ))
                },
                {
                    title: "Products Without Media",
                    content: productsWithoutMedia.map((product: ProductWithoutMedia) => (
                        <div key={product.product_id} className="border p-3 rounded-md shadow-sm">
                            <div>SKU: {product.SKU}</div>
                            <div>Product Name: {product.product_name}</div>
                        </div>
                    ))
                }
            ].map(({
                title,
                content
            }) => (
                <Card className="flex-1 min-w-[300px] h-64 overflow-auto">
                    <CardHeader>
                        <CardTitle>
                            {title}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-2">
                            {content}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default Statistics;