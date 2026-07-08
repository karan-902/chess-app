import Loader from '../Loader/Loader'
import { cn } from '@/lib/utils'
import './button.scss'

interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'outline' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  customClass?: string
  children: React.ReactNode
  width?: string | number
  height?: string | number
  isLoading?: boolean
}

const variantStyles: Record<string, string> = {
  primary:
    'bg-[#f0b90b] text-[#1a0e00] font-bold shadow-[0_4px_16px_rgba(240,185,11,0.35)]' +
    ' hover:bg-[#d4a009] hover:shadow-[0_4px_20px_rgba(240,185,11,0.45)]',
  ghost:
    'bg-white/[0.04] border border-white/[0.08] text-white/55' +
    ' hover:text-white hover:border-white/[0.15] hover:bg-white/[0.07]',
  outline:
    'bg-transparent border border-[rgba(240,185,11,0.28)] text-[#f0b90b]' +
    ' hover:bg-[rgba(240,185,11,0.06)]',
  danger:
    'bg-white/[0.04] border border-white/[0.08] text-white/55' +
    ' hover:border-red-400/40 hover:text-red-400 hover:bg-red-900/[0.06]',
}

const sizeStyles: Record<string, string> = {
  sm: 'h-10 px-[0.875rem] text-[13px]',
  md: 'h-11 px-4 text-[14px]',
  lg: 'h-12 px-5 text-[15px]',
}

function Button({
  variant = 'primary',
  size = 'md',
  fullWidth,
  customClass,
  className,
  children,
  width,
  height,
  isLoading,
  disabled,
  ...props
}: IButtonProps) {
  const inlineStyle: React.CSSProperties = {}
  if (width !== undefined) inlineStyle.width = typeof width === 'number' ? `${width}px` : width
  if (height !== undefined) inlineStyle.height = typeof height === 'number' ? `${height}px` : height

  const isPrimary = variant === 'primary'

  return (
    <button
      className={cn(
        'relative inline-flex items-center justify-center gap-2 rounded-xl font-semibold',
        'cursor-pointer outline-none transition-all duration-150 whitespace-nowrap',
        'overflow-hidden font-[Outfit] tracking-wide',
        'active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
        isLoading && 'cursor-wait',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        customClass,
        className,
      )}
      style={Object.keys(inlineStyle).length ? inlineStyle : undefined}
      disabled={disabled || isLoading}
      {...props}
    >
      {isPrimary && !isLoading && (
        <>
          <div className="-z-30 blur-[2px] absolute inset-0 overflow-visible [container-type:size]">
            <div
              className="absolute inset-0 h-[100cqh] [aspect-ratio:1] [border-radius:0] [mask:none]"
              style={{ animation: 'shimmer-slide 3s ease-in-out infinite' }}
            >
              <div
                className="absolute inset-[-100%] w-auto"
                style={{
                  animation: 'spin-around 3s ease-in-out infinite',
                  background:
                    'conic-gradient(from calc(270deg - 45deg), transparent 0, rgba(255,255,255,0.28) 90deg, transparent 90deg)',
                }}
              />
            </div>
          </div>
          <div className="absolute inset-0 rounded-xl shadow-[inset_0_-8px_10px_rgba(255,255,255,0.12)]" />
          <div className="absolute -z-20 inset-0 rounded-xl bg-[#f0b90b]" />
        </>
      )}

      {isLoading && <Loader size={15} color="#f0b90b" />}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  )
}

export default Button
