import { useQuery, useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-hot-toast";
import { Users, FileText, MessageSquare, Trash2, User, Eye } from "lucide-react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  // Fetch statistics
  const { data: stats } = useQuery({
    queryKey: ["adminStats"],
    queryFn: async () => {
      const res = await axiosInstance.get("/admin/stats");
      return res.data;
    },
  });

  // Fetch users, posts, and comments
  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosInstance.get("/admin/users");
      return res.data;
    },
  });

  const { data: posts } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await axiosInstance.get("/admin/posts");
      return res.data;
    },
  });

  // Delete function
  const deleteMutation = useMutation({
    mutationFn: async (path) => {
      const isConfirmed = window.confirm("Are you sure you want to delete this?")
      if (!isConfirmed) return null;
      await axiosInstance.delete(path);
    },
    onSuccess: () => {
      toast.success("Deleted successfully");
      window.location.reload();
    },
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>

      {/* Statistics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow-md rounded-lg p-6 flex items-center gap-4">
          <Users size={32} className="text-orange-600" />
          <div>
            <h2 className="text-lg font-medium text-gray-700">Total Users</h2>
            <p className="text-2xl font-semibold">{stats?.userCount ?? 0}</p>
          </div>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 flex items-center gap-4">
          <FileText size={32} className="text-green-600" />
          <div>
            <h2 className="text-lg font-medium text-gray-700">Total Posts</h2>
            <p className="text-2xl font-semibold">{stats?.postCount ?? 0}</p>
          </div>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 flex items-center gap-4">
          <MessageSquare size={32} className="text-red-600" />
          <div>
            <h2 className="text-lg font-medium text-gray-700">Total Comments</h2>
            <p className="text-2xl font-semibold">{stats?.commentCount ?? 0}</p>
          </div>
        </div>
      </div>

      {/* Users Section */}
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Manage Users</h2>
      <div className="bg-white shadow-md rounded-lg p-6">
        {users?.length > 0 ? (
          <ul className="space-y-4">
            {users.map((user) => (
              <li key={user._id} className="flex justify-between items-center border-b pb-3">
                <div>
                  <span className="text-gray-700 font-medium">{user.name} ({user.email})</span>
                </div>
                <div className="flex gap-3">
                  <Link
                    to={`/profile/${user.username}`}
                    className="bg-orange-500 text-white px-3 py-1 rounded flex items-center gap-2 hover:bg-orange-600 transition"
                  >
                    <Eye size={16} />
                    View
                  </Link>
                  <button
                    onClick={() => deleteMutation.mutate(`/admin/users/${user._id}`)}
                    className="bg-red-500 text-white px-3 py-1 rounded flex items-center gap-2 hover:bg-red-600 transition"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No users found.</p>
        )}
      </div>

      {/* Posts Section */}
      <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">Manage Posts</h2>
      <div className="bg-white shadow-md rounded-lg p-6">
        {posts?.length > 0 ? (
          <ul className="space-y-4">
            {posts.map((post) => (
              <li key={post._id} className="border-b pb-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{post.content.slice(0, 50)}...</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      <User size={16} className="text-gray-400" />
                      {post.author?.username || "Unknown User"}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => window.open(`/post/${post._id}`, "_blank")}
                      className="bg-orange-500 text-white px-3 py-1 rounded flex items-center gap-2 hover:bg-orange-600 transition"
                    >
                      <Eye size={16} />
                      View
                    </button>
                    <button
                      onClick={() => deleteMutation.mutate(`/admin/posts/${post._id}`)}
                      className="bg-red-500 text-white px-3 py-1 rounded flex items-center gap-2 hover:bg-red-600 transition"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No posts found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
