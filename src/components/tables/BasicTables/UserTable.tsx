import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { User } from "../../../model/UserDTO";
import { Pagination } from "../../../model";
import UserService from "../../../service/UserService";
import { UserStateType, RoleType, StatusType } from "../../../enums";
import Loading from "../../../loading/Loading";
import SelectType from "../../ui/select/SelectType";
import CommonModal from "../../ui/modal/CommonModal";

interface UserTableProps {
  onSuccess?: (alert: {
    type: "success" | "error" | "warning" | "info";
    title: string;
    message: string;
  }) => void;
}

export default function UserTable({ onSuccess }: UserTableProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination>(
    new Pagination(1, 5, 0)
  );
  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState<string | undefined>();
  const [roleFilter, setRoleFilter] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [onConfirm, setOnConfirm] = useState<() => void>(() => () => {});
  const [modalTitle, setModalTitle] = useState("");

  const statusColors: Record<string, string> = {
    ROLE_OPERATOR: "bg-yellow-100 text-yellow-800",
    ROLE_ADMIN: "bg-green-100 text-green-800",
    ROLE_SUPER_ADMIN: "bg-red-100 text-red-800",
    ACTIVE: "bg-green-200 text-green-900",
    INACTIVE: "bg-gray-300 text-gray-900",
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await UserService.getUsers(
        pagination.page,
        pagination.limit,
        stateFilter,
        roleFilter,
        search
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [pagination.page, pagination.limit, stateFilter, roleFilter, search]);

  const handlePageChange = (newPage: number) => {
    setPagination(new Pagination(newPage, pagination.limit, pagination.total));
  };

  const handleLimitChange = (newLimit: number) => {
    setPagination(new Pagination(1, newLimit, pagination.total));
  };

 const handleUpdateState = (userId: string, newState: string, userName: string) => {
    setModalMessage(`Are you sure you want to change state of user "${userName}" to "${newState}"?`);
    setModalTitle("Confirm state change");
    setOnConfirm(() => async () => {
      setShowConfirmModal(false);
      setLoading(true);
      try {
        await UserService.updateUserState(userId, newState);
        setUsers((prev) =>
          prev.map((u) => (u.id.toString() === userId ? { ...u, state: newState } : u))
        );
        onSuccess?.({
          type: "success",
          title: "State Updated",
          message: `User "${userName}" state updated to "${newState}".`,
        });
      } catch (err: any) {
        onSuccess?.({
          type: "error",
          title: "Failed to Update State",
          message: err.response?.data?.message || "Unable to update user state.",
        });
      } finally {
        setLoading(false);
      }
    });
    setShowConfirmModal(true);
  };

  const handleUpdateRole = (userId: string, newRole: string, roleLabel: string, userName: string) => {
    setModalMessage(`Are you sure you want to change role of user "${userName}" to "${roleLabel}"?`);
    setModalTitle("Confirm role change");
    setOnConfirm(() => async () => {
      setShowConfirmModal(false);
      setLoading(true);
      try {
        await UserService.updateUserRole(userId, newRole);
        setUsers((prev) =>
          prev.map((u) => (u.id.toString() === userId ? { ...u, role: newRole } : u))
        );
        onSuccess?.({
          type: "success",
          title: "Role Updated",
          message: `User "${userName}" role updated to "${roleLabel}".`,
        });
      } catch (err: any) {
        onSuccess?.({
          type: "error",
          title: "Failed to Update Role",
          message: err.response?.data?.message || "Unable to update user role.",
        });
      } finally {
        setLoading(false);
      }
    });
    setShowConfirmModal(true);
  };
  

  const totalPages = pagination.getTotalPages();

  return (
    <>
    {loading && <Loading />}
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
            onChange={(e) => {
              setPagination(new Pagination(1, pagination.limit, pagination.total));
              setStateFilter(e.target.value || undefined);
            }}
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
            onChange={(e) =>{
              setPagination(new Pagination(1, pagination.limit, pagination.total));
              setRoleFilter(e.target.value || undefined);
            }}
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
            placeholder="Search by name or email..."
            className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 rounded-md text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            value={search}
            onChange={(e) => {
              setPagination(new Pagination(1, pagination.limit, pagination.total));
              setSearch(e.target.value);
            }}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute right-3 top-2.5 h-4 w-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
            />
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
            { users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="px-5 py-4 text-start">
                    {user.name}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start text-gray-600">
                    {user.email}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                  <SelectType
                    value={user.state}
                    options={Object.values(StatusType).map((s) => ({
                      label: s, 
                      value: s, 
                    }))}
                    colorMap={statusColors}
                    onChange={(val) => handleUpdateState(user.id.toString(), val.toString(), user.name)}
                  />
                </TableCell>
                <TableCell>
                  <SelectType
                    value={user.role}
                    options={Object.values(RoleType).map((r) => ({
                      label: r.label,
                      value: r.value,
                    }))}
                    colorMap={statusColors}
                    onChange={(val) => {
                      const selected = Object.values(RoleType).find((r) => r.value === val);
                      handleUpdateRole(
                        user.id.toString(),
                        val.toString(),
                        selected?.label ?? val.toString(),
                        user.name
                      );
                    }}
                  />
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
        <CommonModal
          title={modalTitle}
          show={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onSave={onConfirm}
          saveText="Yes, Confirm"
          closeText="Cancel"
          message={modalMessage}
        />
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center">
        <span className="text-sm text-gray-600">
          Page {pagination.page} of {totalPages} | Total {pagination.total} users
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
  </>
  );
}
