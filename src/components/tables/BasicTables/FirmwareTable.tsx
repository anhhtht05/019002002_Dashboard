import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { Firmware, Pagination } from "../../../model";
import firmwareService from "../../../service/FirmwareService";
import { HardwareType, ModelType } from "../../../enums";
import UpdateFirmwareModal from "../../modal/UpdateFirmwareModal";
import { StatusFirmwareType, getAllowedNextStatuses } from "../../../enums/StatusFimwareType";
import Loading from "../../../loading/Loading";
import SelectType from "../../ui/select/SelectType";
import Alert from "../../ui/alert/Alert";
import CommonModal from "../../ui/modal/CommonModal";

export default function FirmwareTable() {
  const [firmwares, setFirmwares] = useState<any[]>([]);
  const [pagination, setPagination] = useState(new Pagination(1, 5, 0));
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [modelFilter, setModelFilter] = useState<string | undefined>();
  const [hardwareFilter, setHardwareFilter] = useState<string | undefined>();
  const [selectedFirmware, setSelectedFirmware] = useState<any | null>(null);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{
    type: "success" | "error" | "warning" | "info";
    title: string;
    message: string;
  } | null>(null);
  const statusColors: Record<string, string> = {
    DRAFT: "bg-yellow-100 text-yellow-800",
    RELEASED: "bg-green-100 text-green-800",
    DEPRECATED: "bg-red-100 text-red-800",
    OUTDATED: "bg-gray-100 text-gray-800"
  };
  
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [onConfirm, setOnConfirm] = useState<() => void>(() => () => {});
  const [modalTitle, setModalTitle] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await firmwareService.getFirmwares(
        pagination.page,
        pagination.limit,
        statusFilter,
        modelFilter,
        hardwareFilter,
        search
      );
      setFirmwares(res.data);
      setPagination(
        new Pagination(res.pagination.page, res.pagination.limit, res.pagination.total)
      );
    } catch (err) {
      console.error("Failed to fetch firmwares:", err);
    } finally {
      setLoading(false);
    }
  };
  

  const handleEdit = (firmware: any) => {
    if (!firmware) return;
    setSelectedFirmware(firmware);
    setShowModalUpdate(true);
  };
  useEffect(() => {
    loadData();
  }, [pagination.page, pagination.limit, statusFilter, hardwareFilter, modelFilter, search]);

const handleDelete = (fw: Firmware) => {
  setModalMessage(`Are you sure you want to delete firmware "${fw.name}"?`);
  setModalTitle("Confirm firmware deletion");
  setOnConfirm(() => async () => {
    setShowModal(false);
    setLoading(true);
    try {
      await firmwareService.deleteFirmware(fw.id);

      setAlert({
        type: "success",
        title: "Deleted Successfully",
        message: `Firmware "${fw.name}" has been deleted.`,
      });
      loadData();
    } catch (err: any) {
      setAlert({
        type: "error",
        title: "Delete Failed",
        message: err.response?.data?.message || "Failed to delete firmware.",
      });
    } finally {
      setLoading(false);
    }
  });
  setShowModal(true);
};

const updateStatusFirmware = (fw: Firmware, val: string) => {
  setModalMessage(`Mark firmware "${fw.name}" as ${val}?`);
  setModalTitle("Confirm firmware update");
  setOnConfirm(() => async () => {
    setShowModal(false);
    try {
      setLoading(true);
      await firmwareService.updateStatusFirmware(fw.id, val);
      await loadData();
      setAlert({
        type: "success",
        title: "Status Updated",
        message: `Firmware "${fw.name}" marked as ${val}.`,
      });
    } catch (err: any) {
      setAlert({
        type: "error",
        title: "Update Failed",
        message: err.response?.data?.message || "Failed to update firmware status.",
      });
    } finally {
      setLoading(false);
    }
  });
  setShowModal(true);
};


  const totalPages = pagination.getTotalPages();

  return (
    <>
    {loading && <Loading />}
    {alert && (
      <div className="mb-4">
        <Alert
          variant={alert.type}
          title={alert.title}
          message={alert.message}
          duration={3000}
          onClose={() => setAlert(null)}
        />
      </div>
    )}
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-md dark:border-white/[0.05] dark:bg-gray-900">
      {/* --- Filter Section --- */}
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      {/* Left filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Entries per page */}
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

        {/* --- Filter Group --- */}
        <div className="flex flex-wrap gap-3">
          {/* Status Firmware */}
          <div className="flex flex-col">
            <select
              className="w-36 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm transition"
              value={statusFilter || ""}
              onChange={(e) => {
                setPagination(new Pagination(1, pagination.limit, pagination.total));
                setStatusFilter(e.target.value || undefined);
              }}
            >
              <option value="">All Types</option>
                {Object.values(StatusFirmwareType).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
              ))}
            </select>
          </div>

          {/* Hardware */}
          <div className="flex flex-col">
            <select
              className="w-36 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm transition"
              value={hardwareFilter || ""}
              onChange={(e) => {
                setPagination(new Pagination(1, pagination.limit, pagination.total));
                setHardwareFilter(e.target.value || undefined);
              }}
            >
              <option value="">All Hardware</option>
              {Object.values(HardwareType).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Model */}
          <div className="flex flex-col">
            <select
              className="w-36 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm transition"
              value={modelFilter || ""}
              onChange={(e) => {
                setPagination(new Pagination(1, pagination.limit, pagination.total));
                setModelFilter(e.target.value || undefined);
              }}
            >
              <option value="">All Models</option>
              {Object.values(ModelType).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Right: Search */}
      <div className="relative w-full md:w-64">
        <input
          type="text"
          placeholder="Search by name or ID..."
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
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
        </svg>
      </div>
    </div>


      {/* --- Table --- */}
      <div className="overflow-x-auto rounded-lg border border-gray-100 dark:border-gray-800">
        <Table className="min-w-full text-sm">
          <TableHeader className="bg-gray-50 dark:bg-gray-800">
            <TableRow>
              {["Name", "Version", "Description", "File Path", "Size (KB)", "Status", "Action"].map(
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
            {firmwares.length > 0 ? (
              firmwares.map((fw) => (
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
                    <SelectType 
                      value={fw.status}
                      options={getAllowedNextStatuses(fw.status).map((s) => ({
                        label: s,
                        value: s,
                      }))}
                      colorMap={statusColors}
                      onChange={(val) => updateStatusFirmware(fw, val)}
                      />
                  </TableCell>
                  <TableCell className="px-4 py-2 ">
                    <div className="flex w-full gap-2">
                      {fw.status === "DRAFT" && (
                        <>
                          {/* Delete button */}
                          <button
                            className="text-gray-500 hover:text-error-500 dark:text-gray-400 dark:hover:text-error-500"
                            onClick={() => handleDelete(fw)}
                          >
                            <svg className="fill-current" width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path fill-rule="evenodd" clip-rule="evenodd" d="M7.04142 4.29199C7.04142 3.04935 8.04878 2.04199 9.29142 2.04199H11.7081C12.9507 2.04199 13.9581 3.04935 13.9581 4.29199V4.54199H16.1252H17.166C17.5802 4.54199 17.916 4.87778 17.916 5.29199C17.916 5.70621 17.5802 6.04199 17.166 6.04199H16.8752V8.74687V13.7469V16.7087C16.8752 17.9513 15.8678 18.9587 14.6252 18.9587H6.37516C5.13252 18.9587 4.12516 17.9513 4.12516 16.7087V13.7469V8.74687V6.04199H3.8335C3.41928 6.04199 3.0835 5.70621 3.0835 5.29199C3.0835 4.87778 3.41928 4.54199 3.8335 4.54199H4.87516H7.04142V4.29199ZM15.3752 13.7469V8.74687V6.04199H13.9581H13.2081H7.79142H7.04142H5.62516V8.74687V13.7469V16.7087C5.62516 17.1229 5.96095 17.4587 6.37516 17.4587H14.6252C15.0394 17.4587 15.3752 17.1229 15.3752 16.7087V13.7469ZM8.54142 4.54199H12.4581V4.29199C12.4581 3.87778 12.1223 3.54199 11.7081 3.54199H9.29142C8.87721 3.54199 8.54142 3.87778 8.54142 4.29199V4.54199ZM8.8335 8.50033C9.24771 8.50033 9.5835 8.83611 9.5835 9.25033V14.2503C9.5835 14.6645 9.24771 15.0003 8.8335 15.0003C8.41928 15.0003 8.0835 14.6645 8.0835 14.2503V9.25033C8.0835 8.83611 8.41928 8.50033 8.8335 8.50033ZM12.9168 9.25033C12.9168 8.83611 12.581 8.50033 12.1668 8.50033C11.7526 8.50033 11.4168 8.83611 11.4168 9.25033V14.2503C11.4168 14.6645 11.7526 15.0003 12.1668 15.0003C12.581 15.0003 12.9168 14.6645 12.9168 14.2503V9.25033Z" fill=""></path>
                            </svg>
                          </button>

                          {/* Edit button */}
                          <button
                            className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white/90"
                            onClick={() => handleEdit(fw)}
                          >
                            <svg className="fill-current" width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path fill-rule="evenodd" clip-rule="evenodd" d="M17.0911 3.53206C16.2124 2.65338 14.7878 2.65338 13.9091 3.53206L5.6074 11.8337C5.29899 12.1421 5.08687 12.5335 4.99684 12.9603L4.26177 16.445C4.20943 16.6931 4.286 16.9508 4.46529 17.1301C4.64458 17.3094 4.90232 17.3859 5.15042 17.3336L8.63507 16.5985C9.06184 16.5085 9.45324 16.2964 9.76165 15.988L18.0633 7.68631C18.942 6.80763 18.942 5.38301 18.0633 4.50433L17.0911 3.53206ZM14.9697 4.59272C15.2626 4.29982 15.7375 4.29982 16.0304 4.59272L17.0027 5.56499C17.2956 5.85788 17.2956 6.33276 17.0027 6.62565L16.1043 7.52402L14.0714 5.49109L14.9697 4.59272ZM13.0107 6.55175L6.66806 12.8944C6.56526 12.9972 6.49455 13.1277 6.46454 13.2699L5.96704 15.6283L8.32547 15.1308C8.46772 15.1008 8.59819 15.0301 8.70099 14.9273L15.0436 8.58468L13.0107 6.55175Z" fill=""></path>
                            </svg>
                          </button>
                        </>
                      )}

                      {fw.status === "DEPRECATED" && (
                        <span className="text-gray-400 dark:text-gray-500 text-sm italic">
                        </span>
                      )}
                    </div>
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
        <CommonModal
        title={modalTitle}
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={onConfirm}
        saveText="Yes"
        closeText="Cancel"
        message={modalMessage}
      />
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
      {showModalUpdate && selectedFirmware && (
        <UpdateFirmwareModal
          firmware={selectedFirmware}
          onClose={() => {
            setShowModalUpdate(false);
            setSelectedFirmware(null);
            loadData();
          }}
          onSuccess={(msg) => {
            setAlert(msg); 
            loadData(); 
          }}
        />
      )}
    </div>
  </>
  );
}
