export function filterProducts(products, filters) {
    const { selectedCategory, minPrice, maxPrice } = filters;
  
    return products.filter((product) => {
      const inCategory =
        selectedCategory === "all" || product.category === selectedCategory;
  
      const inPriceRange =
        (minPrice === "" || product.price >= parseFloat(minPrice)) &&
        (maxPrice === "" || product.price <= parseFloat(maxPrice));
  
      return inCategory && inPriceRange;
    });
  }
  