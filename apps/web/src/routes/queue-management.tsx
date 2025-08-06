import { createFileRoute } from "@tanstack/react-router";
import QueueManagementDashboard from "@/components/queue-management-dashboard";

export const Route = createFileRoute("/queue-management")({
  component: QueueManagementComponent,
});

function QueueManagementComponent() {
  return <QueueManagementDashboard />;
}
