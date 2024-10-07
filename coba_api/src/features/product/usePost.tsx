import { useEffect, useState } from "react";
import axiosInstance from "../../libs/axios";

export default function usePosts() {
  const [state, setState] = useState({
    data: null,
    error: null,
  }); // Add error state

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Set loading to true before fetching
        const response = await axiosInstance.get('/posts');
        setState(prev => ({
          ...prev,
          data: response.data,
        }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: error.response?.data || "Error fetching posts", // Add readable error
        }));
      }
    };

    fetchPosts();
  }, []);

  return {
    ...state,
  };
}
