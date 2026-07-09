package com.tphr.hr.payroll.service;

public final class PayrollDeductionCalculator {

    public static final double PENSION_RATE = 0.046;
    public static final double HEALTH_INSURANCE_RATE = 0.03545;
    public static final double EMPLOYMENT_INSURANCE_RATE = 0.009;

    private PayrollDeductionCalculator() {
    }

    public static long pension(long baseSalary) {
        return Math.round(baseSalary * PENSION_RATE);
    }

    public static long healthInsurance(long baseSalary) {
        return Math.round(baseSalary * HEALTH_INSURANCE_RATE);
    }

    public static long employmentInsurance(long baseSalary) {
        return Math.round(baseSalary * EMPLOYMENT_INSURANCE_RATE);
    }

    // Simplified progressive approximation of the withholding tax table (근로소득 간이세액표) for a single-dependent case.
    public static long incomeTax(long taxableBase) {
        if (taxableBase <= 1_060_000) return 0;
        if (taxableBase <= 1_500_000) return Math.round((taxableBase - 1_060_000) * 0.02);
        if (taxableBase <= 3_000_000) return Math.round(8_800 + (taxableBase - 1_500_000) * 0.04);
        if (taxableBase <= 5_000_000) return Math.round(68_800 + (taxableBase - 3_000_000) * 0.08);
        if (taxableBase <= 10_000_000) return Math.round(228_800 + (taxableBase - 5_000_000) * 0.15);
        return Math.round(978_800 + (taxableBase - 10_000_000) * 0.24);
    }
}
