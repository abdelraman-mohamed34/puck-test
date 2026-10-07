import type { Data } from "@measured/puck";

type PublishedContentResult = {
    content: Data | null;
    error: string | null;
};

export function resolvePublishedContent(result: { data?: unknown } | null): PublishedContentResult {
    if (result?.data) {
        return {
            content: result.data as Data,
            error: null,
        };
    }

    return {
        content: null,
        error: "No published content found for this tenant",
    };
}
