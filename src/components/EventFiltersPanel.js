import React from 'react';

export const EventFiltersPanel = ({ filters, onFilterChange }) => {
  const handleFilterChange = (filterType, value) => {
    onFilterChange({
      ...filters,
      [filterType]: value,
    });
  };

  const FilterButton = ({ active, value, label, filterType }) => (
    <button
      className={`filter-button ${active ? 'active' : ''}`}
      onClick={() => handleFilterChange(filterType, value)}
    >
      {label}
    </button>
  );

  const getCategories = () => {
    const professionalCategories = [
      { value: "academic", label: "Academic" },
      { value: "healthcare", label: "Healthcare" },
      { value: "finance", label: "Finance" },
      { value: "tech", label: "AI/Tech" }
    ];
    
    const socialCategories = [
      { value: "arts", label: "Arts & Culture" },
      { value: "sports", label: "Sports" },
      { value: "wellness", label: "Health & Wellness" },
      { value: "service", label: "Community Service" }
    ];
    
    return filters.type === "professional" ? professionalCategories :
           filters.type === "social" ? socialCategories :
           [...professionalCategories, ...socialCategories];
  };

  return (
    <div className="event-filters-panel">
      <div className="filter-section">
        <h3>Location</h3>
        <div className="filter-buttons">
          <FilterButton
            active={filters.location === "all"}
            value="all"
            label="All"
            filterType="location"
          />
          <FilterButton
            active={filters.location === "oncampus"}
            value="oncampus"
            label="On Campus"
            filterType="location"
          />
          <FilterButton
            active={filters.location === "offcampus"}
            value="offcampus"
            label="Off Campus"
            filterType="location"
          />
        </div>
      </div>

      <div className="filter-section">
        <h3>Event Type</h3>
        <div className="filter-buttons">
          <FilterButton
            active={filters.type === "all"}
            value="all"
            label="All"
            filterType="type"
          />
          <FilterButton
            active={filters.type === "professional"}
            value="professional"
            label="Pre-Professional"
            filterType="type"
          />
          <FilterButton
            active={filters.type === "social"}
            value="social"
            label="Social"
            filterType="type"
          />
        </div>
      </div>

      <div className="filter-section">
        <h3>Category</h3>
        <div className="filter-buttons">
          <FilterButton
            active={filters.category === "all"}
            value="all"
            label="All"
            filterType="category"
          />
          {getCategories().map((category) => (
            <FilterButton
              key={category.value}
              active={filters.category === category.value}
              value={category.value}
              label={category.label}
              filterType="category"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventFiltersPanel;
