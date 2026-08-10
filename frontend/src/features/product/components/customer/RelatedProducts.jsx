import React from "react";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";

const RelatedProducts = ({
    products,
    loading,
    parentCategoryId }) => {
    if (loading) {
        return (
            <div className="bg-white mt-4 rounded-sm p-6">
                <div className="flex justify-between items-center mb-5">
                    <h2 className="uppercase text-lg font-medium text-gray-700">
                        Sản phẩm liên quan
                    </h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, index) => (
                        <div
                            key={index}
                            className="animate-pulse">
                            <div className="aspect-square bg-gray-200 rounded"></div>
                            <div className="h-4 bg-gray-200 rounded mt-3"></div>
                            <div className="h-4 bg-gray-200 rounded mt-2 w-2/3"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    if (!products.length) return null;
    return (
        <div className="bg-white mt-4 rounded-sm p-6">
            <div className="flex justify-between items-center mb-5">
                <h2 className="uppercase text-lg font-medium text-gray-700">
                    Sản phẩm liên quan
                </h2>
                <Link
                    to={`/products?category=${parentCategoryId}`}

                    className="text-[#ee4d2d] text-sm hover:underline">
                    Xem tất cả →
                </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
                {products.map(product => (
                    <ProductCard
                        key={product.id}
                        product={product}
                    />
                ))}
            </div>
        </div>
    );
};
export default RelatedProducts;