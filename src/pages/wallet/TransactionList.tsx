import Box from '../../components/base/Box/Box'
import Text from '../../components/base/Text/Text'
import TransactionItem from './TransactionItem'
import { TRANSACTIONS } from '../../constants/gameData'

function TransactionList() {
  return (
    <Box customClass="tx-section">
      <Text customClass="section-title">Recent Transactions</Text>
      <Box customClass="tx-list">
        {TRANSACTIONS.map((tx) => (
          <TransactionItem key={tx.id} tx={tx} />
        ))}
      </Box>
    </Box>
  )
}

export default TransactionList
