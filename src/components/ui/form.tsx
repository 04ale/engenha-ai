import * as React from "react"
import {
  useForm,
  UseFormReturn,
  FieldValues,
  Path,
  Controller,
} from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { cn } from "@/lib/utils"
import { Label } from "./label"

export interface FormProps<T extends FieldValues> {
  children: (form: UseFormReturn<T>) => React.ReactNode
  schema?: any
  defaultValues?: Partial<T>
  onSubmit: (data: T) => void | Promise<void>
  className?: string
}

function Form<T extends FieldValues>({
  children,
  schema,
  defaultValues,
  onSubmit,
  className,
}: FormProps<T>) {
  const form = useForm<T>({
    resolver: schema ? zodResolver(schema) : undefined,
    defaultValues,
  })

  const handleSubmit = form.handleSubmit(async (data) => {
    await onSubmit(data)
  })

  return (
    <form onSubmit={handleSubmit} className={className}>
      {children(form)}
    </form>
  )
}

export interface FormFieldProps<T extends FieldValues> {
  form: UseFormReturn<T>
  name: Path<T>
  label?: string
  children: (field: {
    value: any
    onChange: (value: any) => void
    error?: string
  }) => React.ReactNode
}

function FormField<T extends FieldValues>({
  form,
  name,
  label,
  children,
}: FormFieldProps<T>) {
  const error = form.formState.errors[name]

  return (
    <div className="space-y-2">
      {label && <Label htmlFor={name as string}>{label}</Label>}
      <Controller
        control={form.control}
        name={name}
        render={({ field }) =>
          children({
            value: field.value,
            onChange: field.onChange,
            error: error?.message as string,
          })
        }
      />
      {error && (
        <p className="text-sm text-destructive">{error.message as string}</p>
      )}
    </div>
  )
}

export interface FormItemProps extends React.HTMLAttributes<HTMLDivElement> {}

function FormItem({ className, ...props }: FormItemProps) {
  return <div className={cn("space-y-2", className)} {...props} />
}

export interface FormLabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {}

function FormLabel({ className, ...props }: FormLabelProps) {
  return <Label className={className} {...props} />
}

export interface FormMessageProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  error?: string
}

function FormMessage({ error, className, ...props }: FormMessageProps) {
  if (!error) return null
  return (
    <p className={cn("text-sm text-destructive", className)} {...props}>
      {error}
    </p>
  )
}

export { Form, FormField, FormItem, FormLabel, FormMessage }
