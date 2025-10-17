import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import FirmwareTable from "../../components/tables/BasicTables/FirmwareTable";
import RegisterFirmwareModal from "../../components/modal/RegisterFirmwareModal";

export default function FirmwareTables() {
  return (
    <>
      <PageBreadcrumb pageTitle="Firmware" />
      <div className="space-y-6">
        <ComponentCard
          title="Firmware Management"
          modalComponent={RegisterFirmwareModal}
          actionLabel="Upload Firmware"
        >
          <FirmwareTable/>
        </ComponentCard>
      </div>
    </>
  );
}
