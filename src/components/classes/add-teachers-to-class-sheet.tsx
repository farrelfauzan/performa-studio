import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { Search, Check } from 'lucide-react'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useApiQuery } from '@/hooks/use-api'
import { customerApi } from '@/lib/api'
import { useAddTeachers, useClassTeachers } from '@/hooks/use-classes'
import { validateWithZod } from '@/lib/utils'
import type { Customer, PageMeta } from '@/lib/types'

const customerIdsSchema = z
  .array(z.string())
  .min(1, 'Select at least one teacher')

interface AddTeachersToClassSheetProps {
  classId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddTeachersToClassSheet({
  classId,
  open,
  onOpenChange,
}: AddTeachersToClassSheetProps) {
  const [search, setSearch] = useState('')

  const { data: customersData } = useApiQuery<{
    customers: Customer[]
    meta?: PageMeta
  }>(
    ['customers', search],
    async () => {
      const result = await customerApi.getAll({
        search: search || undefined,
        pageSize: 50,
      })
      return {
        customers: result.data,
        meta: result.meta,
      }
    },
  )

  const { data: teachersData } = useClassTeachers(classId)

  const { mutate: addTeachers, isPending } = useAddTeachers()

  const alreadyAdded = new Set(
    teachersData?.teachers?.map((t) => t.customerId) ?? [],
  )

  const form = useForm({
    defaultValues: {
      customerIds: [] as string[],
    },
    onSubmit: async ({ value }) => {
      const newIds = value.customerIds.filter((id) => !alreadyAdded.has(id))
      if (newIds.length === 0) return
      addTeachers(
        { classId, customerIds: newIds },
        {
          onSuccess: () => {
            form.reset()
            onOpenChange(false)
          },
        },
      )
    },
  })

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[480px] flex flex-col">
        <SheetHeader>
          <SheetTitle className="text-white">Add Teachers</SheetTitle>
        </SheetHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <div className="flex-1 space-y-4 overflow-y-auto py-4 px-6">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
              <Input
                placeholder="Search teachers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            <form.Field
              name="customerIds"
              validators={{
                onChange: validateWithZod(customerIdsSchema),
              }}
            >
              {(field) => {
                const toggleCustomer = (id: string) => {
                  const current = field.state.value
                  field.handleChange(
                    current.includes(id)
                      ? current.filter((c) => c !== id)
                      : [...current, id],
                  )
                }

                return (
                  <div className="space-y-1">
                    {customersData?.customers.map((customer) => {
                      const isAlreadyAdded = alreadyAdded.has(customer.id)
                      const isSelected = field.state.value.includes(
                        customer.id,
                      )
                      return (
                        <button
                          key={customer.id}
                          type="button"
                          disabled={isAlreadyAdded}
                          onClick={() => toggleCustomer(customer.id)}
                          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                            isAlreadyAdded
                              ? 'cursor-not-allowed opacity-50'
                              : isSelected
                                ? 'bg-white/10 ring-1 ring-white/20'
                                : 'hover:bg-white/5'
                          }`}
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-white/10 text-xs text-white/60">
                              {customer.fullName
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-white/90">
                              {customer.fullName}
                            </p>
                            <p className="text-xs text-white/40">
                              {customer.uniqueId}
                            </p>
                          </div>
                          {isAlreadyAdded && (
                            <span className="text-xs text-white/30">
                              Already added
                            </span>
                          )}
                          {isSelected && !isAlreadyAdded && (
                            <Check className="h-4 w-4 text-green-400" />
                          )}
                        </button>
                      )
                    })}
                    {customersData?.customers.length === 0 && (
                      <p className="py-8 text-center text-sm text-white/30">
                        No teachers found
                      </p>
                    )}
                  </div>
                )
              }}
            </form.Field>
          </div>

          <SheetFooter className="px-6 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Adding...' : 'Add Teachers'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
