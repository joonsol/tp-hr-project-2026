package com.tphr.hr.common.util;

import java.time.LocalDate;

public final class DocumentNumberGenerator {

    private DocumentNumberGenerator() {
    }

    public static String prefixForThisYear(String prefix) {
        return prefix + "-" + LocalDate.now().getYear() + "-";
    }

    public static String next(String yearPrefix, long existingCount) {
        return yearPrefix + String.format("%03d", existingCount + 1);
    }
}
