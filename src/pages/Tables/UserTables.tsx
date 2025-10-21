import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import UserTable from "../../components/tables/BasicTables/UserTable";
import RegisterUserModal from "../../components/modal/RegisterUserModal";

export default function UserTables() {
  return (
    <>
      <PageBreadcrumb pageTitle="User" />
      <div className="space-y-6">
      <ComponentCard
          title="User Management"
          modalComponent={RegisterUserModal}
          actionLabel="Add User"
        >
          <UserTable/>
        </ComponentCard>
      </div>
    </>
  );
}
