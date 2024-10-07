import { useState } from "react";
import axiosInstance from "../../libs/axios";
import { ResponsePosts } from "../../types/type";

export const useDeletePosts = (): ResponsePosts => {
  const [state, setState] = useState<Omit<ResponsePosts, 'mutate'>>({
    data: null,
    loading: false,
    error: null,
    message: '',
    status: '',
  });

  const mutate = async (id: string) => {
    setState(prev => ({
      ...prev,
      loading: true,
    }));
    try {
      const response = await axiosInstance.delete(`/posts/${id}`);
      setState(prev => ({
        ...prev,
        data: response.data,
        loading: false,
        error: null,
        message: response.data.message,
        status: response.data.status,
      }));
      window.location.reload();
    } catch (err) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err : new Error('Error deleting post'),
      }));
    }
  };

  return {
    ...state,
    mutate,
  };
}
