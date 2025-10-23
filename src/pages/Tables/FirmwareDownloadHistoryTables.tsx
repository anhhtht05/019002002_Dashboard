import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import FirmwareTable from "../../components/tables/BasicTables/FirmwareTable";

export default function FirmwareDownloadHistoryTables() {
  return (
    <>
      <PageBreadcrumb pageTitle="Firmware Download History" />
      <div className="space-y-6">
        <ComponentCard
          title="Firmware Download History Management"
        >
          <FirmwareTable/>
        </ComponentCard>
      </div>
    </>
  );
}
