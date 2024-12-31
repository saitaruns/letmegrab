import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import ProductForm from "@/pages/ProductForm"

export function ProductDialog({
    children,
    id
}: {
    children: React.ReactNode,
    id?: string
}) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <ProductForm id={id} />
            </DialogContent>
        </Dialog>
    )
}
