import { useState } from "react";
import axiosInstance from "../../libs/axios";
import { ResponsePosts } from "../../types/type";

export const useCreatePosts = (): ResponsePosts => {
  const [state, setState] = useState<Omit<ResponsePosts, 'mutate' >>({
    data: null,
    loading: false,
    error: null,
    message: '',
    status: '',
  });


  const mutate = async (content: string) => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      const response = await axiosInstance.post('/posts', { content });
      setState({
        data: response.data,
        loading: false,
        error: null,
        message: response.data.message,
        status: response.data.status
      });
    } catch (err) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err : new Error('Error creating post'),
      }));
    }
  };

  return {
    ...state,
    mutate,
  };
}