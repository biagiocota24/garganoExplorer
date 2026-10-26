package com.biagiocota.garganoexplorer.common.tools;

import java.util.Locale;

public final class TextNormalizerTools {

    private TextNormalizerTools() {
    }


    public static String email(String email) {
        String cleaned = blankToNull(email);
        return cleaned == null? null : cleaned.toLowerCase(Locale.ROOT).trim();
    }

    public static String name(String name) {
        return name.trim().replaceAll("\\s+", " ");
    }

    public static String blankToNull(String text){
        if(text == null || text.isBlank()){
            return null;
        }
        return text.trim();
    }
}

