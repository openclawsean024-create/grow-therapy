import { format, isValid, parseISO } from 'date-fns';

function safeDate(date: string | Date): Date {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return isValid(d) ? d : new Date();
}

export function formatDate(date: string | Date): string {
  return format(safeDate(date), 'MMM d, yyyy');
}

export function formatTime(date: string | Date): string {
  return format(safeDate(date), 'h:mm a');
}

export function formatDateTime(date: string | Date): string {
  return format(safeDate(date), 'MMM d, yyyy h:mm a');
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

export function getAvailableSlots(): string[] {
  const slots = ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];
  // Return all slots - in production, filter out booked ones
  return slots;
}
