"use client"

import { Input } from "@/components/ui/input"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { User, LogOut, Edit3, Palette, Crown, Mail, X, Check, AlertTriangle } from "lucide-react"

interface UserProfileSectionProps {
  user: {
    id: string
    email: string
    name: string
    avatar: string
    avatarBg: string
    createdAt: string
  }
  onLogout: () => void
  onUpdateProfile: (updates: { name?: string; avatar?: string; avatarBg?: string }) => void
  avatarCharacters: string[]
  avatarBackgrounds: string[]
}

export function UserProfileSection({
  user,
  onLogout,
  onUpdateProfile,
  avatarCharacters,
  avatarBackgrounds,
}: UserProfileSectionProps) {
  const [showProfile, setShowProfile] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [editName, setEditName] = useState(user.name)
  const [selectedAvatar, setSelectedAvatar] = useState(user.avatar)
  const [selectedBg, setSelectedBg] = useState(user.avatarBg)

  const handleSaveProfile = () => {
    onUpdateProfile({
      name: editName,
      avatar: selectedAvatar,
      avatarBg: selectedBg,
    })
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setEditName(user.name)
    setSelectedAvatar(user.avatar)
    setSelectedBg(user.avatarBg)
    setIsEditing(false)
  }

  const handleLogoutConfirm = () => {
    setShowProfile(false)
    setShowLogoutConfirm(false)
    onLogout()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("it-IT", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  }

  return (
    <>
      {/* Profile Avatar Button - Consistent with app design */}
      <button onClick={() => setShowProfile(true)} className="relative group">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 border-2 border-white"
          style={{ background: user.avatarBg }}
        >
          {user.avatar}
        </div>
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
      </button>

      {/* Profile Modal - Consistent with app's card design */}
      {showProfile && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 z-50 font-sans">
          <Card className="w-full max-w-md bg-white rounded-4xl shadow-2xl animate-scale-in border-0">
            <CardContent className="p-0">
              {/* Header */}
              <div className="relative p-8 pb-4">
                <button
                  onClick={() => setShowProfile(false)}
                  className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>

                {/* Avatar Section - Consistent styling */}
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    <div
                      className="w-24 h-24 rounded-3xl flex items-center justify-center text-4xl shadow-xl border-4 border-white"
                      style={{ background: isEditing ? selectedBg : user.avatarBg }}
                    >
                      {isEditing ? selectedAvatar : user.avatar}
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-yellow-500 rounded-full border-4 border-white flex items-center justify-center">
                      <Crown className="w-4 h-4 text-white" />
                    </div>
                  </div>

                  {isEditing ? (
                    <div className="mt-4">
                      <Input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="text-xl font-bold text-center border-2 border-gray-200 rounded-2xl px-4 py-3 w-full focus:border-black"
                        placeholder="Il tuo nome"
                      />
                    </div>
                  ) : (
                    <div className="mt-4">
                      <h2 className="text-2xl font-bold text-black">{user.name}</h2>
                      <p className="text-gray-600 flex items-center justify-center mt-2">
                        <Mail className="w-4 h-4 mr-2" />
                        {user.email}
                      </p>
                    </div>
                  )}
                </div>

                {/* User Stats - Consistent with app's card design */}
                <div className="space-y-4 mb-6">
                  <Card className="p-4 bg-gray-50 rounded-2xl border-0">
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-1">Account</div>
                      <div className="font-semibold text-black">{user.email}</div>
                      <div className="text-xs text-gray-500 mt-1">Utente verificato</div>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Avatar Customization - Consistent styling */}
              {isEditing && (
                <div className="px-8 pb-4">
                  <div className="space-y-6">
                    {/* Avatar Characters */}
                    <div>
                      <h4 className="text-sm font-semibold text-black mb-3 flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        Scegli Avatar
                      </h4>
                      <div className="grid grid-cols-8 gap-2">
                        {avatarCharacters.map((char, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedAvatar(char)}
                            className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all ${
                              selectedAvatar === char
                                ? "bg-black text-white scale-110 shadow-lg"
                                : "bg-gray-100 hover:bg-gray-200 hover:scale-105"
                            }`}
                          >
                            {char}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Background Colors */}
                    <div>
                      <h4 className="text-sm font-semibold text-black mb-3 flex items-center">
                        <Palette className="w-4 h-4 mr-2" />
                        Sfondo
                      </h4>
                      <div className="grid grid-cols-5 gap-3">
                        {avatarBackgrounds.map((bg, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedBg(bg)}
                            className={`w-12 h-12 rounded-2xl transition-all ${
                              selectedBg === bg ? "scale-110 ring-4 ring-black shadow-lg" : "hover:scale-105 shadow-md"
                            }`}
                            style={{ background: bg }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions - Consistent button styling */}
              <div className="p-8 pt-4 space-y-3">
                {isEditing ? (
                  <div className="flex gap-3">
                    <Button
                      onClick={handleCancelEdit}
                      variant="outline"
                      className="flex-1 h-12 rounded-2xl border-2 border-gray-200 hover:bg-gray-50"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Annulla
                    </Button>
                    <Button
                      onClick={handleSaveProfile}
                      className="flex-1 h-12 bg-black hover:bg-gray-800 text-white rounded-2xl"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Salva
                    </Button>
                  </div>
                ) : (
                  <>
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                      className="w-full h-12 rounded-2xl border-2 border-gray-200 hover:bg-gray-50"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Personalizza Avatar
                    </Button>

                    <Button
                      onClick={() => setShowLogoutConfirm(true)}
                      className="w-full h-14 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-semibold text-lg shadow-lg"
                    >
                      <LogOut className="w-5 h-5 mr-2" />
                      Disconnetti
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Logout Confirmation Modal - Consistent design */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 z-50 font-sans">
          <Card className="w-full max-w-sm bg-white rounded-4xl shadow-2xl animate-scale-in border-0">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>

              <h3 className="text-xl font-bold text-black mb-2">Conferma Logout</h3>
              <p className="text-gray-600 mb-6">Sei sicuro di voler uscire dal tuo account?</p>

              <div className="flex gap-3">
                <Button
                  onClick={() => setShowLogoutConfirm(false)}
                  variant="outline"
                  className="flex-1 h-12 rounded-2xl border-2 border-gray-200 hover:bg-gray-50"
                >
                  Annulla
                </Button>
                <Button
                  onClick={handleLogoutConfirm}
                  className="flex-1 h-12 bg-red-600 hover:bg-red-700 text-white rounded-2xl"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Esci
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
