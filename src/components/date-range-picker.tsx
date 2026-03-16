import * as React from 'react'
import dayjs from 'dayjs'
import { CalendarIcon } from 'lucide-react'
import type { DateRange } from 'react-day-picker'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

type Preset = {
  label: string
  getValue: () => DateRange
}

const PRESETS: Preset[] = [
  {
    label: 'Last 7 days',
    getValue: () => ({
      from: dayjs().subtract(7, 'day').toDate(),
      to: dayjs().toDate(),
    }),
  },
  {
    label: 'Last 14 days',
    getValue: () => ({
      from: dayjs().subtract(14, 'day').toDate(),
      to: dayjs().toDate(),
    }),
  },
  {
    label: 'Last 30 days',
    getValue: () => ({
      from: dayjs().subtract(30, 'day').toDate(),
      to: dayjs().toDate(),
    }),
  },
  {
    label: 'Last 90 days',
    getValue: () => ({
      from: dayjs().subtract(90, 'day').toDate(),
      to: dayjs().toDate(),
    }),
  },
  {
    label: 'This month',
    getValue: () => ({
      from: dayjs().startOf('month').toDate(),
      to: dayjs().toDate(),
    }),
  },
  {
    label: 'Last month',
    getValue: () => ({
      from: dayjs().subtract(1, 'month').startOf('month').toDate(),
      to: dayjs().subtract(1, 'month').endOf('month').toDate(),
    }),
  },
  {
    label: 'This year',
    getValue: () => ({
      from: dayjs().startOf('year').toDate(),
      to: dayjs().toDate(),
    }),
  },
]

function formatRange(from: Date | undefined, to: Date | undefined) {
  if (!from) return 'Pick a date range'
  if (!to) return dayjs(from).format('MMM D, YYYY')
  if (dayjs(from).isSame(to, 'day')) return dayjs(from).format('MMM D, YYYY')
  if (dayjs(from).isSame(to, 'year')) {
    return `${dayjs(from).format('MMM D')} – ${dayjs(to).format('MMM D, YYYY')}`
  }
  return `${dayjs(from).format('MMM D, YYYY')} – ${dayjs(to).format('MMM D, YYYY')}`
}

type DateRangePickerProps = {
  from: Date | undefined
  to: Date | undefined
  onRangeChange: (range: { from: Date; to: Date }) => void
  className?: string
}

export function DateRangePicker({
  from,
  to,
  onRangeChange,
  className,
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [draft, setDraft] = React.useState<DateRange | undefined>(
    from && to ? { from, to } : undefined,
  )

  React.useEffect(() => {
    setDraft(from && to ? { from, to } : undefined)
  }, [from, to])

  function applyPreset(preset: Preset) {
    const range = preset.getValue()
    setDraft(range)
    if (range.from && range.to) {
      onRangeChange({ from: range.from, to: range.to })
    }
    setOpen(false)
  }

  function handleSelect(range: DateRange | undefined) {
    setDraft(range)
    if (range?.from && range?.to) {
      onRangeChange({ from: range.from, to: range.to })
      setOpen(false)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            'justify-start gap-2 text-left font-normal',
            !from && 'text-muted-foreground',
            className,
          )}
        >
          <CalendarIcon className="size-4" />
          <span className="truncate">{formatRange(from, to)}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <div className="flex">
          {/* Presets sidebar */}
          <div className="flex flex-col gap-1 border-r border-border p-3">
            <p className="mb-1 px-2 text-xs font-medium text-muted-foreground">
              Quick select
            </p>
            {PRESETS.map((preset) => (
              <Button
                key={preset.label}
                variant="ghost"
                size="sm"
                className="justify-start text-xs"
                onClick={() => applyPreset(preset)}
              >
                {preset.label}
              </Button>
            ))}
          </div>

          {/* Calendar */}
          <div className="p-3">
            <Calendar
              mode="range"
              selected={draft}
              onSelect={handleSelect}
              numberOfMonths={2}
              defaultMonth={
                from
                  ? dayjs(from).subtract(1, 'month').toDate()
                  : dayjs().subtract(1, 'month').toDate()
              }
              disabled={{ after: new Date() }}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
