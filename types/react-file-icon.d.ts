declare module "react-file-icon" {
    import type { FC, CSSProperties } from "react";

    export interface FileIconProps {
        extension?: string;
        type?: string;
        color?: string;
        fold?: boolean;
        foldColor?: string;
        glyphColor?: string;
        gradientColor?: string;
        gradientOpacity?: number;
        labelColor?: string;
        labelTextColor?: string;
        labelUppercase?: boolean;
        radius?: number;
        className?: string;
        style?: CSSProperties;
    }

    export const FileIcon: FC<FileIconProps>;

    export type DefaultStyleRecord = Record<string, FileIconProps>;

    export const defaultStyles: DefaultStyleRecord;
}
