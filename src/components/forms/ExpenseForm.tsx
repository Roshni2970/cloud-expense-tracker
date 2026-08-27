"use client"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useRouter } from "next/navigation"

const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters."),
  amount: z.coerce.number().positive("Amount must be positive."),
  currency: z.string().min(3).max(3),
  date: z.string(),
  categoryId: z.string().min(1, "Please select a category."),
  notes: z.string().optional(),
})

export function ExpenseForm({ categories, userId }: { categories: any[], userId: string }) {
  const router = useRouter()
  const [isUploading, setIsUploading] = useState(false)
  const [ocrResult, setOcrResult] = useState<string | null>(null)

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currency: "USD",
      date: new Date().toISOString().split('T')[0],
    }
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, userId }),
      })
      
      if (res.ok) {
        router.push("/dashboard/expenses")
        router.refresh()
      } else {
        alert("Failed to create expense.")
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setOcrResult("Scanning receipt with Mock OCR...")

    // Simulate OCR processing delay
    setTimeout(() => {
      // Mock extracted data
      setValue("title", "Mock Vendor Receipt")
      setValue("amount", 125.50)
      setValue("date", new Date().toISOString().split('T')[0])
      
      setIsUploading(false)
      setOcrResult("Receipt processed successfully! Fields auto-populated.")
    }, 2000)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardContent className="space-y-6 pt-6">
          <div className="border-2 border-dashed rounded-lg p-6 text-center bg-gray-50 hover:bg-gray-100 transition-colors">
            <Label htmlFor="receipt" className="cursor-pointer flex flex-col items-center justify-center space-y-2">
              <span className="text-sm font-medium">Click to upload receipt (Mock OCR)</span>
              <span className="text-xs text-muted-foreground">PNG, JPG, PDF up to 5MB</span>
              <Input id="receipt" type="file" className="hidden" accept="image/*,.pdf" onChange={handleFileUpload} />
            </Label>
            {isUploading && <p className="text-sm text-blue-500 mt-2">{ocrResult}</p>}
            {!isUploading && ocrResult && <p className="text-sm text-green-500 mt-2">{ocrResult}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Title / Vendor</Label>
              <Input {...register("title")} placeholder="e.g. Uber Ride" />
              {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label>Category</Label>
              <select 
                {...register("categoryId")} 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              >
                <option value="">Select a category</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              {errors.categoryId && <p className="text-xs text-red-500">{errors.categoryId.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Amount</Label>
              <Input type="number" step="0.01" {...register("amount")} placeholder="0.00" />
              {errors.amount && <p className="text-xs text-red-500">{errors.amount.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Currency</Label>
              <select {...register("currency")} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="JPY">JPY - Japanese Yen</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" {...register("date")} />
              {errors.date && <p className="text-xs text-red-500">{errors.date.message}</p>}
            </div>

            <div className="space-y-2 col-span-2">
              <Label>Notes</Label>
              <Input {...register("notes")} placeholder="Optional details..." />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting || isUploading}>
            {isSubmitting ? "Saving..." : "Save Expense"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
