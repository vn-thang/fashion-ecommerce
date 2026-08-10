import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productApi } from '../api/productApi';
import { categoryApi } from '../../category/api/categoryApi';
import { brandApi } from '../../brand/api/brandApi';

export const useCustomerHome = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const urlCategory = searchParams.get('category') || '';
  const urlSearch = searchParams.get('search') || '';
  const urlSort = searchParams.get('sort') || 'default';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState(urlSort);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState({
    min: '',
    max: ''
  });

  const [triggerFetch, setTriggerFetch] = useState(0);

  useEffect(() => {
    setSortBy(urlSort);
  }, [urlSort]);

  useEffect(() => {
    setSelectedCategories([]);
    setCurrentPage(1);
    setTriggerFetch(prev => prev + 1);
  }, [urlCategory]);

const flattenCategories = categories => {
  return categories.flatMap(({ children = [], ...category }) => [
    category,
    ...flattenCategories(children)
  ]);
};

useEffect(() => {
  const fetchFiltersData = async () => {
    try {
      const [catRes, brandRes] = await Promise.all([
        categoryApi.getAll(),
        brandApi.getAll()
      ]);

      setCategories(
        flattenCategories(catRes?.data || [])
      );

      setBrands(
        brandRes?.data?.brands || []
      );
    } catch (error) {
      console.error(error);
    }
  };

  fetchFiltersData();
}, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);

      try {
        let finalCategoryId;

        if (selectedCategories.length > 0) {
          finalCategoryId = selectedCategories.join(',');
        } else if (urlCategory) {
          finalCategoryId = urlCategory;
        }

        const params = {
          page: currentPage,
          limit,
          search: urlSearch || undefined,
          sortBy: sortBy === 'default' ? undefined : sortBy,
          categoryId: finalCategoryId,
          brandId:
            selectedBrands.length > 0
              ? selectedBrands.join(',')
              : undefined,
          minPrice: priceRange.min || undefined,
          maxPrice: priceRange.max || undefined
        };

        const res = await productApi.getAll(params);
        const rawData = res?.data || res;

        setProducts(rawData.products || []);
        setTotalPages(rawData.pagination?.totalPages || 1);
      } catch (error) {
        console.error(error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [
    currentPage,
    sortBy,
    triggerFetch,
    urlCategory,
    urlSearch
  ]);

  const currentCategoryObj = categories.find(
    c => (c.id || c._id) === urlCategory
  );

  const activeParentId =
    currentCategoryObj?.parentId || urlCategory;

  const handleSearch = e => {
    e.preventDefault();
    setCurrentPage(1);
    setTriggerFetch(prev => prev + 1);
  };

  const handleCategoryChange = id => {
    setSelectedCategories(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleBrandChange = id => {
    setSelectedBrands(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleApplyFilter = () => {
    setCurrentPage(1);
    setTriggerFetch(prev => prev + 1);
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange({
      min: '',
      max: ''
    });
    setSortBy('default');
    setSearchParams({});
    setCurrentPage(1);
    setTriggerFetch(prev => prev + 1);
  };

  const handleSortToggle = value => {
    const nextSort =
      sortBy === value ? 'default' : value;

    setSortBy(nextSort);

    const params = {};

    if (urlCategory) params.category = urlCategory;
    if (urlSearch) params.search = urlSearch;
    if (nextSort !== 'default') params.sort = nextSort;

    setSearchParams(params);

    setCurrentPage(1);
  };

  return {
    products,
    categories,
    brands,
    isLoading,

    searchTerm,
    setSearchTerm,

    sortBy,
    handleSortToggle,

    currentPage,
    setCurrentPage,
    totalPages,

    selectedCategories,
    handleCategoryChange,

    selectedBrands,
    handleBrandChange,

    priceRange,
    setPriceRange,

    handleSearch,
    handleApplyFilter,
    handleClearFilters,

    urlCategory,
    activeParentId,
    setSearchParams
  };
};