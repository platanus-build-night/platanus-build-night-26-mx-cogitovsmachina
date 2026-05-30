import { LatAmProcessTemplate } from '@/types';

export const LatAmTemplates: LatAmProcessTemplate[] = [
  {
    code: 'MX_CFDI_AUDIT',
    country: 'Mexico',
    title: 'CFDI v4.0 SAT Invoice Audit',
    description: 'Verify XML CFDI invoice metadata schemas, SAT compliance flags, and tax breakdown for Mexican SMB operations.',
    defaultSql: `
-- Audit CFDI schemas & amounts
SELECT id, uuid, total, rfc_emisor, rfc_receptor, sat_status 
FROM mx_invoices 
WHERE sat_status != 'Vigente' OR total <= 0;
    `.trim(),
    validationRules: [
      "RFC Emisor and Receptor must be exactly 12 or 13 characters long",
      "Invoice UUID must be a valid 36-character hexadecimal string",
      "Total amount must match sum of subtotal and calculated IVA (16% or 8% border zone)"
    ],
    tokenCostLimit: 8000
  },
  {
    code: 'BR_BOLETO_SYNC',
    country: 'Brazil',
    title: 'Boleto Bancário Ledger Reconciliation',
    description: 'Reconcile generated Boleto barcodes and due dates with active customer billing ledgers in Brazil.',
    defaultSql: `
-- Find unpaid, overdue boletos
SELECT id, barcode, value_cents, due_date, status 
FROM br_boletos 
WHERE status = 'pending' AND due_date < CURRENT_DATE;
    `.trim(),
    validationRules: [
      "Boleto barcode line must be exactly 47 or 48 numeric digits",
      "Value cents must be greater than zero",
      "Due date must be a valid future ISO-8601 date upon initial emission"
    ],
    tokenCostLimit: 9500
  },
  {
    code: 'CL_BOLETA_EMISSION',
    country: 'Chile',
    title: 'SII Boleta Electrónica Compliance',
    description: 'Automate boleta ledgers submission and test SII digital signature compatibility in Chile.',
    defaultSql: `
-- Check SII signature sync status
SELECT id, folio, total, signature_hash, sii_received 
FROM cl_boletas 
WHERE sii_received = false;
    `.trim(),
    validationRules: [
      "Folio must be a unique, monotonically increasing positive integer",
      "Signature hash must be present (SII compliance)",
      "Totals must include correct ICA / retenciones breakdown"
    ],
    tokenCostLimit: 7500
  }
];

export function getTemplate(code: string): LatAmProcessTemplate | undefined {
  return LatAmTemplates.find(t => t.code === code);
}
