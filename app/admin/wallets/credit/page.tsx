"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FieldGroup, Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { DollarSign, Search, CheckCircle } from "lucide-react";

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  balance?: number;
}

export default function CreditWalletPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
  });

  useEffect(() => {
    const searchUsers = async () => {
      if (searchQuery.length < 2) {
        setUsers([]);
        return;
      }

      setSearching(true);
      try {
        const res = await fetch(`/api/admin/users/search?q=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        setUsers(data.users || []);
      } catch {
        setUsers([]);
      } finally {
        setSearching(false);
      }
    };

    const debounce = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedUser) {
      setError("Please select a user");
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/wallets/credit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: selectedUser.id,
          amount,
          description: formData.description || "Manual credit by admin",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to credit wallet");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/admin/wallets");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to credit wallet");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold mb-2">Wallet Credited Successfully</h2>
            <p className="text-muted-foreground">
              ${formData.amount} has been added to {selectedUser?.first_name}&apos;s wallet.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold">Credit Wallet</h1>
        <p className="text-muted-foreground">
          Add funds to a user&apos;s wallet
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            Manual Credit
          </CardTitle>
          <CardDescription>
            This will add funds directly to the user&apos;s wallet balance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <FieldGroup>
              <Field>
                <FieldLabel>Search User</FieldLabel>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by email or name..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setSelectedUser(null);
                    }}
                    className="pl-9"
                    disabled={loading}
                  />
                  {searching && (
                    <Spinner className="absolute right-3 top-1/2 -translate-y-1/2" />
                  )}
                </div>

                {users.length > 0 && !selectedUser && (
                  <div className="mt-2 border rounded-lg divide-y max-h-48 overflow-y-auto">
                    {users.map((user) => (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => {
                          setSelectedUser(user);
                          setSearchQuery("");
                          setUsers([]);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-muted flex items-center justify-between"
                      >
                        <div>
                          <p className="font-medium">{user.first_name} {user.last_name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          ${Number(user.balance || 0).toLocaleString()}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </Field>

              {selectedUser && (
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{selectedUser.first_name} {selectedUser.last_name}</p>
                      <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Current Balance</p>
                      <p className="font-bold">${Number(selectedUser.balance || 0).toLocaleString()}</p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="link"
                    className="mt-2 p-0 h-auto"
                    onClick={() => setSelectedUser(null)}
                  >
                    Change user
                  </Button>
                </div>
              )}

              <Field>
                <FieldLabel htmlFor="amount">Amount (USD)</FieldLabel>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                  disabled={loading}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="description">Description (Optional)</FieldLabel>
                <Textarea
                  id="description"
                  placeholder="Reason for credit..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  disabled={loading}
                />
              </Field>

              {error && <FieldError>{error}</FieldError>}
            </FieldGroup>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading || !selectedUser}>
                {loading ? (
                  <>
                    <Spinner className="mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <DollarSign className="mr-2 h-4 w-4" />
                    Credit Wallet
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
