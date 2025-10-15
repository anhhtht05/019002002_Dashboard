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

export default function DataTable() {
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

  const totalPages = pagination.getTotalPages();

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) 
  );

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-4">
      {/* Search + Filter */}
      <div className="mb-4 flex justify-between items-center">
        {/* Left side: show entries + filters */}
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Show</span>
            <select
              className="border p-2 rounded"
              value={pagination.limit}
              onChange={(e) => handleLimitChange(Number(e.target.value))}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </select>
            <span className="text-sm text-gray-600">entries</span>
          </div>
          <select
            className="border p-2 rounded"
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
          <select
            className="border p-2 rounded"
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

        {/* Right side: search */}
        <div>
          <input
            type="text"
            placeholder="Search..."
            className="border p-2 rounded w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Header */}
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              {/* <TableCell isHeader className="px-5 py-3 text-start">
                Id
              </TableCell> */}
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

          {/* Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                {/* <TableCell className="px-5 py-4 sm:px-6 text-start">
                {user.id}
                </TableCell> */}
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    {user.name}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start">
                    {user.email}
                  </TableCell>
                  {/* <TableCell className="px-4 py-3 text-start">
                    <Badge
                      size="sm"
                      color={user.state === "ACTIVE" ? "success" : "error"}
                    >
                      {user.state}
                    </Badge>
                  </TableCell> */}
                  {/* <TableCell className="px-4 py-3 text-start">
                    <select
                        className="border rounded px-2 py-1 text-sm"
                        value={user.state}
                        onChange={(e) => {
                        const newState = e.target.value;
                        setUsers((prev) =>
                            prev.map((u) =>
                            u.id === user.id ? { ...u, state: newState } : u
                            )
                        );

                        }}
                    >
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="INACTIVE">INACTIVE</option>
                    </select>
                    </TableCell> */}
                    <TableCell className="px-4 py-3 text-start">
                        <select
                            className={`px-2 py-1 rounded text-sm font-medium border-0
                            ${user.state === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
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
                            <option value="ACTIVE" className="text-green-700">
                            ACTIVE
                            </option>
                            <option value="INACTIVE" className="text-red-700">
                            INACTIVE
                            </option>
                        </select>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500">
                        {user.role === "ROLE_ADMIN" ? "Admin" : "User"}
                    </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <td colSpan={4} className="text-center py-4 text-gray-500">
                  No data found
                </td>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center">
        <span className="text-sm text-gray-600">
          Page {pagination.page} of {totalPages} | Total {pagination.total} users
        </span>
        <div className="flex space-x-2">
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            disabled={!pagination.hasPrev()}
            onClick={() => handlePageChange(pagination.page - 1)}
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              className={`px-3 py-1 border rounded ${
                pagination.page === idx + 1 ? "bg-blue-500 text-white" : ""
              }`}
              onClick={() => handlePageChange(idx + 1)}
            >
              {idx + 1}
            </button>
          ))}
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
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
