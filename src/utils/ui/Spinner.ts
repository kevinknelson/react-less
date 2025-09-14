

export class Spinner {
    private static count = 0;
    private static overlayElement: HTMLElement | null = null;
    private static textElement: HTMLElement | null = null;

    private static init() {
        if (!this.overlayElement) {
            this.overlayElement = document.getElementById("global-spinner");
            if (!this.overlayElement) {
                console.error("Spinner element #global-spinner not found in DOM");
            }
        }
        if (!this.textElement) {
            this.textElement = document.getElementById("global-spinner-text");
        }
    }

    public static start(text?: string) {
        this.init();
        if (text) this.setText(text);
        this.count++;
        if (this.overlayElement) {
            this.overlayElement.style.display = "flex";
        }
    }

    public static end() {
        this.init();
        this.count = Math.max(0, this.count - 1);
        if (this.count === 0 && this.overlayElement) {
            this.overlayElement.style.display = "none";
        }
    }

    public static reset() {
        this.count = 0;
        if (this.overlayElement) {
            this.overlayElement.style.display = "none";
        }
    }

    public static setText(text: string) {
        this.init();
        if (this.textElement) {
            this.textElement.textContent = text;
        }
    }
}
