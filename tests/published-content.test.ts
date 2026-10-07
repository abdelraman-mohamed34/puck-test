import { resolvePublishedContent } from "@/lib/published-content";

describe("resolvePublishedContent", () => {
    it("returns page data when the API provides content", () => {
        const result = resolvePublishedContent({ data: { content: [{ type: "heading", props: { text: "Hello" } }] } });

        expect(result).toEqual({
            content: { content: [{ type: "heading", props: { text: "Hello" } }] },
            error: null,
        });
    });

    it("returns a helpful error when there is no published content", () => {
        const result = resolvePublishedContent(null);

        expect(result).toEqual({
            content: null,
            error: "No published content found for this tenant",
        });
    });
});
