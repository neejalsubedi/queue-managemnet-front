import Select, {
    Props as SelectProps,
    ClassNamesConfig,
} from "react-select";


export type Option<T = string | number|boolean> = {
    value: T;
    label: string;
};

type BaseProps = {
    label?: string;
    name: string;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    className?: string; // outer wrapper
    labelClassName?: string;
    helperText?: string;
};

type NiceSelectProps<IsMulti extends boolean> = BaseProps &
    Omit<
        SelectProps<Option, IsMulti>,
        "className" | "classNamePrefix" | "isDisabled"
    > & {
    isMulti?: IsMulti;
};

const getClassNames = (
    hasError: boolean,
    disabled?: boolean
): ClassNamesConfig<Option, boolean> => ({
    control: ({ isFocused }) =>
        [
            "w-full flex items-center rounded border px-3 py-0.5 min-h-[40px] text-sm bg-white",
            disabled ? "bg-gray-50 cursor-not-allowed" : "cursor-pointer",
            hasError
                ? "border-red-500"
                : isFocused
                    ? "border-blue-500 ring-2 ring-blue-500/40"
                    : "border-gray-300",
            // hover
            !disabled && !hasError ? "hover:border-gray-400" : "",
        ]
            .filter(Boolean)
            .join(" "),
    valueContainer: () => "flex gap-1 px-0 py-0",
    placeholder: () => "text-gray-400 text-sm",
    singleValue: () => "text-gray-900 text-sm",
    input: () => "text-sm text-gray-900",
    menu: () =>
        "mt-1 border border-gray-200 rounded-md bg-white shadow-lg text-sm z-50 overflow-hidden",
    option: ({ isSelected, isFocused }) =>
        [
            "px-3 py-2 cursor-pointer",
            isSelected
                ? "bg-blue-500 text-white"
                : isFocused
                    ? "bg-blue-50 text-gray-900"
                    : "bg-white text-gray-900",
        ].join(" "),
    multiValue: () => "bg-blue-50 rounded-full text-blue-700",
    multiValueLabel: () => "px-2 py-0.5 text-xs",
    multiValueRemove: () =>
        "px-1 rounded-full hover:bg-transparent hover:text-blue-700",
    dropdownIndicator: ({ isFocused }) =>
        [
            "px-2",
            isFocused ? "text-gray-600" : "text-gray-400",
            "hover:text-gray-600",
        ].join(" "),
    clearIndicator: () => "px-2 text-gray-400 hover:text-gray-600",
    indicatorSeparator: () => "bg-gray-200",
});

export function NiceSelect<IsMulti extends boolean = false>(
    props: NiceSelectProps<IsMulti>
) {
    const {
        label,
        name,
        error,
        required = false,
        disabled = false,
        className = "",
        labelClassName = "block mb-1 font-medium text-sm",
        helperText,
        isMulti,
        ...rest
    } = props;

    return (
        <div className={`relative ${className}`}>
            {label && (
                <label htmlFor={name} className={labelClassName}>
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            {required && !label && (
                <span className="absolute -top-6 right-0 text-red-500 text-md">
            *
          </span>
            )}
            <Select<Option, IsMulti>
                {...(rest as SelectProps<Option, IsMulti>)}
                inputId={name}
                name={name}
                isMulti={isMulti}
                isDisabled={disabled}
                className="text-sm"
                classNames={getClassNames(!!error, disabled)}
            />

            {error ? (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            ) : helperText ? (
                <p className="mt-1 text-xs text-gray-500">{helperText}</p>
            ) : null}
        </div>
    );
}
