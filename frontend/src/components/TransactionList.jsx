import EmptyState from './EmptyState';
import TransactionItem from './TransactionItem';

export default function TransactionList({ onDelete, onEdit, transactions }) {
  if (transactions.length === 0) {
    return (
      <EmptyState
        description="Record your first income or expense to start building the dashboard."
        title="No transactions yet"
      />
    );
  }

  return (
    <section className="panel">
      <div className="table-list">
        <div className="table-list__head">
          <span>Entry</span>
          <span>Type</span>
          <span>Amount</span>
          <span>Date</span>
          <span>Actions</span>
        </div>

        <div className="table-list__body">
          {transactions.map((transaction) => (
            <TransactionItem
              key={transaction.id}
              onDelete={onDelete}
              onEdit={onEdit}
              transaction={transaction}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
