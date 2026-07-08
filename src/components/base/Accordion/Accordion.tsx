import clsx from 'clsx'
import * as RadixAccordion from '@radix-ui/react-accordion'
import './accordion.scss'

interface IAccordionProps {
  type?: 'single' | 'multiple'
  defaultValue?: string
  children: React.ReactNode
  customClass?: string
}

interface IAccordionItemProps {
  value: string
  children: React.ReactNode
  customClass?: string
}

interface IAccordionTriggerProps {
  children: React.ReactNode
  customClass?: string
}

interface IAccordionContentProps {
  children: React.ReactNode
  customClass?: string
}

export function Accordion({ type = 'single', defaultValue, children, customClass }: IAccordionProps) {
  return (
    <RadixAccordion.Root
      type={type as 'single'}
      defaultValue={defaultValue}
      className={clsx('accordion-root', customClass)}
      collapsible
    >
      {children}
    </RadixAccordion.Root>
  )
}

export function AccordionItem({ value, children, customClass }: IAccordionItemProps) {
  return (
    <RadixAccordion.Item value={value} className={clsx('accordion-item', customClass)}>
      {children}
    </RadixAccordion.Item>
  )
}

export function AccordionTrigger({ children, customClass }: IAccordionTriggerProps) {
  return (
    <RadixAccordion.Header className="accordion-header">
      <RadixAccordion.Trigger className={clsx('accordion-trigger', customClass)}>
        {children}
        <span className="accordion-chevron">▾</span>
      </RadixAccordion.Trigger>
    </RadixAccordion.Header>
  )
}

export function AccordionContent({ children, customClass }: IAccordionContentProps) {
  return (
    <RadixAccordion.Content className={clsx('accordion-content', customClass)}>
      <div className="accordion-content-inner">{children}</div>
    </RadixAccordion.Content>
  )
}
