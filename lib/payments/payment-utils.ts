/**
 * Payment Utilities Library
 * Handles payment method validation, formatting, and processing
 */

export type PaymentMethod = "card" | "bank" | "crypto" | "paystack" | "flutterwave"

export interface PaymentConfig {
  method: PaymentMethod
  amount: number
  currency: string
  description?: string
  metadata?: Record<string, any>
}

export interface PaymentResult {
  success: boolean
  transactionId?: string
  reference?: string
  message: string
  error?: string
  nextAction?: string
  processor?: string
}

// Validation functions
export const validateCardNumber = (cardNumber: string): boolean => {
  const cleaned = cardNumber.replace(/\s/g, "")
  // Luhn algorithm
  if (!/^\d{13,19}$/.test(cleaned)) return false

  let sum = 0
  let isEven = false

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10)

    if (isEven) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }

    sum += digit
    isEven = !isEven
  }

  return sum % 10 === 0
}

export const validateBankAccountNumber = (accountNumber: string): boolean => {
  // Basic validation - customize based on your bank's requirements
  return accountNumber.length >= 8 && /^\d+$/.test(accountNumber)
}

export const validateCryptoAddress = (address: string, type: string = "ethereum"): boolean => {
  if (type === "ethereum") {
    return /^0x[a-fA-F0-9]{40}$/.test(address)
  }
  // Add other crypto address validations as needed
  return false
}

export const validateIBAN = (iban: string): boolean => {
  // Remove spaces and convert to uppercase
  const normalizedIBAN = iban.replace(/\s/g, "").toUpperCase()

  // Check if IBAN format is correct (2 letters, 2 digits, then up to 30 alphanumeric)
  if (!/^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}$/.test(normalizedIBAN)) {
    return false
  }

  // Validate checksum using mod-97 algorithm
  let rearranged = normalizedIBAN.substring(4) + normalizedIBAN.substring(0, 4)
  let numericIBAN = ""

  for (let i = 0; i < rearranged.length; i++) {
    const char = rearranged[i]
    numericIBAN += char.charCodeAt(0) - (char >= "A" ? 55 : 48)
  }

  // Check if mod-97 of numeric IBAN is 1
  let remainder = numericIBAN
  while (remainder.length > 2) {
    remainder = ((parseInt(remainder.substring(0, 9)) % 97) + remainder.substring(9)).toString()
  }

  return parseInt(remainder) % 97 === 1
}

// Formatting functions
export const formatCardNumber = (cardNumber: string): string => {
  const cleaned = cardNumber.replace(/\s/g, "")
  return cleaned.replace(/(.{4})/g, "$1 ").trim()
}

export const formatCurrency = (amount: number, currency: string = "USD"): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount)
}

export const maskCardNumber = (cardNumber: string): string => {
  if (cardNumber.length < 4) return cardNumber
  const lastFour = cardNumber.slice(-4)
  return `•••• •••• •••• ${lastFour}`
}

export const maskBankAccount = (accountNumber: string): string => {
  if (accountNumber.length < 4) return accountNumber
  const lastFour = accountNumber.slice(-4)
  return `•••• ${lastFour}`
}

// Transaction fee calculations
export const calculateFee = (
  amount: number,
  method: PaymentMethod,
  currency: string = "USD"
): { fee: number; total: number } => {
  let fee = 0

  switch (method) {
    case "card":
    case "paystack":
      // Paystack: 1.5% + NGN 100 (if NGN) or standard 2.9% + $0.30 for international
      if (currency === "NGN") {
        fee = amount * 0.015 + 100
      } else {
        fee = amount * 0.029 + 0.3
      }
      break

    case "flutterwave":
      // Flutterwave: 1.4% for local, 3.8% for international
      fee = amount * (currency === "NGN" ? 0.014 : 0.038)
      break

    case "bank":
      // Bank transfer: No fee
      fee = 0
      break

    case "crypto":
      // Crypto: Network gas fees (estimated)
      fee = 0 // User pays gas separately
      break

    default:
      fee = 0
  }

  return {
    fee: Math.round(fee * 100) / 100,
    total: Math.round((amount + fee) * 100) / 100,
  }
}

// Payment method detection from card number
export const detectCardType = (cardNumber: string): string => {
  const number = cardNumber.replace(/\D/g, "")

  if (/^4[0-9]{12}(?:[0-9]{3})?$/.test(number)) return "Visa"
  if (/^5[1-5][0-9]{14}$/.test(number)) return "Mastercard"
  if (/^3[47][0-9]{13}$/.test(number)) return "American Express"
  if (/^6(?:011|5[0-9]{2})[0-9]{12}$/.test(number)) return "Discover"
  if (/^(?:2131|1800|35\d{3})\d{11}$/.test(number)) return "JCB"

  return "Unknown"
}

// Get payment method icon
export const getPaymentMethodIcon = (method: PaymentMethod): string => {
  const iconMap: Record<PaymentMethod, string> = {
    card: "💳",
    bank: "🏦",
    crypto: "₿",
    paystack: "🟢",
    flutterwave: "🟠",
  }
  return iconMap[method] || "💰"
}

// Payment status descriptions
export const getPaymentStatusDescription = (status: string): string => {
  const descriptions: Record<string, string> = {
    pending: "Payment is pending. Please complete the transaction.",
    processing: "Your payment is being processed. This may take a few moments.",
    completed: "Payment completed successfully!",
    failed: "Payment failed. Please try again or use a different payment method.",
    cancelled: "Payment was cancelled.",
    refunded: "Payment has been refunded to your account.",
  }
  return descriptions[status] || "Unknown status"
}

// Export API functions
export async function processPayment(config: PaymentConfig): Promise<PaymentResult> {
  try {
    // Map config to API expected format
    const payload = {
      amount: config.amount,
      currency: config.currency,
      description: config.description,
      payment_method_id: config.metadata?.payment_method_id,
      transaction_type: config.metadata?.transaction_type,
      listing_id: config.metadata?.listing_id,
      // Optional overrides from UI
      processor: config.metadata?.processor || config.metadata?.payment_processor,
      crypto_chain: config.metadata?.crypto_chain || config.metadata?.chain || config.metadata?.network,
    }

    const response = await fetch("/api/payments/process", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const error = await response.json()
      return {
        success: false,
        message: error.error || "Payment processing failed",
        error: error.error,
      }
    }

    const result = await response.json()
    return {
      success: true,
      transactionId: result.transaction_id,
      reference: result.reference,
      message: "Payment processed successfully",
      nextAction: result.next_action,
    }
  } catch (error) {
    return {
      success: false,
      message: "Payment processing error",
      error: String(error),
    }
  }
}

export async function createWithdrawal(
  amount: number,
  paymentMethodId: string
): Promise<PaymentResult> {
  try {
    const response = await fetch("/api/payments/withdraw", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount, payment_method_id: paymentMethodId }),
    })

    if (!response.ok) {
      const error = await response.json()
      return {
        success: false,
        message: error.error || "Withdrawal request failed",
        error: error.error,
      }
    }

    const result = await response.json()
    return {
      success: true,
      transactionId: result.withdrawal_id,
      message: result.message,
    }
  } catch (error) {
    return {
      success: false,
      message: "Withdrawal request error",
      error: String(error),
    }
  }
}

export async function getPaymentMethods() {
  try {
    const response = await fetch("/api/payments/methods")
    if (!response.ok) throw new Error("Failed to fetch payment methods")
    return await response.json()
  } catch (error) {
    console.error("Error fetching payment methods:", error)
    return { success: false, methods: [] }
  }
}

export async function deletePaymentMethod(methodId: string): Promise<PaymentResult> {
  try {
    const response = await fetch(`/api/payments/methods?id=${methodId}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      const error = await response.json()
      return {
        success: false,
        message: error.error || "Failed to delete payment method",
        error: error.error,
      }
    }

    const result = await response.json()
    return {
      success: true,
      message: result.message,
    }
  } catch (error) {
    return {
      success: false,
      message: "Payment method deletion error",
      error: String(error),
    }
  }
}

export async function getTransactions(
  limit?: number,
  status?: string,
  type?: string
) {
  try {
    const params = new URLSearchParams()
    if (limit) params.append("limit", limit.toString())
    if (status) params.append("status", status)
    if (type) params.append("type", type)

    const response = await fetch(`/api/payments/transactions?${params}`)
    if (!response.ok) throw new Error("Failed to fetch transactions")
    return await response.json()
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return { success: false, transactions: [] }
  }
}
