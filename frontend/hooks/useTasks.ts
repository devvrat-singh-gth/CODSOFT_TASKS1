"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getTasks,
} from "@/services/api";

import type {
  Pagination,
} from "@/types/api";

import type {
  Task,
  TaskFilters,
} from "@/types/task";

export function useTasks(
  initialFilters: TaskFilters = {},
  initialPage = 1,
  initialLimit = 12
) {
  const [tasks, setTasks] =
    useState<Task[]>([]);

  const [pagination, setPagination] =
    useState<Pagination>({
      page: initialPage,
      limit: initialLimit,
      total: 0,
      totalPages: 0,
    });

  const [filters, setFilters] =
    useState<TaskFilters>(
      initialFilters
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const fetchTasks =
    useCallback(
      async (
        page = pagination.page,
        nextFilters = filters
      ) => {
        try {
          setLoading(true);
          setError("");

          const result =
            await getTasks(
              page,
              pagination.limit,
              nextFilters
            );

          setTasks(
            result.data
          );

          setPagination(
            result.pagination
          );
        } catch (error: unknown) {
          const message =
            (
              error as {
                response?: {
                  data?: {
                    message?: string;
                  };
                };
              }
            )?.response?.data
              ?.message;

          setError(
            message ||
              "Unable to load tasks."
          );
        } finally {
          setLoading(false);
        }
      },
      [
        filters,
        pagination.limit,
        pagination.page,
      ]
    );

  useEffect(() => {
    void fetchTasks(
      initialPage,
      initialFilters
    );
    // Initial load only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    tasks,
    pagination,
    filters,
    setFilters,
    loading,
    error,
    refetch: fetchTasks,
    setTasks,
  };
}