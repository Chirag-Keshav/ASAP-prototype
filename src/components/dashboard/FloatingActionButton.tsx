"use client";

import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import React from "react";

export const FloatingActionButton = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
    (props, ref) => {
        return (
            <Button
                ref={ref}
                className="fixed bottom-8 right-8 h-16 w-16 rounded-full shadow-lg"
                aria-label="New Delivery Request"
                {...props}
            >
                <Plus className="h-8 w-8" />
            </Button>
        )
    }
);
FloatingActionButton.displayName = 'FloatingActionButton';