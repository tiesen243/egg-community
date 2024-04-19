'use client'

import { Slot } from '@radix-ui/react-slot'
import * as React from 'react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  message?: string
  asChild?: boolean
}

export const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label = '', message = '', className = '', asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : Input

    return (
      <div className={cn('space-y-1', className)}>
        <Label className={message ? 'text-destructive' : ''}>{label}</Label>
        <Comp {...props} ref={ref} className={message ? 'border-destructive' : ''} />
        <span className="text-sm text-destructive">{message ?? ''}</span>
      </div>
    )
  },
)

FormField.displayName = 'FormField'
