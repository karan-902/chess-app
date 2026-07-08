import { useState } from 'react'
import clsx from 'clsx'
import Card from '../../components/base/Card/Card'
import Box from '../../components/base/Box/Box'
import Button from '../../components/base/Button/Button'
import Text from '../../components/base/Text/Text'
import Input from '../../components/base/Input/Input'

interface IActionCardProps {
  tab: 'deposit' | 'withdraw'
  network: 'lightning' | 'onchain'
  onTabChange: (tab: 'deposit' | 'withdraw') => void
  onNetworkChange: (net: 'lightning' | 'onchain') => void
}

function ActionCard({ tab, network, onTabChange, onNetworkChange }: IActionCardProps) {
  const [amount, setAmount] = useState('')

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/[^0-9.]/g, '')
    const parts = val.split('.')
    if (parts.length > 2) val = parts[0] + '.' + parts.slice(1).join('')
    setAmount(val)
  }

  return (
    <Card customClass="action-card">
      <Box customClass="action-tabs">
        {(['deposit', 'withdraw'] as const).map((t) => (
          <button
            key={t}
            onClick={() => onTabChange(t)}
            className={clsx('action-tab', tab === t && 'active')}
          >
            {t === 'deposit' ? '↓ Deposit' : '↑ Withdraw'}
          </button>
        ))}
      </Box>
      <Box customClass="action-content">
        <Box customClass="field-group">
          <Text font="mono" size={10} color="muted" uppercase customClass="field-label">Amount (ETH)</Text>
          <Input
            type="text"
            inputMode="decimal"
            placeholder="0.00000000"
            customClass="amount-input"
            fullWidth
            value={amount}
            onChange={handleAmountChange}
          />
        </Box>
        <Box customClass="field-group">
          <Text font="mono" size={10} color="muted" uppercase customClass="field-label">Network</Text>
          <Box customClass="network-options">
            <button
              className={clsx('network-btn', network === 'lightning' && 'active')}
              onClick={() => onNetworkChange('lightning')}
            >
              ⚡ Lightning
            </button>
            <button
              className={clsx('network-btn', network === 'onchain' && 'active')}
              onClick={() => onNetworkChange('onchain')}
            >
              ⛓ On-chain
            </button>
          </Box>
        </Box>
        <Button variant="primary" size="lg" fullWidth>
          {tab === 'deposit' ? 'GENERATE INVOICE' : 'REQUEST WITHDRAWAL'}
        </Button>
      </Box>
    </Card>
  )
}

export default ActionCard
