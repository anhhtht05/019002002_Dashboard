import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import FirmwareTable from "../../components/tables/BasicTables/FirmwareTable";

export default function FirmwareTables() {
  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Firmware" />
      <div className="space-y-6">
        <ComponentCard title="Firmware Table">
          {/* <BasicTableOne/> */}
          <FirmwareTable/>
        </ComponentCard>
      </div>
    </>
  );
}
