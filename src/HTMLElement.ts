declare interface DOMVisibilityRect  {
    bottom: boolean;
    top: boolean;
    left: boolean;
    right: boolean;
    all: boolean;
    any: boolean;
}

declare interface HTMLElement {
    normaliseAttrs(attrs: Entries<string>): Entries<string>;

    isVisible(): boolean;

    getChildVisibilityRect(child: HTMLElement): DOMVisibilityRect;

    isChildFullyVisible(child: HTMLElement): boolean;
    isChildPartiallyVisible(child: HTMLElement): boolean;

    isFocused(): boolean;
}

HTMLElement.prototype.isFocused = function() {
    return document.activeElement === this;
};

HTMLElement.prototype.isChildFullyVisible = function(child: HTMLElement): boolean { 
    return this.getChildVisibilityRect(child).all;
};

HTMLElement.prototype.isChildPartiallyVisible = function(child: HTMLElement): boolean { 
    return this.getChildVisibilityRect(child).any;
};

HTMLElement.prototype.getChildVisibilityRect = function(child: HTMLElement): DOMVisibilityRect {
    if(!(child instanceof HTMLElement))
        throw new Error("Child is not a HTMLElement.");

    let parentBoundingRect = this.getBoundingClientRect();
    let childBoundingRect = child.getBoundingClientRect();

    const rect = {
        bottom: childBoundingRect.bottom < parentBoundingRect.bottom,
        top: childBoundingRect.top > parentBoundingRect.top,
        left: childBoundingRect.left > parentBoundingRect.left,
        right: childBoundingRect.right < parentBoundingRect.right,
        all: false,
        any: false
    };

    rect.any = rect.bottom || rect.top || rect.left || rect.right;
    rect.all = rect.bottom && rect.top && rect.left && rect.right;

    return rect;
};

HTMLElement.prototype.isVisible = function() {
    const e = this;

    let style = window.getComputedStyle(e);
    let rect = e.getBoundingClientRect();
    if (style.display === "none") return false;
    if (style.visibility !== "visible") return false;
    if (parseFloat(style.opacity) < 0.1) return false;
    if (e.offsetWidth + e.offsetHeight + e.getBoundingClientRect().height +
        e.getBoundingClientRect().width === 0) {
        return false;
    }
    let center   = {
        x: rect.left + e.offsetWidth  / 2,
        y: rect.top  + e.offsetHeight / 2
    };
    if (center.x < 0) return false;
    if (center.x > (document.documentElement.clientWidth || window.innerWidth)) return false;
    if (center.y < 0) return false;
    if (center.y > (document.documentElement.clientHeight || window.innerHeight)) return false;
    let pointContainer: ParentNode|Element|Nullable = document.elementFromPoint(center.x, center.y);
    
    do {
        if (pointContainer === e)
            return true;
    }
    while (pointContainer = (pointContainer ? pointContainer.parentNode : undefined));
    
    return false;
};

//@ts-ignore
HTMLElement.normaliseAttrs = function(attrs: Entries<any>): Entries<any> {
    if(attrs.hasOwnProperty("class")) {
        if(Object.isString(attrs.class)) {
            attrs.class = attrs.class.split(" ");
        }
    }

    if(Object.isString(attrs.style)) {
        attrs.style = Object.fromEntries(
            attrs.style
                .split(";")
                .map((style: string): string[] => {
                    let entry: string[] = style.split(":").map((kv: string): string => kv.trim());

                    entry[0] = entry[0].camel();

                    return entry;
                })
        );
    }

    return attrs;
};