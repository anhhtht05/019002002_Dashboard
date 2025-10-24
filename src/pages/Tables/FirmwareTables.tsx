import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import FirmwareTable from "../../components/tables/BasicTables/FirmwareTable";
import RegisterFirmwareModal from "../../components/modal/RegisterFirmwareModal";
import { useState } from "react";
import Alert from "../../components/ui/alert/Alert";

export default function FirmwareTables() {
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
      <PageBreadcrumb pageTitle="Firmware" />
      <div className="space-y-6">
        <ComponentCard
          title="Firmware Management"
          modalComponent={RegisterFirmwareModal}
          actionLabel="Upload Firmware"
          onSuccess={(data) => setAlertData(data)}
        >
          <FirmwareTable onSuccess={(data) => setAlertData(data)}/>
        </ComponentCard>
      </div>
    </>
  );
}
