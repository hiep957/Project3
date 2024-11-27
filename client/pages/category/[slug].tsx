import { Layout } from "@/components/Layout";
import { getProductByCategory } from "@/redux/api";
import { useRouter } from "next/router";
import Grid from "@mui/material/Grid2";
import { FC, useEffect, useState } from "react";
import { ProductType } from "@/utils/Type";
import { CircularProgress, Pagination, PaginationItem } from "@mui/material";
import Image from "next/image";
import ProductCard from "@/components/ProductCart";

const API_URL = process.env.SV_HOST || "http://localhost:5000";

const CategoryPage: FC = () => {
  const router = useRouter();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 0,
    limit: 10,
  });
  const [filters, setFilters] = useState<{
    subcategory: string | null;
    brand: string | null;
    minPrice: number | null;
    maxPrice: number | null;
  }>({
    subcategory: null,
    brand: null,
    minPrice: null,
    maxPrice: null,
  });

  const fetchFilteredProducts = async () => {
    setIsLoading(true);
    try {
      const slug = router.query.slug as string;
      const queryParams: Record<string, string | null> = {
        subcategory: filters.subcategory || null,
        brand: filters.brand || null,
        minPrice: filters.minPrice ? filters.minPrice.toString() : null,
        maxPrice: filters.maxPrice ? filters.maxPrice.toString() : null,
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      };
      const response = await getProductByCategory(slug, queryParams);

      // Update pagination state form server response

      if (response.data.pagination) {
        setPagination({
          total: response.data.pagination.total,
          page: response.data.pagination.page,
          pages: response.data.pagination.pages,
          limit: response.data.pagination.limit,
        });
      }

      console.log("response", response.data);
      setProducts(response.data.products || []);
      
    } catch (error) {
      console.error("Lỗi khi lọc sản phẩm:", error);
      setProducts([]);
      setPagination(prev => ({...prev, total: 0, pages: 0}));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (router.query.slug) {
      fetchFilteredProducts();
    }
  }, [filters, router.query.slug]);

  const handleSubCategoryChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    const isChecked = event.target.checked;
    setFilters({
      ...filters,
      subcategory: isChecked ? value : null,
    });

    const updateQuery = { ...router.query };

    if (isChecked) {
      updateQuery.subcategory = value;
    } else {
      delete updateQuery.subcategory;
    }

    router.push(
      {
        pathname: router.pathname,
        query: updateQuery,
      },
      undefined,
      { shallow: true }
    );
  };

  const handleBrandChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const isChecked = event.target.checked;
    setFilters({
      ...filters,
      brand: isChecked ? value : null,
    });

    const updateQuery = { ...router.query };

    if (isChecked) {
      updateQuery.brand = value;
    } else {
      delete updateQuery.brand;
    }
    router.push(
      {
        pathname: router.pathname,
        query: updateQuery,
      },
      undefined,
      { shallow: true }
    );
  };

  const handlePriceChange = (
    minPrice: number | null,
    maxPrice: number | null,
    checked: boolean
  ) => {
    setFilters({
      ...filters,
      minPrice: checked ? minPrice : null,
      maxPrice: checked ? maxPrice : null,
    });

    const updateQuery = { ...router.query };

    if (checked) {
      updateQuery.minPrice = minPrice?.toString() || "";
      updateQuery.maxPrice = maxPrice?.toString() || "";
    } else {
      delete updateQuery.minPrice;
      delete updateQuery.maxPrice;
    }

    router.push(
      {
        pathname: router.pathname,
        query: updateQuery,
      },
      undefined,
      { shallow: true }
    );
  };

  return (
    <Layout>
      <div className="container mx-auto px-20">
        <Grid container spacing={2}>
          <Grid size={2}>
            <div className="text-xl font-bold tracking-wide mb-4 mt-6">
              Bộ lọc
            </div>

            <FilterSection
              title="Sub Category"
              value={filters.subcategory}
              onChange={handleSubCategoryChange}
              options={[
                { value: "Áo bóng đá", label: "Áo bóng đá" },
                { value: "Quần bóng đá", label: "Quần bóng đá" },
                { value: "other", label: "Other" },
              ]}
            />

            <FilterSection
              title="Thương hiệu"
              value={filters.brand}
              onChange={handleBrandChange}
              options={[
                { value: "Adidas", label: "Adidas" },
                { value: "Nike", label: "Nike" },
                { value: "other", label: "Other" },
              ]}
            />

            <div className="mb-4">
              <div className="font-normal text-md mb-1">Giá</div>
              <div className="flex flex-col">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="p-2"
                    onChange={(e) =>
                      handlePriceChange(0, 200000, e.target.checked)
                    }
                    checked={
                      filters.minPrice === 0 && filters.maxPrice === 200000
                    }
                  />
                  <label className="ml-2">Dưới 200,000</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="p-2"
                    onChange={(e) =>
                      handlePriceChange(200000, 500000, e.target.checked)
                    }
                    checked={
                      filters.minPrice === 200000 && filters.maxPrice === 500000
                    }
                  />
                  <label className="ml-2">200,000 - 500,000</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="p-2"
                    onChange={(e) =>
                      handlePriceChange(500000, null, e.target.checked)
                    }
                    checked={
                      filters.minPrice === 500000 && filters.maxPrice === null
                    }
                  />
                  <label className="ml-2">Trên 500,000</label>
                </div>
              </div>
            </div>
          </Grid>

          <Grid size={10}>
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <CircularProgress />
              </div>
            ) : products.length === 0 ? (
              <div className="">
                <p>Không tìm thấy sản phẩm</p>
              </div>
            ) : (
              <ProductGrid products={products} />
            )}
          </Grid>
        </Grid>
      </div>
    </Layout>
  );
};

const FilterSection: FC<{
  title: string;
  value: string | null;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  options: { value: string; label: string }[];
}> = ({ title, value, onChange, options }) => (
  <div className="mb-4">
    <div className="font-normal text-md mb-1">{title}</div>
    <div className="flex flex-col">
      {options.map((option) => (
        <div key={option.value} className="flex items-center">
          <input
            type="checkbox"
            className="p-2"
            value={option.value}
            checked={value === option.value}
            onChange={onChange}
          />
          <label className="ml-2">{option.label}</label>
        </div>
      ))}
    </div>
  </div>
);

const ProductGrid: FC<{ products: ProductType[] }> = ({ products }) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
    {products.map((product, index) => (
      <ProductCard key={index} product={product} />
    ))}
  </div>
);

export default CategoryPage;