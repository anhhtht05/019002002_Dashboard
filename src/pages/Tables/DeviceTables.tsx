import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import DeviceTable from "../../components/tables/BasicTables/DeviceTable";
import RegisterDeviceModal from "../../components/modal/RegisterDeviceModal";

export default function DeviceTables() {
  return (
    <>
      <PageBreadcrumb pageTitle="Device" />

      <div className="space-y-6">
      <ComponentCard
        title="Device Management"
        modalComponent={RegisterDeviceModal}
        actionLabel="Add Device"
      >
          <DeviceTable />
        </ComponentCard>
      </div>
    </>
  );
}
