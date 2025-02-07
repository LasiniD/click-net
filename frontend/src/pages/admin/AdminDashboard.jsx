import { useQuery, useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-hot-toast";

const AdminDashboard = () => {
  // Fetch data
  const { data: stats } = useQuery({
    queryKey: ["adminStats"],
    queryFn: async () => {
      const res = await axiosInstance.get("/admin/stats");
      return res.data;
    }
  });

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosInstance.get("/admin/users");
      return res.data;
    }
  });

  const { data: posts } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await axiosInstance.get("/admin/posts");
      return res.data;
    }
  });

  const { data: comments } = useQuery({
    queryKey: ["comments"],
    queryFn: async () => {
      const res = await axiosInstance.get("/admin/comments");
      return res.data;
    }
  });

  // Delete function
  const deleteMutation = useMutation({
    mutationFn: async (path) => {
      await axiosInstance.delete(path);
    },
    onSuccess: () => {
      toast.success("Deleted successfully");
    },
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-500 text-white p-4 rounded-lg">
          <h2 className="text-lg">Total Users</h2>
          <p className="text-xl">{stats?.userCount}</p>
        </div>
        <div className="bg-green-500 text-white p-4 rounded-lg">
          <h2 className="text-lg">Total Posts</h2>
          <p className="text-xl">{stats?.postCount}</p>
        </div>
        <div className="bg-red-500 text-white p-4 rounded-lg">
          <h2 className="text-lg">Total Comments</h2>
          <p className="text-xl">{stats?.commentCount}</p>
        </div>
      </div>

      <h2 className="text-xl font-semibold mt-6">Users</h2>
      <ul>
        {users?.map((user) => (
          <li key={user._id} className="flex justify-between">
            <span>{user.name} ({user.email})</span>
            <button onClick={() => deleteMutation.mutate(`/admin/users/${user._id}`)} className="bg-red-500 text-white px-3 py-1 rounded">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
