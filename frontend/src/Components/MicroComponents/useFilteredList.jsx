import { useState, useEffect } from "react";

export default function useFilteredList(data, search, limit = 10) {
  const [visibleCount, setVisibleCount] = useState(limit);

  useEffect(() => {
    setVisibleCount(limit);
  }, [search, limit]);

  const query = (search || "").toLowerCase().trim();

  const filtered = data.filter((item) =>
    JSON.stringify(item).toLowerCase().includes(query)
  );

  const displayed = filtered.slice(0, visibleCount);

  return {
    query,
    filtered,
    displayed,
    visibleCount,
    setVisibleCount,
  };
}
