import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { User, Pagination } from "../../../model";
import UserService from "../../../service/UserService";
import { UserStateType, RoleType } from "../../../enums";

export default function UserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination>(
    new Pagination(1, 5, 0)
  );
  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState<string | undefined>();
  const [roleFilter, setRoleFilter] = useState<string | undefined>();

  const loadData = async () => {
    try {
      const res = await UserService.getUsers(
        pagination.page,
        pagination.limit,
        stateFilter,
        roleFilter
      );
      setUsers(res.data);
      setPagination(
        new Pagination(
          res.pagination.page,
          res.pagination.limit,
          res.pagination.total
        )
      );
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, [pagination.page, pagination.limit, stateFilter, roleFilter]);

  const handlePageChange = (newPage: number) => {
    setPagination(new Pagination(newPage, pagination.limit, pagination.total));
  };

  const handleLimitChange = (newLimit: number) => {
    setPagination(new Pagination(1, newLimit, pagination.total));
  };
  
  const getRoleColor = (roleValue: string) => {
    switch (roleValue) {
      case RoleType.SUPERADMIN.value:
        return "bg-red-100 text-red-700";
      case RoleType.ADMIN.value:
        return "bg-blue-100 text-blue-700";
      case RoleType.OPERATOR.value:
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };
  
  const totalPages = pagination.getTotalPages();

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-4">
      {/* Header: Search + Filters */}
      <div className="mb-4 flex flex-wrap justify-between items-center gap-4">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center">
          {/* Limit per page */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Show</span>
            <select
              className="border p-2 rounded text-sm"
              value={pagination.limit}
              onChange={(e) => handleLimitChange(Number(e.target.value))}
            >
              {[5, 10, 15, 20].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <span className="text-sm text-gray-600">entries</span>
          </div>

          {/* State Filter */}
          <select
            className="border p-2 rounded text-sm"
            value={stateFilter || ""}
            onChange={(e) => setStateFilter(e.target.value || undefined)}
          >
            <option value="">All States</option>
            {Object.values(UserStateType).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          {/* Role Filter */}
          <select
            className="border p-2 rounded text-sm"
            value={roleFilter || ""}
            onChange={(e) => setRoleFilter(e.target.value || undefined)}
          >
             <option value="">All Roles</option>
              {Object.values(RoleType).map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
            </option>
            ))}
          </select>
        </div>

        {/* Search Box */}
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search by name or ID..."
            className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 rounded-md text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute right-3 top-2.5 h-4 w-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
          </svg>
        </div>
      </div>

      {/* Table */}
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell isHeader className="px-5 py-3 text-start">
                Name
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-start">
                Email
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-start">
                State
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-start">
                Role
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="px-5 py-4 text-start">
                    {user.name}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start text-gray-600">
                    {user.email}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    <select
                      className={`px-2 py-1 rounded text-sm font-medium border-0 cursor-pointer ${
                        user.state === "ACTIVE"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                      value={user.state}
                      onChange={async (e) => {
                        const newState = e.target.value;
                        try {
                          await UserService.updateUserState(user.id, newState);
                          setUsers((prev) =>
                            prev.map((u) =>
                              u.id === user.id ? { ...u, state: newState } : u
                            )
                          );
                        } catch (err) {
                          console.error("Update state failed:", err);
                        }
                      }}
                    >
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="INACTIVE">INACTIVE</option>
                    </select>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    <span
                      className={`px-2 py-1 rounded text-sm font-medium ${getRoleColor(user.role)}`}
                    >
                      {Object.values(RoleType).find(r => r.value === user.role)?.label || "Unknown"}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <td
                  colSpan={4}
                  className="text-center py-4 text-gray-500"
                >
                  No users found
                </td>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center">
        <span className="text-sm text-gray-600">
          Page {pagination.page} of {totalPages} | Total {pagination.total}{" "}
          users
        </span>
        <div className="flex space-x-2">
          <button
            className="px-3 py-1 border rounded text-sm disabled:opacity-50"
            disabled={!pagination.hasPrev()}
            onClick={() => handlePageChange(pagination.page - 1)}
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              className={`px-3 py-1 border rounded text-sm ${
                pagination.page === idx + 1 ? "bg-blue-500 text-white" : ""
              }`}
              onClick={() => handlePageChange(idx + 1)}
            >
              {idx + 1}
            </button>
          ))}
          <button
            className="px-3 py-1 border rounded text-sm disabled:opacity-50"
            disabled={!pagination.hasNext()}
            onClick={() => handlePageChange(pagination.page + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
