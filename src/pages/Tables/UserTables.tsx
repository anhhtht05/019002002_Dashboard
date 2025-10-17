import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import UserTable from "../../components/tables/BasicTables/UserTable";

export default function UserTables() {
  return (
    <>
      <PageBreadcrumb pageTitle="User" />
      <div className="space-y-6">
        <ComponentCard title="User Table" className="Add User">
          {/* <BasicTableOne/> */}
          <UserTable/>
        </ComponentCard>
      </div>
    </>
  );
}
