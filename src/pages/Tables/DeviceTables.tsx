import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import RegisterDeviceModal from "../../components/modal/RegisterDeviceModal";
import DeviceTable from "../../components/tables/BasicTables/DeviceTable";
import { useState } from "react";
import Alert from "../../components/ui/alert/Alert";

export default function DeviceTables() {
  const [alertData, setAlertData] = useState<{
    type: "success" | "error" | "warning" | "info";
    title: string;
    message: string;
  } | null>(null);

  return (
    <>
    {alertData && (
        <div className="mb-4">
          <Alert
            variant={alertData.type}
            title={alertData.title}
            message={alertData.message}
            duration={3000}
            onClose={() => setAlertData(null)}
          />
        </div>
      )}
      <PageBreadcrumb pageTitle="Device" />

      <div className="space-y-6">
      <ComponentCard
        title="Device Management"
        modalComponent={RegisterDeviceModal}
        actionLabel="Add Device"
        onSuccess={(data) => setAlertData(data)}
      >
          <DeviceTable onSuccess={(data) => setAlertData(data)}/>
        </ComponentCard>
      </div>
    </>
  );
}
