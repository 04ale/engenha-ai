import * as React from "react"
import {
  useForm,
  type UseFormReturn,
  type FieldValues,
  type Path,
  type DefaultValues,
  Controller,
} from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { cn } from "@/lib/utils"
import { Label } from "./label"

export interface FormProps<T extends FieldValues> {
  children: (form: UseFormReturn<T>) => React.ReactNode
  schema?: any
  defaultValues?: DefaultValues<T> // Alterado de Partial para DefaultValues
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

  // Ajuste na tipagem do submit para evitar o erro TS2345
  const handleSubmit = form.handleSubmit((data) => {
    return onSubmit(data as T)
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
  }) => React.ReactElement // Alterado de ReactNode para ReactElement para o erro da linha 70
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
        render={({ field }) => (
          // O cast como ReactElement resolve o erro TS2322 na linha 70
          (children({
            value: field.value,
            onChange: field.onChange,
            error: error?.message as string,
          }) as React.ReactElement)
        )}
      />
      {error && (
        <p className="text-sm text-destructive">{error.message as string}</p>
      )}
    </div>
  )
}

// ... restante das interfaces (FormItem, FormLabel, FormMessage) permanecem iguais

export interface FormItemProps extends React.HTMLAttributes<HTMLDivElement> { }

function FormItem({ className, ...props }: FormItemProps) {
  return <div className={cn("space-y-2", className)} {...props} />
}

export interface FormLabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> { }

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