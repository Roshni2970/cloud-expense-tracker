"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function ExpenseTable({ expenses }: { expenses: any[] }) {
  const [filter, setFilter] = useState("")

  const filtered = expenses.filter(e => 
    e.title.toLowerCase().includes(filter.toLowerCase()) || 
    e.category.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div className="w-full">
      <div className="p-4 border-b">
        <Input 
          placeholder="Filter expenses..." 
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
          <tr>
            <th className="px-6 py-3">Date</th>
            <th className="px-6 py-3">Title</th>
            <th className="px-6 py-3">Category</th>
            <th className="px-6 py-3">Amount</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3">Submitter</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(expense => (
            <tr key={expense.id} className="bg-white border-b hover:bg-gray-50">
              <td className="px-6 py-4">{new Date(expense.date).toLocaleDateString()}</td>
              <td className="px-6 py-4 font-medium text-gray-900">{expense.title}</td>
              <td className="px-6 py-4">{expense.category.name}</td>
              <td className="px-6 py-4">${expense.amount.toFixed(2)} {expense.currency}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  expense.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                  expense.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {expense.status}
                </span>
              </td>
              <td className="px-6 py-4">{expense.user.name}</td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr>
              <td colSpan={6} className="px-6 py-4 text-center text-muted-foreground">
                No expenses found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
