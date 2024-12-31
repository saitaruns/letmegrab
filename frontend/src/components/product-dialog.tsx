import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import ProductForm from "@/pages/ProductForm"
import { useState } from "react"

export function ProductDialog({
    children,
    id
}: {
    children: React.ReactNode,
    id?: string
}) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <Dialog
            open={isOpen}
            onOpenChange={setIsOpen}
        >
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <ProductForm
                    id={id}
                    closeDialog={() => setIsOpen(false)}
                />
            </DialogContent>
        </Dialog>
    )
}
