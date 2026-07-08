import type { Board, Pool, Leader, Transaction, EngineLine, MoveRecord } from '../types'

export const WHITE_PIECES = new Set(['♔', '♕', '♖', '♗', '♘', '♙'])
export const BLACK_PIECES = new Set(['♚', '♛', '♜', '♝', '♞', '♟'])

export const INITIAL_BOARD: Board = [
  ['♜', null, '♝', '♛', '♚', null, null, '♜'],
  ['♟', '♟', null, '♝', '♞', '♟', '♟', '♟'],
  [null, null, '♟', null, '♟', null, null, null],
  [null, null, '♞', null, null, null, null, null],
  [null, null, '♗', '♙', null, null, null, null],
  [null, null, '♘', null, null, '♘', null, null],
  ['♙', '♙', null, null, '♙', '♙', '♙', '♙'],
  ['♖', null, '♗', '♕', '♔', null, null, '♖'],
]

export const MOVE_HISTORY: MoveRecord[] = [
  { n: 1,  w: 'e4',   b: 'e5' },
  { n: 2,  w: 'Nf3',  b: 'Nc6' },
  { n: 3,  w: 'Bb5',  b: 'a6' },
  { n: 4,  w: 'Ba4',  b: 'Nf6' },
  { n: 5,  w: 'O-O',  b: 'Be7' },
  { n: 6,  w: 'Re1',  b: 'b5' },
  { n: 7,  w: 'Bb3',  b: 'd6' },
  { n: 8,  w: 'c3',   b: 'O-O' },
  { n: 9,  w: 'd4',   b: 'Bg4' },
  { n: 10, w: 'Be3',  b: 'exd4' },
]

export const ENGINE_LINES: EngineLine[] = [
  { move: 'Nc4', score: '+0.4', continuation: 'Nc4 Qd7 f4 f6 Nf3' },
  { move: 'Qd2', score: '+0.1', continuation: 'Qd2 Nf6 Nc3 d5 e5' },
  { move: 'f4',  score: '-0.2', continuation: 'f4 f6 Nf3 Ne7 d5' },
]

export const POOLS: Pool[] = [
  { id: 1, stake: '0.01 ETH',  stake_amount: 0.01,  prize: '0.019 ETH',  players: 847, time: '1 min',  active: 234, usd: '$25',    category: 'bullet'    },
  { id: 2, stake: '0.05 ETH',  stake_amount: 0.05,  prize: '0.095 ETH',  players: 512, time: '3 min',  active: 178, usd: '$127',   category: 'blitz'     },
  { id: 3, stake: '0.10 ETH',  stake_amount: 0.10,  prize: '0.19 ETH',   players: 312, time: '5 min',  active: 89,  usd: '$254',   category: 'blitz'     },
  { id: 4, stake: '0.25 ETH',  stake_amount: 0.25,  prize: '0.475 ETH',  players: 98,  time: '10 min', active: 31,  usd: '$635',   category: 'rapid'     },
  { id: 5, stake: '0.50 ETH',  stake_amount: 0.50,  prize: '0.95 ETH',   players: 44,  time: '15 min', active: 12,  usd: '$1.27K', category: 'rapid'     },
  { id: 6, stake: '1.00 ETH',  stake_amount: 1.00,  prize: '1.90 ETH',   players: 18,  time: '30 min', active: 5,   usd: '$2.54K', category: 'classical' },
  { id: 7, stake: '5.00 ETH',  stake_amount: 5.00,  prize: '9.50 ETH',   players: 6,   time: '60 min', active: 2,   usd: '$12.7K', category: 'classical' },
]

export const LEADERS: Leader[] = [
  { rank: 1, name: 'GrandMasterX',  rating: 2847, earnings: '12.4 ETH', streak: 8,  flag: '🇷🇺' },
  { rank: 2, name: 'Karpov_99',     rating: 2791, earnings: '9.8 ETH',  streak: 5,  flag: '🇩🇪' },
  { rank: 3, name: 'DeepBlue_7',    rating: 2744, earnings: '7.2 ETH',  streak: 12, flag: '🇺🇸' },
  { rank: 4, name: 'NightCrawler',  rating: 2698, earnings: '5.9 ETH',  streak: 3,  flag: '🇬🇧' },
  { rank: 5, name: 'QueenSacrifice',rating: 2651, earnings: '4.1 ETH',  streak: 0,  flag: '🇫🇷' },
  { rank: 6, name: 'YourUsername',  rating: 2534, earnings: '2.3 ETH',  streak: 2,  flag: '🇧🇷', isYou: true },
  { rank: 7, name: 'Blitz_King',    rating: 2501, earnings: '1.9 ETH',  streak: 1,  flag: '🇯🇵' },
  { rank: 8, name: 'PawnStorm',     rating: 2487, earnings: '1.6 ETH',  streak: 0,  flag: '🇮🇳' },
]

export const TRANSACTIONS: Transaction[] = [
  { id: 1, type: 'win',      desc: 'Won vs. Karpov_99',   amount: '+0.10 ETH', usd: '+$254',    time: '2h ago' },
  { id: 2, type: 'deposit',  desc: 'Deposit · Lightning', amount: '+0.50 ETH', usd: '+$1,270',  time: '5h ago' },
  { id: 3, type: 'loss',     desc: 'Lost vs. DeepBlue_7', amount: '-0.05 ETH', usd: '-$127',    time: '8h ago' },
  { id: 4, type: 'withdraw', desc: 'Withdrawal to Wallet',amount: '-1.00 ETH', usd: '-$2,540',  time: '1d ago' },
  { id: 5, type: 'win',      desc: 'Won vs. Magnus_Fan',  amount: '+0.25 ETH', usd: '+$635',    time: '2d ago' },
]

export const VIEW_TITLES: Record<string, string> = {
  play:         'Live Game',
  matchmaking:  'Find Match',
  wallet:       'Wallet',
  leaderboard:  'Leaderboard',
}
