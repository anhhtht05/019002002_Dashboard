import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { Pagination } from "../../../model";
import firmwareService from "../../../service/FirmwareService";

export default function FirmwareTable() {
  const [firmwares, setFirmwares] = useState<any[]>([]);
  const [pagination, setPagination] = useState(new Pagination(1, 5, 0));
  const [search, setSearch] = useState("");

  const loadData = async () => {
    try {
      const res = await firmwareService.getFirmwares(
        pagination.page,
        pagination.limit
      );
      setFirmwares(res.data);
      setPagination(
        new Pagination(res.pagination.page, res.pagination.limit, res.pagination.total)
      );
    } catch (err) {
      console.error("Failed to fetch firmwares:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, [pagination.page, pagination.limit]);

  const totalPages = pagination.getTotalPages();

  const filteredFirmwares = firmwares.filter(
    (fw) =>
      fw.name?.toLowerCase().includes(search.toLowerCase()) ||
      fw.version?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-md dark:border-white/[0.05] dark:bg-gray-900">
      {/* --- Search --- */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-700 dark:text-gray-300">Show</span>
          <select
            className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-1 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
            value={pagination.limit}
            onChange={(e) =>
              setPagination(new Pagination(1, Number(e.target.value), pagination.total))
            }
          >
            {[5, 10, 15, 20].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <span className="text-gray-700 dark:text-gray-300">entries</span>
        </div>

        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search by name or version..."
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

      {/* --- Table --- */}
      <div className="overflow-x-auto rounded-lg border border-gray-100 dark:border-gray-800">
        <Table className="min-w-full text-sm">
          <TableHeader className="bg-gray-50 dark:bg-gray-800">
            <TableRow>
              {["Name", "Version", "Description", "File Path", "Size (KB)", "Status"].map(
                (header) => (
                  <TableCell
                    key={header}
                    isHeader
                    className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300"
                  >
                    {header}
                  </TableCell>
                )
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFirmwares.length > 0 ? (
              filteredFirmwares.map((fw) => (
                <TableRow
                  key={`${fw.name}-${fw.version}`}
                  className="hover:bg-blue-50 dark:hover:bg-gray-800 transition"
                >
                  <TableCell className="px-4 py-2 font-medium text-gray-900 dark:text-gray-100">
                    {fw.name}
                  </TableCell>
                  <TableCell className="px-4 py-2">{fw.version}</TableCell>
                  <TableCell className="px-4 py-2">{fw.description}</TableCell>
                  <TableCell className="px-4 py-2">{fw.filePath}</TableCell>
                  <TableCell className="px-4 py-2">{(fw.fileSize / 1024).toFixed(2)}</TableCell>
                  {/* <TableCell className="px-4 py-2">{fw.checksum}</TableCell> */}
                  <TableCell className="px-4 py-2">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        fw.status === "DRAFT"
                          ? "bg-yellow-100 text-yellow-700"
                          : fw.status === "RELEASED"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {fw.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <td
                  colSpan={7}
                  className="text-center py-6 text-gray-500 dark:text-gray-400"
                >
                  No firmwares found
                </td>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* --- Pagination --- */}
      <div className="mt-6 flex flex-col md:flex-row md:justify-between md:items-center gap-3">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Page {pagination.page} of {totalPages} | Total {pagination.total} firmwares
        </span>
        <div className="flex flex-wrap gap-2 justify-center md:justify-end">
          <button
            className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
            disabled={!pagination.hasPrev()}
            onClick={() =>
              setPagination(new Pagination(pagination.page - 1, pagination.limit, pagination.total))
            }
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              className={`px-3 py-1 rounded-md border border-gray-300 dark:border-gray-700 ${
                pagination.page === idx + 1
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
              }`}
              onClick={() =>
                setPagination(new Pagination(idx + 1, pagination.limit, pagination.total))
              }
            >
              {idx + 1}
            </button>
          ))}
          <button
            className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
            disabled={!pagination.hasNext()}
            onClick={() =>
              setPagination(new Pagination(pagination.page + 1, pagination.limit, pagination.total))
            }
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
