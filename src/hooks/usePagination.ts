import { useRoute } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";

export const usePagination = (
  fetchFunction: any,
  initialPage = 1,
  limit = 3,
  skipInitialLoad = false,
) => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const route = useRoute();
  const fetchData = useCallback(
    async (page: number, isRefreshing = false) => {
      if (loading) return;

      setLoading(true);
      try {
        const result = await fetchFunction(page);
        if (result.length > 0) {
          setData((prev) => (isRefreshing ? result : [...prev, ...result]));
          setHasMore(result.length === limit);
        } else {
          //Only sets the events to [] on the home page to prevent
          //bug on the profile page
          if (route.name === "home") {
            setData([]);
          }
          setHasMore(false);
        }
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
