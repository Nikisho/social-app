import { useRoute } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";

export const usePagination = (
  fetchFunction: any,
  initialPage = 1,
  limit = 3,
  skipInitialLoad = false,
) => {
  const [data, setData] = useState<any>([]);
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(
    async (page:number, isRefreshing = false) => {
      if (loading) return;

      setLoading(true);
      try {
        const result = await fetchFunction(page);
        // Update data state whether or not there are results
        if (isRefreshing) {
          // On refresh, replace the current data with the new results (even if empty)
          setData(result);
        } else {
          // When loading more pages, append new results
          setData((prev:any) => [...prev, ...result]);
        }
        // Determine if there's more data to load
        setHasMore(result.length === limit);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [fetchFunction, limit, loading],
  );

  // Fetch data on initial load
  useEffect(() => {
    if (!skipInitialLoad) {
      fetchData(initialPage, true);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setPage(initialPage);
    await fetchData(initialPage, true);
  }, [fetchData, initialPage]);

  const onEndReached = useCallback(async () => {
    if (hasMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      await fetchData(nextPage);
    }
  }, [fetchData, hasMore, loading, page]);

  return {
    data,
    page,
    hasMore,
    loading,
    refreshing,
    onRefresh,
    onEndReached,
  };
};
