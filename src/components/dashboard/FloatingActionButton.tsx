"use client";

import { Plus } from "lucide-react";
import { Button } from "../ui/button";

export const FloatingActionButton = () => {
    return (
        <Button
            className="fixed bottom-8 right-8 h-16 w-16 rounded-full shadow-lg"
            aria-label="New Delivery Request"
        >
            <Plus className="h-8 w-8" />
        </Button>
    )
}
