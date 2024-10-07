import React, { useState } from "react";
import { z } from "zod";
import { useCreatePosts } from "../../features/product/useCreatePosts";
import { useUpdatePosts } from "../../features/product/useUpdatePosts";
import usePosts from "../../features/product/usePost";
import { useDeletePosts } from "../../features/product/useDeletePosts";
import ButtonPrimary from "../../components/elements/ButtonPrimary";

// Define the type for each post
interface Post {
  id: string;
  content: string;
  created_at: string;
}

// Define Zod schema for post content
const PostSchema = z.object({
  content: z.string().min(1, "Content is required").max(280, "Content must be 280 characters or less"),
});


export default function Home() {
    const [content, setContent] = useState('');
  const [editPostId, setEditPostId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const { data, error } = usePosts();
  const { mutate: createPosts, error: createError } = useCreatePosts();
  const { mutate: updatePosts, error: updateError } = useUpdatePosts();
  const { mutate: deletePosts, error: deleteError } = useDeletePosts();

  const validateContent = (content: string) => {
    try {
      PostSchema.parse({ content });
      setValidationError(null);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setValidationError(error.errors[0].message);
      } else {
        setValidationError("An unknown error occurred");
      }
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const contentToValidate = editPostId ? editContent : content;
    if (validateContent(contentToValidate)) {
      if (editPostId) {
        updatePosts(editPostId, editContent );
        setEditPostId(null);
        setEditContent('');

      } else {
        createPosts(content);
        window.location.reload();
      }
      setContent('');
    }
  };

  const editHandler = (post: Post) => {
    setEditPostId(post.id);
    setEditContent(post.content);
  };

  const deleteHandler = (id: string) => {
    deletePosts(id);
  };

  return (
    <section className="w-full min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl flex flex-col justify-center items-center gap-4 border border-gray-300 rounded-lg bg-white shadow-lg p-6"
      >
        <input
          type="text"
          value={editPostId ? editContent : content}
          onChange={(e) =>
            editPostId ? setEditContent(e.target.value) : setContent(e.target.value)
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 transition duration-200"
          placeholder="Enter your post"
        />
        {validationError && (
          <p className="text-red-500 text-sm">{validationError}</p>
        )}
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
        >
          {editPostId ? "Update" : "Submit"}
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">Error fetching posts: {error}</p>}
      {createError && <p className="text-red-500 mt-4">Error creating post: {createError}</p>}
      {updateError && <p className="text-red-500 mt-4">Error updating post: {updateError}</p>}
      {deleteError && <p className="text-red-500 mt-4">Error deleting post: {deleteError}</p>}

      <table className="w-full max-w-4xl mt-12 bg-white shadow-lg rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-blue-100">
            <th className="px-6 py-4 text-left text-gray-600 font-medium">ID</th>
            <th className="px-6 py-4 text-left text-gray-600 font-medium">Content</th>
            <th className="px-6 py-4 text-left text-gray-600 font-medium">Created At</th>
            <th className="px-6 py-4 text-left text-gray-600 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.data?.map((post: Post) => (
            <tr key={post.id} className="border-t border-gray-200">
              <td className="px-6 py-4">{post.id}</td>
              <td className="px-6 py-4">{post.content}</td>
              <td className="px-6 py-4">{new Date(post.created_at).toLocaleString()}</td>
                <td className="px-6 py-4 flex space-x-2">
                <ButtonPrimary
                    className="bg-yellow-500 hover:bg-yellow-600"
                    onClick={() => editHandler(post)}
                    text="Edit"
                />
                <ButtonPrimary
                    className="bg-red-500 hover:bg-red-600"
                    onClick={() => deleteHandler(post.id)}
                    text="Delete"
                />
                </td>
            </tr>
          ))}
        </tbody>
      </table>

      {data?.data?.length === 0 && (
        <p className="text-gray-600 mt-4 text-center">No posts available.</p>
      )}
    </section>
  );
}