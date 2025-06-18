"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shield } from "lucide-react"

interface SecurityQuestionSetupProps {
  onComplete: (questionId: string, answer: string) => void
  onSkip: () => void
}

const SECURITY_QUESTIONS = [
  { id: "pet", question: "Qual è il nome del tuo primo animale domestico?" },
  { id: "city", question: "In che città sei nato/a?" },
  { id: "school", question: "Qual è il nome della tua scuola elementare?" },
  { id: "mother", question: "Qual è il cognome da nubile di tua madre?" },
  { id: "car", question: "Qual è stata la marca della tua prima auto?" },
]

export function SecurityQuestionSetup({ onComplete, onSkip }: SecurityQuestionSetupProps) {
  const [selectedQuestion, setSelectedQuestion] = useState("")
  const [answer, setAnswer] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedQuestion && answer.trim()) {
      onComplete(selectedQuestion, answer.trim())
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Shield className="h-12 w-12 text-blue-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Configura Domanda di Sicurezza</h3>
        <p className="text-gray-400 text-sm">Questa domanda ti aiuterà a recuperare la password in caso di necessità</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Scegli una domanda</label>
          <Select value={selectedQuestion} onValueChange={setSelectedQuestion}>
            <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Seleziona una domanda di sicurezza" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              {SECURITY_QUESTIONS.map((q) => (
                <SelectItem key={q.id} value={q.id} className="text-white hover:bg-gray-700">
                  {q.question}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">La tua risposta</label>
          <Input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Inserisci la tua risposta"
            required
          />
          <p className="text-xs text-gray-500 mt-1">Ricorda questa risposta, ti servirà per recuperare la password</p>
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onSkip}
            className="flex-1 bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
          >
            Salta
          </Button>
          <Button
            type="submit"
            disabled={!selectedQuestion || !answer.trim()}
            className="flex-1 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            Configura
          </Button>
        </div>
      </form>
    </div>
  )
}
