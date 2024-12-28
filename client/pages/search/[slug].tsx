import { Layout } from "@/components/Layout";
import { getProductByCategory } from "@/redux/api";
import { useRouter } from "next/router";
import Grid from "@mui/material/Grid2";
import { FC, useEffect, useState } from "react";
import { ProductType } from "@/utils/Type";
import {
  CircularProgress,
  Container,
  Pagination,
  PaginationItem,
} from "@mui/material";

import ProductCard from "@/components/ProductCart";
import { useAppSelector } from "@/redux/hooks";
import { Category } from "@/redux/slice/categorySlice";
import { RootState } from "@/redux/store";

const SearchPage: FC = () => {
  const router = useRouter();
  console.log("router.query", router.query);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 0,
    limit: 12,
  });
  const [filters, setFilters] = useState<{
    brand: string | null;
    minPrice: number | null;
    maxPrice: number | null;
  }>({
    brand: null,
    minPrice: null,
    maxPrice: null,
  });

  const fetchFilteredProducts = async () => {
    console.log("nhayr vaof gam");
    setIsLoading(true);
    try {
      const slug = router.query.slug as string;
      console.log("slug", slug);
      const queryParams: Record<string, string | null> = {
        search: slug,
        brand: filters.brand || null,
        minPrice: filters.minPrice ? filters.minPrice.toString() : null,
        maxPrice: filters.maxPrice ? filters.maxPrice.toString() : null,
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      };
      const queryString = new URLSearchParams(
        Object.entries(queryParams).reduce((acc, [key, value]) => {
          if (value !== null) acc[key] = value; // Bỏ qua các giá trị null
          return acc;
        }, {} as Record<string, string>)
      ).toString();
      console.log("query String", queryString);

      const response = await fetch(
        `http://localhost:5000/api/v1/product?${queryString}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Lỗi khi lọc sản phẩm");
      }
      const data = await response.json();
      console.log("response tra ve", data);
      // Update pagination state form server response

      if (data.data.pagination) {
        setPagination({
          total: data.data.pagination.total,
          page: data.data.pagination.page,
          pages: data.data.pagination.pages,
          limit: data.data.pagination.limit,
        });
      }

      setProducts(data.data.products || []);
    } catch (error) {
      setProducts([]);
      setPagination((prev) => ({ ...prev, total: 0, pages: 0 }));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (router.query.slug) {
      fetchFilteredProducts();
    }
  }, [filters, router.query.slug, pagination.page]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    // Update page in both local state and URL query
    setPagination((prev) => ({ ...prev, page: value }));

    // Update URL query for page
    const updateQuery = {
      ...router.query,
      page: value.toString(),
    };

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

    // Reset to first page when filter changes
    setPagination((prev) => ({ ...prev, page: 1 }));

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

    // Reset to first page when filter changes
    setPagination((prev) => ({ ...prev, page: 1 }));

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
      <Container maxWidth={false} sx={{ maxWidth: "1280px" }}>
        <Grid container spacing={2}>
          <Grid size={2}>
            <div className="text-xl font-bold tracking-wide mb-4 mt-6">
              Bộ lọc
            </div>

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
              <>
                <ProductGrid products={products} />

                <div className="flex justify-center mt-8">
                  <Pagination
                    count={pagination.pages}
                    page={pagination.page}
                    onChange={handlePageChange}
                    color="primary"
                    showFirstButton
                    showLastButton
                    renderItem={(item) => <PaginationItem {...item} />}
                  />
                </div>
              </>
            )}
          </Grid>
        </Grid>
      </Container>
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

export default SearchPage;