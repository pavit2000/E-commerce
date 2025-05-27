import React from "react";
import { filterProducts } from "../utils/filterProducts";

function FilterControls({ filters, setFilters }) {
  return (
    <div className="filters">
      <label>
        Category:
        <select
          value={filters.selectedCategory}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, selectedCategory: e.target.value }))
          }
        >
          <option value="all">All</option>
          <option value="Shoes">Shoes</option>
          <option value="Electronics">Electronics</option>
          <option value="Wearables">Wearables</option>
        </select>
      </label>

      <label>
        Brand:
        <select
          value={filters.selectedBrand}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, selectedBrand: e.target.value }))
          }
        >
          <option value="all">All</option>
          <option value="Nike">Nike</option>
          <option value="Adidas">Adidas</option>
          <option value="Apple">Apple</option>
          <option value="Sony">Sony</option>
          <option value="Fitbit">Fitbit</option>
          <option value="Garmin">Garmin</option>
          <option value="JBL">JBL</option>
          <option value="Razer">Razer</option>
          <option value="Dell">Dell</option>
          <option value="ASUS">ASUS</option>
          <option value="HP">HP</option>
          <option value="Crocs">Crocs</option>
          <option value="New Balance">New Balance</option>
          <option value="Reebok">Reebok</option>
          <option value="Logitech">Logitech</option>
          <option value="Beats">Beats</option>
          <option value="Vans">Vans</option>
          <option value="Samsung">Samsung</option>
          <option value="Google">Google</option>
          <option value="Under Armour">Under Armour</option>
          <option value="Timberland">Timberland</option>
          <option value="Bose">Bose</option>
          <option value="Polar">Polar</option>
          <option value="Microsoft">Microsoft</option>
          <option value="Canon">Canon</option>
          <option value="On">On</option>
          <option value="Lenovo">Lenovo</option>
          <option value="Anker">Anker</option>
        </select>
      </label>

      <label>
        Min Price:
        <input
          type="number"
          value={filters.minPrice}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, minPrice: e.target.value }))
          }
          placeholder="e.g. 10"
        />
      </label>

      <label>
        Max Price:
        <input
          type="number"
          value={filters.maxPrice}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, maxPrice: e.target.value }))
          }
          placeholder="e.g. 100"
        />
      </label>
    </div>
  );
}

export default FilterControls;
