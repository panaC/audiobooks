import { OPDSLink } from "@r2-opds-js/opds/opds2/opds2-link";
import { OPDSProperties } from "@r2-opds-js/opds/opds2/opds2-properties";
export declare type TProperties = Partial<OPDSProperties>;
declare type TLink = Omit<OPDSLink, "Properties">;
export declare type TLinkMayBeOpds = TLink & {
    Properties: TProperties;
};
export {};
