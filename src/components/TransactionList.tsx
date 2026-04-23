import React from 'react';

interface TransactionListProps {
  transactions?: any[];
  loading?: boolean;
  error?: any;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, loading, error }) => {
  if (loading) return <div>Loading transactions...</div>;
  if (error) return <div>Error loading transactions: {error.data?.message || error.error}</div>;
  if (!transactions || transactions.length === 0) return <p>No transactions found.</p>;

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
      <thead>
        <tr style={{ backgroundColor: '#f2f2f2' }}>
          <th style={{ padding: '8px', border: '1px solid #ddd' }}>Date</th>
          <th style={{ padding: '8px', border: '1px solid #ddd' }}>Amount (NGN)</th>
          <th style={{ padding: '8px', border: '1px solid #ddd' }}>Recipient</th>
          <th style={{ padding: '8px', border: '1px solid #ddd' }}>Status</th>
          <th style={{ padding: '8px', border: '1px solid #ddd' }}>Reference</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((tx) => (
          <tr key={tx._id}>
            <td style={{ padding: '8px', border: '1px solid #ddd' }}>
              {new Date(tx.createdAt).toLocaleString()}
            </td>
            <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right' }}>
              ₦{tx.amount.toLocaleString()}
            </td>
            <td style={{ padding: '8px', border: '1px solid #ddd' }}>
              {typeof tx.recipient === 'object' && tx.recipient
                ? `${tx.recipient.firstName} ${tx.recipient.lastName}`
                : tx.recipient}
            </td>
            <td
              style={{
                padding: '8px',
                border: '1px solid #ddd',
                color: tx.status === 'success' ? 'green' : tx.status === 'failed' ? 'red' : 'orange',
                fontWeight: 'bold',
              }}
            >
              {tx.status.toUpperCase()}
            </td>
            <td style={{ padding: '8px', border: '1px solid #ddd', fontFamily: 'monospace' }}>
              {tx.reference}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TransactionList;