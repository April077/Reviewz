"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FolderPlus, Trash } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Space {
  id: string;
  name: string;
}

interface CreateSpaceResponse {
  space: Space;
}

interface GetResponseSpaces {
  spaces: Space[];
}

export default function SpacesPage() {
  const { status } = useSession();
  const [newSpaceName, setNewSpaceName] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<Space | null>(null);
  const router = useRouter();
  const queryClient = useQueryClient();

  // ✅ API call moved outside component
  const fetchSpaces = async (): Promise<Space[]> => {
    const res = await axios.get<GetResponseSpaces>("/api/spaces");
    return res.data.spaces || [];
  };

  // ✅ useQuery handles caching and fetching
  const {
    data: spaces,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["spaces"],
    queryFn: fetchSpaces,
    staleTime: 1000 * 60, // 1 min
    enabled: status === "authenticated", // don’t fetch if not logged in
  });

  // ✅ Create space mutation
  const createSpaceMutation = useMutation({
    mutationFn: async (name: string) => {
      const res = await axios.post<CreateSpaceResponse>("/api/spaces", { name });
      return res.data.space;
    },
    onSuccess: (newSpace) => {
      // update cache instantly
      queryClient.setQueryData<Space[]>(["spaces"], (old) =>
        old ? [...old, newSpace] : [newSpace]
      );
      setNewSpaceName("");
    },
  });

  // ✅ Delete space mutation
  const deleteSpaceMutation = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/spaces/${id}`);
      return id;
    },
    onSuccess: (deletedId) => {
      queryClient.setQueryData<Space[]>(["spaces"], (old) =>
        old ? old.filter((s) => s.id !== deletedId) : []
      );
      setConfirmDelete(null);
    },
  });

  // ✅ redirect if unauthenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center">
      <h1 className="text-4xl sm:text-5xl font-bold mb-10 text-center text-gray-800">
        Your Workspaces
      </h1>

      {/* Create Space */}
      <div className="mb-8 flex gap-3 items-center w-full max-w-md">
        <input
          type="text"
          required
          placeholder="Enter a new space name"
          value={newSpaceName}
          onChange={(e) => setNewSpaceName(e.target.value)}
          className="flex-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
        />
        <button
          onClick={() => {
            if (!newSpaceName.trim()) return;
            createSpaceMutation.mutate(newSpaceName);
          }}
          disabled={createSpaceMutation.isPending}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2.5 rounded-lg transition disabled:opacity-50"
        >
          {createSpaceMutation.isPending ? "Creating..." : "Create"}
        </button>
      </div>

      {error && (
        <p className="text-red-600 font-medium mb-4">Failed to load spaces</p>
      )}

      {isLoading ? (
        <p className="text-gray-600">Loading your spaces...</p>
      ) : !spaces || spaces.length === 0 ? (
        <p className="text-gray-600">
          You don’t have any spaces yet. Create your first one above.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-6xl">
          {spaces.map((space) => (
            <div
              key={space.id}
              className="relative bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition border border-gray-200 group cursor-pointer"
              onClick={() => router.push(`/spaces/${space.id}`)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-100 p-3 rounded-lg">
                    <FolderPlus className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {space.name}
                  </h2>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirmDelete(space);
                  }}
                  className="ml-auto p-2 rounded-lg border border-gray-300 bg-gray-100 text-red-500 hover:bg-red-100 hover:text-red-600 transition"
                  disabled={deleteSpaceMutation.isPending}
                >
                  <Trash className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 shadow-lg w-100 text-center">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Are you sure?
            </h3>
            <p className="text-gray-600 mb-6">
              Do you really want to delete <strong>{confirmDelete.name}</strong>?
            </p>
            <div className="flex justify-around">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteSpaceMutation.mutate(confirmDelete.id)}
                disabled={deleteSpaceMutation.isPending}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition disabled:opacity-50"
              >
                {deleteSpaceMutation.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
