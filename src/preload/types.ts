export type GenerateCardsParams = 
    | { method: "file"; model: string; filePath: string }
    | { method: "text"; model: string; stringText: string }
    | { method: "terms"; model: string; terms: string}

