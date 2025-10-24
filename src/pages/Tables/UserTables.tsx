import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import UserTable from "../../components/tables/BasicTables/UserTable";
import RegisterUserModal from "../../components/modal/RegisterUserModal";
import { useState } from "react";
import Alert from "../../components/ui/alert/Alert";

export default function UserTables() {
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
      <PageBreadcrumb pageTitle="User" />
      <div className="space-y-6">
      <ComponentCard
          title="User Management"
          modalComponent={RegisterUserModal}
          actionLabel="Add User"
          onSuccess={(data) => setAlertData(data)}
        >
          <UserTable onSuccess={(data) => setAlertData(data)} />
        </ComponentCard>
      </div>
    </>
  );
}
