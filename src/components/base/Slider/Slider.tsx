import clsx from 'clsx'
import * as RadixSlider from '@radix-ui/react-slider'
import './slider.scss'

interface ISliderProps {
  value?: number[]
  defaultValue?: number[]
  onValueChange?: (value: number[]) => void
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  customClass?: string
}

function Slider({ value, defaultValue, onValueChange, min = 0, max = 100, step = 1, disabled, customClass }: ISliderProps) {
  return (
    <RadixSlider.Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      className={clsx('slider-root', customClass)}
    >
      <RadixSlider.Track className="slider-track">
        <RadixSlider.Range className="slider-range" />
      </RadixSlider.Track>
      <RadixSlider.Thumb className="slider-thumb" />
    </RadixSlider.Root>
  )
}

export default Slider
