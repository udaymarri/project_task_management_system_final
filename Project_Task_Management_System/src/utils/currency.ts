// Currency formatter for Indian Rupees
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format numbers in Indian numbering system (Lakhs, Crores)
export function formatIndianNumber(num: number): string {
  const x = num.toString();
  const lastThree = x.substring(x.length - 3);
  const otherNumbers = x.substring(0, x.length - 3);
  
  if (otherNumbers !== '') {
    return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + lastThree;
  } else {
    return lastThree;
  }
}

// Format currency in lakhs and crores
export function formatIndianCurrency(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  } else {
    return `₹${formatIndianNumber(amount)}`;
  }
}
