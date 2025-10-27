import { useEffect, useState } from "react";
import { BoxIconLine, GroupIcon } from "../../icons";
import UserService from "../../service/UserService";
import deviceService from "../../service/DeviceService";
import firmwareService from "../../service/FirmwareService";
import { Pagination } from "../../model";
import Loading from "../../loading/Loading";

export default function EcommerceMetrics() {
  const [userTotal, setUserTotal] = useState(0);
  const [deviceTotal, setDeviceTotal] = useState(0);
  const [firmwareTotal, setFirmwareTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const pagination = new Pagination(1, 1, 0); 

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [userRes, deviceRes, firmwareRes] = await Promise.all([
        UserService.getUsers(pagination.page, pagination.limit),
        deviceService.getDevices(pagination.page, pagination.limit),
        firmwareService.getFirmwares(pagination.page, pagination.limit),
      ]);

      setUserTotal(userRes.pagination.total || 0);
      setDeviceTotal(deviceRes.pagination.total || 0);
      setFirmwareTotal(firmwareRes.pagination.total || 0);
    } catch (err) {
      console.error("Failed to fetch metrics:", err);
    } finally {
      setLoading(false);
      }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  return (
    <>
    {loading && <Loading />}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {/* Users */}
      <div className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] w-full">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Users</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {userTotal.toLocaleString()}
            </h4>
          </div>
        </div>
      </div>

      {/* Devices */}
      <div className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] w-full">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Devices</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {deviceTotal.toLocaleString()}
            </h4>
          </div>
        </div>
      </div>

      {/* Firmwares */}
      <div className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] w-full">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Firmwares</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {firmwareTotal.toLocaleString()}
            </h4>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
