import clsx from 'clsx'
import Card from '../../components/base/Card/Card'
import Box from '../../components/base/Box/Box'
import Text from '../../components/base/Text/Text'
import type { Transaction } from '../../types'

const ICONS: Record<string, string> = { win: '♔', loss: '♚', deposit: '↓', withdraw: '↑' }

interface ITransactionItemProps {
  tx: Transaction
}

function TransactionItem({ tx }: ITransactionItemProps) {
  const isPos = tx.amount.startsWith('+')
  return (
    <Card customClass="tx-item">
      <Box customClass={clsx('tx-icon', isPos ? 'pos' : 'neg')}>{ICONS[tx.type]}</Box>
      <Box customClass="tx-info">
        <Text font="inter" size={14} color="white" customClass="tx-desc">{tx.desc}</Text>
        <Text font="mono" size={11} color="muted" customClass="tx-time">{tx.time}</Text>
      </Box>
      <Box customClass="tx-amounts">
        <Text font="mono" size={14} weight={700} customClass={clsx('tx-amount', isPos ? 'pos' : 'neg')}>{tx.amount}</Text>
        <Text font="mono" size={10} color="muted" customClass="tx-usd">{tx.usd}</Text>
      </Box>
    </Card>
  )
}

export default TransactionItem
