import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import Text from '../Text/Text'
import './input.scss'

interface IInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'filled'
  fullWidth?: boolean
  customClass?: string
  isError?: boolean
  helperText?: string
  isNumberOnly?: boolean
}

const sizeStyles: Record<string, string> = {
  sm: 'h-10 px-3 text-[13px]',
  md: 'h-12 px-4 text-[14px]',
  lg: 'h-[3.25rem] px-[1.125rem] text-[15px]',
}

const Input = React.forwardRef<HTMLInputElement, IInputProps>(
  (
    {
      size = 'md',
      variant = 'default',
      fullWidth,
      customClass,
      className,
      type,
      isError,
      helperText,
      isNumberOnly,
      onKeyDown,
      onFocus,
      onBlur,
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false)
    const [isFocused, setIsFocused] = useState(false)

    const isPassword = type === 'password'
    const resolvedType = isPassword ? (showPassword ? 'text' : 'password') : isNumberOnly ? 'text' : type

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (isNumberOnly) {
        const allowed = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End']
        if (!allowed.includes(e.key) && !/^\d$/.test(e.key)) e.preventDefault()
      }
      onKeyDown?.(e)
    }

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      onFocus?.(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      onBlur?.(e)
    }

    return (
      <div className={cn('flex flex-col gap-1', fullWidth && 'w-full', customClass, className)}>
        {/* wrapper with Aceternity glow border */}
        <div className="relative group/input">
          {/* Aceternity animated bottom glow on focus */}
          <AnimatePresence>
            {isFocused && !isError && (
              <motion.span
                key="glow"
                className="pointer-events-none absolute -bottom-px inset-x-0 h-px"
                style={{
                  background:
                    'linear-gradient(90deg, transparent, #f0b90b, transparent)',
                }}
                initial={{ opacity: 0, scaleX: 0.4 }}
                animate={{ opacity: 1, scaleX: 1 }}
                exit={{ opacity: 0, scaleX: 0.4 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                aria-hidden
              />
            )}
          </AnimatePresence>

          {/* Aceternity radial glow beneath input on focus */}
          <AnimatePresence>
            {isFocused && !isError && (
              <motion.span
                key="radial-glow"
                className="pointer-events-none absolute inset-0 rounded-xl"
                style={{
                  background:
                    'radial-gradient(ellipse 90% 60% at 50% 130%, rgba(240,185,11,0.18) 0%, transparent 70%)',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                aria-hidden
              />
            )}
          </AnimatePresence>

          <input
            ref={ref}
            type={resolvedType}
            className={cn(
              'w-full rounded-xl font-[Outfit] text-white outline-none transition-all duration-200',
              'bg-[#1e2130] border placeholder:text-white/20',
              // border states
              isError
                ? 'border-red-500/60 focus:border-red-500/80 shadow-[0_0_0_3px_rgba(231,76,60,0.1)]'
                : 'border-white/[0.09] focus:border-[rgba(240,185,11,0.5)] focus:shadow-[0_0_0_3px_rgba(240,185,11,0.09)]',
              variant === 'filled' && 'bg-white/[0.05] border-transparent focus:border-[rgba(240,185,11,0.4)] focus:bg-[#1e2130]',
              isPassword && 'pr-[2.75rem]',
              sizeStyles[size],
              'disabled:opacity-40 disabled:cursor-not-allowed',
            )}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            inputMode={isNumberOnly ? 'numeric' : undefined}
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-7 h-7 bg-transparent border-none cursor-pointer text-white/40 hover:text-white/85 transition-colors"
              onClick={() => setShowPassword((p) => !p)}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}
        </div>

        {isError && helperText && (
          <Text as="span" customClass="input-helper-text">{helperText}</Text>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'

export default Input
