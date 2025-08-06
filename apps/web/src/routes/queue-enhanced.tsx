import { createFileRoute } from "@tanstack/react-router";
import QueueManagementEnhanced from "@/components/queue-management-enhanced";

export const Route = createFileRoute("/queue-enhanced")({
  component: QueueEnhancedComponent,
});

function QueueEnhancedComponent() {
  return <QueueManagementEnhanced />;
}
