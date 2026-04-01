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
      <div className="panel__header">
        <div>
          <p className="eyebrow">Recorded activity</p>
          <h3>Transaction log</h3>
        </div>
        <div className="panel__meta">{transactions.length} entries</div>
      </div>

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
