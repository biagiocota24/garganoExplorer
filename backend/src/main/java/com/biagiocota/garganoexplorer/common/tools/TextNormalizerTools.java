package com.biagiocota.garganoexplorer.common.tools;

import java.util.Locale;

public final class TextNormalizerTools {

    private TextNormalizerTools() {
    }


    public static String email(String email) {
        return email.toLowerCase(Locale.ROOT).trim();
    }

    public static String name(String name) {
        return name.trim().replaceAll("\\s+", " ");
    }
}

