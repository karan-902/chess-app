import Card from '../../components/base/Card/Card'
import Box from '../../components/base/Box/Box'
import Text from '../../components/base/Text/Text'

function BalanceCard() {
  return (
    <Card customClass="balance-card">
      <Text font="mono" size={10} color="muted" uppercase customClass="balance-label">Total Balance</Text>
      <Box customClass="balance-row">
        <Text customClass="balance-amount-text">3.4210</Text>
        <Text customClass="balance-currency-text">ETH</Text>
      </Box>
      <Text customClass="balance-usd-text">≈ $8,634</Text>
      <Text customClass="balance-profit-text">+0.32 ETH today ↑</Text>
    </Card>
  )
}

export default BalanceCard
