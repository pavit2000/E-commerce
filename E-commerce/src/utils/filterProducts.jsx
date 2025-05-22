export function filterProducts(products, filters) {
    const { selectedCategory, selectedBrand, minPrice, maxPrice } = filters;
  
    return products.filter((product) => {
      const inCategory =
        selectedCategory === "all" || product.categories === selectedCategory;

      const inBrand =
        selectedBrand === "all" || product.brand === selectedBrand;
  
      const inPriceRange =
        (minPrice === "" || product.price >= parseFloat(minPrice)) &&
        (maxPrice === "" || product.price <= parseFloat(maxPrice));
  
      return inBrand && inCategory && inPriceRange;
    });
  }
  