import * as React from "react"
import useEmblaCarousel, {
    type UseEmblaCarouselType,
} from "embla-carousel-react"
import { ArrowLeft, ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]

type CarouselProps = {
    opts?: CarouselOptions
    plugins?: CarouselPlugin
    orientation?: "horizontal" | "vertical"
    setApi?: (api: CarouselApi) => void
}

type CarouselContextProps = {
    carouselRef: ReturnType<typeof useEmblaCarousel>[0]
    api: ReturnType<typeof useEmblaCarousel>[1]
    scrollPrev: () => void
    scrollNext: () => void
    canScrollPrev: boolean
    canScrollNext: boolean
} & CarouselProps

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

function useCarousel() {
    const context = React.useContext(CarouselContext)
    if (!context) {
        throw new Error("useCarousel must be used within a <Carousel />")
    }
    return context
}

const Carousel = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(
    (
        {
            orientation = "horizontal",
            opts,
            setApi,
            plugins,
            className,
            children,
            ...props
        },
        ref
    ) => {
        const [carouselRef, api] = useEmblaCarousel(
            {
                align: "start",
                loop: false,
                ...opts,
                axis: orientation === "horizontal" ? "x" : "y",
            },
            plugins
        )

        const [canScrollPrev, setCanScrollPrev] = React.useState(false)
        const [canScrollNext, setCanScrollNext] = React.useState(false)

        const onSelect = React.useCallback((api: CarouselApi) => {
            if (!api) return
            setCanScrollPrev(api.canScrollPrev())
            setCanScrollNext(api.canScrollNext())
        }, [])

        const scrollPrev = React.useCallback(() => api?.scrollPrev(), [api])
        const scrollNext = React.useCallback(() => api?.scrollNext(), [api])

        React.useEffect(() => {
            if (!api) return
            onSelect(api)
            api.on("select", onSelect)
            api.on("reInit", onSelect)
            return () => {
                api.off("select", onSelect)
            }
        }, [api, onSelect])

        React.useEffect(() => {
            if (api && setApi) setApi(api)
        }, [api, setApi])

        return (
            <CarouselContext.Provider
                value={{
                    carouselRef,
                    api,
                    scrollPrev,
                    scrollNext,
                    canScrollPrev,
                    canScrollNext,
                    orientation,
                    opts,
                }}
            >
                <div
                    ref={ref}
                    className={cn("relative w-full", className)}
                    role="region"
                    aria-roledescription="carousel"
                    {...props}
                >
                    {children}
                </div>
            </CarouselContext.Provider>
        )
    }
)
Carousel.displayName = "Carousel"

const CarouselContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
    const { carouselRef, orientation } = useCarousel()

    return (
        <div ref={carouselRef} className="overflow-hidden">
            <div
                ref={ref}
                className={cn(
                    "flex gap-4 px-2",
                    orientation === "vertical" && "flex-col",
                    className
                )}
                {...props}
            />
        </div>
    )
})
CarouselContent.displayName = "CarouselContent"

const CarouselItem = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
    return (
        <div
            ref={ref}
            role="group"
            aria-roledescription="slide"
            className={cn(
                "shrink-0 grow-0 basis-full sm:basis-1/2 lg:basis-1/3",
                "min-w-[280px]", // 👈 prevents squeezing
                "transition-transform duration-300 hover:scale-[1.03]",
                className
            )}

            {...props}
        />
    )
})
CarouselItem.displayName = "CarouselItem"
const CarouselPrevious = React.forwardRef<
    HTMLButtonElement,
    React.ComponentProps<typeof Button>
>(({ className, variant = "ghost", size = "icon", ...props }, ref) => {
    const { scrollPrev, canScrollPrev } = useCarousel()

    return (
        <Button
            ref={ref}
            variant={variant}
            size={size}
            className={cn(
                "absolute -left-6 top-1/2 z-20 -translate-y-1/2",
                "h-10 w-10 rounded-full",
                "bg-white/80 backdrop-blur-md shadow-lg",
                "hover:bg-primary hover:text-white hover:scale-110",
                "transition-all duration-300",
                "disabled:opacity-30 disabled:pointer-events-none",
                className
            )}
            disabled={!canScrollPrev}
            onClick={scrollPrev}
            {...props}
        >
            <ArrowLeft className="h-5 w-5" />
        </Button>
    )
})

CarouselPrevious.displayName = "CarouselPrevious"

const CarouselNext = React.forwardRef<
    HTMLButtonElement,
    React.ComponentProps<typeof Button>
>(({ className, variant = "ghost", size = "icon", ...props }, ref) => {
    const { scrollNext, canScrollNext } = useCarousel()

    return (
        <Button
            ref={ref}
            variant={variant}
            size={size}
            className={cn(
                "absolute -right-6 top-1/2 z-20 -translate-y-1/2",
                "h-10 w-10 rounded-full",
                "bg-white/80 backdrop-blur-md shadow-lg",
                "hover:bg-primary hover:text-white hover:scale-110",
                "transition-all duration-300",
                "disabled:opacity-30 disabled:pointer-events-none",
                className
            )}
            disabled={!canScrollNext}
            onClick={scrollNext}
            {...props}
        >
            <ArrowRight className="h-5 w-5" />
        </Button>
    )
})

CarouselNext.displayName = "CarouselNext"

export {
    type CarouselApi,
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext,
}
