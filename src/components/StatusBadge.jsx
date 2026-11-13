import { classeStatus, statusLabels } from '../data/orders';

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${classeStatus(status)}`}
    >
      {statusLabels[status] || status}
    </span>
  );
}

export default StatusBadge;
