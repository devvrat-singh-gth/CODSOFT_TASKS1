"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getProjects,
} from "@/services/api";

import type {
  Pagination,
} from "@/types/api";

import type {
  Project,
} from "@/types/project";

export function useProjects(
  initialPage = 1,
  initialLimit = 12
) {
  const [projects, setProjects] =
    useState<Project[]>([]);

  const [pagination, setPagination] =
    useState<Pagination>({
      page: initialPage,
      limit: initialLimit,
      total: 0,
      totalPages: 0,
    });

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const fetchProjects =
    useCallback(
      async (
        page = pagination.page,
        limit = pagination.limit
      ) => {
        try {
          setLoading(true);
          setError("");

          const result =
            await getProjects(
              page,
              limit
            );

          setProjects(
            result.data
          );

          setPagination(
            result.pagination
          );
        } catch (error: any) {
          setError(
            error?.response?.data
              ?.message ||
              "Unable to load projects."
          );
        } finally {
          setLoading(false);
        }
      },
      [
        pagination.limit,
        pagination.page,
      ]
    );

  useEffect(() => {
    fetchProjects(
      initialPage,
      initialLimit
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    projects,
    pagination,
    loading,
    error,
    refetch: fetchProjects,
    setProjects,
  };
}