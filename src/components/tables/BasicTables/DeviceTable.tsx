import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { Pagination } from "../../../model";
import deviceService from "../../../service/DeviceService";
import { DeviceType, ModelType, HardwareType } from "../../../enums";

export default function DeviceTable() {
  const [devices, setDevices] = useState<any[]>([]);
  const [pagination, setPagination] = useState(new Pagination(1, 5, 0));

  // Filter
  const [deviceTypeFilter, setDeviceTypeFilter] = useState<string | undefined>();
  const [hardwareFilter, setHardwareFilter] = useState<string | undefined>();
  const [modelFilter, setModelFilter] = useState<string | undefined>();
  const [search, setSearch] = useState("");

  // Load data
  const loadData = async () => {
    try {
      const res = await deviceService.getDevices(
        pagination.page,
        pagination.limit,
        deviceTypeFilter,
        hardwareFilter,
        modelFilter
      );
      setDevices(res.data);
      setPagination(
        new Pagination(
          res.pagination.page,
          res.pagination.limit,
          res.pagination.total
        )
      );
    } catch (err) {
      console.error("Failed to fetch devices:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, [pagination.page, pagination.limit, deviceTypeFilter, hardwareFilter, modelFilter]);

  const totalPages = pagination.getTotalPages();

  // Frontend search filter
  const filteredDevices = devices.filter(
    (d) =>
      d.deviceName.toLowerCase().includes(search.toLowerCase()) ||
      d.deviceId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white p-4 dark:border-white/[0.05] dark:bg-white/[0.03]">
      {/* --- Filter + Search --- */}
      <div className="mb-4 flex justify-between items-center">
        {/* Left: filter & entries */}
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Show</span>
            <select
              className="border p-2 rounded"
              value={pagination.limit}
              onChange={(e) =>
                setPagination(new Pagination(1, Number(e.target.value), pagination.total))
              }
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </select>
            <span className="text-sm text-gray-600">entries</span>
          </div>

          {/* Device Type */} 
          <select
            className="border p-2 rounded"
            value={deviceTypeFilter || ""}
            onChange={(e) => setDeviceTypeFilter(e.target.value || undefined)}
          >
            <option value="">All Types</option>
            {Object.values(DeviceType).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          {/* Hardware */}
          <select
            className="border p-2 rounded"
            value={hardwareFilter || ""}
            onChange={(e) => setHardwareFilter(e.target.value || undefined)}
          >
            <option value="">All Hardware</option>
            {Object.values(HardwareType).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          {/* Model */}
          <select
            className="border p-2 rounded"
            value={modelFilter || ""}
            onChange={(e) => setModelFilter(e.target.value || undefined)}
          >
            <option value="">All Models</option>
            {Object.values(ModelType).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Right: Search */}
        <div>
          <input
            type="text"
            placeholder="Search by name or ID..."
            className="border p-2 rounded w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* --- Table --- */}
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell isHeader>ID</TableCell>
              <TableCell isHeader>Name</TableCell>
              <TableCell isHeader>Type</TableCell>
              <TableCell isHeader>Hardware</TableCell>
              <TableCell isHeader>Serial</TableCell>
              <TableCell isHeader>MAC</TableCell>
              <TableCell isHeader>Model</TableCell>
              <TableCell isHeader>Status</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {filteredDevices.length > 0 ? (
              filteredDevices.map((d) => (
                <TableRow key={d.deviceId}>
                  <TableCell>{d.deviceId}</TableCell>
                  <TableCell>{d.deviceName}</TableCell>
                  <TableCell>{d.deviceType}</TableCell>
                  <TableCell>{d.hardwareVersion}</TableCell>
                  <TableCell>{d.serialNumber}</TableCell>
                  <TableCell>{d.macAddress}</TableCell>
                  <TableCell>{d.model}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 text-sm rounded ${
                        d.status === "ONLINE"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {d.status}
                    </span>
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

      {/* --- Pagination --- */}
      <div className="mt-4 flex justify-between items-center">
        <span className="text-sm text-gray-600">
          Page {pagination.page} of {totalPages} | Total {pagination.total} devices
        </span>
        <div className="flex space-x-2">
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
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
              className={`px-3 py-1 border rounded ${
                pagination.page === idx + 1 ? "bg-blue-500 text-white" : ""
              }`}
              onClick={() =>
                setPagination(new Pagination(idx + 1, pagination.limit, pagination.total))
              }
            >
              {idx + 1}
            </button>
          ))}
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
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
