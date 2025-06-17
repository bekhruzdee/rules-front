"use client";

import { useUsers } from "@/contexts/user-context";

export default function TotalUsersCard() {
  const { users, loading } = useUsers();

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4 shadow rounded bg-white dark:bg-gray-800">
      <h2 className="text-lg font-bold">Total Users</h2>
      <p className="text-2xl mt-2">{users.length}</p>
    </div>
  );
}
