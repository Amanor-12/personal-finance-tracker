import { formatCurrency } from '../utils/currency';
import { formatDisplayDate } from '../utils/date';

export default function TransactionItem({ transaction, onDelete, onEdit }) {
  return (
    <article className="table-row">
      <div>
        <p className="table-row__primary">{transaction.description || transaction.category_name}</p>
        <p className="table-row__secondary">{transaction.category_name}</p>
      </div>

      <div>
        <span className={`pill ${transaction.type === 'income' ? 'pill--success' : 'pill--neutral'}`}>
          {transaction.type}
        </span>
      </div>

      <div>
        <p className={`amount ${transaction.type === 'income' ? 'amount--positive' : 'amount--negative'}`}>
          {transaction.type === 'income' ? '+' : '-'}
          {formatCurrency(transaction.amount)}
        </p>
      </div>

      <div>
        <p className="table-row__secondary">{formatDisplayDate(transaction.transaction_date)}</p>
      </div>

      <div className="table-row__actions">
        <button className="button button--ghost" onClick={() => onEdit(transaction)} type="button">
          Edit
        </button>
        <button className="button button--ghost-danger" onClick={() => onDelete(transaction)} type="button">
          Delete
        </button>
      </div>
    </article>
  );
}
