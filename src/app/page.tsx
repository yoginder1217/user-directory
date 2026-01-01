"use client";

import { useEffect, useState, useCallback } from "react";
import { UserProfile } from "@/types";
import SearchBar from "@/components/SearchBar";
import Filters from "@/components/Filters";
import UserGrid from "@/components/UserGrid";
import UserDetail from "@/components/UserDetail";
import LayoutShell from "@/components/LayoutShell";

export default function Home() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [displayedUsers, setDisplayedUsers] = useState<UserProfile[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserProfile | undefined>();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    department: "",
    role: "",
    alpha: ""
  });
  const [displayCount, setDisplayCount] = useState(6);
  const [loading, setLoading] = useState(true);

  // Load all users on mount
  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/users", { cache: "no-store" });
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const data = await res.json();
        if (!Array.isArray(data)) {
          throw new Error("Invalid data format");
        }
        setUsers(data);
        setFilteredUsers(data);
        setDisplayedUsers(data.slice(0, 6));
      } catch (err) {
        console.error("Error loading users:", err);
        setUsers([]);
        setFilteredUsers([]);
        setDisplayedUsers([]);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  // Filter and search users
  useEffect(() => {
    let result = users;

    // Apply search
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(term) ||
          u.email.toLowerCase().includes(term) ||
          u.skills.some((s) => s.toLowerCase().includes(term))
      );
    }

    // Apply department filter
    if (filters.department) {
      result = result.filter((u) => u.department === filters.department);
    }

    // Apply role filter
    if (filters.role) {
      result = result.filter((u) => u.role === filters.role);
    }

    // Apply alphabetical filter
    if (filters.alpha) {
      result = result.filter((u) =>
        u.name.toUpperCase().startsWith(filters.alpha)
      );
    }

    setFilteredUsers(result);
    setDisplayCount(6);
    setDisplayedUsers(result.slice(0, 6));
  }, [searchTerm, filters, users]);

  const handleLoadMore = useCallback(() => {
    const newCount = displayCount + 3;
    setDisplayCount(newCount);
    setDisplayedUsers(filteredUsers.slice(0, newCount));
  }, [displayCount, filteredUsers]);

  const handleScroll = useCallback(
    (e: Event) => {
      const target = e.target as Document;
      const scrollPercentage =
        (target.documentElement.scrollTop /
          (target.documentElement.scrollHeight -
            target.documentElement.clientHeight)) *
        100;

      if (scrollPercentage > 80 && displayCount < filteredUsers.length) {
        handleLoadMore();
      }
    },
    [displayCount, filteredUsers.length, handleLoadMore]
  );

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <LayoutShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Campus Directory
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore and connect with students, teachers, and staff. Find experts
            in various fields and expand your academic network.
          </p>
        </div>

        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <SearchBar onSearch={setSearchTerm} />
            <Filters filters={filters} onFilterChange={setFilters} />
          </div>

          {/* Main Content */}
          <div className="flex-1 min-h-screen">
            <div className="flex gap-8">
              {/* Users Grid */}
              <div className="flex-1">
                {loading ? (
                  <div className="flex justify-center items-center h-96">
                    <div className="text-center">
                      <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading profiles...</p>
                    </div>
                  </div>
                ) : displayedUsers.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600 text-lg">
                      No profiles match your search criteria.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                      <UserGrid
                        users={displayedUsers}
                        onUserSelect={setSelectedUser}
                        selectedUserId={selectedUser?.id}
                      />
                    </div>

                    {displayCount < filteredUsers.length && (
                      <div className="text-center py-8">
                        <button
                          onClick={handleLoadMore}
                          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold transition-colors"
                        >
                          Load More Profiles
                        </button>
                      </div>
                    )}

                    {displayCount >= filteredUsers.length && filteredUsers.length > 0 && (
                      <div className="text-center py-8">
                        <p className="text-gray-600">
                          Showing all {filteredUsers.length} profiles
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* User Details Panel */}
              {selectedUser && (
                <div className="w-96 flex-shrink-0 sticky top-8 max-h-[calc(100vh-2rem)] overflow-y-auto">
                  <UserDetail user={selectedUser} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </LayoutShell>
  );
}