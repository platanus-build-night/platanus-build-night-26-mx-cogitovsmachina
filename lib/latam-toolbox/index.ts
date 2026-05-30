export interface LatAmTemplate {
  id: string;
  name: string;
  country: 'MX' | 'CL' | 'CO' | 'BR' | 'Regional';
  description: string;
  schemaVerificationSql: string;
  businessValidationRules: string[];
}

export const LATAM_TOOLBOX_TEMPLATES: LatAmTemplate[] = [
  {
    id: "mx_cfdi_4_0",
    name: "Facturación Electrónica (CFDI 4.0)",
    country: "MX",
    description: "Validates electronic invoicing schema under Mexico's SAT CFDI 4.0 regulations.",
    schemaVerificationSql: `
      CREATE TABLE IF NOT EXISTS mx_cfdi_invoices (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        rfc_emisor VARCHAR(13) NOT NULL,
        rfc_receptor VARCHAR(13) NOT NULL,
        uuid_fiscal VARCHAR(36) UNIQUE,
        monto_subtotal NUMERIC(15,2) NOT NULL CHECK (monto_subtotal >= 0),
        monto_iva NUMERIC(15,2) NOT NULL CHECK (monto_iva >= 0),
        monto_total NUMERIC(15,2) NOT NULL CHECK (monto_total = monto_subtotal + monto_iva),
        regimen_fiscal_receptor VARCHAR(3) NOT NULL,
        uso_cfdi VARCHAR(3) NOT NULL,
        xml_metadata JSONB,
        status VARCHAR(10) DEFAULT 'vigente' CHECK (status IN ('vigente', 'cancelado')),
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `,
    businessValidationRules: [
      "RFC Emisor and Receptor must be valid Mexican Tax ID formats (12 or 13 chars).",
      "Total amount must mathematically equal Subtotal + IVA.",
      "Regimen Fiscal must match SAT catalogs (e.g., 601, 605, 626)."
    ]
  },
  {
    id: "cl_dte_invoicing",
    name: "Documento Tributario Electrónico (DTE)",
    country: "CL",
    description: "Validates electronic tax invoices compliance according to Chile's SII rules.",
    schemaVerificationSql: `
      CREATE TABLE IF NOT EXISTS cl_dte_invoices (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        rut_emisor VARCHAR(10) NOT NULL,
        rut_receptor VARCHAR(10) NOT NULL,
        folio INT NOT NULL,
        tipo_dte INT NOT NULL CHECK (tipo_dte IN (33, 34, 52, 61)),
        monto_neto INT NOT NULL CHECK (monto_neto >= 0),
        monto_iva INT NOT NULL CHECK (monto_iva >= 0),
        monto_total INT NOT NULL CHECK (monto_total = monto_neto + monto_iva),
        xml_signature TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `,
    businessValidationRules: [
      "RUT must include verification digit (DV) and match regex format.",
      "Tipo DTE must be standard (33 for Factura Electrónica, 61 for Nota de Crédito).",
      "Monto Total net calculations must align with 19% standard VAT (IVA) rate."
    ]
  },
  {
    id: "latam_payroll_calc",
    name: "Cálculo de Nómina & Retenciones",
    country: "Regional",
    description: "Verifies payroll retention, health insurance, and social security calculations.",
    schemaVerificationSql: `
      CREATE TABLE IF NOT EXISTS payroll_runs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        employee_id VARCHAR(50) NOT NULL,
        base_salary NUMERIC(15,2) NOT NULL,
        retention_rate NUMERIC(5,2) NOT NULL CHECK (retention_rate >= 0 AND retention_rate <= 100),
        social_security NUMERIC(15,2) NOT NULL,
        net_pay NUMERIC(15,2) NOT NULL,
        currency VARCHAR(3) DEFAULT 'MXN',
        payment_status VARCHAR(15) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'processing', 'completed'))
      );
    `,
    businessValidationRules: [
      "Base salary must be equal or greater than the regional minimum wage.",
      "Retention deduction must strictly correspond to the tax bracket calculation.",
      "Net pay must equal Base salary minus retentions and social security deductions."
    ]
  }
];

export function getTemplateById(id: string): LatAmTemplate | undefined {
  return LATAM_TOOLBOX_TEMPLATES.find(t => t.id === id);
}
