import clsx from 'clsx'
import * as RadixAvatar from '@radix-ui/react-avatar'
import './avatar.scss'

interface IAvatarProps {
  letter: string
  src?: string
  variant?: 'primary' | 'danger' | 'neutral'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  customClass?: string
}

function Avatar({ letter, src, variant = 'primary', size = 'md', className, customClass }: IAvatarProps) {
  return (
    <RadixAvatar.Root className={clsx('avatar', variant, size, customClass, className)}>
      {src && <RadixAvatar.Image src={src} alt={letter} className="avatar-image" />}
      <RadixAvatar.Fallback className="avatar-fallback" delayMs={src ? 300 : 0}>
        {letter}
      </RadixAvatar.Fallback>
    </RadixAvatar.Root>
  )
}

export default Avatar
